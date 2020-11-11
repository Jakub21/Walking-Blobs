
var $id = (id) => { return document.getElementById(id); }
var $cn = (id) => { return document.getElementsByClassName(id); }
var $tag = (id) => { return document.getElementsByTagName(id); }
var $create = (tag) => { return document.createElement(tag); }
var $on = (elm, key, cb) => { elm.addEventListener(key, cb); }

var sim;
var fpsReading = 0;

function main() {
  var boardSize = new Vector(1920/2-120, 1080/2);
  var config = {
    canvas: $id('canvas'),
    displayScale: 2,
    holderConfig: {
      size: boardSize,
      regionSize: 60,
      interactionRange: 1
    },
    environmentConfig: {
      size: boardSize,
      maxFoodDensity: 2.5e-4,
      foodGenChance: 9e-2,
      foodConfig: {
        massPerEnergy: .4,
        maxEnergy: 15,
        startEnergyFraction: .25,
        energyIncrease: 3e-2
      }
    },
    walkerConfig: {
      moveCost: .15,
      rotateCost: 1.5,
      baseSightRange: 75,
      importance: {
        food: 60,
        danger: 180,
        mating: 30
      }
    },
    herbivoreConfig: {
      mass: 12,
      maxEnergy: 120,
      startEnergyFraction: .3
    },
    carnivoreConfig: {
      mass: 18,
      maxEnergy: 150,
      startEnergyFraction: .3
    },
  };
  config.herbivoreConfig = Object.assign(config.herbivoreConfig, config.walkerConfig);
  config.carnivoreConfig = Object.assign(config.carnivoreConfig, config.walkerConfig);
  delete config.walkerConfig;
  var FPS = 63;
  var herbivores = 36;
  var carnivores = 4;
  console.log('Simulation instance');
  sim = new Simulation(config);
  for (var index = 0; index < herbivores; index+= 1)
    sim.holder.addEntity(new Herbivore(sim,
      Position.randContained(boardSize), config.herbivoreConfig));
  for (var index = 0; index < carnivores; index+= 1)
    sim.holder.addEntity(new Carnivore(sim,
      Position.randContained(boardSize), config.carnivoreConfig));
  console.log('Run simulation');
  setInterval(function () { sim.update(); }, 1000/FPS);
  setInterval(function () {
    $id('fps').innerText = `FPS = ${sim.fpsMeter.get().toFixed(1)}`;
  }, 1000);
}
