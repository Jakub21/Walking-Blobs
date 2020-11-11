
class Simulation {
  constructor(config) {
    this.fpsMeter = new FpsMeter(100);
    this.domGui = new DomGui(this);
    this.holder = new EntitiesHolder(this, config.holderConfig);
    this.environment = new Environment(this, config.environmentConfig);
    this.canvas = config.canvas;
    this.canvas.focus();
    this.displayScale = config.displayScale;
    this.canvas.onclick = (evt)=>{this.onclick(this, evt)};
    // $on(this.canvas, 'keydown', (evt)=>{this.onkey(this, evt)});
    this.selectionAppearance = {
      angle: 0, color: '#F0F', radius: 2.3, sections: 3
    };
    this.selectionTargetAppearance = {
      angle: 0, color: '#FF0', radius: 2.3, sections: 5
    };
    this.wallThickness = 5;
  }
  count(entype) {
    return this.holder.count[entype];
  }
  update() {
    this.fpsMeter.tick();
    this.environment.update();
    this.holder.forEachEntity((entity) => {entity.update()});
    this.domGui.update();
    this.drawEverything();
    this.selectionAppearance.angle += .02;
    this.selectionTargetAppearance.angle += .04;
  }
  onclick(self, event) {
    var point = new Vector(event.x/this.displayScale, event.y/this.displayScale);
    this.domGui.removeTarget();
    this.holder.forEachWalker((entity) => {
      if (entity.intersects(point)) this.domGui.newTarget(entity);
    });
  }
  drawEverything() {
    this.canvas.width = round(window.innerWidth);
    this.canvas.height = round(window.innerHeight);
    var ctx = this.canvas.getContext('2d');
    ctx.transform(this.displayScale, 0, 0, this.displayScale, 0, 0);
    this.holder.drawRegionsGrid(ctx);
    this.environment.draw(ctx);
    if (this.domGui.hasTarget) this.drawSelectionAngle(ctx); // TEMP
    this.holder.forEachEntity((entity) => {entity.draw(ctx)});
    this.drawSelection(ctx);
  }
  drawSelection(ctx) {
    if (!this.domGui.hasTarget) return;
    var pos = this.domGui.target.pos;
    var apr = this.selectionAppearance;
    var length = TAU/(2*apr.sections);
    var angle = apr.angle;
    ctx.strokeStyle = apr.color;
    for (var index = 1; index < 4; index += 1) {
      var radius = this.domGui.target.radius * apr.radius * (1 + .03*index);
      for (var section = 0; section < apr.sections; section += 1) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, angle, angle+(length*3/4));
        ctx.stroke();
        angle += length * 2;
    } angle = apr.angle + length*index/4; }
    this.drawSelectionTargets(ctx); // TEMP
  }
  drawSelectionTargets(ctx) { // TEMP
    var targets = this.domGui.target.brain.targets;
    for (var target of targets) {
      var pos = target.pos;
      var apr = this.selectionTargetAppearance;
      var length = TAU/(2*apr.sections);
      var angle = apr.angle;
      ctx.strokeStyle = apr.color;
      for (var index = 1; index < 4; index += 1) {
        var radius = target.radius * apr.radius * (1 + .03*index);
        for (var section = 0; section < apr.sections; section += 1) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, radius, angle, angle+(length*3/4));
          ctx.stroke();
          angle += length * 2;
      } angle = apr.angle + length*index/4; }
    }
  }
  drawSelectionAngle(ctx) { // TEMP
    var entity = this.domGui.target;
    var angle = entity.brain.angle;
    if (angle == null) return;
    var x = cos(angle) * entity.radius * 4;
    var y = sin(angle) * entity.radius * 4;
    ctx.strokeStyle = '#FFF';
    ctx.beginPath();
    ctx.moveTo(entity.pos.x, entity.pos.y);
    ctx.lineTo(entity.pos.x+x, entity.pos.y+y);
    ctx.stroke();
  }
}
