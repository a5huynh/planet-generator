/*
 *  ParticleTerrain.h
 *  FinalProject
 *
 *  Created by Andrew Huynh on 12/6/09.
 *  Copyright 2009 ATHLabs. All rights reserved.
 *
 */
 
#pragma once

class ParticleTerrain {
	public:
		// Initialize terrain generator
		ParticleTerrain( int );
		
		// Generate particle terrain based on a set of values
		void generate( int seed, int land_radius, int num_islands, 
							int iterations, float sm );
		
		// Grab data from height map
		float getData( int, int );
		
		// Get width of height map
		int getWidth();
		
	private:
		// Random direction generator
		int dir();
		
		// random displacement generator
		float genDisp( float );
		
		// helper method is set height map data
		void setData( int, int, float );
		
		// Check if random movement is within island radius
		bool inCircle( int, int, int, int, int );
		
		// Smooth out terrain
		void smooth();
	
		int width;
		float *data;
		
		float k;		// smoothness constant
};
