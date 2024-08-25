// Skybox ; need sky object that has sky material

const sky = WORLD.getObject("sky");
const geometry = new THREE.SphereGeometry( 500, 60, 40 );
// invert the geometry on the x-axis so that all of the faces point inward
geometry.scale( -1, 1, 1 );
const material = new THREE.MeshBasicMaterial( sky.material );
const mesh = new THREE.Mesh( geometry, material );
mesh.position.copy(new THREE.Vector3(0, 100, 0));

WORLD.add(mesh);