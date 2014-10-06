/*
 *  BasicMath.h
 *  Lab 2
 *
 *  Created by Andrew Huynh on 10/15/09.
 */
 
#pragma once
#include "Vector3.h"

#define PI 3.14159265

float deg2rad( float );

float rad2deg( float );

void spherePoint( Vector3&, float, float, float );

bool intersects( Vector3&, Vector3&, Vector3&, Vector3& );