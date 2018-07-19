
// Claculate distance. For results in meter, 'K' hsould be choosen as the unit
function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
        dist = dist * 1.609344;
    }
    if (unit == "N") {
        dist = dist * 0.8684;
    }
    return dist;
}

//Calculate the direct distance from start to end
function calcDirectDistance (start, end) {
    var startUri = start.substring(start.lastIndexOf(",") + 1).trim();
    var endUri = end.substring(end.lastIndexOf(",") + 1).trim();
    var direct_distance = distance(
        markers[startUri]['_latlng']['lat'], markers[startUri]['_latlng']['lng'],
        markers[endUri]['_latlng']['lat'],
        markers[endUri]['_latlng']['lng'], 'K');
    var int_direct_dist = parseInt(direct_distance * 1000, 10);
    return int_direct_dist;
}
//TODO: zoom and labels should be reset as well
function resetMap(){
    map.setView([init_lat, init_lon], min_zoom);
    resetMarkers();
    resetPaths();
}
//TODO: zoom and labels should be repainted as well???
function repaintMap(){
    repaintMarkers();
    repaintPaths();
}


/*
 Set a color for an object excluded from a list
 */
function setColor (code, toExclude) {
    if (toExclude.indexOf(code) == -1)
    //colorLookup[code];
        return regions[code]['color']
    else return "lightgray";
}

// function lengthInMeters(path) {
//     var m = 0;
//     path.forEach(function(p) {
//         m += p.properties.Meter;
//     })
//     return m;
// }
//
// function getRandomColor() {
//     var letters = '0123456789ABCDEF'.split('');
//     var color = '#';
//     for (var i = 0; i < 6; i++ ) {
//         color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
// }
//
//
// function getPosition(str, m, i) {
//     return str.split(m, i).join(m).length;
// }
