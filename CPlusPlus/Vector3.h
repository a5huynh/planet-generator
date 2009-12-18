/*
 *  Vector3.h
 *  Lab 1
 *
 *  Created by Andrew Huynh on 10/2/09.
 */
#pragma once
#include <stdio.h>

class Vector3 {
	public:
		Vector3();
		Vector3( const Vector3 & );
		Vector3( float, float, float );
		
		// Operator overloading functions
//		Vector3& operator+ ( const Vector3 & );		
		Vector3& operator- ( const Vector3 & ) const;
		
		Vector3& operator= ( const Vector3 & );
		float operator[] ( const int & ) const;
		
		// Scale
		void scale( float );
		void scale( float, Vector3 & );
		
		// Subtraction and Addition
		Vector3& add( const Vector3 & ) const;
		Vector3& sub( const Vector3 & ) const;

		void add( const Vector3 &, const Vector3 & );
		void sub( const Vector3 &, const Vector3 & );
		
		// Dot & Cross product
		float	dot( const Vector3 & );
		Vector3& cross( const Vector3 & );
		void cross( const Vector3 &, const Vector3 & );
		
		// Length
		float	magnitude();
		void normalize();
		
		void setX( float );
		float getX() const;
		
		void setY( float );
		float getY() const;
		
		void setZ( float );
		float getZ() const;
		
		void print() const;
		
	private:
		float x, y, z;
		
};
