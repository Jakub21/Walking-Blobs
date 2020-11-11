// NOTE: Those must be turned into traits later

var SEARCH_ROTATION_CHANCE = .3;
var SEARCH_ANGLE = .05;
var SEARCH_FORWARD = 10;

var CHASING_ANGLE_CHECK = TAU * 1/30;
var CHASING_ANGLE_STEP = TAU * 2e-3;
var CHASING_FORWARD = 10;

var RUNNING_ANGLE_CHECK = TAU * 1/12;
var RUNNING_ANGLE_STEP = TAU * 5e-3;
var RUNNING_FORWARD = 15;

class WalkerState {
  constructor(entity, key, color) {
    this.entity = entity;
    this.key = key;
    this.weight = 0;
  }
  updateWeight() { this.weight = this.getCurrentWeight(); }
  getCurrentWeight() {
    console.warn('getCurrentWeight was not implemented for this state');
    return 0;
  }
  move() {
    console.warn('move was not implemented for this state');
  }
}

class HungrySearchState extends WalkerState {
  constructor(entity) { super(entity, 'hungrySearch'); }
  getCurrentWeight() {
    var nearbyFood = this.entity.checkContitionalNearby(this.entity.isEdible);
    if (nearbyFood.length) return 0; // chase food instead
    var frac = this.entity.energy / this.entity.maxEnergy;
    return max((1-frac) * this.entity.importance.food, 0);
  }
  move() {
    var choice = random();
    if (choice < SEARCH_ROTATION_CHANCE/2) this.entity.rotate(SEARCH_ANGLE);
    else if (choice < SEARCH_ROTATION_CHANCE) this.entity.rotate(-SEARCH_ANGLE);
    else this.entity.forward(SEARCH_FORWARD);
  }
}

class HungryChaseState extends WalkerState {
  constructor(entity) { super(entity, 'hungryChase'); }
  getCurrentWeight() {
    var nearbyFood = this.entity.checkContitionalNearby(this.entity.isEdible);
    if (!nearbyFood.length) return 0; // search for food instead
    var frac = this.entity.energy / this.entity.maxEnergy;
    return max((1-frac) * this.entity.importance.food, 0);
  }
  move() {
    var nearbyFood = this.entity.checkContitionalNearby(this.entity.isEdible);
    var nearestEdible = null;
    var nearestDistance = Infinity;
    for (var other of nearbyFood) {
      var dist = this.entity.pos.diff(other.pos);
      if (dist >= nearestDistance) continue;
      nearestEdible = other; nearestDistance = dist;
    }
    if (nearestEdible == null) return; // NOTE
    var foodAngle = this.entity.pos.angleTo(nearestEdible.pos);
    this.entity.brain.angle = foodAngle;
    var angle = angleDiff(this.entity.pos.a, foodAngle);
    if (angle > CHASING_ANGLE_CHECK) this.entity.rotateTowards(foodAngle, CHASING_ANGLE_STEP);
    else this.entity.forward(CHASING_FORWARD);
    // NOTE: Calculating what angle should be added to the velocity
    // can be done with integrals, this is workaround
    this.entity.brain.targets.push(nearestEdible);
  }
}

class ReprodSearchState extends WalkerState {
  constructor(entity) { super(entity, 'reprodSearch'); }
  getCurrentWeight() {
    return 0;
  }
}

class ReprodChaseState extends WalkerState {
  constructor(entity) { super(entity, 'reprodChase'); }
  getCurrentWeight() {
    return 0;
  }
}

class ScaredRunningState extends WalkerState {
  constructor(entity) { super(entity, 'scaredRunning'); }
  getCurrentWeight() {
    var predators = this.entity.checkContitionalNearby(this.entity.isDanger);
    if (!predators.length) return 0;
    var nearest = Infinity;
    for (var other of predators) {
      nearest = min(nearest, this.entity.pos.diff(other.pos));
    }
    var frac = nearest/this.entity.sightRange;
    return (1-frac) * this.entity.importance.danger;
  }
  move() {
    var predators = this.entity.checkContitionalNearby(this.entity.isDanger);
    if (!predators.length) return;
    var angles = [];
    for (var other of predators) {
      angles.push(this.entity.pos.angleTo(other.pos)); }
    angles = angles.map((angle)=>{while (angle<-TAU)angle+=TAU;angle%=TAU;return angle;});
    angles.sort();
    var index = 0
    var anglesChance = [];
    for (var angle of angles) {
      var i = index+1; if (i == angles.length) i = 0;
      if (i == index) { // there is only 1 predator
        anglesChance.push([angle+(TAU/2), 100]);  break; }
      var delta = angles[i] - angle;
      var escapeAngle = angle + delta/2;
      anglesChance.push([escapeAngle, delta]);
      index += 1;
    }
    anglesChance.sort((a, b) => {return b[1] - a[1]});
    var targetAngle = anglesChance[0][0];
    this.entity.brain.angle = targetAngle;
    var angle = angleDiff(this.entity.pos.a, targetAngle);
    if (angle > RUNNING_ANGLE_CHECK) this.entity.rotateTowards(targetAngle, RUNNING_ANGLE_STEP);
    else this.entity.forward(RUNNING_FORWARD);
    this.entity.brain.targets = predators;
  }
}
