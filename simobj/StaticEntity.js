let ENT_ID = 100;
let ENT_ID_DELTA = 5;

/* All entities included in the simulation inherit from this class */
class StaticEntity {
  constructor(entype, sim, pos, mass, density) {
    this.sim = sim;
    this.entype = entype;
    this.pos = pos;
    this.id = ENT_ID;
    ENT_ID += ENT_ID_DELTA;
    this.tick = 0;
    this.mass = mass;
    this.density = density;
    this.recalcRadius();
  }
  update() { /* placeholder */ }
  draw(ctx) { /* placeholder */ }
  remove() { this.sim.removeEntity(this); }
  recalcRadius() {
    this.radius = sqrt(this.mass*TAU/(2*this.density));
  }
}
