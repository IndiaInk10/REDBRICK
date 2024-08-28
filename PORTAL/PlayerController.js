isEquiped = true;

// Hole

const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
const bvh = WORLD.getObjectByName('bvhCollider');
// Portal

class Portal {
    isDeployed;
    one; // object
    theOtherPortal = null; // Portal
    target;
    hole; // object
    resetScale = {
        origin : null,
        target : null,
    }
    camera;
    renderTarget;
    
    get position() {
        return this.one.position;
    }

    constructor (object) {
        this.isDeployed = false;
        this.one = object;
        this.resetScale.origin = new THREE.Vector3();
        this.resetScale.target = object.scale;
        this.hole = object.children[0];
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
        this.camera = new THREE.PerspectiveCamera(20, canvas.width/canvas.height, 0.1, 1000);
        this.camera.layers.enableAll();
        this.camera.lookAt(this.target.position);
        this.one.add(this.camera);
        this.camera.position.set(0, -0.75, 0);
        this.renderTarget = new THREE.WebGLRenderTarget(canvas.width, canvas.height);
        this.hole.material.dispose();
        this.hole.material = new THREE.MeshBasicMaterial({ map: this.renderTarget.texture });
    }
    
    connectToTheOther(portal) {
        this.theOtherPortal = portal;
        this.theOtherPortal.theOtherPortal = this;
    }
    getDistanceBetweenCamera() {
        return this.position.distanceTo(GLOBAL.CAMERA.position);
    }
    moveToTheOther() {
        this.theOtherPortal.target.getWorldPosition(PLAYER.position);
        this.one.getWorldQuaternion(GLOBAL.CAMERA.quaternion);
        // GLOBAL.CAMERA.updateProjectionMatrix();
        PLAYER.body.needUpdate = true;
    }

    Update(dt) {
        this.UpdateHole(dt);
        if(this.getDistanceBetweenCamera() > 1.5) return;
        this.moveToTheOther();
    }
    UpdateHole(dt) {
        if(!this.theOtherPortal) return;
        renderer.setRenderTarget(this.theOtherPortal.renderTarget);
        renderer.render(WORLD, this.camera);
        
        renderer.setRenderTarget(null);
        renderer.render(WORLD, GLOBAL.CAMERA);
    }
}

// Debug

const geometry = new THREE.SphereGeometry( 1, 32, 16 ); 
const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
const sphere = new THREE.Mesh( geometry, material ); 
WORLD.add( sphere );

// Raycast

const orange_portal = new Portal(WORLD.getObject('Orange_Portal'));
const blue_portal =  new Portal(WORLD.getObject('Blue_Portal'));
orange_portal.connectToTheOther(blue_portal);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(0,0);
const raycastObjects = [bvh];

raycaster.layers.enableAll();
raycaster.firstHitOnly = true;

function OnKeyDown(event) {
    if(event.code === 'KeyF') {
        raycasting(blue_portal);
    } else if(event.code === 'KeyG') {
        raycasting(orange_portal);
    }
}

function raycasting(object) {
    if(!isEquiped) return;

    raycaster.setFromCamera(pointer, GLOBAL.CAMERA);

    const intersects = raycaster.intersectObjects(raycastObjects);
    
    if(intersects.length > 0) {
        // sphere.position.copy(intersects[0].point);
        let position = new THREE.Vector3();
        let normal = new THREE.Vector3();
        // intersects[0].face.normal.x = MathUtils.round(intersects[0].face.normal.x);
        // intersects[0].face.normal.y = MathUtils.round(intersects[0].face.normal.y);
        // intersects[0].face.normal.z = MathUtils.round(intersects[0].face.normal.z);
        position.copy(GLOBAL.GRID.calculateGrid(intersects[0].point, intersects[0].face.normal));
        position.add(intersects[0].face.normal.multiplyScalar(0.1));
        // sphere.position.copy(position);
        normal.addVectors(position, intersects[0].face.normal);
        object.one.position.copy(position);
        object.one.lookAt(normal);
    }
}

orange_portal.camera.getWorldPosition(sphere.position);

function Update(dt) {
    orange_portal.Update(dt);
    blue_portal.Update(dt);
}