/*
 *  Vector4.cpp
 *  Lab 1
 *
 *  Created by Andrew Huynh on 10/2/09.
 */

#include "Vector4.h"
#include <stdio.h>
Vector4::Vector4() {
	x1 = x2 = x3 = x4 = 0.0f;
}

Vector4::Vector4( const Vector4 &v ) {
	x1 = v.getX1();
	x2 = v.getX2();
	x3 = v.getX3();
	x4 = v.getX4();
}

Vector4::Vector4( float f1, float f2, float f3, float f4 ) {
	x1 = f1;
	x2 = f2;
	x3 = f3;
	x4 = f4;
}

Vector4 Vector4::operator+ ( Vector4 &v1 ) {
	Vector4 temp = *this;
	temp.add( temp, v1 );
	return temp;
}

void Vector4::add( Vector4& v1, Vector4& v2 ) {
	this->setX1( v1.getX1() + v2.getX1() );
	this->setX2( v1.getX2() + v2.getX2() );
	this->setX3( v1.getX2() + v2.getX3() );
	this->setX4( v1.getX3() + v2.getX4() );
}

Vector4 Vector4::add( Vector4 &v ) {
	Vector4 temp = *this;
	
	temp.setX1( temp.getX1() + v.getX1() );
	temp.setX2( temp.getX2() + v.getX2() );
	temp.setX3( temp.getX3() + v.getX3() );
	temp.setX4( temp.getX4() + v.getX4() );
	
	return temp;	
}

Vector4 Vector4::operator- ( Vector4 &v1 ) {
	Vector4 temp = *this;
	return temp.sub( v1 );
}

Vector4 Vector4::sub( const Vector4 &v ) {
	Vector4 temp = *this;
	
	temp.setX1( temp.getX1() - v.getX1() );
	temp.setX2( temp.getX2() - v.getX2() );
	temp.setX3( temp.getX3() - v.getX3() );
	temp.setX4( temp.getX4() - v.getX4() );
	
	return temp;
}

Vector4 Vector4::operator= ( const Vector4 &v ) {
	this->setX1( v.getX1() );
	this->setX2( v.getX2() );
	this->setX3( v.getX3() );
	this->setX4( v.getX4() );	

	return *this;
}

void Vector4::dehomogenize() {
	this->setX1( this->getX1() / this->getX4() );
	this->setX2( this->getX2() / this->getX4() );
	this->setX3( this->getX3() / this->getX4() );
	this->setX4( 1.0f );
	
}

float Vector4::get( int i ) const {
	switch (i) {
		case 0:
			return x1;
		case 1:
			return x2;
		case 2:
			return x3;
		case 3:
			return x4;
	}
	return -1;
}

void Vector4::set( int index, float value ) {
	switch (index) {
		case 0:
			x1 = value;
			break;
		case 1:
			x2 = value;
			break;
		case 2:
			x3 = value;
			break;
		case 3:
			x4 = value;
			break;
	}
}

float Vector4::getX() const { return x1; }
float Vector4::getY() const { return x2; }
float Vector4::getZ() const { return x3; }
float Vector4::getW() const { return x4; }

float Vector4::getX1() const {
	return x1;
}

void Vector4::setX1( float f ) {
	x1 = f;
}

float Vector4::getX2() const {
	return x2;
}

void Vector4::setX2( float f ) {
	x2 = f;
}

float Vector4::getX3() const {
	return x3;
}

void Vector4::setX3( float f ) {
	x3 = f;
}

float Vector4::getX4() const {
	return x4;
}

void Vector4::setX4( float f ) {
	x4 = f;
}