import { GLTFLoader } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

let scene, camera, renderer;
let currentSpeaker = null;

function init() {
    console.log('Initializing Three.js scene');
    try {
        // Create scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87CEEB);  // Sky blue background
        console.log('Scene created successfully');

        // Create camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight * 0.75), 0.1, 1000);
        camera.position.set(0, 5, 10);
        camera.lookAt(0, 0, 0);
        console.log('Camera created and positioned successfully');

        // Create renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight * 0.75);
        const container = document.getElementById('game-container');
        if (!container) {
            throw new Error('Game container not found in the DOM');
        }
        container.appendChild(renderer.domElement);
        console.log('Renderer created and added to DOM successfully');

        // Create lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 10, 5);
        scene.add(directionalLight);
        console.log('Lights added to scene successfully');

        // Create ground plane
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x33ff33 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        scene.add(ground);
        console.log('Ground plane added to scene successfully');

        // Create placeholder models
        createPlaceholderModel(new THREE.Vector3(-2, 1, 0), 0x0000FF, 'Agumon');
        createPlaceholderModel(new THREE.Vector3(0, 1, 0), 0xFF0000, 'RJmon');
        createPlaceholderModel(new THREE.Vector3(2, 1, 0), 0x00FF00, 'Veemon');

        // Handle window resize
        window.addEventListener('resize', onWindowResize, false);

        // Start animation loop
        animate();

        console.log('Scene contents:', scene.children);
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}

function createPlaceholderModel(position, color, name) {
    try {
        const geometry = new THREE.BoxGeometry(1, 2, 1);
        const material = new THREE.MeshPhongMaterial({ color: color });
        const model = new THREE.Mesh(geometry, material);
        model.position.copy(position);
        model.name = name;
        addLabel(model, name);
        scene.add(model);
        console.log(`Placeholder model created for ${name}`);
    } catch (error) {
        console.error(`Error creating placeholder model for ${name}:`, error);
    }
}

function onWindowResize() {
    try {
        camera.aspect = window.innerWidth / (window.innerHeight * 0.75);
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight * 0.75);
        console.log('Window resized, camera and renderer updated');
    } catch (error) {
        console.error('Error during window resize:', error);
    }
}

function addLabel(object, text) {
    try {
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
    } catch (error) {
        console.error(`Error adding label to object ${text}:`, error);
    }
}

function panCameraToObject(object) {
    try {
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
    } catch (error) {
        console.error('Error panning camera to object:', error);
    }
}

function animate() {
    requestAnimationFrame(animate);
    try {
        if (scene && camera && renderer) {
            TWEEN.update();
            renderer.render(scene, camera);
        } else {
            console.error('Scene, camera, or renderer is undefined');
        }
    } catch (error) {
        console.error('Error during animation:', error);
    }
}

console.log('Starting initialization');
init();
console.log('Initialization complete');

// Export functions for use in other scripts
window.panCameraToObject = panCameraToObject;
