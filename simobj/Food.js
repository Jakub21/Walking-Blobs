
class Food extends StaticEntity {
  constructor(sim, pos, config) {
    super('food', sim, pos, config.massPerEnergy, 1.3);
    this.config = config;
    this.energy = config.startEnergyFraction * config.maxEnergy;
    this.appearance = {
      outline: '#7C7',
      fill: '#8A8'
    };
    this.mass = this.config.massPerEnergy * this.energy;
    this.recalcRadius();
  }
  update() {
    super.update();
    if (this.energy < this.config.maxEnergy) this.energy += this.config.energyIncrease;
    this.mass = this.config.massPerEnergy * this.energy;
    this.recalcRadius();
  }
  draw(ctx) {
    ctx.strokeStyle = this.appearance.outline;
    ctx.fillStyle = this.appearance.fill;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, TAU);
    ctx.fill();
    ctx.stroke();
  }
}
