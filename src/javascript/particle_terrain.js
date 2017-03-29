function ParticleTerrain( w ) {
	this.width = w;
	this.data  = new Array( this.width * this.width );
	
	for( var i = 0; i < this.data.length; i++ ) {
		this.data[i] = 0.0;
	}	
}

ParticleTerrain.prototype = {
	dir: function() {
		return this.randInt( 3 );
	},
	
	generate: function( land_radius, num_islands, iterations, sm ) {
		
		// Displacement. Increase if we want taller land masses
		var disp = 3;
		
		for( var j = 0; j < num_islands; j++ ) {

			// Find a random spot to grow an island
			var sx = this.randInt( this.width - 1 );
			var sy = this.randInt( this.width - 1 );

			var x = sx, y = sy;
			for( var i = 0; i < iterations; i++ ) {
				
				var d = this.getData( x, y );
				// Check neighbors
				if( this.getData( x-1, y ) < d ) {
					this.setData( x-1, y, this.getData( x-1, y ) + disp );
				} else if( this.getData( x+1, y ) < d ) {
					this.setData( x+1, y, this.getData( x+1, y ) + disp );
				} else if( this.getData( x, y-1 ) < d ) {
					this.setData( x, y-1, this.getData( x, y-1 ) + disp );
				} else if( this.getData( x, y+1 ) < d ) {
						this.setData( x, y+1, this.getData( x, y+1 ) + disp );
				} else {
					this.setData( x, y, d + disp );
				}

				switch( this.dir() ) {
					case 0:
						y++;
						if( this.inCircle( sx, sy, x, y, land_radius ) && 
								y > 0 && y < this.width ) {
							break;
						} else {
							y--;
						}
					case 1:
						y--;
						if( this.inCircle( sx, sy, x, y, land_radius ) && 
								y > 0 && y < this.width ) {
							break;
						} else {
							y++;
						}
					case 2:
						x++;
						if( this.inCircle( sx, sy, x, y, land_radius ) && 
								x > 0 && x < this.width ) {
							break;
						} else {
							x--;
						}
					case 3:
						x--;
						if( this.inCircle( sx, sy, x, y, land_radius ) &&
								x > 0 && x < this.width ) {
							break;
						} else {
							x++;
						}
				}
			}
		}

		this.smooth( sm );
		return this.data;
	},
	
	getData: function( x, y ) {
		return this.data[ x * this.width + y ];
	},
	
	inCircle: function( sx, sy, x, y, r ) {
		return ( Math.pow( x-sx, 2) + Math.pow( y-sy, 2 ) ) < Math.pow( r, 2 );	
	},
	
	// Returns a number between 0 and num, inclusive.
	randInt: function( num ) {
		return Math.floor( Math.random()*(num+1) );	
	},
	
	setData: function( x, y, val ) {
		this.data[ x * this.width + y ] = val;
	},

	smooth: function( k ) {
		for( var x = 1; x < this.width; x++ ) {
			for( var z = 0; z < this.width; z++ ) {
				this.data[ x * this.width + z ] = 
				this.data[ (x-1) * this.width + z ] * ( 1 - k ) + 
				this.data[ x * this.width + z ] * k;
			}
		}

		for( var x = this.width-2; x >= 0; x-- ) {
			for( var z = 0; z < this.width; z++ ) {
				this.data[ x * this.width + z ] = 
				this.data[ (x+1) * this.width + z ] * ( 1 - k ) + 
				this.data[ x * this.width + z ] * k;
			}
		}

		for( var x = 0; x < this.width; x++ ) {
			for( var z = this.width-2; z >= 0; z-- ) {
				this.data[ x * this.width + z ] = 
				this.data[ x * this.width + (z+1) ] * ( 1 - k ) + 
				this.data[ x * this.width + z ] * k;
			}
		}

		for( var x = 0; x < this.width; x++ ) {
			for( var z = 1; z < this.width; z++ ) {
				this.data[ x * this.width + z ] = 
				this.data[ x * this.width + (z-1) ] * ( 1 - k ) + 
				this.data[ x * this.width + z ] * k;
			}
		}		
	}
};