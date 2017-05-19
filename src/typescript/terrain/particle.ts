import { TerrainGenerator } from './base';

const NORTH = 0;
const EAST  = 1;
const SOUTH = 2;
const WEST  = 3;

class ParticleTerrain implements TerrainGenerator {

    private displacement: number;
    private heightMap: Array<number>;

    private numX: number;
    private numY: number;

    constructor( private numIslands: number ) {
        this.displacement = 0.1;
    }

    initialize( numX: number, numY: number  ) {
        this.numX = numX;
        this.numY = numY;

        this.heightMap = new Array( numX * numY );
        for( var i = 0; i < numX * numY; i++ ) {
            this.heightMap[i] = 0.0;
        }

        this._generate( 100 );
    }

    /**
     * Generate a height map using particle deposition.
     *
     * @param numIslands Number of separate land masses to create
     * @param iterations Number of displacements that will happen at each island
     */
    _generate( iterations: number ) {

        for( var i = 0; i < this.numIslands; i++ ) {
            // Find a random spot to grow an island
            var sx = this._randomInt( 0, this.numX - 1 );
            var sy = this._randomInt( 0, this.numY - 1 );

            for( var itNum = 0; itNum < iterations; itNum++ ) {
                // Add the displacement to the current height
                this.setHeight( sx, sy, this.getHeight( sx, sy ) + this.displacement );

                // Pick a direction to go
                switch( this._randomInt( 0, 3 ) ) {
                    case NORTH: sx = sx + 1; break;
                    case EAST:  sy = sy + 1; break;
                    case SOUTH: sx = sx - 1; break;
                    case WEST:  sy = sy - 1; break;
                }

                // If we're going out of bounds, simply loop around to
                // the opposite side.
                // NOTE: This is actually problematic in UV spheres, since the rows
                // will loop around to the bottom of the sphere.
                if( sx > this.numX - 1 ) {
                    sx = 0;
                } else if( sx < 0 ) {
                    sx = this.numX - 1;
                }

                if( sy > this.numY - 1 ) {
                    sy = 0;
                } else if( sy < 0 ) {
                    sy = this.numY - 1;
                }
            }
        }

        this._smooth();
    }

    /**
     * Returns a number between `min` and `max`, inclusively.
     *
     * @param min
     * @param max
     */
    _randomInt( min: number, max: number ) {
        return Math.floor( Math.random() * (max - min + 1) + min );
    }

    /**
     * Run a simple band smoothing filter across the height map.
     *
     * @param k Smoothing factor
     */
    _smooth( k: number = 0.6 ) {

        for( var x = 1; x < this.numX; x++ ) {
            for( var y = 0; y < this.numY; y++ ) {
                this.setHeight(
                    x, y,
                    this.getHeight( x - 1, y ) * (1 - k) + this.getHeight( x, y ) * k
                )
            }
        }

        for( var x = this.numX - 2; x > 0; x-- ) {
            for( var y = 0; y < this.numY; y++ ) {
                this.setHeight(
                    x, y,
                    this.getHeight( x + 1, y ) * (1 - k) + this.getHeight( x, y ) * k
                )
            }
        }

        for( var x = 0; x < this.numX; x++ ) {
            for( var y = 1; y < this.numY; y++ ) {
                this.setHeight(
                    x, y,
                    this.getHeight( x, y - 1 ) * (1 - k) + this.getHeight( x, y ) * k
                )
            }
        }

        for( var x = 0; x < this.numX; x++ ) {
            for( var y = this.numY - 2; y > 0; y-- ) {
                this.setHeight(
                    x, y,
                    this.getHeight( x, y + 1 ) * (1 - k) + this.getHeight( x, y ) * k
                )
            }
        }

    }

    /**
     * Get the height for the point <x, y>. Since we're
     * using a 1D array to represent a 2D matrix, we
     * need to convert (x, y) coordinates into an
     * index.
     *
     * @param x X coordinate
     * @param y Y coordinate
     */
    getHeight( x: number, y: number ): number {
        return this.heightMap[ ( this.numX * y ) + x ];
    }

    setHeight( x: number, y: number, value: number ): number {
        let prev = this.heightMap[ ( this.numX * y ) + x ];
        this.heightMap[ ( this.numX * y ) + x ] = value
        return prev
    }
}

export { ParticleTerrain };
