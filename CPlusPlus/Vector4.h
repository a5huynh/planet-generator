/*
 *  Vector4.h
 *  Lab 1
 *
 *  Created by Andrew Huynh on 10/2/09.
 */
#pragma once

class Vector4 {
	public:
		Vector4();
		Vector4( const Vector4& );
		Vector4( float, float, float, float );
		
		// Operator overloading functions
		Vector4 operator+ ( Vector4 & );		
		Vector4 operator- ( Vector4 & );
		
		Vector4 operator= ( const Vector4 & );
		float operator[] ( const int & ) const;
				
		// Subtraction and Addition
		Vector4 add( Vector4 & );
		void add( Vector4&, Vector4& );
		Vector4 sub( const Vector4 & );
		
		void dehomogenize();
		
		float get( int i ) const;
		void set( int, float );
						
		void setX1( float );
		float getX1() const;
		float getX() const;
		
		void setX2( float );
		float getX2() const;
		float getY() const;
		
		void setX3( float );
		float getX3() const;
		float getZ() const;
		
		void setX4( float );
		float getX4() const;
		float getW() const;
		
	private:
		float x1, x2, x3, x4;
		
};

