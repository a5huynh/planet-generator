document.gl = {
	mvMatrixStack:  [ ],
	mvMatrix:       [ ],
	pMatrix:        [ ] 
};

function mvPushMatrix(m) {
	if(m) {
		document.gl.mvMatrixStack.push(m.dup());
		document.gl.mvMatrix = m.dup();
	} else {
		document.gl.mvMatrixStack.push( document.gl.mvMatrix.dup() );
	}
}

function mvPopMatrix() {
	if( document.gl.mvMatrixStack.length == 0 )
		throw "Invalid popMatrix!";
	document.gl.mvMatrix = document.gl.mvMatrixStack.pop();
}

function loadIdentity() { document.gl.mvMatrix = Matrix.I(4); }
function multMatrix(m) { document.gl.mvMatrix = document.gl.mvMatrix.x(m); }

function mvTranslate(v) {
	var m = Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4();
	multMatrix(m);
}

function mvRotate(ang, v) {
	var arad = ang * Math.PI / 180.0;
	var m = Matrix.Rotation(arad, $V([v[0], v[1], v[2]])).ensure4x4();
	multMatrix(m);
}

function perspective(fovy, aspect, znear, zfar) {
	document.gl.pMatrix = makePerspective(fovy, aspect, znear, zfar)
}

function lookAt( ex, ey, ez, cx, cy, cz, ux, uy, uz ) {
	document.gl.mvMatrix = document.gl.mvMatrix.x( makeLookAt( ex, ey, ez, cx, cy, cz, ux, uy, uz ) );
}

function setMatrixUniforms() {
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	gl.uniformMatrix4fv( pUniform, false, new Float32Array( document.gl.pMatrix.flatten() ) );
	
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	gl.uniformMatrix4fv( mvUniform, false, new Float32Array( document.gl.mvMatrix.flatten() ) );
	
	var normalMatrix = document.gl.mvMatrix.inverse();
	normalMatrix = normalMatrix.transpose();
	var nUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
	gl.uniformMatrix4fv(nUniform, false, new Float32Array(normalMatrix.flatten()));	
}