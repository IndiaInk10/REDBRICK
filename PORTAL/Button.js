class Button {
    isPressed;
    isPressing;
    part;
    wires = [];
    duration;
    originToTargetDistance;
    resetPosition = {
        origin : null,
        target : null,
    };
    currentTween;
    millisec = {
        origin : null,
        target : null,
    };
    
    constructor(object, duration = 0.1) {
        this.isPressed = false;
        this.isPressing = false;
        this.duration = duration;
        this.resetPosition.target = object.position.clone();
        object.children.forEach(val => {
            switch(val.title) {
                case 'wire':
                    this.wires.push(val);
                    break;
                case 'button':
                    this.part = val;
                    this.resetPosition.origin = val.position.clone();
                    break;
                default: 
                    break;
            }
        });
        this.originToTargetDistance = this.resetPosition.origin.distanceTo(this.resetPosition.target);
        this.currentTween = null;
        this.millisec.origin = 10000;
        this.millisec.target = 1000;
    }

    getDistanceBetweenPlayer() {
        let partPosition = new THREE.Vector3(); 
        this.part.getWorldPosition(partPosition);
        return partPosition.distanceTo(PLAYER.position);
    }
    getDistanceBetweenObject(object) {
        let partPosition = new THREE.Vector3(); 
        this.part.getWorldPosition(partPosition);
        return partPosition.distanceTo(object.position);
    }
    calculateDurationByDistance(distance) {
        let ratio = distance / this.originToTargetDistance;
        return this.duration * ratio;
    }
    createTweenAndStart(key_str, func = null) {
        if(this.currentTween) this.currentTween.stop();

        let distance = this.part.position.distanceTo(this.resetPosition[key_str]);
        this.currentTween = new TWEEN.Tween(this.part.position);
            this.currentTween.to({
                y: this.resetPosition[key_str].y,
            }, this.calculateDurationByDistance(distance) * this.millisec[key_str])
            .onComplete(() => {
                this.currentTween = null;
                if(func) func();
            });
            this.currentTween.start();
    }
    press() {
        if(this.isPressing) return;
        this.isPressing = true;
        this.createTweenAndStart('target', () => {
            this.onPressed();
        });
    }
    unpress() {
        if(!this.isPressing) return;
        this.isPressing = false;
        this.createTweenAndStart('origin', () => {
            this.onUnpressed();
        });
    }
    onPressed() {
        this.wires.forEach(val => {
            val.material.color.set(GLOBAL.COLOR.ORANGE);
        });
    }
    onUnpressed() {
        this.wires.forEach(val => {
            val.material.color.set(GLOBAL.COLOR.BLUE);
        });
    }
}

const BUTTON = new Button(this);

function Update(dt) {
    if(BUTTON.getDistanceBetweenPlayer() > 2.5) {
        if(BUTTON.isPressing) BUTTON.unpress(); 
        return; 
    }
    else {
        if(!BUTTON.isPressing) BUTTON.press();
        return;
    }
}