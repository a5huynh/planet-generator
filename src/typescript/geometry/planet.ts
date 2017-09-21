import * as THREE from 'three';
import { TerrainGenerator } from '../terrain/base';

interface PlanetConfig {
    radius: number;
    detail: number;
}


class Planet {

    public geometry: THREE.Geometry;

    faces: Array<THREE.Face3>;
    terrain: TerrainGenerator;

    constructor( public config: PlanetConfig ) {
        this.faces = new Array();
        this.geometry = new THREE.Geometry();
    }
    /**
     * Calculates the color for a particular vertice based on the height.
     *
     * @param {number} height
     * @returns {THREE.Color}
     * @memberof Planet
     */
    _color( height: number ): THREE.Color {
        // Ocean
        if( height <= 1.01 ) {
            return new THREE.Color(0x55bbff);
        // Sand
        } else if( height <= 1.05 ) {
            return new THREE.Color(0xffff00);
        // Grassland
        } else if( height <= 1.10 ) {
            return new THREE.Color(0x00ff00);
        // Mountains
        } else {
            return new THREE.Color(0xfffffff);
        }

    }

    /**
     * Returns a Face3 with colorized vertices based on the vertex lenght.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {THREE.Face3}
     * @memberof Planet
     */
    _face( x: number, y: number, z: number ): THREE.Face3 {
        let face = new THREE.Face3( x, y, z );
        face.vertexColors[0] = this._color(this.geometry.vertices[face.a].length());
        face.vertexColors[1] = this._color(this.geometry.vertices[face.a].length());
        face.vertexColors[2] = this._color(this.geometry.vertices[face.a].length());
        return face;
    }

    generate( generator: TerrainGenerator ): void {}
}

/**
 * IsoPlanet generator class.
 *
 * This object encapsulates everything that is needed to generate a random planet
 * using particle deposition and an icosahedron geometry.
 */
class IsoPlanet extends Planet {

    private terrain_size: number;

    constructor( public config: PlanetConfig ) {
        super(config);
        // Since `iso` generation is a bit exponential, scale down
        // the detail factor by a factor of 4 before we begin.
        this.config.detail = Math.floor( this.config.detail / 4 );
    }

    generate( terrain: TerrainGenerator ) {
        this.terrain = terrain;

        this.terrain_size = 12 * this.config.detail;
        console.log(this.terrain_size);
        this.terrain.initialize( this.terrain_size, this.terrain_size );

        this._setupInitialVertices();
        this._setupInitialFaces();
        this._refineGeometry();

        for( let face of this.faces ) {
            this.geometry.faces.push( face );
        }

        this.geometry.computeFaceNormals();
        this.geometry.computeVertexNormals();
    }

    _refineGeometry() {

        for( var i = 0; i < this.config.detail; i++ ) {

            let refinedFaces = new Array<THREE.Face3>();

            for( let triangle of this.faces ) {
                // Replace the triangle with 4 new triangles.
                let a = this._getMidPoint( triangle.a, triangle.b );
                let b = this._getMidPoint( triangle.b, triangle.c );
                let c = this._getMidPoint( triangle.c, triangle.a );

                refinedFaces.push(
                    this._face( triangle.a, a, c ),
                    this._face( triangle.b, b, a ),
                    this._face( triangle.c, c, b ),
                    this._face( a, b, c ),
                )
            }

            this.faces = refinedFaces;
        }
    }

