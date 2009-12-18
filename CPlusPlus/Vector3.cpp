/*
 *  Vector3.cpp
 *  Lab 1
 *
 *  Created by Andrew Huynh on 10/2/09.
 */

#include <math.h>
#include "Vector3.h"

Vector3::Vector3() {
	x = 0;
	y = 0;
	z = 0;
}

Vector3::Vector3( const Vector3 &v ) {
	x = v.getX();
	y = v.getY();
	z = v.getZ();
}

Vector3::Vector3( float f1, float f2, float f3 ) {
	x = f1;
	y = f2;
	z = f3;
}

//Vector3& Vector3::operator+ ( const Vector3 &v1 ) {
//	return this->add( v1 );
//}

Vector3& Vector3::add( const Vector3 &v ) const {
	Vector3 *temp = new Vector3();
	
	temp->setX( this->getX() + v.getX() );
	temp->setY( this->getY() + v.getY() );
	temp->setZ( this->getZ() + v.getZ() );
	
	return *temp;	
}

void Vector3::add( const Vector3 &v1, const Vector3 &v2 ) {
	this->setX( v1.getX() + v2.getX() );
	this->setY( v1.getY() + v2.getY() );
	this->setZ( v1.getZ() + v2.getZ() );
}

Vector3& Vector3::operator- ( const Vector3 &v1 ) const {
	return this->sub( v1 );
}

Vector3& Vector3::sub( const Vector3 &v ) const {
	Vector3 *temp = new Vector3();
	
	temp->setX( this->getX() - v.getX() );
	temp->setY( this->getY() - v.getY() );
	temp->setZ( this->getZ() - v.getZ() );
	
	return *temp;
}

void Vector3::sub( const Vector3 &v1, const Vector3 &v2 ) {
	this->setX( v1.getX() - v2.getX() );
	this->setY( v1.getY() - v2.getY() );
	this->setZ( v1.getZ() - v2.getZ() );
}

Vector3& Vector3::operator= ( const Vector3 &v ) {
	
	x = v.getX();
	y = v.getY();
	z = v.getZ();
	
	return (*this);
}

void Vector3::scale ( float f ) {
	this->setX( this->getX() * f );
	this->setY( this->getY() * f );
	this->setZ( this->getZ() * f );
}

void Vector3::scale ( float f, Vector3 &v ) {
	this->setX( v.getX() * f );
	this->setY( v.getY() * f );
	this->setZ( v.getZ() * f );	
}

float Vector3::dot( const Vector3 &v ) {
	return this->getX()*v.getX() + this->getY()*v.getY() + this->getZ()*v.getZ();
}

Vector3& Vector3::cross( const Vector3 &v ) {
	
	Vector3 *res = new Vector3();
	
	res->setX( this->getY() * v.getZ() - this->getZ() * v.getY() );
	res->setY( this->getZ() * v.getX() - this->getX() * v.getZ() );
	res->setZ( this->getX() * v.getY() - this->getY() * v.getX() );
	
	return *res;
	
}

void Vector3::cross( const Vector3 &v1, const Vector3 &v2 ) {
	this->setX( v1.getY() * v2.getZ() - v1.getZ() * v2.getY() );
	this->setY( v1.getZ() * v2.getX() - v1.getX() * v2.getZ() );
	this->setZ( v1.getX() * v2.getY() - v1.getY() * v2.getX() );
}

float Vector3::operator[] ( const int &i ) const {
	switch (i) {
		case 0:
			return x;
		case 1:
			return y;
		case 2:
			return z;
		default:
			return 0;
	}
}

float Vector3::magnitude() {
	Vector3 v = *this;
	return sqrtf( v.getX() * v.getX() + v.getY() * v.getY() + v.getZ() * v.getZ() );
}

void Vector3::normalize() {
	scale( 1.0f/ magnitude() );
}

float Vector3::getX() const {
	return x;
}

void Vector3::setX( float f ) {
	x = f;
}

float Vector3::getY() const {
	return y;
}

void Vector3::setY( float f ) {
	y = f;
}

float Vector3::getZ() const {
	return z;
}

void Vector3::setZ( float f ) {
	z = f;
}

void Vector3::print() const {
	printf( "%f %f %f\n", x, y, z );
}
