/*
 *  Planet.cpp
 *  FinalProject
 *
 *  Created by Andrew Huynh on 12/4/09.
 *  Copyright 2009 ATHLabs. All rights reserved.
 *
 */

#define PLANET_RADIUS 100

#include "Planet.h"
#include "BasicMath.h"

#include <stdio.h>
#include <math.h>
#include <time.h>

Planet::Planet() {
	seed = 20;
	// Benchmark creation process
	int bm = clock();
	terrain = new ParticleTerrain( 129 );
	terrain->generate( seed, 20, 30, 400, .6 );
	printf("Terrain Generation: %fs\n", ( (float)clock() - bm ) / CLOCKS_PER_SEC );
	
	// Use generated height map to generate planet points and normals
	int bm2 = clock();
	generate();
	genNormals();
	printf("Planet & Normal Generation: %fs\n", ( (float)clock() - bm2 ) / CLOCKS_PER_SEC );
	printf("Total Generation Time: %fs\n", ( (float)clock() - bm ) / CLOCKS_PER_SEC );
	printf("Polygon Count: %d\n", land.size() / 2 );
			
	// Cleanup
	for( int i = 0; i < normals.size(); i++ )
		delete normals[i];	
	normals.clear();
	displayNormals = false;
	displayVertices = true;

	dl = glGenLists(1);
	generateDisplayList();
}

Planet::Planet( int s ) {
	// Benchmark creation process
	int bm = clock();
	terrain = new ParticleTerrain( 129 );
	terrain->generate( seed, 20, 30, 400, .6 );
	printf("Terrain Generation: %fs\n", ( (float)clock() - bm ) / CLOCKS_PER_SEC );
	
	// Use generated height map to generate planet points and normals
	int bm2 = clock();
	generate();
	genNormals();
	printf("Planet & Normal Generation: %fs\n", ( (float)clock() - bm2 ) / CLOCKS_PER_SEC );
	printf("Total Generation Time: %fs\n", ( (float)clock() - bm ) / CLOCKS_PER_SEC );
	printf("Polygon Count: %d\n", land.size() / 2 );
		
	// Cleanup
	for( int i = 0; i < normals.size(); i++ )
		delete normals[i];	
	normals.clear();
	displayNormals = false;
	displayVertices = true;

	dl = glGenLists(1);
	generateDisplayList();
}

Planet::~Planet() {
	for( int i = 0; i < land.size(); i++ )
		delete land[i];
		
	for( int i = 0; i < vNormals.size(); i++ )
		delete vNormals[i];
		
	land.clear();
	vNormals.clear();
	heightValues.clear();
	glDeleteLists( dl, 1 );
	glDeleteLists( dlNormals, 1 );
	delete terrain;
}

void Planet::draw() {
	if( displayVertices )
		glCallList( dl );
		
	if( displayNormals ) {
		//NORMALS
		glLineWidth( 1 );
		glColor3f(1, 0, 0);
		glBegin(GL_LINES);
		for (unsigned int i = 0; i < land.size(); ++i) {
			Vector3 n;
			Vector3 *v = land[i];
			n.add( *v, *vNormals[i] );
			glVertex3f(v->getX(), v->getY(), v->getZ());
			glVertex3f(n.getX(), n.getY(), n.getZ());
		}
		glEnd();
	}
}

void Planet::print() {
	printf("Planet\n");
}

void Planet::toggleNormals() {
	displayNormals = !displayNormals;
}

void Planet::toggleVertices() {
	displayVertices = !displayVertices;
}

vector<Vector3*>* Planet::getVertices() {
	return &land;
}

vector<Vector3*>* Planet::getNormals() {
	return &vNormals;
}

