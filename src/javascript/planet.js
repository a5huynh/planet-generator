function Planet( radius ) {
    this.terrainWidth = 129;
    this.hMap = [];
    this.planetRadius = radius;
}

Planet.prototype = {

    addVertex: function( verts, v ) {
        verts.push( v.e( 1 ) );
        verts.push( v.e( 2 ) );
        verts.push( v.e( 3 ) );
    },

    assignColor: function( h ) {
        if( h <= 1 ) {
            return $V( [ 0, 0, 1, 1] ); // Ocean
        } else if( h <= 4 ) {
            return $V( [ 0.83, 0.72, 0.34, 1 ] ); // Sand
        } else if( h <= 10 ) {
            return $V( [ 0, .6, 0, 1 ] ); // Grass
        } else {
            return $V( [ 0.5, 0.5, 0.5, 1 ] ); // Mountains
        }
    },

    generate: function() {

        var planetVertices  = [];
        var planetIndices   = [];
        var planetTriangles = [];
        var planetNormals   = [];
        var planetColors	= [];

        var twidth = ( this.terrainWidth - 1 ) * 2.0;

        // Horizontal points
        var gammaStep = 2 * Math.PI / twidth;

        // Vertical points
        var thetaStep = Math.PI / ( this.terrainWidth - 1 );

        var gamma = 0.0, theta = 0.0;

        var i, j;

        var terrain = new ParticleTerrain( this.terrainWidth );
        this.hMap = terrain.generate( 20, 30, 400, .6 );

        // Generate vertices
        for( i = 0; i < twidth; i++ ) {

            gamma = i * gammaStep;

            for( j = 0; j < this.terrainWidth; j++ ) {

                theta = j * thetaStep;

                var pt = this.planetPoint( theta, gamma, i, j );
                planetVertices.push( pt );
                this.addVertex( planetTriangles, pt );

                var c = this.assignColor( this.getHeight( i, j ) );

                planetColors.push( c.e( 1 ) );
                planetColors.push( c.e( 2 ) );
                planetColors.push( c.e( 3 ) );
                planetColors.push( c.e( 4 ) );
            }
        }

        // Generate normal
        for( i = 0; i < twidth; i++ ) {

            for( j = 0; j < this.terrainWidth; j++ ) {

                var i1 = i * this.terrainWidth + j;
                var i2 = ( ( i + 1 ) % twidth ) * this.terrainWidth + j;
                var i3 = ( ( i + 1 ) % twidth ) * this.terrainWidth + j + 1;
                var i4 = i * this.terrainWidth + j + 1;

                if( j >= this.terrainWidth-1 ) {
                    i3 = this.terrainWidth + j + 1;
                    i4 = j + 1;
                }

                var v1 = planetVertices[ i1 ];
                var v2 = planetVertices[ i2 ];
                var v3 = planetVertices[ i3 ];
                var v4 = planetVertices[ i4 ];

                var normal;
                var t1, t2, t3, t4;
                var n1, n2, n3, n4;

                t1 = v1.subtract( v1 );
                t2 = v2.subtract( v3 );
                t3 = v3.subtract( v4 );
                t4 = v4.subtract( v1 );

                n1 = t1.cross( t2 ).toUnitVector();
                n2 = t2.cross( t3 ).toUnitVector();
                n3 = t3.cross( t4 ).toUnitVector();
                n4 = t4.cross( t1 ).toUnitVector();

                normal = n1.add( n2 ).add( n3 ).add( n4 ).toUnitVector();
                this.addVertex( planetNormals, normal );
            }
        }

        // Generate indices for triangles
        for( i = 0; i < twidth; i++ ) {
            for( j = 0; j < this.terrainWidth-1; j++ ) {

                var i1 = i * this.terrainWidth + j;
                var i2 = ( ( i + 1 ) % twidth ) * this.terrainWidth + j;
                var i3 = ( ( i + 1 ) % twidth ) * this.terrainWidth + j + 1;
                var i4 = i * this.terrainWidth + j + 1;

                planetIndices.push( i1 );
                planetIndices.push( i2 );
                planetIndices.push( i3 );

                planetIndices.push( i1 );
                planetIndices.push( i3 );
                planetIndices.push( i4 );

            }
        }

        // Free up some memory
        planetVertices = [];

        return {colors: planetColors, vertices: planetTriangles,
                    indices: planetIndices, normals: planetNormals };
    },

    getHeight: function( i, j ) {
        var offset;
        if( i >= this.terrainWidth ) {
            offset = this.hMap[ ( ( 2 * this.terrainWidth - 1 ) - i ) * this.terrainWidth + j ];
        } else {
            offset = this.hMap[ i * this.terrainWidth + j ];
        }

        return offset;
    },

    planetPoint: function( theta, gamma, i, j ) {
        var offset = this.getHeight( i, j );
        var pt = this.spherePoint( this.planetRadius, theta, gamma ).toUnitVector();
        return pt.multiply( this.planetRadius + offset );
    },

    spherePoint: function( radius,  theta, gamma ) {
        var x = radius * Math.sin( theta ) * Math.cos( gamma );
        var y = radius * Math.cos( theta );
        var z = radius * Math.sin( theta ) * Math.sin( gamma );
        return $V([ x, y, z ]);
    }
};