/*
 *  ParticleTerrain.cpp
 *  FinalProject
 *
 *  Created by Andrew Huynh on 12/6/09.
 *  Copyright 2009 ATHLabs. All rights reserved.
 *
 */

#include "ParticleTerrain.h"
#include <stdlib.h>
#include <math.h>
#include <stdio.h>

ParticleTerrain::ParticleTerrain( int w ) {
	width = w;

	data = (float*)malloc( width * width * sizeof(float) );
	
	// It's all water for now.
	for( int i = 0; i < width * width; i++ ) {
		data[i] = -7.0f;
	}
}

float ParticleTerrain::getData( int x, int y ) {
	return data[x * width + y];
}

void ParticleTerrain::setData( int x, int y, float val ) {
	data[ x * width + y ] = val;
}

int ParticleTerrain::getWidth() {
	return width;
}

bool ParticleTerrain::inCircle( int sx, int sy, int x, int y, int r ) {
	return ( pow( x-sx, 2 ) + pow( y-sy, 2 ) ) < pow( r, 2 );
}

void ParticleTerrain::generate( int seed, int land_radius, int num_islands, int iterations, float sm ) {
	k = sm;
	srand( seed );
	
	for( int j = 0; j < num_islands; j++ ) {
		int sx = rand() % (width-1) + 1;
		int sy = rand() % (width-1) + 1;
	
		int x = sx;
		int y = sy;
		
		for( int i = 0; i < iterations; i++ ) {
		
			int d = getData( x, y );
			int disp = 3;//genDisp( 10 );

			// Check neighbors
			if( getData( x-1, y ) < d ) {
				setData( x-1, y, getData( x-1, y ) + disp );
			} else if( getData( x+1, y ) < d ) {
				setData( x+1, y, getData( x+1, y ) + disp );
			} else if( getData( x, y-1 ) < d ) {
				setData( x, y-1, getData( x, y-1 ) + disp );
			} else if( getData( x, y+1 ) < d ) {
				setData( x, y+1, getData( x, y+1 ) + disp );
			} else {
				setData( x, y, d + disp );
			}
			
			int step = dir();
			switch( step ) {
				case 0:
					y++;
					if( inCircle( sx, sy, x, y, land_radius ) && 
							y > 0 && y < width ) {
						break;
					} else {
						y--;
					}
				case 1:
					y--;
					if( inCircle( sx, sy, x, y, land_radius ) && 
							y > 0 && y < width ) {
						break;
					} else {
						y++;
					}
				case 2:
					x++;
					if( inCircle( sx, sy, x, y, land_radius ) && 
							x > 0 && x < width ) {
						break;
					} else {
						x--;
					}
				case 3:
					x--;
					if( inCircle( sx, sy, x, y, land_radius ) &&
							x > 0 && x < width ) {
						break;
					} else {
						x++;
					}					
			}
		}
	}
	
	smooth();
}

int ParticleTerrain::dir() {
	return rand() % 4;
}

float ParticleTerrain::genDisp( float maxDisp ) {
	return (2*maxDisp) * ((float)rand()/RAND_MAX) - maxDisp;
}

void ParticleTerrain::smooth() {
	for( int x = 1; x < width; x++ ) {
		for( int z = 0; z < width; z++ ) {
			data[ x * width + z ] = 
				data[ (x-1) * width + z ] * ( 1 - k ) + 
				data[ x * width + z ] * k;
		}
	}

	for( int x = width-2; x >= 0; x-- ) {
		for( int z = 0; z < width; z++ ) {
			data[ x * width + z ] = 
				data[ (x+1) * width + z ] * ( 1 - k ) + 
				data[ x * width + z ] * k;
		}
	}
	
	for( int x = 0; x < width; x++ ) {
		for( int z = width-2; z >= 0; z-- ) {
			data[ x * width + z ] = 
				data[ x * width + (z+1) ] * ( 1 - k ) + 
				data[ x * width + z ] * k;
		}
	}

	for( int x = 0; x < width; x++ ) {
		for( int z = 1; z < width; z++ ) {
			data[ x * width + z ] = 
				data[ x * width + (z-1) ] * ( 1 - k ) + 
				data[ x * width + z ] * k;
		}
	}
}