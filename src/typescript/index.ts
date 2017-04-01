import * as THREE from 'three';


class TheScene {

    private camera: THREE.PerspectiveCamera;
    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;
    private box: THREE.Mesh;

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

        let light2 = new THREE.DirectionalLight (0xFFFFFF, 1.0 );
        light2.position.set(-100, 100, -100);
        this.scene.add(light2);

        let material = new THREE.MeshBasicMaterial({
            color: 0xaaaaaa,
            wireframe: true
        });

        // create a box and add it to the scene
        this.box = new THREE.Mesh( new THREE.BoxGeometry(1, 1, 1), material );
        this.scene.add( this.box );

        this.box.position.x = 0.5;
        this.box.rotation.y = 0.5;

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
        this.box.rotation.x += 0.1;
        this.renderer.render( this.scene, this.camera );
    }
}

let app = new TheScene();