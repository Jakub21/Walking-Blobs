
class Environment {
  constructor(sim, config) {
    this.sim = sim;
    this.size = config.size;
    this.maxFoodCount = config.maxFoodDensity * this.size.xyProduct();
    this.foodGenChance = config.foodGenChance;
    this.foodConfig = config.foodConfig;
  }
  update() {
    if (random() < this.foodGenChance) this.generateRandomFood();
  }
  generateRandomFood() {
    if (this.sim.count('food') >= this.maxFoodCount) return
    this.sim.holder.addEntity(new Food(this.sim,
      Vector.randContained(this.size), this.foodConfig));
  }
  draw(ctx) {
    ctx.strokeStyle = '#777';
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.rect(0, 0, this.size.x, this.size.y);
    ctx.stroke();
  }
}
