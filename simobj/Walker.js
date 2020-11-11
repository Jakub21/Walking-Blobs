
class Walker extends DynamicEntity {
  constructor(entype, sim, pos, config) {
    super(entype, sim, pos, config.mass, 1);
    // Traits
    this.maxEnergy = config.maxEnergy;
    this.sightRange = config.baseSightRange;
    this.energy = config.startEnergyFraction * config.maxEnergy;
    this.importance = config.importance;
    this.moveCost = config.moveCost;
    this.rotateCost = config.rotateCost;
    // Physics
    this.vel.add(Vector.randUnit());
    this.vel.a += (random()-.5) * .3;
    this.groundFriction = 5e-2;
    // Simulation
    this.appearance = {
      noseLength: 1.4, noseWidth: 0.6,
      eyeDist: 0.35, eyeSize: 1.5, eyeAngle: 1,
      outline: '#CCC'
    };
    this.nearby = [];
    this.stateScores = {};
  }
  update() {
    super.update();
    this.getNearbyEntitites();
    if (!this.checkAlive()) this.kill();
  }
  checkContitionalNearby(check) {
    var result = [];
    for (var entity of this.nearby) {
      if (check(entity)) result.push(entity);
    }
    return result;
  }
  checkAlive() {
    return this.energy > 0;
  }
  kill() {
    this.sim.holder.removeEntity(this);
  }
  rotate(angle) {
    this.vel.a += angle;
    this.energy -= abs(angle) * this.rotateCost;
  }
  rotateTowards(angle, step) {
    while(this.pos.a < 0) this.pos.a += TAU; this.pos.a %= TAU;
    while(angle < 0) angle += TAU; angle %= TAU;
    var delta = this.pos.a - angle;
    if (delta < 0) delta += TAU;
    this.rotate((delta < TAU/2) ? -step : step);
  }
  forward(force) {
    var acc = new Vector(force/this.mass, 0, 0);
    this.vel.addRelative(acc, this.pos.a);
    this.energy -= force * this.moveCost;
  }
  getNearbyEntitites() {
    var entities = this.sim.holder.getNearbyEntitites(this);
    this.nearby = [];
    for (var entity of entities) {
      if (this.pos.diff(entity.pos) < this.sightRange) this.nearby.push(entity);
    }
    // this.nearby = this.sim.holder.getNearbyEntitites(this);
  }
  intersects(point) {
    return this.pos.diff(point) <= this.radius;
  }
  touches(entity) {
    return this.pos.diff(entity.pos) <= this.radius + entity.radius;
  }
  eat() {
    for (var entity of this.nearby) {
      if (this.energy >= this.maxEnergy) break;
      if (this.touches(entity) && this.isEdible(entity)) {
        this.energy += entity.energy;
        this.sim.holder.removeEntity(entity);
      }
    }
  }
  draw(ctx) {
    var apr = this.appearance;
    var r = this.radius;
    var {x, y, a} = this.pos;
    ctx.strokeStyle = apr.outline;
    ctx.fillStyle = this.stateColors[this.brain.state.key];
    ctx.lineWidth = 1;
    // body and nose
    ctx.beginPath();
    ctx.arc(x, y, r, a+apr.noseWidth, a-apr.noseWidth);
    ctx.lineTo(x+cos(a)*(r*apr.noseLength), y+sin(a)*(r*apr.noseLength))
    ctx.lineTo(x+cos(a+apr.noseWidth)*(r), y+sin(a+apr.noseWidth)*(r))
    ctx.fill();
    ctx.stroke();
    // eyes
    for (var d of [apr.eyeAngle, -apr.eyeAngle]) {
      ctx.beginPath();
      ctx.arc(x+cos(a+d)*(r*apr.eyeDist), y+sin(a+d)*(r*apr.eyeDist), apr.eyeSize, 0, TAU);
      ctx.fillStyle = apr.outline;
      ctx.fill();
    }
  }
}