void Planet::generateDisplayList() {
	int twidth = (terrain->getWidth() - 1) * 2;

	glNewList( dl, GL_COMPILE );
		glBegin( GL_TRIANGLES );
		// Loop over each face
		for( int i = 0; i < twidth; i++ ) {
		
			for( int j = 0; j < terrain->getWidth()-1; j++ ) {

				int i1 = i * terrain->getWidth() + j;
				int i2 = ((i+1)%twidth) * terrain->getWidth() + j;
				int i3 = ((i+1)%twidth) * terrain->getWidth() + j+1;
				int i4 = i * terrain->getWidth() + j+1;
			
				Vector3 *v1 = land[ i1 ];
				Vector3 *v2 = land[ i2 ];
				Vector3 *v3 = land[ i3 ];
				Vector3 *v4 = land[ i4 ];
				
				Vector3	*n1  = vNormals[ i1 ];
				Vector3	*n2  = vNormals[ i2 ];
				Vector3	*n3  = vNormals[ i3 ];
				Vector3	*n4  = vNormals[ i4 ];
				
				glNormal3f( n1->getX(), n1->getY(), n1->getZ() );
				setColor( heightValues[ i1 ] );
				glVertex3f( v1->getX(), v1->getY(), v1->getZ() );
				
				glNormal3f( n2->getX(), n2->getY(), n2->getZ() );
				setColor( heightValues[ i2 ] );
				glVertex3f( v2->getX(), v2->getY(), v2->getZ() );
				
				glNormal3f( n3->getX(), n3->getY(), n3->getZ() );
				setColor( heightValues[ i3 ] );
				glVertex3f( v3->getX(), v3->getY(), v3->getZ() );
				
				glNormal3f( n1->getX(), n1->getY(), n1->getZ() );
				setColor( heightValues[ i1 ] );
				glVertex3f( v1->getX(), v1->getY(), v1->getZ() );
				
				glNormal3f( n3->getX(), n3->getY(), n3->getZ() );
				setColor( heightValues[ i3 ] );
				glVertex3f( v3->getX(), v3->getY(), v3->getZ() );			
				
				glNormal3f( n4->getX(), n4->getY(), n4->getZ() );
				setColor( heightValues[ i4 ] );
				glVertex3f( v4->getX(), v4->getY(), v4->getZ() );
			
			}
		}
		glEnd();
	glEndList();
}

void Planet::nextPoint( int& index, int dir, Vector3& p, Vector3& n ) {
	int i = index / terrain->getWidth();
	int j = index - ( i * terrain->getWidth() );

	// Find the index for the next vertice
	switch( dir ) {
		case 0:
			i++; j--; break;
		case 1:
			j--; break;
		case 2:
			i--; j--; break;
		case 3:
			i++; break;
		case 4:
			i--; break;
		case 5:
			i++; j++; break;
		case 6:
			j++; break;
		case 7:
			i--; j++; break;
	}
	
	if( i >= (terrain->getWidth()-1)*2 ) {
		i = 0;
	}
	
	if( i < 0 ) {
		i = (terrain->getWidth()-1)*2 - 1;
	}
	
	if( j < 0 ) {
		j = terrain->getWidth()-1;
	}
	
	if( j >= terrain->getWidth() ) {
		j = 0;
	}
	
	index =  i * terrain->getWidth() + j;
	p.setX( land[ index ]->getX() );
	p.setY( land[ index ]->getY() );
	p.setZ( land[ index ]->getZ() );
	
	n.setX( vNormals[ index ]->getX() );
	n.setY( vNormals[ index ]->getY() );
	n.setZ( vNormals[ index ]->getZ() );
}

void Planet::setColor( float h ) {	
	float color[4];
	color[3] = 1;
	
	if( h <= -6.0 ) {
		color[0] = 0; 
		color[1] = 0; 
		color[2] = 1;
	} else if ( h <= -2.0 ) {
		color[0] = .83; 
		color[1] = .72; 
		color[2] = .34;
	} else if ( h <= 4.0 ) {
		color[0] = 0; 
		color[1] = .6; 
		color[2] = 0;
	} else {
		color[0] = .5;
		color[1] = .5;
		color[2] = .5;
	}
	
	glColor3f( color[0], color[1], color[2] );
}
void Planet::spherePoint( Vector3& v, float theta, float gamma ) {
	float x = PLANET_RADIUS * sin( theta ) * cos( gamma );
	float y = PLANET_RADIUS * cos( theta );
	float z = PLANET_RADIUS * sin( theta) * sin( gamma );
	
	v.setX( x );
	v.setY( y );
	v.setZ( z );
}

