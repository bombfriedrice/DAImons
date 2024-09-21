let scene, camera, renderer, daimon;

function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);  // Sky blue background

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight * 0.75);
    document.getElementById('game-container').appendChild(renderer.domElement);

    // Create lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    // Load Daimon character
    loadDaimonCharacter();

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);

    // Start animation loop
    animate();
}

function loadDaimonCharacter() {
    const loader = new THREE.ObjectLoader();
    loader.load('static/models/daimon.json', (object) => {
        daimon = object;
        scene.add(daimon);
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / (window.innerHeight * 0.75);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight * 0.75);
}

function animate() {
    requestAnimationFrame(animate);

    if (daimon) {
        daimon.rotation.y += 0.01;
    }

    renderer.render(scene, camera);
}

init();
