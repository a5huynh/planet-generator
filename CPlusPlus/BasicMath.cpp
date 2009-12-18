/*
 *  BasicMath.cpp
 *  Lab 2
 *
 *  Created by Andrew Huynh on 10/15/09.
 */

#include "BasicMath.h"
#include <math.h>
#include <algo.h>

float deg2rad( float deg ) {
	return deg * PI / 180;
}

float rad2deg( float rad ) {
	return rad * 180 / PI;
}

void spherePoint( Vector3& v, float radius, float theta, float gamma ) {

	float x = radius * sin( theta ) * cos( gamma );
	float y = radius * cos( theta );
	float z = radius * sin( theta) * sin( gamma );
	v.setX( x );
	v.setY( y );
	v.setZ( z );
	
}

bool intersects( Vector3& seg1_a, Vector3& seg1_b, Vector3& seg2_a, Vector3& seg2_b ) {

	float a1 = ( seg1_b.getY() - seg1_a.getY() );
	float b1 = ( seg1_a.getX() - seg1_b.getX() );
	float c1 = ( seg1_b.getX() * seg1_a.getY() - seg1_a.getX() * seg1_b.getY() );

	float a2 = ( seg2_b.getY() - seg2_a.getY() );
	float b2 = ( seg2_a.getX() - seg2_b.getX() );
	float c2 = ( seg2_b.getX() * seg2_a.getY() - seg2_a.getX() * seg2_b.getY() );	
	
	float denom = a1 * b2 - a2 * b1;
	
	if( denom == 0 )
		return false;
		
	int x = (b1*c2 - b2*c1)/denom;
	int y = (a2*c1 - a1*c2)/denom;
	
	int maxX, minX, maxY, minY;
	// Check to see if point is in bounding box of each line segment
	maxX = max( seg1_a.getX(), seg1_b.getX() );
	minX = min( seg1_a.getX(), seg1_b.getX() );
	maxY = max( seg1_a.getY(), seg1_b.getY() );
	minY = min( seg1_a.getY(), seg1_b.getY() );
	
	if( x < minX || x > maxX || y < minY || y > maxY )
		return false;

	maxX = max( seg2_a.getX(), seg2_b.getX() );
	minX = min( seg2_a.getX(), seg2_b.getX() );
	maxY = max( seg2_a.getY(), seg2_b.getY() );
	minY = min( seg2_a.getY(), seg2_b.getY() );
	
	if( x < minX || x > maxX || y < minY || y > maxY )
		return false;

	return true;
} 