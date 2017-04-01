import * as THREE from 'three';


class Planet {

    public geometry: THREE.Geometry;

    constructor() {
        this.geometry = new THREE.Geometry();
        this._generate();
    }

    _generate() {
        // this.geometry.vertices.push(
        //     new THREE.Vector3( -1,  1, 0 ),
        //     new THREE.Vector3( -1, -1, 0 ),
        //     new THREE.Vector3( 1, -1, 0 )
        // );

        // this.geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
        // this.geometry.computeFaceNormals();

        // create 12 vertices of a icosahedron
        let t = (1.0 + Math.sqrt(5.0)) / 2.0;

        this.geometry.vertices.push(
            new THREE.Vector3( -1,  t,  0 ),
            new THREE.Vector3(  1,  t,  0 ),
            new THREE.Vector3( -1, -t,  0 ),
            new THREE.Vector3(  1, -t,  0 ),
        );

        this.geometry.vertices.push(
            new THREE.Vector3(  0, -1,  t ),
            new THREE.Vector3(  0,  1,  t ),
            new THREE.Vector3(  0, -1, -t ),
            new THREE.Vector3(  0,  1, -t ),
        );

        this.geometry.vertices.push(
            new THREE.Vector3(  t,  0, -1 ),
            new THREE.Vector3(  t,  0,  1 ),
            new THREE.Vector3( -t,  0, -1 ),
            new THREE.Vector3( -t,  0,  1 )
        );
        this.geometry.computeFaceNormals();

        // create 20 triangles of the icosahedron

        // 5 faces around point 0
        this.geometry.faces.push( new THREE.Face3(  0, 11,  5 ) );
        this.geometry.faces.push( new THREE.Face3(  0,  5,  1 ) );
        this.geometry.faces.push( new THREE.Face3(  0,  1,  7 ) );
        this.geometry.faces.push( new THREE.Face3(  0,  7, 10 ) );
        this.geometry.faces.push( new THREE.Face3(  0, 10, 11 ) );

        // 5 adjacent faces
        this.geometry.faces.push( new THREE.Face3(  1,  5,  9 ) );
        this.geometry.faces.push( new THREE.Face3(  5, 11,  4 ) );
        this.geometry.faces.push( new THREE.Face3( 11, 10,  2 ) );
        this.geometry.faces.push( new THREE.Face3( 10,  7,  6 ) );
        this.geometry.faces.push( new THREE.Face3(  7,  1,  8 ) );

        // 5 faces around point 3
        this.geometry.faces.push( new THREE.Face3(  3,  9,  4 ) );
        this.geometry.faces.push( new THREE.Face3(  3,  4,  2 ) );
        this.geometry.faces.push( new THREE.Face3(  3,  2,  6 ) );
        this.geometry.faces.push( new THREE.Face3(  3,  6,  8 ) );
        this.geometry.faces.push( new THREE.Face3(  3,  8,  9 ) );

        // 5 adjacent faces
        this.geometry.faces.push( new THREE.Face3(  4,  9,  5 ) );
        this.geometry.faces.push( new THREE.Face3(  2,  4, 11 ) );
        this.geometry.faces.push( new THREE.Face3(  6,  2, 10 ) );
        this.geometry.faces.push( new THREE.Face3(  8,  6,  7 ) );
        this.geometry.faces.push( new THREE.Face3(  9,  8,  1 ) );

        this.geometry.computeFaceNormals();
    }
}

export { Planet };
