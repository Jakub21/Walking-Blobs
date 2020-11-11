
class Position extends Vector {
  constructor(x, y, a) {
    super(x, y);
    this.a = a;
  }
  add(other) {
    this.x += other.x; this.y += other.y;
    if (other.a) this.a += other.a;
    this._modAngle();
  }
  scale(k) {
    this.x *= k; this.y *= k; this.a *= k;
    this._modAngle();
  }
  _modAngle() {
    while (this.a < -TAU) this.a += TAU;
    this.a %= TAU;
  }
  addRelative(_other, angle) {
    // rotate other vector so its x+ axis is translated
    // to changes towards angle then add its values
    var other = Vector.duplicate(_other);
    other.transform(
      new Vector(cos(angle), sin(angle)),
      new Vector(-sin(angle), cos(angle)) );
    this.add(other);
    return other; // TEMP
  }
  isZero(threshold=7.5e-3) {
    return super.isZero(threshold) && (abs(this.a) < threshold);
  }
  angleTo(other) {
    var deltaX = this.x - other.x; var deltaY = this.y - other.y;
    return (atan2(deltaY, deltaX)+TAU*3/2) % TAU;
  }
  static delta(a, b) {
    var result = new Vector(a.x-b.x, a.y-b.y, a.a-b.a);
    result._modAngle();
    return result;
  }
  static duplicate(other) {
    return new Position(other.x, other.y, other.a);
  }
  static randContained(other) {
    return new Position(random()*other.x, random()*other.y, random()*TAU,
    random()*TAU);
  }
  static randUnit() {
    var result = new Vector(random()-.5, random()-.5, 0);
    result.scale(1/result.magnitude());
    return result;
  }
}
