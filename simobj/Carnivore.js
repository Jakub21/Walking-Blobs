
class Carnivore extends Walker {
  constructor(sim, pos, config) {
    super('carnivore', sim, pos, config);
    this.appearance.outline = '#F70';
    this.brain = new CarnivoreBrain(this);
    this.stateColors = {
      hungrySearch: '#703',
      hungryChase: '#A36',
      reprodSearch: '#000',
      reprodChase: '#400'
    };
  }
  update() {
    this.brain.update();
    if (this.vel.isZero()) this.brain.move();
    super.update();
    this.eat();
  }
  isEdible(entity) {return entity.entype == 'herbivore'}
  isDanger(entity) {return false}
  isMateable(entity) {return entity.entype == 'carnivore'}
}
