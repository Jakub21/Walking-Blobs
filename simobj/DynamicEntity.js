
class DynamicEntity extends StaticEntity {
  constructor(entype, sim, pos, mass, density) {
    super(entype, sim, pos, mass, density);
    this.prevPos = Position.duplicate(this.pos);
    this.vel = new Position(0, 0, 0);
    this.groundFriction = 0;
  }
  applyForce(source, force, isReaction=false) {
    var acc = Vector.duplicate(force);
    acc.scale(1/this.mass);
    this.vel.add(acc);
    if (!isReaction) {
      var reaction = Vector.duplicate(force);
      reaction.scale(-1);
      source.applyForce(this, reaction, true);
    }
  }
  update() {
    if (this.groundFriction) {
      var acc = Position.duplicate(this.vel);
      acc.scale(-this.groundFriction);
      this.vel.add(acc);
    }
    this.pos.add(this.vel);
    this.bounce();
    this.sim.holder.reasign(this);
    this.prevPos = Position.duplicate(this.pos);
  }
  bounce() {
    var r = this.sim.wallThickness;
    if (this.pos.x >= this.sim.environment.size.x-r && this.vel.x > 0)
      this.vel.x = -this.vel.x;
    if (this.pos.y >= this.sim.environment.size.y-r && this.vel.y > 0)
      this.vel.y = -this.vel.y;
    if (this.pos.x <= r && this.vel.x < 0) this.vel.x = -this.vel.x;
    if (this.pos.y <= r && this.vel.y < 0) this.vel.y = -this.vel.y;
  }
}
