import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const objLoader = new OBJLoader();
/**
 * House
 */
// Create a new group for the post-apocalyptic house
const postHouse = new THREE.Group();
scene.add(postHouse); // Add the group to the scene

// Load the Medieval House model
const gltfLoader = new GLTFLoader();
gltfLoader.load(
    '/models/posthouse/scene.gltf',
    (gltfScene) => {
        gltfScene.scene.position.y += 0.5; // Scale, position, and rotate the model if needed
        gltfScene.scene.scale.set(0.5, 0.5, 0.5);  // Adjust the scale as needed
        gltfScene.scene.position.set(0, 0, 0);    // Position the house model
        gltfScene.scene.rotation.set(0, Math.PI / 2, 0);  // Rotate the model if needed
        
        // Add the loaded model to the postHouse group
        postHouse.add(gltfScene.scene);

        console.log("GLTF model loaded successfully!");
    },
    undefined,  // Optional progress callback
    (error) => {
        console.error('Error loading GLTF model:', error);
    }
);

/**
 * Post-Apocalyptic Fence

/**
 * Graves 
 */
// Graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' });

for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2; // Random angle
    const radius = 3 + Math.random() * 10;     // Random radius
    const x = Math.cos(angle) * radius;       // Get the x position using cosine
    const z = Math.sin(angle) * radius;       // Get the z position using sine

    // Create the mesh
    const grave = new THREE.Mesh(graveGeometry, graveMaterial);

    // Position
    grave.position.set(x, 0.3, z);

    // Rotation
    grave.rotation.z = (Math.random() - 0.5) * 0.4;
    grave.rotation.y = (Math.random() - 0.5) * 0.4;

    // Enable shadows for graves
    grave.castShadow = true;

    // Add to the graves container
    graves.add(grave);
}

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture =
textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture =
textureLoader.load('/textures/grass/roughness.jpg')

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.MeshStandardMaterial({ 
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture
        
    })
)
grassColorTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)
grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping
grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping
floor.geometry.setAttribute('uv2', new
THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Light color, intensity: 0.5
scene.add(ambientLight);
// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
doorLight.position.set(0, 2.2, 2.7)
postHouse.add(doorLight) // Add door light to the postHouse group

//Fog
const fog = new THREE.Fog('#262837', 1, 15)
scene.fog = fog

// Ghosts
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
scene.add(ghost1)
const ghost2 = new THREE.PointLight('#00ffff', 2, 3)
scene.add(ghost2)
const ghost3 = new THREE.PointLight('#ffff00', 2, 3)
scene.add(ghost3)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262827')

renderer.shadowMap.enabled = true
moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(elapsedTime * 3)
    const ghost2Angle = - elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)
    const ghost3Angle = - elapsedTime * 0.18
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()
