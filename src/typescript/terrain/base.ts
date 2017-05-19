interface TerrainGenerator {
    initialize( numX: number, numY: number ): void;
    // Generate a height map for a grid of [x, y].
    getHeight( x: number, y: number ): number;
}

class EmptyGenerator {
    initialize( numX: number, numY: number ) {}
    getHeight( x: number, y: number ) {
        return 0;
    }
}

export { TerrainGenerator, EmptyGenerator };
