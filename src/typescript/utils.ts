import * as THREE from 'three';

function getParameterByName( name: string ) {
    let url = window.location.href;

    var key = name.replace( /[\[\]]/g, "\\$&" );
    var regex = new RegExp( `[?&]${name}(=([^&#]*)|&|#|$)` );
    var results = regex.exec( url );

    if( !results || !results[2] ) {
        return null;
    }

    return decodeURIComponent( results[2].replace( /\+/g, ' ' ) );
}


function createMultiMaterialObject(
    geometry: THREE.BufferGeometry,
    materials: THREE.Material[]
): THREE.Group {
    let group = new THREE.Group();
    for (let i = 0, l = materials.length; i < l; i++) {
        group.add( new THREE.Mesh( geometry, materials[i] ) );
    }

    return group;
}

export {
    createMultiMaterialObject,
    getParameterByName
};
