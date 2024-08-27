const avatar = REDBRICK.AvatarManager.createDefaultAvatar();
const my_camera = WORLD.getObject("MainCamera");
const followingCamera = avatar.setFollowingCamera(my_camera);
avatar.setDefaultController();
my_camera.useFPS();

// const renderTarget = RENDERER.getWebGLRenderer();

const planelikeGeometry = new THREE.BoxGeometry( 400, 200, 200 );
// const plane = new THREE.Mesh( planelikeGeometry, new THREE.MeshBasicMaterial( { map: renderTarget } ) );
// plane.position.set(0,0,0);

// WORLD.add(plane);

const canvas = document.getElementById('canvas');

const renderTarget = new THREE.WebGLRenderTarget(canvas.width, canvas.height);
const camera = new THREE.PerspectiveCamera(120, 16/9, 0.1, 1000);
camera.position.set(0, 25, 0);
camera.lookAt(0, 0, 0);

console.log(WORLD);

const geometry = new THREE.CircleGeometry(5, 32);
const material = new THREE.MeshBasicMaterial({ map: renderTarget.texture });
const circle = new THREE.Mesh(geometry, material);
circle.position.set(0, 5, 5);
WORLD.add(circle);

const planeGeometry = new THREE.PlaneGeometry(5, 5);
const planeMaterial = new THREE.MeshBasicMaterial({ map: renderTarget.texture });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(0, 2.5, 0);
WORLD.add(plane);

const renderer = new THREE.WebGLRenderer({ canvas: canvas });

// function animate() {
//     requestAnimationFrame(animate);

//     // 렌더 타겟에 씬을 렌더링
//     renderer.setRenderTarget(renderTarget);
//     renderer.render(WORLD, camera);

//     // 기본 렌더 타겟에 씬을 렌더링
//     renderer.setRenderTarget(null);
//     renderer.render(WORLD, camera);
// }

// animate();

function Update(dt) {
    // 렌더 타겟에 씬을 렌더링
    renderer.setRenderTarget(renderTarget);
    renderer.render(WORLD, camera);

    // 기본 렌더 타겟에 씬을 렌더링
    renderer.setRenderTarget(null);
    renderer.render(WORLD, my_camera);
}