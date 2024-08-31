// InteractBox

class InteractBox {
    isSelected;
    isShowGuide; // isSelectable

    #one; // object(this)
    selectGuide; // object

    static offset;

    resetOpacity = {
        origin : null,
        target : null,
    }

    get position() {
        return this.#one.position;
    }
    get body() {
        return this.#one.body;
    }
    setDynamic(isDynamic = true) {
        this.#one.setDynamic(isDynamic);
    }

    constructor(object) {
        this.isSelected = false;
        this.isShowGuide = false;

        this.#one = object;
        this.selectGuide = object.children[0];

        this.offset = new THREE.Vector3(0, -1.25, 0);

        this.resetOpacity.origin = object.children[0].material.opacity;
        this.resetOpacity.target = 0;

        object.children[0].material.opacity = 0;
    }
    static fromObject(object) {
        return new InteractBox(object);
    }

    getDistanceBetweenPlayer() {
        let offsetPosition = new THREE.Vector3();
        offsetPosition.addVectors(this.offset, this.position);
        return offsetPosition.distanceTo(PLAYER.position);
    }

    showSelectGuide() {
        if (this.isShowGuide) return;
        this.isShowGuide = true;
        this.selectGuide.material.opacity = this.resetOpacity.origin;
    }
    hideSelectGuide() {
        if (!this.isShowGuide) return;
        this.isShowGuide = false;
        this.selectGuide.material.opacity = this.resetOpacity.target;
    }

    selectBox() {
        this.isSelected = true;
        this.setDynamic(false);
        this.hideSelectGuide();
    }
    deselectBox() {
        this.isSelected = false;
        this.setDynamic(true);
    }

    Update(dt) {
        if (this.isSelected) {
            this.position.copy(PLAYER.selectPosition);
            this.body.needUpdate = true;
            return;
        }
        if (this.getDistanceBetweenPlayer() > 9) {
            this.hideSelectGuide();
            return;
        }
        this.showSelectGuide();
    }
}
GLOBAL.InteractBoxFromObject = InteractBox.fromObject;


// Button

class Button {
    isPressed;
    isPressing;
    isOnTop;
    
    part;
    wires = [];
    
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
        this.setOnCollide(object);
        
        this.resetPosition.target = object.position.clone();
        this.originToTargetDistance = this.resetPosition.origin.distanceTo(this.resetPosition.target);
        
        this.currentTween = null;
        this.duration = duration;
        this.millisec.origin = 10000;
        this.millisec.target = 1000;
    }
    static fromObject(object, duration = 0.1) {
        return new Button(object, duration);
    }

    // 추후 수정 필요
    setOnCollide(object) {
        this.part.onCollide(`InteractBox_${object.title.split('_')[1]}`, () => this.isOnTop = true, 'start');
        this.part.onCollide(`InteractBox_${object.title.split('_')[1]}`, () => this.isOnTop = false, 'end');
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
        GLOBAL.audio_manager.playButtonPositiveSfx();
        this.isPressing = true;
        this.createTweenAndStart('target', () => {
            this.onPressed();
        });
    }
    unpress() {
        if(!this.isPressing) return;
        GLOBAL.audio_manager.playButtonNegativeSfx();
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

    Update(dt) {
        if(this.getDistanceBetweenPlayer() > 2.5 && !this.isOnTop) {
            if(this.isPressing) this.unpress();
        }
        else {
            if(!this.isPressing) this.press();
        }
    }   
}
GLOBAL.ButtonFromObject = Button.fromObject;


// Door

class Door {
    // isOpened;
    isOpening;
    
    centerPosition;
    parts = []; // if parts[2] exist : Button Object
    
    currentTweens;
    originToTargetDistance;
    duration;
    resetPositions = {
        origin: [],
        target: [],
    };

    isConnected;

    constructor(object, duration = 0.35) {
        // this.isOpened = false;
        this.isOpening = false;
        this.isConnected = false;
        this.centerPosition = object.position.clone();
        this.duration = duration;
        object.children.forEach(val => {
            switch(val.title) {
                case 'side_a':
                    this.resetPositions.target[0] = val.position.clone();
                    break;
                case 'side_a_door':
                    this.parts[0] = val;
                    this.resetPositions.origin[0] = val.position.clone();
                    break;
                case 'side_b':
                    this.resetPositions.target[1] = val.position.clone();
                    break;
                case 'side_b_door':
                    this.parts[1] = val;
                    this.resetPositions.origin[1] = val.position.clone();
                    break;
                default: 
                    break;
            }
        });
        let button = WORLD.getObject(`Button_${object.title.split('_')[1]}`);
        if (button) {
            this.parts[2] = button;
            this.isConnected = true;
        }
        this.originToTargetDistance = this.resetPositions.origin[0].distanceTo(this.resetPositions.target[0]);
        this.currentTweens = [ null, null ];
    }
    static fromObject(object, duration = 0.35) {
        return new Door(object, duration);
    }
    
    checkButtonPressed() {
        if (!this.isConnected) return; // doubleCheck
        return this.parts[2].class.isPressed;
    }
    getDistanceBetweenPlayer() {
        return this.centerPosition.distanceTo(PLAYER.position);
    }
    calculateDurationByDistance(distance) {
        let ratio = distance / this.originToTargetDistance;
        return this.duration * ratio;
    }
    createTweenAndStart(key_str) {
        this.currentTweens.forEach(val => { if(val) val.stop() });

        let distance = this.parts[0].position.distanceTo(this.resetPositions[key_str][0]);
        for(let i = 0; i < 2; i++) {
            this.currentTweens[i] = new TWEEN.Tween(this.parts[i].position);
            this.currentTweens[i].to({
                x: this.resetPositions[key_str][i].x, 
                z: this.resetPositions[key_str][i].z,
            }, this.calculateDurationByDistance(distance) * 1000)
            .onComplete(() => {
                this.currentTweens[i] = null;
            });
            this.currentTweens[i].start();
        }
    }
    open() {
        if(this.isOpening) return;
        this.isOpening = true;
        this.createTweenAndStart('target');
    }
    close() {
        if(!this.isOpening) return;
        this.isOpening = false;
        this.createTweenAndStart('origin');
    }

    Update(dt) {
        if (this.isConnected) {
            if (this.checkButtonPressed()) {
                if (!this.isOpening) this.open();
            }
            else {
                if(this.isOpening) this.close();
            }
            return;
        }
        if (this.getDistanceBetweenPlayer() > 16) {
            if(this.isOpening) this.close(); 
        }
        else {
            if(!this.isOpening) this.open();
        }
    }
}
GLOBAL.DoorFromObject = Door.fromObject;
// 문 연결시 반드시 문과 버튼 오브젝트 뒤에 숫자 세팅(_N)을 해주어야 함