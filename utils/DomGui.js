
class DomGui {
  constructor(sim) {
    this.sim = sim;
    this.buildGui();
    this.removeTarget();
  }
  newTarget(entity) {
    this.target = entity;
    this.hasTarget = true;
    $id('TargetName').innerText = `Entity: ${this.target.entype} #${this.target.id}`;
  }
  removeTarget() {
    this.target = null;
    this.hasTarget = false;
    $id('TargetName').innerText = 'No entity selected';
    $id('TargetPosition').innerText = 'pos = __, __';
    $id('TargetAngle').innerText = 'heading = __ degs';
    $id('TargetEnergy').innerText = 'energy = __ (__%)';
    $id('TargetState').innerText = 'state = _____';
    $id('TargetStateScores').innerText = 'state scores = {}';
    $id('TargetBrainTargets').innerText = 'brain targets = []';
    $id('TargetTouches').innerText = 'touches = []';
  }
  buildGui() {
    var container = $create('div');
    container.id = 'GuiContainer';
    document.body.appendChild(container);
    var targetName = $create('p');
    targetName.id = 'TargetName';
    container.appendChild(targetName);
    var targetPosition = $create('p');
    targetPosition.id = 'TargetPosition';
    container.appendChild(targetPosition);
    var targetAgnle = $create('p');
    targetAgnle.id = 'TargetAngle';
    container.appendChild(targetAgnle);
    var targetEnergy = $create('p');
    targetEnergy.id = 'TargetEnergy';
    container.appendChild(targetEnergy);
    var targetState = $create('p');
    targetState.id = 'TargetState';
    container.appendChild(targetState);
    var targetStateScores = $create('p');
    targetStateScores.id = 'TargetStateScores';
    container.appendChild(targetStateScores);
    var targetBrainTargets = $create('p');
    targetBrainTargets.id = 'TargetBrainTargets';
    container.appendChild(targetBrainTargets);
    var targetTouches = $create('p');
    targetTouches.id = 'TargetTouches';
    container.appendChild(targetTouches);
  }
  update() {
    if (!this.hasTarget) return;
    // position
    $id('TargetPosition').innerText =
      `pos = ${this.target.pos.x.toFixed(2)}, ${this.target.pos.y.toFixed(2)}`;
    // angle
    var angle = this.target.pos.a;
    while (angle < 0) angle += TAU;
    angle %= TAU;
    angle *= 360/TAU;
    $id('TargetAngle').innerText = `heading = ${angle.toFixed(2)} degs`;
    // energy
    var energy = this.target.energy.toFixed(1);
    var perc = (energy / this.target.maxEnergy * 100).toFixed(1);
    $id('TargetEnergy').innerText = `energy = ${energy} (${perc}%)`
    // state
    var brain = this.target.brain;
    $id('TargetState').innerText = `state = ${brain.state.key}\n  a = ${(brain.angle*360/TAU).toFixed(2)}`;
    // state scores
    $id('TargetStateScores').innerText = 'brain state weights = {\n';
    for (var state of brain.states) {
      $id('TargetStateScores').innerText += `  ${state.key}: ${state.weight.toFixed(2)}\n`;
    }
    $id('TargetStateScores').innerText += '}';
    // brain targets
    $id('TargetBrainTargets').innerText = 'brain targets = [\n';
    for (var target of brain.targets)
      $id('TargetBrainTargets').innerText +=
        `  ${target.entype}: ${(this.target.pos.angleTo(target.pos)*360/TAU).toFixed(2)} degs\n`;
    $id('TargetBrainTargets').innerText += '}';
    // touches
    var nearby = this.target.nearby;
    $id('TargetTouches').innerText = 'touching = [\n';
    for (var entity of nearby)
      $id('TargetTouches').innerText +=
        `  ${entity.entype}: ${this.target.touches(entity)}\n`;
    $id('TargetTouches').innerText += ']';
  }
}
