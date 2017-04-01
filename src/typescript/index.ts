import * as THREE from 'three';
import { Planet } from './geometry/planet';

class TheScene {

    private camera: THREE.PerspectiveCamera;
    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;
    private planet: Planet;
    private mesh: THREE.Mesh;

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.renderer = new THREE.WebGLRenderer();

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
        let light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
        light.position.set( 100, 100, 100 );
        this.scene.add( light );

        let material = new THREE.MeshPhongMaterial({
            color: 0x0000ff
        });

        this.planet = new Planet();

        // create a box and add it to the scene
        this.mesh = new THREE.Mesh( this.planet.geometry, material );
        this.scene.add( this.mesh );

        this.mesh.position.x = 0.5;
        this.mesh.rotation.y = 0.5;

        this.camera.position.x = 5;
        this.camera.position.y = 5;
        this.camera.position.z = 5;

        this.camera.lookAt( this.scene.position )
    }

    animate = () => {
        requestAnimationFrame( this.animate );
        this.render();
    }

    render = () => {
        this.mesh.rotation.x += 0.01;
        this.renderer.render( this.scene, this.camera );
    }
}

let app = new TheScene();
