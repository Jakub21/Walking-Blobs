
class EntitiesHolder {
  constructor(sim, config) {
    this.sim = sim;
    this.regionSize = config.regionSize;
    this.interactionRange = config.interactionRange;
    this.size = Vector.duplicate(config.size);
    this.size.scale(1/this.regionSize);
    this.size.ceil();
    this.entities = [];
    for (var y = 0; y <= this.size.y; y+=1) {
      var yreg = [];
      for (var x = 0; x <= this.size.x; x+=1) yreg.push([]);
      this.entities.push(yreg);
    }
    this.count = {carnivore:0, herbivore:0, food:0, waste:0};
  }
  reasign(entity) {
    var yPrevRegion = floor(entity.prevPos.y / this.regionSize);
    var xPrevRegion = floor(entity.prevPos.x / this.regionSize);
    var yRegion = floor(entity.pos.y / this.regionSize);
    var xRegion = floor(entity.pos.x / this.regionSize);
    if (yPrevRegion == yRegion && xPrevRegion == xRegion) return;
    var index = this.entities[yPrevRegion][xPrevRegion].indexOf(entity);
    var removed = this.entities[yPrevRegion][xPrevRegion].splice(index, 1);
    try {this.entities[yRegion][xRegion].push(entity); }
    catch (err) {
      console.warn('Can not reassign', entity.entype, 'at', entity.pos);
      throw err;
    }
  }
  addEntity(entity) {
    var yRegion = floor(entity.pos.y / this.regionSize);
    var xRegion = floor(entity.pos.x / this.regionSize);
    this.entities[yRegion][xRegion].push(entity);
    this.count[entity.entype] += 1;
  }
  removeEntity(entity) {
    var yRegion = floor(entity.pos.y / this.regionSize);
    var xRegion = floor(entity.pos.x / this.regionSize);
    var index = this.entities[yRegion][xRegion].indexOf(entity);
    if (index == -1) throw 'Can not remove entity: It is not in entities array';
    var removed = this.entities[yRegion][xRegion].splice(index, 1);
    this.count[entity.entype] -= 1;
  }
  getNearbyEntitites(entity) {
    var delta = this.interactionRange;
    var region = {
      x: floor(entity.pos.x / this.regionSize),
      y: floor(entity.pos.y / this.regionSize)
    };
    var result = [];
    for (var y = region.y-delta; y <= region.y+delta; y+=1) {
      var yreg = this.entities[y];
      if (yreg == undefined) continue;
      for (var x = region.x-delta; x <= region.x+delta; x+=1) {
        var sub = yreg[x];
        if (sub == undefined) continue;
        result = result.concat(sub);
      }
    }
    var index = result.indexOf(entity);
    result.splice(index, 1);
    return result;
  }
  forEachEntity(fnc) {
    for (var yreg of this.entities) {
      for (var sub of yreg) {
        for (var entity of sub) fnc(entity);
    }}
  }
  forEachResource(f) {
    this.forEachEntity( (entity) => {
      if (entity.entype == 'food') f(entity);});
  }
  forEachWalker(f) {
    this.forEachEntity( (entity) => {
      if (entity.entype == 'carnivore' || entity.entype == 'herbivore') f(entity);});
  }
  drawRegionsGrid(ctx) {
    ctx.strokeStyle = '#444';
    for (var x = 0; x <= this.size.x; x+=1) {
      ctx.moveTo(x*this.regionSize, 0);
      ctx.lineTo(x*this.regionSize, this.size.y*this.regionSize);
      ctx.stroke();
    }
    for (var y = 0; y <= this.size.y; y+=1) {
      ctx.moveTo(0, y*this.regionSize);
      ctx.lineTo(this.size.x*this.regionSize, y*this.regionSize);
      ctx.stroke();
    }
  }
}
