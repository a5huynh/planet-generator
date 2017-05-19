import { TerrainGenerator } from './base';

class RandomTerrain implements TerrainGenerator {

    constructor() {}

    initialize( numX: number, numY: number ) {}

    getHeight( x: number, y: number ) {
        return Math.random();
    }
}

export { RandomTerrain };
