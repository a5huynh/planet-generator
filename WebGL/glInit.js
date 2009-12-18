var gl;
function initGL(canvas) {
	try {
		gl = canvas.getContext("experimental-webgl");
	} catch(e) { }

	if (!gl) {
		try {
			gl = canvas.getContext("webkit-3d");
		} catch(e) { }
	
	}

	if (!gl) {
		try {
			gl = canvas.getContext("moz-webgl");
		} catch(e) { }
	}

	if (!gl) {
		alert("Could not initialise WebGL, sorry :-(");
	}

	// This temporary code provides support for Google Chrome, which
	// as of 30 Nov 2009 does not support the new names for the
	// functions to get shader/program parameters (among other things).
	// It should be unnecessary soon, and is only a partial fix
	// in the meantime (as, for example, there's no way to get shader
	// or program parameters that are vectors of integers).
	// See http://learningwebgl.com/blog/?p=1082 for details.
	if (!gl.getProgramParameter) {
		gl.getProgramParameter = gl.getProgrami
	}

	if (!gl.getShaderParameter) {
		gl.getShaderParameter = gl.getShaderi
	}
	// End of Chrome compatibility code
}