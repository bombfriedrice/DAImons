import { GLTFLoader } from 'https://unpkg.com/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer;
let currentSpeaker = null;

async function init() {
    console.log('Initializing Three.js scene');
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);  // Sky blue background
    console.log('Scene created');
    console.log('Scene background color:', scene.background);

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight * 0.75), 0.1, 1000);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
    console.log('Camera created and positioned');
    console.log('Camera position:', camera.position);

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight * 0.75);
    document.getElementById('game-container').appendChild(renderer.domElement);
    console.log('Renderer created and added to DOM');
    console.log('Renderer size:', renderer.getSize(new THREE.Vector2()));

    // Create lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 10, 5);
    scene.add(directionalLight);
    console.log('Lights added to scene');

    // Create ground plane
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x33ff33 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);
    console.log('Ground plane added to scene');

    // Load GLB models
    await loadGLBModel('/static/models/agumon.glb', new THREE.Vector3(-2, 0, 0), 0.5, 'Agumon');
    await loadGLBModel('/static/models/rjmon.glb', new THREE.Vector3(0, 0, 0), 0.5, 'RJmon');
    await loadGLBModel('/static/models/veemon.glb', new THREE.Vector3(2, 0, 0), 0.5, 'Veemon');

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);

    // Start animation loop
    animate();

    console.log('Scene contents:', scene.children);
}

async function loadGLBModel(file, position, scale, name) {
    console.log(`Starting to load GLB model: ${name}`);
    
    const fileExists = await fetch(file).then(response => response.ok).catch(() => false);
    if (!fileExists) {
        console.error(`File not found: ${file}`);
        createFallbackObject(position, scale, name);
        return;
    }
    
    try {
        const loader = new GLTFLoader();
        loader.load(
            file,
            (gltf) => {
                console.log(`GLB model loaded successfully: ${name}`);
                const model = gltf.scene;
                model.position.set(position.x, position.y, position.z);
                model.scale.set(scale, scale, scale);
                model.name = name;
                addLabel(model, name);
                scene.add(model);
                console.log(`GLB model added to scene: ${name}`);
            },
            (xhr) => {
                console.log(`${name} ${(xhr.loaded / xhr.total * 100).toFixed(2)}% loaded`);
            },
            (error) => {
                console.error(`Error loading GLB model ${name}:`, error);
                console.error('Error details:', error.message);
                console.error('Error stack:', error.stack);
                createFallbackObject(position, scale, name);
            }
        );
    } catch (error) {
        console.error(`Error initializing GLTFLoader for ${name}:`, error);
        createFallbackObject(position, scale, name);
    }
}

function createFallbackObject(position, scale, name) {
    console.log(`Creating fallback object for ${name}`);
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const fallbackObject = new THREE.Mesh(geometry, material);
    fallbackObject.position.set(position.x, position.y, position.z);
    fallbackObject.scale.set(scale, scale, scale);
    fallbackObject.name = name;
    addLabel(fallbackObject, name);
    scene.add(fallbackObject);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / (window.innerHeight * 0.75);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight * 0.75);
    console.log('Window resized, camera and renderer updated');
}

function addLabel(object, text) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = '24px Arial';
    context.fillStyle = 'white';
    context.fillText(text, 0, 24);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(0, 1.5, 0);
    sprite.scale.set(2, 1, 1);

    object.add(sprite);
    console.log(`Label added to object: ${text}`);
}

function panCameraToObject(object) {
    if (currentSpeaker !== object) {
        currentSpeaker = object;
        const targetPosition = new THREE.Vector3().copy(object.position);
        targetPosition.y += 1;
        targetPosition.z += 3;

        new TWEEN.Tween(camera.position)
            .to(targetPosition, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();

        new TWEEN.Tween(camera.rotation)
            .to({ x: 0, y: 0, z: 0 }, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();

        console.log(`Camera panned to object: ${object.name}`);
    }
}

function animate() {
    requestAnimationFrame(animate);
    if (scene && camera) {
        try {
            TWEEN.update();
        } catch (error) {
            console.error('Error updating TWEEN:', error);
        }
        renderer.render(scene, camera);
    } else {
        console.error('Scene or camera is undefined');
    }
}

console.log('Starting initialization');
init();
console.log('Initialization complete');
