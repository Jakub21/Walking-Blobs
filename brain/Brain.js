
class WalkerBrain {
  constructor(entity) {
    this.entity = entity;
    this.stype = '';
    this.states = [];
    this.targets = [];
  }
  update() {
    for (var state of this.states) state.updateWeight();
    this.states.sort((a,b)=>{return b.weight-a.weight});
    if (this.state != undefined) { if (this.states[0].key == this.state.key) return; }
    this.state = this.states[0];
  }
  move() {
    this.targets = []; this.angle = null;
    this.state.move();
  }
}

class HerbivoreBrain extends WalkerBrain {
  constructor(entity) {
    super(entity);
    this.states = [
      new HungrySearchState(this.entity), new HungryChaseState(this.entity),
      new ReprodSearchState(this.entity), new ReprodChaseState(this.entity),
      new ScaredRunningState(this.entity)
    ];
  }
}

class CarnivoreBrain extends WalkerBrain {
  constructor(entity) {
    super(entity);
    this.states = [
      new HungrySearchState(this.entity), new HungryChaseState(this.entity),
      new ReprodSearchState(this.entity), new ReprodChaseState(this.entity)
    ];
  }
}
