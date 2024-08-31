function Start() {
    GLOBAL.MAINCAMERA.getWorldDirection(this.position);
    this.position.multiplyScalar(-0.5);
    this.position.y -= 0.025;
    GLOBAL.MAINCAMERA.add(this);
}