import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';


let scene, camera, renderer, controls, mixer, donuts

function init() {
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10);
    renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.set(0.6, 0.6, 1);
    document.body.appendChild(renderer.domElement);

    const directionLight = new THREE.DirectionalLight(0xffffff, 0.4);
    scene.add(directionLight);

}

function loadModel() {
    const gltfLoader = new GLTFLoader()
    gltfLoader.load('../../resources/models/donuts.glb', gltf => {
        donuts = gltf.scene;
        scene.add(donuts);
        mixer = new THREE.AnimationMixer(donuts);
        const clips = gltf.animations;
        clips.forEach(clip => {
            const action = mixer.clipAction(clip);
            action.loop = THREE.LoopOnce;
            action.clampWhenFinished = true
            action.play()
        })
    });
}

function loadBackground() {
    const rgbeLoader = new RGBELoader()
    rgbeLoader.load('../../resources/hdr/sky.hdr', function (texture) {
        scene.background = texture;
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
        renderer.outputEncoding = THREE.sRGBEncoding;
    });
}

function initControls() {
    controls = new OrbitControls(camera, renderer.domElement);
}

function animate() {
    renderer.render(scene, camera)

    if (donuts){
        donuts.rotation.y += 0.01;
    }

    if (mixer) {
        mixer.update(0.02);
    }

    requestAnimationFrame(animate)
}



init()

loadModel()

loadBackground()

initControls()

animate()