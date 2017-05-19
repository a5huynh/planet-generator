
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

export { getParameterByName };
