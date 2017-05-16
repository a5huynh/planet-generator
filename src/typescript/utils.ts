
function getParameterByName( name: string, url: string ) {
    if( !url ) {
        url = window.location.href;
    }

    var key = name.replace( /[\[\]]/g, "\\$&" );
    var regex = new RegExp( `[?&]${name}(=([^&#]*)|&|#|$)` );
    var results = regex.exec( url );

    if ( !results ) {
        return null;
    }

    if ( !results[2] ) {
        return '';
    }

    return decodeURIComponent( results[2].replace( /\+/g, ' ' ) );
}

export { getParameterByName };
