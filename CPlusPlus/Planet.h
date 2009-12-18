/*
 *  Planet.h
 *  FinalProject
 *
 *  Created by Andrew Huynh on 12/4/09.
 *  Copyright 2009 ATHLabs. All rights reserved.
 *
 */
#pragma once

#include "ParticleTerrain.h"

#include <GLUT/GLUT.h>
#include <vector>

#include "Vector3.h"

using namespace std;

class Planet {
	public:
		Planet();
		Planet(int);
		~Planet();
		
		virtual void draw();
		virtual void print();
		
		void toggleNormals();
		void toggleVertices();
		
		// In case we want to place stuff on the planet.
		vector<Vector3*>* getVertices();
		vector<Vector3*>* getNormals();
		
		void nextPoint( int& index, int dir, Vector3& point, Vector3& norm );
	
	private:
		void generate();
		void generateDisplayList();
		
		// Set a vertex color based on height
		void setColor( float );
		
		// Generate a point on a sphere
		void spherePoint( Vector3& v, float theta, float gamma );
		
		// Generate a point on the planet
		void genPlanetPoint( Vector3& v, float theta, float gamma, int i, int j );
	
		void genNormals();
		
		GLuint dl, dlNormals;
		bool displayNormals, displayVertices;
		
		ParticleTerrain *terrain;
		
		vector<Vector3*> land, normals, vNormals;
		vector<float> heightValues;
		
		int seed;
};