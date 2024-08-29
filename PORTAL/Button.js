class Button {
    isPressed;
    isPressing;
    isOnTop;
    
    part;
    wires = [];
    debouncer;
    
    originToTargetDistance;
    resetPosition = {
        origin : null,
        target : null,
    };
    
    currentTween;
    duration;
    millisec = {
        origin : null,
        target : null,
    };
    
    constructor(object, duration = 0.1) {
        this.isPressed = false;
        this.isPressing = false;
        this.isOnTop = false;
        
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
        this.setOnCollide();
        
        this.resetPosition.target = object.position.clone();
        this.originToTargetDistance = this.resetPosition.origin.distanceTo(this.resetPosition.target);
        
        this.currentTween = null;
        this.duration = duration;
        this.millisec.origin = 10000;
        this.millisec.target = 1000;
    }
    setOnCollide() {
        this.part.onCollide('InteractBox', () => this.isOnTop = true, 'start');
        this.part.onCollide('InteractBox', () => this.isOnTop = false, 'end');
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
            .onUpdate(()=> {
                this.part.body.needUpdate = true;
            })
            .onComplete(() => {
                if(func) func();
                this.currentTween = null;
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
        this.isPressed = false;
        this.createTweenAndStart('origin', () => {
            this.onUnpressed();
        });
    }
    onPressed() {
        this.isPressed = true;
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
    if(BUTTON.getDistanceBetweenPlayer() > 2.5 && !BUTTON.isOnTop) {
        if(BUTTON.isPressing) BUTTON.unpress();
        return; 
    }
    else {
        if(!BUTTON.isPressing) BUTTON.press();
    }
}