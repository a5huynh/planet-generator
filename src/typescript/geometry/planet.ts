import * as THREE from 'three';


/**
 * IsoPlanet generator class.
 *
 * This object encapsulates everything that is needed to generate a random planet
 * using particle deposition and an icosahedron geometry.
 */
class IsoPlanet {

    /**
     * radius of the planet.
     */
    public radius: number;

    /**
     * planet geometry
     */
    public geometry: THREE.Geometry;

    private faces: Array<THREE.Face3>;

    constructor( radius: number ) {

        this.faces = new Array();
        this.radius = radius;
        this.geometry = new THREE.Geometry();

        this._setupInitialVertices();
        this._setupInitialFaces();
        this._refineGeometry( 2 );

        for( let face of this.faces ) {
            this.geometry.faces.push( face );
        }

        this.geometry.computeFaceNormals();
        this.geometry.computeVertexNormals();
    }

    _refineGeometry( detail: number ) {

        for( var i = 0; i < detail; i++ ) {

            let refinedFaces = new Array<THREE.Face3>();

            for( let triangle of this.faces ) {
                // Replace the triangle with 4 new triangles.
                let a = this._getMidPoint( triangle.a, triangle.b );
                let b = this._getMidPoint( triangle.b, triangle.c );
                let c = this._getMidPoint( triangle.c, triangle.a );

                refinedFaces.push(
                    new THREE.Face3( triangle.a, a, c ),
                    new THREE.Face3( triangle.b, b, a ),
                    new THREE.Face3( triangle.c, c, b ),
                    new THREE.Face3( a, b, c ),
                )
            }

            this.faces = refinedFaces;
        }
    }

    /**
     * Create the initial 20 triangles of the icosahedron
     */
    _setupInitialFaces( ) {

        // 5 faces around point 0
        this.faces.push( new THREE.Face3(  0, 11,  5 ) );
        this.faces.push( new THREE.Face3(  0,  5,  1 ) );
        this.faces.push( new THREE.Face3(  0,  1,  7 ) );
        this.faces.push( new THREE.Face3(  0,  7, 10 ) );
        this.faces.push( new THREE.Face3(  0, 10, 11 ) );

        // 5 adjacent faces
        this.faces.push( new THREE.Face3(  1,  5,  9 ) );
        this.faces.push( new THREE.Face3(  5, 11,  4 ) );
        this.faces.push( new THREE.Face3( 11, 10,  2 ) );
        this.faces.push( new THREE.Face3( 10,  7,  6 ) );
        this.faces.push( new THREE.Face3(  7,  1,  8 ) );

        // 5 faces around point 3
        this.faces.push( new THREE.Face3(  3,  9,  4 ) );
        this.faces.push( new THREE.Face3(  3,  4,  2 ) );
        this.faces.push( new THREE.Face3(  3,  2,  6 ) );
        this.faces.push( new THREE.Face3(  3,  6,  8 ) );
        this.faces.push( new THREE.Face3(  3,  8,  9 ) );

        // 5 adjacent faces
        this.faces.push( new THREE.Face3(  4,  9,  5 ) );
        this.faces.push( new THREE.Face3(  2,  4, 11 ) );
        this.faces.push( new THREE.Face3(  6,  2, 10 ) );
        this.faces.push( new THREE.Face3(  8,  6,  7 ) );
        this.faces.push( new THREE.Face3(  9,  8,  1 ) );
    }

    /**
     * Create 12 vertices of a icosahedron. This will be used to create a sphere
     * in increasing detail.
     */
    _setupInitialVertices() {
        let t = ( 1 + Math.sqrt(5.0)) / 2.0;

        this.geometry.vertices.push(
            this._normalizedVector( -1,  t,  0 ),
            this._normalizedVector(  1,  t,  0 ),
            this._normalizedVector( -1, -t,  0 ),
            this._normalizedVector(  1, -t,  0 ),
        );

        this.geometry.vertices.push(
            this._normalizedVector(  0, -1,  t ),
            this._normalizedVector(  0,  1,  t ),
            this._normalizedVector(  0, -1, -t ),
            this._normalizedVector(  0,  1, -t ),
        );

        this.geometry.vertices.push(
            this._normalizedVector(  t,  0, -1 ),
            this._normalizedVector(  t,  0,  1 ),
            this._normalizedVector( -t,  0, -1 ),
            this._normalizedVector( -t,  0,  1 )
        );

    }

    _getMidPoint( v1_idx: number, v2_idx: number ): number {

        let p1 = this.geometry.vertices[ v1_idx ];
        let p2 = this.geometry.vertices[ v2_idx ];

        let new_vertex = this._normalizedVector(
            ( p1.x + p2.x ) / 2.0,
            ( p1.y + p2.y ) / 2.0,
            ( p1.z + p2.z ) / 2.0
        );

        this.geometry.vertices.push( new_vertex );
        return this.geometry.vertices.length - 1;
    }

    _normalizedVector( x: number, y: number, z:number ) {

        let length = Math.sqrt( x * x + y * y + z * z );

        return new THREE.Vector3(
            x / length * this.radius,
            y / length * this.radius,
            z / length * this.radius
        );
    }
}

export { IsoPlanet };
