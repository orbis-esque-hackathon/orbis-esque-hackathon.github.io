
function createMatrix(postdata) {
    edgeMap = {};
    nodeHash = {};
    for (x in postdata) {
        var line = postdata[x].geometry.coordinates;
        var sName = postdata[x].properties.sToponym;
        var eName = postdata[x].properties.eToponym;
        var lS = line[0];
        var lE = line[line.length - 1];
        var nA = [lS, lE];
        var cost = d3.geo.length(postdata[x]) * 6371;
        if (edgeMap[sName]) {
            edgeMap[sName][eName] = cost;
        }
        else {
            edgeMap[sName] = {};
            edgeMap[sName][eName] = cost;
        }
        if (edgeMap[eName]) {
            edgeMap[eName][sName] = cost;
        }
        else {
            edgeMap[eName] = {};
            edgeMap[eName][sName] = cost;
        }
    }

    return new DijksGraph(edgeMap);
}

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

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function getPosition(str, m, i) {
    return str.split(m, i).join(m).length;
}

function repaintPaths() {
    all_route_layers.forEach(function(lay) {
        customLineStyle(lay, lay.options.default_color, 1, 0.2);
    });
}

function repaintMarkers() {
    Object.keys(markers).forEach(function(keys) {
        // new structure of places.geojson file
        //customMarkerStyle(markers[keys], colorLookup[marker_properties[keys].region], 0.2);
        customMarkerStyle(markers[keys], regions[marker_properties[keys].region]['color'], 0.2);
        markers[keys].bringToFront();
    });
}

function resetPaths() {
    all_route_layers.forEach(function(lay) {
        customLineStyle(lay, lay.options.default_color, 2, 1);
    });
}

function resetMarkers() {
    Object.keys(markers).forEach(function(keys) {
        // new structure of places.geojson file
        //customMarkerStyle(markers[keys], colorLookup[marker_properties[keys].region], 1);
        customMarkerStyle(markers[keys], regions[marker_properties[keys].region]['color'], 1);
        marker = markers[keys];
        if(marker.label._container != undefined)
            if(marker_properties[keys].type == "metropoles")
               customLabelStyle(markers[keys], "black", "20px", true);
            else
                customLabelStyle(markers[keys], "black", "20px", false);
        markers[keys].bringToFront();
    })
}

function displayPathControl(pathData,color) {
    var  path_distances= 0;
    //if (pathData != undefined) { //TODO:
        for (var i = 0; i < pathData.length - 1; i++) {
            var lay = index_routes_layers[pathData[i] + "," + pathData[i + 1]];
            if (lay == undefined) {
                lay = index_routes_layers[pathData[i + 1] + "," + pathData[i]];
            }
            if (lay != undefined) {
                customLineStyle(lay, color, 3, 1);
                path_distances += lay.feature.properties.Meter;
            }
        }
        //all_route_layers.forEach(function (lay) {
        //    if (pathData.indexOf(lay.feature.properties.sToponym) !== -1
        //        && pathData.indexOf(lay.feature.properties.eToponym) !== -1) {
        //        console.log("test " + JSON.stringify(lay.feature.properties.Meter));
        //
        //    }
        //});
        Object.keys(markers).forEach(function (keys) {
            if (pathData.indexOf(marker_properties[keys].cornu_URI) !== -1)
                customMarkerStyle(markers[keys], color, 0.8);
        });
    //}
    return path_distances;

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