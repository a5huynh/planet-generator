#include <iostream>
#include <GLUT/glut.h>

#include "Planet.h"

float WIN_WIDTH  = 512.0;
float WIN_HEIGHT = 512.0;

Planet *planet;
float angle = 0.0;

float ambient[4]  = { 0.1, 0.1, 0.1, 1.0 };
float diffuse[4]  = { 1, 1, 1, 1.0 };
float specular[4] = { 1, 1, 1, 1.0 };
float shininess[1] = { 30.0 };
float position[4] = {0.0, 200.0, 200.0, 1.0 };

void reshape(int width, int height ) {
	glViewport( 0, 0, width, height );
	
	glMatrixMode( GL_PROJECTION );
	
	glLoadIdentity();
		
	// set perspective projection viewing frustum
	gluPerspective( 60, WIN_HEIGHT/WIN_WIDTH, 1.0, 1000 ); 
}

void display() {
	
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);  // clear color and depth buffers
	glMatrixMode(GL_MODELVIEW);

	glLoadIdentity();

	// Set up camera
	gluLookAt( 0, 0, 300, 0, 0, 0, 0, 1, 0 );
	
	// Set up light
	glLightfv( GL_LIGHT0, GL_POSITION,		position );

	glRotatef( angle, 0, 1, 0 );
	planet->draw();
	
	glFlush();	
	glutSwapBuffers();
} 

void idle() {

	angle += 0.1;
	if( angle > 360 ) {
		angle = 0.0;
	}

	display();
}


int main (int argc, char * argv[]) {

	// initialize GLUT
	glutInit(&argc, argv);
	
	// open an OpenGL context with double buffering, RGB colors, and depth buffering
	glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGBA | GLUT_DEPTH);   	

	// set initial window size
	glutInitWindowSize( WIN_WIDTH, WIN_HEIGHT );

	// open window and set window title
	glutCreateWindow("Planet Generator");
	
	// enable depth buffering
	glEnable( GL_COLOR_MATERIAL );
	glEnable( GL_DEPTH_TEST );	
	glEnable( GL_BLEND );
	glEnable( GL_POLYGON_SMOOTH );
	glEnable( GL_CULL_FACE );
	glCullFace( GL_BACK );
	glPolygonMode( GL_FRONT, GL_FILL );
	glShadeModel(GL_SMOOTH);						// set shading to smooth		
		
	glClear(GL_DEPTH_BUFFER_BIT);					// clear depth buffer
	
	// Setup lighting
	glLightfv( GL_LIGHT0, GL_POSITION,		position );
	glLightfv( GL_LIGHT0, GL_AMBIENT,		ambient );
	glLightfv( GL_LIGHT0, GL_SPECULAR,		specular );
	glLightfv( GL_LIGHT0, GL_DIFFUSE,		diffuse );

	glEnable( GL_LIGHTING );
	glEnable( GL_LIGHT0 );

	// set clear color to black
	glClearColor( 0, 0, 0, 1 );

	planet = new Planet();
	
	// Install callback functions:
	glutDisplayFunc( display );
	glutReshapeFunc( reshape );
	glutIdleFunc( idle );
	
	glutMainLoop();
		 
	return 0;	
}

