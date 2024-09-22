import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer;
let currentSpeaker = null;

function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);  // Sky blue background

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight * 0.75), 0.1, 1000);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight * 0.75);
    document.getElementById('game-container').appendChild(renderer.domElement);

    // Create lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 10, 5);
    scene.add(directionalLight);

    // Create ground plane
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x33ff33 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Load GLB models
    loadGLBModel('static/models/agumon_sculpt.glb', new THREE.Vector3(-2, 0, 0), 0.5, 'Agumon');
    loadGLBModel('static/models/rjmon.glb', new THREE.Vector3(0, 0, 0), 0.5, 'RJmon');
    loadGLBModel('static/models/digimon_linkz_-_veemon.glb', new THREE.Vector3(2, 0, 0), 0.5, 'Veemon');

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);

    // Start animation loop
    animate();
}

function loadGLBModel(file, position, scale, name) {
    const loader = new GLTFLoader();
    loader.load(file, (gltf) => {
        const model = gltf.scene;
        model.position.set(position.x, position.y, position.z);
        model.scale.set(scale, scale, scale);
        model.name = name;
        addLabel(model, name);
        scene.add(model);
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / (window.innerHeight * 0.75);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight * 0.75);
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
    }
}

function animate() {
    requestAnimationFrame(animate);

    TWEEN.update();

    renderer.render(scene, camera);
}

init();
