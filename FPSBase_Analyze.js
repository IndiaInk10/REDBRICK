// GLOBAL.MAINCAMERA = WORLD.getObejct("MainCamera");
GLOBAL.MAINCAMERA = WORLD.getObejct("Main_Camera");

// Must add machine_rifle_003 object on the scene ; AK47
class FPSController {
    constructor() {
        this.yawQuat = new THREE.Quaternion();
        this.pitchQuat = new THREE.Quaternion();
        this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
        this.yAxis = new THREE.Vector3(0, 1, 0);
        this.xAxis = new THREE.Vector3(1, 0, 0);
        this.gun = WORLD.getObject("machine_rifle_003");
        this.clock = new THREE.Clock();
        this.bulletSpeed = 715;
        this.physicsWorld = this.initializePhysics();
        this.bullets = [];
    }

    initializePhysics() {
        let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
        let dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
        let overlappingPairCache = new Ammo.btDbvtBroadphase();
        let solver = new Ammo.btSequentialImpulseConstraintSolver();
        let world = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
        world.setGravity(new Ammo.btVector3(0, -9.81, 0));
        return world;
    }

    Start() {
        PLAYER.visible = false;
        GLOBAL.MAINCAMERA.rotation.set(0, 0, 0);
        document.body.requestPointerLock = document.body.requestPointerLock || document.body.mozRequestPointerLock;
        document.body.requestPointerLock();
    }

    Update(dt) {
        this.physicsWorld.stepSimulation(dt, 10);
        this.updateCameraAndGun();
        this.bullets.forEach((bullet) => {
            let transform = new Ammo.btTransform();
            bullet.body.getMotionState().getWorldTransform(transform);
            let origin = transform.getOrigin();
            bullet.mesh.position.set(origin.x(), origin.y(), origin.z());
        });
    }
    
    OnPointerMove(event) {
        const sensitivity = 0.002;
        let deltaX = event.movementX || event.mozMovementX || 0;
        let deltaY = event.movementY || event.mozMovementY || 0;

        this.yawQuat.setFromAxisAngle(this.yAxis, -deltaX * sensitivity);
        this.pitchQuat.setFromAxisAngle(this.xAxis, -deltaY * sensitivity);

        GLOBAL.MAINCAMERA.quaternion.multiplyQuaternions(this.yawQuat, GLOBAL.MAINCAMERA.quaternion);
        GLOBAL.MAINCAMERA.quaternion.multiplyQuaternions(GLOBAL.MAINCAMERA.quaternion, this.pitchQuat);

        this.euler.setFromQuaternion(GLOBAL.MAINCAMERA.quaternion);
        this.euler.x = THREE.MathUtils.clamp(this.euler.x, -Math.PI * 85 / 180, Math.PI * 85 / 180);
        GLOBAL.MAINCAMERA.quaternion.setFromEuler(this.euler);
    }
}

class FPSControllerExtension extends FPSController {
    OnPointerDown(event) {
        this.fireGun();
    }

    fireGun() {
        const startOffset = new THREE.Vector3(0.02, 0.25, 3); 
        startOffset.applyQuaternion(this.gun.quaternion);
    
        let bullet = this.createBullet(startOffset);
        WORLD.add(bullet.mesh);
        this.physicsWorld.addRigidBody(bullet.body);
        this.bullets.push(bullet);

        setTimeout(() => {
            WORLD.remove(bullet.mesh);
            this.physicsWorld.removeRigidBody(bullet.body);
            Ammo.destroy(bullet.body);

            const index = this.bullets.indexOf(bullet);
            if (index > -1) {
                this.bullets.splice(index, 1);
            }
        }, 5000);
    }

    createBullet(offset) {
        const bulletGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        let mesh = new THREE.Mesh(bulletGeometry, bulletMaterial);
        mesh.position.copy(this.gun.position).add(offset);
    
        let body = new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(
            1,
            new Ammo.btDefaultMotionState(new Ammo.btTransform(new Ammo.btQuaternion(0, 0, 0, 1), new Ammo.btVector3(mesh.position.x, mesh.position.y, mesh.position.z))),
            new Ammo.btSphereShape(0.05),
            new Ammo.btVector3(0, 0, 0)
        ));
    
        let gunDirection = new THREE.Vector3(0, 0, 1);
        gunDirection.applyQuaternion(this.gun.quaternion);
        body.setLinearVelocity(new Ammo.btVector3(gunDirection.x * this.bulletSpeed, gunDirection.y * this.bulletSpeed, gunDirection.z * this.bulletSpeed));
    
        let transform = new Ammo.btTransform();
        body.getMotionState().getWorldTransform(transform);
        transform.setOrigin(new Ammo.btVector3(mesh.position.x, mesh.position.y, mesh.position.z));
        body.getMotionState().setWorldTransform(transform);
    
        return { mesh: mesh, body: body };
    }

    updateCameraAndGun() {
        GLOBAL.MAINCAMERA.position.copy(PLAYER.position);
        GLOBAL.MAINCAMERA.position.y += 4;
        let handOffset = new THREE.Vector3(1, -1, -3);
        this.gun.position.copy(GLOBAL.MAINCAMERA.position).add(handOffset.applyQuaternion(GLOBAL.MAINCAMERA.quaternion));
        this.gun.quaternion.copy(GLOBAL.MAINCAMERA.quaternion);
        let gunRotation = new THREE.Quaternion();
        gunRotation.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
        this.gun.quaternion.multiplyQuaternions(this.gun.quaternion, gunRotation);
    }

    animate() {
        let deltaTime = this.clock.getDelta();
        this.Update(deltaTime);
        requestAnimationFrame(this.animate.bind(this));
    }
}

let fpsController = new FPSControllerExtension();

document.addEventListener('pointermove', (event) => fpsController.OnPointerMove(event));
document.addEventListener('pointerdown', (event) => fpsController.OnPointerDown(event));

fpsController.Start();
fpsController.animate();