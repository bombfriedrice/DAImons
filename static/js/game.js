let scene, camera, renderer, daimon, ground, cube, sphere;

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
    ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Create cube
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff3333 });
    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-2, 0.5, 0);
    scene.add(cube);

    // Create sphere
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x3333ff });
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(2, 0.5, 0);
    scene.add(sphere);

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
        daimon.position.set(0, 1, 0);
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

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    sphere.position.y = 0.5 + Math.sin(Date.now() * 0.001) * 0.5;

    renderer.render(scene, camera);
}

init();