    /**
     * Create the initial 20 triangles of the icosahedron j
     */
    _setupInitialFaces( ) {

        // 5 faces around point 0
        this.faces.push( this._face(  0, 11,  5 ) );
        this.faces.push( this._face(  0,  5,  1 ) );
        this.faces.push( this._face(  0,  1,  7 ) );
        this.faces.push( this._face(  0,  7, 10 ) );
        this.faces.push( this._face(  0, 10, 11 ) );

        // 5 adjacent faces
        this.faces.push( this._face(  1,  5,  9 ) );
        this.faces.push( this._face(  5, 11,  4 ) );
        this.faces.push( this._face( 11, 10,  2 ) );
        this.faces.push( this._face( 10,  7,  6 ) );
        this.faces.push( this._face(  7,  1,  8 ) );

        // 5 faces around point 3
        this.faces.push( this._face(  3,  9,  4 ) );
        this.faces.push( this._face(  3,  4,  2 ) );
        this.faces.push( this._face(  3,  2,  6 ) );
        this.faces.push( this._face(  3,  6,  8 ) );
        this.faces.push( this._face(  3,  8,  9 ) );

        // 5 adjacent faces
        this.faces.push( this._face(  4,  9,  5 ) );
        this.faces.push( this._face(  2,  4, 11 ) );
        this.faces.push( this._face(  6,  2, 10 ) );
        this.faces.push( this._face(  8,  6,  7 ) );
        this.faces.push( this._face(  9,  8,  1 ) );
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

    /**
     * Converts a vertice to an x,y coordinate in our height map and
     * returns the height at that location.
     *
     * Understanding the math: This is based on a polar projection onto 2D
     * space. Normal vertices (x, y, z) gives u
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @memberof IsoPlanet
     */
    _getHeight( x: number, y: number, z:number ): number {
        var hx = Math.atan2( x, z ) / ( -2.0 * Math.PI );
        var hy = Math.asin( y ) / Math.PI + 0.5;

        if ( hx < 0 ) {
            hx += 1;
        }

        hx = Math.floor( hx * (this.terrain_size - 1) );
        if( isNaN( hx ) ) {
            hx = 0;
        }

        hy = Math.floor( hy * (this.terrain_size - 1) );
        if( isNaN( hy ) ) {
            hy = 0;
        }

        return this.terrain.getHeight( hx, hy );
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

    _normalizedVector( x: number, y: number, z:number ): THREE.Vector3 {
        var height = this.config.radius + this._getHeight( x, y, z );
        return new THREE.Vector3( x, y, z )
                        .normalize()
                        .multiplyScalar( height );
    }
}


/**
 * UVPlanet generator class.
 * This object encapsulates everything that is needed to generate a random planet
 * using particle deposition and an uv-sphere geometry.
 */
class UVPlanet extends Planet {

    generate( terrain: TerrainGenerator ) {
        this.terrain = terrain;
        this.terrain.initialize( this.config.detail + 1, this.config.detail + 1);

        this._setupVertices( this.config.detail );
        this.geometry.computeFaceNormals();
        this.geometry.computeVertexNormals();
    }

    /**
     * Converts a spherical coordinate <theta, gamma) into carteisian
     * coordinates. See: http://mathworld.wolfram.com/SphericalCoordinates.html
     *
     * @param theta Azimuthal angle in the x-y plane.
     * @param gamma Polar angel in the z-y plane.
     * @param height Height of this vertice.
     */
    _vertex( theta: number, gamma: number, height: number ): THREE.Vector3 {

        var x = Math.sin( theta ) * Math.cos( gamma );
        var y = Math.cos( theta );
        var z = Math.sin( theta ) * Math.sin( gamma );

        return new THREE.Vector3( x, y, z ).normalize()
                        .multiplyScalar( height );
    }

    _setupVertices( detail: number ) {

        // Horizontal steps
        var gamma = 0.0;
        var gammaStep = 2 * Math.PI / detail;

        // Vertical steps
        var theta = 0.0;
        var thetaStep = Math.PI / detail;

        // Number of points is the number of sides + 1
        var numPoints = detail + 1;

        for( var row = 0; row < numPoints; row++ ) {
            // Vertical points
            gamma = row * gammaStep;
            for( var col = 0; col < numPoints; col++ ) {
                // Horizontal
                theta = col * thetaStep;
                // Add vertice
                let height = this.config.radius + this.terrain.getHeight( row, col );
                this.geometry.vertices.push( this._vertex( theta, gamma, height ));
            }
        }

        // Generate faces
        for( var row = 0; row < numPoints; row++ ) {
            for( var col = 0; col < numPoints; col++ ) {

                // Top right
                var i0 = row * numPoints + col;
                // Bottom right
                var i1 = ( i0 + 1 ) % ( numPoints * numPoints );
                // Top left
                var i2 = ( (row + 1) % numPoints ) * numPoints + col;
                // Bottom left
                var i3 = ( i2 + 1 ) % ( numPoints * numPoints );

                this.geometry.faces.push( this._face( i0, i3, i1 ) );
                this.geometry.faces.push( this._face( i0, i2, i3 ) );
            }
        }
    }
}

export { Planet, IsoPlanet, UVPlanet };
