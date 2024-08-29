const CANVAS = document.getElementById('canvas');
const RENDERER = new THREE.WebGLRenderer({ canvas: CANVAS });

// Portal

class Portal {
    isDeployed;
    
    #one; // object(Portal)
    theOtherPortal = null; // Portal

    static offset;
    target;
    
    currentTween;
    duration;
    resetScale = {
        origin : null,
        target : null,
    }

    hole; // object
    camera;
    renderTarget;
    
    get position() {
        return this.#one.position;
    }
    get scale() {
        return this.#one.scale;
    }
    lookAt(target) {
        this.#one.lookAt(target);
    }

    constructor (object) {
        this.isDeployed = false;

        this.#one = object;

        this.currentTween = null;
        this.resetScale.origin = new THREE.Vector3();
        this.resetScale.target = object.scale.clone();
        this.duration = 300;
        
        this.offset = new THREE.Vector3(0, -3, 0);
        object.children.forEach(val => {
            switch(val.title) {
                case 'hole':
                    this.hole = val;
                    break;
                case 'target':
                    this.target = val;
                    break;
            }
        });
        
        this.camera = new THREE.PerspectiveCamera(20, CANVAS.width / CANVAS.height, 0.1, 1000);
        this.camera.layers.enableAll();
        // this.camera.layers.disable(3);
        this.camera.lookAt(this.target.position);
        this.#one.add(this.camera);
        this.camera.position.set(0, -0.75, 0);
        this.renderTarget = new THREE.WebGLRenderTarget(CANVAS.width, CANVAS.height);
        this.hole.material.dispose();
        this.hole.material = new THREE.MeshBasicMaterial({ map: this.renderTarget.texture });
    }
    
    connectToTheOther(portal) {
        this.theOtherPortal = portal;
        this.theOtherPortal.theOtherPortal = this;
    }
    getDistanceBetweenPlayer() {
        let offsetPosition = new THREE.Vector3();
        offsetPosition.addVectors(this.offset, this.position);
        return offsetPosition.distanceTo(PLAYER.position);
    }
    getDistanceBetweenCamera() {
        return this.position.distanceTo(GLOBAL.CAMERA.position);
    }
    moveToTheOther() {
        let offsetPosition = new THREE.Vector3();
        this.theOtherPortal.target.getWorldPosition(offsetPosition);
        offsetPosition.add(this.offset);

        PLAYER.position.copy(offsetPosition);
        PLAYER.body.needUpdate = true;
    }

    createTweenAndStart() {
        if (this.currentTween) this.currentTween.stop();
        this.isDeployed = false;
        
        this.scale.copy(this.resetScale.origin);
        this.currentTween = new TWEEN.Tween(this.scale);
        this.currentTween.to(this.resetScale.target, this.duration)
        .onComplete(() => {
            this.isDeployed = true;
            this.currentTween = null;
        });
        this.currentTween.start();
    }
    deployPortal(position, lookAtPosition) {
        this.position.copy(position);
        this.lookAt(lookAtPosition);
        this.createTweenAndStart();
    }

    Update(dt) {
        this.UpdateHole(dt);
        if(this.getDistanceBetweenPlayer() > 3.5 || !this.isDeployed || !this.theOtherPortal.isDeployed) return;
        this.moveToTheOther();
    }
    UpdateHole(dt) {
        if(!this.theOtherPortal) return;
        RENDERER.setRenderTarget(this.theOtherPortal.renderTarget);
        RENDERER.render(WORLD, this.camera);
        
        RENDERER.setRenderTarget(null);
        RENDERER.render(WORLD, GLOBAL.CAMERA);
    }
}

// Portal Gun

class PortalGun {
    portals = [];

    bvh;
    raycaster;
    pointer;
    raycastObjects;

    constructor(portals) {
        this.portals = [portals[0], null, portals[1]]; // for mouse button matching
        this.portals[GLOBAL.PORTAL_TYPE.ORANGE].connectToTheOther(this.portals[GLOBAL.PORTAL_TYPE.BLUE]);

        this.bvh = WORLD.getObjectByName('bvhCollider');
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        this.raycastObjects = [this.bvh];

        this.raycaster.layers.enableAll();
        this.raycaster.firstHitOnly = true;
    }

    shootPortal(portal_type) {
        this.raycaster.setFromCamera(this.pointer, GLOBAL.CAMERA);

        const intersects = this.raycaster.intersectObjects(this.raycastObjects);
        if (intersects.length > 0) {
            let position = new THREE.Vector3();
            let normal = new THREE.Vector3();
            position.copy(GLOBAL.GRID.calculateGrid(intersects[0].point, intersects[0].face.normal));
            position.add(intersects[0].face.normal.multiplyScalar(0.1));
            normal.addVectors(position, intersects[0].face.normal);
            this.portals[portal_type].deployPortal(position, normal);
        }
    }

    Update(dt) {
        this.portals.forEach(val => { 
            if(val !== null) val.Update(dt);
        });
    }
}

GLOBAL.portal_gun = new PortalGun([
    new Portal(WORLD.getObject('Orange_Portal')),
    new Portal(WORLD.getObject('Blue_Portal')),
]);

const hand = WORLD.getObject('Hand');
const realPortalGun = WORLD.getObject('PortalGun');

const distance = -1;
const offset = new THREE.Vector3(1, -1, 0);

function Start() {
    // Add Hand to Camera
    GLOBAL.CAMERA.getWorldDirection(hand.position);
    hand.position.multiplyScalar(distance);
    hand.position.add(offset);
    GLOBAL.CAMERA.add(hand);
    
    // Add PortalGun to PLAYER
    let portalGunClone = realPortalGun.clone();
    portalGunClone.scale.multiplyScalar(0.25);
    portalGunClone.position.set(-0.2, 0.25, 0);
    PLAYER.add(portalGunClone);
}

function updateRealPortalGunPoistion() {
    hand.getWorldPosition(realPortalGun.position);
    realPortalGun.lookAt(PLAYER.selectPosition);
}

function Update(dt) {
    // Update PortalGun Position to Hand
    updateRealPortalGunPoistion();
    GLOBAL.portal_gun.Update(dt);
}