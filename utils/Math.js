
const ceil = Math.ceil;
const round = Math.round;
const floor = Math.floor;

const random = Math.random;

const sqrt = Math.sqrt;
const pow = Math.pow;

const sin = Math.sin;
const cos = Math.cos;
const atan2 = Math.atan2;

const TAU = Math.PI * 2;

const abs = Math.abs;

const min = Math.min;
const max = Math.max;

const angleDiff = (a, b) => {
  // Calculate absolute angle difference
  return min(abs(a-b), abs(TAU+a-b)) % TAU;
}
