import * as THREE from 'three';
import { IsoPlanet } from './geometry/planet';

class TheScene {

    private camera: THREE.PerspectiveCamera;
    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;
    private planet: IsoPlanet;
    private mesh: THREE.Object3D;

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.renderer = new THREE.WebGLRenderer({ antialias: true });

        // When the window is resized, resize the renderer and camera.
        window.addEventListener( "resize", ( event ) => {
            this.renderer.setSize( window.innerWidth, window.innerHeight );
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        });

        this.initScene();
        this.animate();
    }

    initScene() {
        // Create canvas and add to page.
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );

        // add lights
        let light = new THREE.AmbientLight( 0x404040 );
        this.scene.add( light );

        light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 5, 5, 0 );
        this.scene.add( light );

        let materials = [
            new THREE.MeshPhongMaterial({ color: 0x0099FF, shading: THREE.FlatShading, shininess: 0 }),
            new THREE.MeshBasicMaterial({ color: 0x55bbff, shading: THREE.FlatShading, wireframe: true })
        ]

        this.planet = new IsoPlanet( 2.0 );

        // create a box and add it to the scene
        this.mesh = THREE.SceneUtils.createMultiMaterialObject( this.planet.geometry, materials );
        this.scene.add( this.mesh );

        this.camera.position.x = 5;
        this.camera.position.y = 0;
        this.camera.position.z = 5;

        this.camera.lookAt( this.scene.position )
    }

    animate = () => {
        requestAnimationFrame( this.animate );
        this.render();
    }

    render = () => {
        this.mesh.rotation.y += 0.01;
        this.renderer.render( this.scene, this.camera );
    }
}

let app = new TheScene();
