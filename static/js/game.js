let scene, camera, renderer, daimon, ground, cube, sphere;
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
    ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Create cube
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff3333 });
    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-2, 0.5, 0);
    cube.name = 'Cubey';
    addLabel(cube, 'Cubey');
    scene.add(cube);

    // Create sphere
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x3333ff });
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(2, 0.5, 0);
    sphere.name = 'Sphera';
    addLabel(sphere, 'Sphera');
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
        daimon.name = 'Daimon';
        addLabel(daimon, 'Daimon');
        scene.add(daimon);
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

    if (daimon) {
        daimon.rotation.y += 0.01;
    }

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    sphere.position.y = 0.5 + Math.sin(Date.now() * 0.001) * 0.5;

    renderer.render(scene, camera);
}

init();