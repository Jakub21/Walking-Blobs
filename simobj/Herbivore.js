
class Herbivore extends Walker {
  constructor(sim, pos, config) {
    super('herbivore', sim, pos, config);
    this.appearance.outline = '#CC5';
    this.brain = new HerbivoreBrain(this);
    this.stateColors = {
      hungrySearch: '#553',
      hungryChase: '#886',
      reprodSearch: '#224',
      reprodChase: '#226',
      scaredRunning: '#526'
    };
  }
  update() {
    this.brain.update();
    if (this.vel.isZero()) this.brain.move();
    super.update();
    this.eat();
  }
  // evaluate other entities
  isEdible(entity) {return entity.entype == 'food'}
  isDanger(entity) {return entity.entype == 'carnivore'}
  isMateable(entity) {return entity.entype == 'herbivore'}
}