void Planet::genPlanetPoint( Vector3& v, float theta, float gamma, int i, int j ) {
	float offset;
	
	if( i >= terrain->getWidth() ) {
		offset = terrain->getData( (2*terrain->getWidth()-1)-i, j );
	} else {
		offset = terrain->getData( i, j );
	}
	
	spherePoint( v, theta, gamma );
	
	v.normalize();
	v.scale( PLANET_RADIUS + offset );
}

void Planet::generate() {
	int twidth = (terrain->getWidth() - 1) * 2;

	float gammaStep = 2*PI / twidth;
	float thetaStep = PI / (terrain->getWidth() - 1);
	
	float gamma = 0, theta = 0;

	int i, j;
	
	// Generate planet vertices
	for( i = 0; i < twidth; i++ ) {

		gamma = i * gammaStep;
	
		for( j = 0; j < terrain->getWidth(); j++ ) {

			theta = j * thetaStep;
		
			Vector3 *v1 = new Vector3();
			
			genPlanetPoint( *v1, theta, gamma, i, j );

			land.push_back( v1 );

			heightValues.push_back( v1->magnitude() - PLANET_RADIUS );
		
		}
	}
	
	// Calculate face normals
	for( i = 0; i < twidth; i++ ) {
	
		for( j = 0; j < terrain->getWidth()-1; j++ ) {
		
			Vector3 *v1 = land[   i            * terrain->getWidth() + j ];
			Vector3 *v2 = land[ ((i+1)%twidth) * terrain->getWidth() + j ];
			Vector3 *v3 = land[ ((i+1)%twidth) * terrain->getWidth() + j+1 ];
			Vector3 *v4 = land[   i            * terrain->getWidth() + j+1 ];
			
			Vector3 *normal;
			Vector3 t1, t2, t3, t4;
			Vector3 n1, n2, n3, n4;
			
			t1.sub( *v1, *v2 );
			t2.sub( *v2, *v3 );
			t3.sub( *v3, *v4 );
			t4.sub( *v4, *v1 );
			
			n1.cross( t1, t2 ); n1.normalize();
			n2.cross( t2, t3 ); n2.normalize();
			n3.cross( t3, t4 ); n3.normalize();
			n4.cross( t4, t1 ); n4.normalize();
			
			normal = new Vector3( n1 );
			normal->add( *normal, n2 );
			normal->add( *normal, n3 );
			normal->add( *normal, n4 );
			normal->normalize();
			
			normals.push_back( normal );			
		}
	}	
}

void Planet::genNormals() {

	int twidth = (terrain->getWidth() - 1) * 2;
	
	// Loop over all vertices
	for( int i = 0; i < twidth; i++ ) {

		for( int j = 0; j < terrain->getWidth(); j++ ) {

			Vector3 *n = new Vector3( 0, 0, 0 );

			// top right face
			n->add( *n, *normals[ max(i-1, 0) * (terrain->getWidth()-1) + max(j-1, 0) ] );

			// bottom right face
			n->add( *n, *normals[ max(i-1, 0) * (terrain->getWidth()-1) + min(j, terrain->getWidth()-2) ] );

			// top left face
			n->add( *n, *normals[ i * (terrain->getWidth()-1) + max(j-1, 0) ] );

			// bottom left face
			n->add( *n, *normals[ i * (terrain->getWidth()-1) + min(j, terrain->getWidth()-2) ] );

			n->normalize();

			vNormals.push_back( n );
		}
	}
}