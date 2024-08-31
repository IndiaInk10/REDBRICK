function Start() {
    GLOBAL.CAMERA.getWorldDirection(this.position);
    this.position.multiplyScalar(-0.5);
    this.position.y -= 0.025;
    GLOBAL.CAMERA.add(this);
}