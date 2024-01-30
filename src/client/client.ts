import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'lil-gui'


const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 2

const sideCamera = new THREE.OrthographicCamera(-window.innerWidth / 8, window.innerWidth / 8, window.innerHeight / 8, -window.innerHeight / 8, 1, 1000);
sideCamera.position.set(1, 0, 0);
sideCamera.lookAt(scene.position);

const frontCamera = new THREE.OrthographicCamera(-window.innerWidth / 4, window.innerWidth / 4, window.innerHeight / 4, -window.innerHeight / 4, 1, 1000);
frontCamera.position.set(0, 0, 1);
frontCamera.lookAt(scene.position);

const topCamera = new THREE.OrthographicCamera(-window.innerWidth / 4, window.innerWidth / 4, window.innerHeight / 4, -window.innerHeight / 4, 1, 1000);
topCamera.position.set(0, 1, 0);
topCamera.lookAt(scene.position);

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.addEventListener('change', render)

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
})

const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

const onWheel = () => {
    onWindowResize()
}
window.addEventListener('wheel', onWheel, false)
window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    const depth = 2
    const width = window.innerWidth / 2;
    const height = window.innerHeight / 2;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    const distance = controls.getDistance()
const orthZoom = 0.125/16*distance/depth
    sideCamera.left = (-width / 2) * orthZoom;
    sideCamera.right = (width / 2) * orthZoom;
    sideCamera.top = (height / 2) * orthZoom;
    sideCamera.bottom = (-height / 2) * orthZoom;
    sideCamera.updateProjectionMatrix();

    frontCamera.left = (-width / 2) * orthZoom;
    frontCamera.right = (width / 2) * orthZoom;
    frontCamera.top = (height / 2) * orthZoom;
    frontCamera.bottom = (-height / 2) * orthZoom;
    frontCamera.updateProjectionMatrix();

    topCamera.left = (-width / 2) * orthZoom;
    topCamera.right = (width / 2) * orthZoom;
    topCamera.top = (height / 2) * orthZoom;
    topCamera.bottom = (-height / 2) * orthZoom;
    topCamera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    render()
}
onWindowResize()

const stats = new Stats()
document.body.appendChild(stats.dom)

const gui = new GUI()
const cubeFolder = gui.addFolder('Cube')
const cubeRotationFolder = cubeFolder.addFolder('Rotation')
cubeRotationFolder.add(cube.rotation, 'x', 0, Math.PI * 2)
cubeRotationFolder.add(cube.rotation, 'y', 0, Math.PI * 2)
cubeRotationFolder.add(cube.rotation, 'z', 0, Math.PI * 2)
cubeFolder.open()
cubeRotationFolder.open()
// const cubePositionFolder = cubeFolder.addFolder('Position')
// cubePositionFolder.add(cube.position, 'x', -10, 10, 2)
// cubePositionFolder.add(cube.position, 'y', -10, 10, 2)
// cubePositionFolder.add(cube.position, 'z', -10, 10, 2)
// cubeFolder.open()
// cubePositionFolder.open()
// const cubeScaleFolder = cubeFolder.addFolder('Scale')
// cubeScaleFolder.add(cube.scale, 'x', -5, 5)
// cubeScaleFolder.add(cube.scale, 'y', -5, 5)
// cubeScaleFolder.add(cube.scale, 'z', -5, 5)
cubeFolder.add(cube, 'visible')
cubeFolder.open()
let meshes: THREE.Object3D[] = []
const nMeshes = 31
for(let i = 0; i < nMeshes; i++){
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
    meshes.push(mesh)
}
function animate() {
    requestAnimationFrame(animate)
console.log(cube.quaternion.toJSON())
    // cube.rotation.x += 0.01
    // cube.rotation.y += 0.01
    
    for(let i = 0; i < nMeshes; i++){
        const mesh = meshes[i]
        mesh.position.x = i-nMeshes/2
        mesh.position.y = 0
        mesh.position.z = Math.cos(i/10*Math.PI*2)*2
            mesh.quaternion.slerp(cube.quaternion, 0.01*Math.sin(i/nMeshes/2*Math.PI*2))
    }
    render()

    stats.update()
}

function render() {
    const width = window.innerWidth / 2;
    const height = window.innerHeight / 2;

    renderer.setScissorTest(true);

    renderer.setScissor(0, 0, width, height);
    renderer.setViewport(0, 0, width, height);
    renderer.render(scene, camera);

    renderer.setScissor(width, 0, width, height);
    renderer.setViewport(width, 0, width, height);
    renderer.render(scene, sideCamera);

    renderer.setScissor(0, height, width, height);
    renderer.setViewport(0, height, width, height);
    renderer.render(scene, frontCamera);

    renderer.setScissor(width, height, width, height);
    renderer.setViewport(width, height, width, height);
    renderer.render(scene, topCamera);

    renderer.setScissorTest(false);
}

animate()