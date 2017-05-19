import * as THREE from 'three';
import { Planet, IsoPlanet, UVPlanet } from './geometry/planet';
// Terrain generation
import { TerrainGenerator, EmptyGenerator } from './terrain/base';
import { ParticleTerrain } from './terrain/particle';
import { RandomTerrain } from './terrain/random';
// Helpful utils
import { getParameterByName } from './utils';


interface SceneConfig {
    // Either `iso` or `uv`
    sphereType: string;
    // Either `particle`, `random`, or `null` for no terrain.
    terrainType: string;
    // The base height the planet.
    planetRadius: number;
    // The resolution of the generated planet.
    planetDetail: number;
    // Zoom level of the camera.
    zoom: number;

    // Used in the particle generator to indicate the number of islands
    // to generate.
    particleNumIslands: number;
}

class TheScene {

    private sceneConfig : SceneConfig;

    private camera: THREE.PerspectiveCamera;
    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;


    private planet: Planet;
    private mesh: THREE.Object3D;

    constructor( config: SceneConfig ) {

        this.sceneConfig = config;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.renderer = new THREE.WebGLRenderer({ antialias: true });

        // When the window is resized, resize the renderer and camera.
        window.addEventListener( "resize", ( event ) => {
            this.renderer.setSize( window.innerWidth, window.innerHeight );
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        });

        // Set up the terrain generator used.
        var terrain = new EmptyGenerator();
        if( this.sceneConfig.terrainType == 'particle' ) {
            terrain = new ParticleTerrain(
                this.sceneConfig.particleNumIslands ? this.sceneConfig.particleNumIslands : 1
            );
        } else if( this.sceneConfig.terrainType == 'random' ) {
            terrain = new RandomTerrain();
        }

        // Set up planet configuration
        let planetConfig = {
            radius: this.sceneConfig.planetRadius ? this.sceneConfig.planetRadius : 1.0,
            detail: this.sceneConfig.planetDetail ? this.sceneConfig.planetDetail : 10
        }

        // Set up the planet being used.
        if( this.sceneConfig.sphereType == 'iso' ) {
            this.planet = new IsoPlanet( planetConfig );
        } else {
            this.planet = new UVPlanet( planetConfig );
        }

        // Generate planet and setup scene
        this.planet.generate( terrain );
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

        // create a box and add it to the scene
        this.mesh = THREE.SceneUtils.createMultiMaterialObject( this.planet.geometry, materials );
        this.scene.add( this.mesh );

        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = this.sceneConfig.zoom ? this.sceneConfig.zoom : 3;
        this.camera.lookAt( this.scene.position )
    }

    animate = () => {
        requestAnimationFrame( this.animate );
        this.render();
    }

    render = () => {
        this.mesh.rotation.z += 0.01;
        this.mesh.rotation.y += 0.01;
        this.renderer.render( this.scene, this.camera );
    }
}

let app = new TheScene({
    sphereType: getParameterByName( 'sphereType' ),
    terrainType: getParameterByName( 'terrainType' ),
    planetRadius: Number.parseInt( getParameterByName( 'planetRadius' ) ),
    planetDetail: Number.parseInt( getParameterByName( 'planetDetail' ) ),
    particleNumIslands: Number.parseInt( getParameterByName( 'particleNumIslands' ) ),
    zoom: Number.parseInt( getParameterByName( 'zoom' ) )
});
