
class Vector {
  constructor(x, y) {
    this.x = x; this.y = y;
  }
  magnitude() {
    return sqrt(pow(this.x, 2) + pow(this.y, 2));
  }
  scale(k) {
    this.x *= k; this.y *= k;
  }
  add(other) {
    this.x += other.x; this.y += other.y;
  }
  diff(other) {
    var delta = Vector.delta(this, other);
    return delta.magnitude();
  }
  cap(maxmag) {
    var mag = this.magnitude();
    this.scale(mag/maxmag);
  }
  wrap(other) {
    this.x %= other.x; this.y %= other.y;
    while (this.x < 0) this.x += other.x;
    while (this.y < 0) this.y += other.y;
  }
  xyProduct() {
    return this.x * this.y;
  }
  transform(ihat, jhat) {
    var x = this.x * ihat.x + this.y * jhat.x;
    var y = this.x * ihat.y + this.y * jhat.y;
    this.x = x; this.y = y;
  }
  isZero(threshold=1e-4) {
    return (abs(this.x) < threshold) && (abs(this.y) < threshold);
  }
  round() {
    this.x = round(this.x); this.y = round(this.y);
  }
  ceil() {
    this.x = ceil(this.x); this.y = ceil(this.y);
  }
  floor() {
    this.x = floor(this.x); this.y = floor(this.y);
  }
  static delta(a, b) {
    return new Vector(a.x-b.x, a.y-b.y);
  }
  static duplicate(other) {
    return new Vector(other.x, other.y);
  }
  static randContained(other) {
    return new Vector(random()*other.x, random()*other.y);
  }
  static randUnit() {
    var result = new Vector(random()-.5, random()-.5);
    result.scale(1/result.magnitude());
    return result;
  }
}
