var pfselected = false;
var rfselected = false;

var placesfile;
function handlePlacesFileSelect(evt) {
    placesfile = evt.target.files[0];
    pfselected = true;
    if (rfselected){
        document.getElementById('uploaddata_btn').style.display = 'inline-block';
    }
}

var routesfile;
function handleRoutesFileSelect(evt) {
    routesfile = evt.target.files[0];
    rfselected = true;
    if (pfselected){
        document.getElementById('uploaddata_btn').style.display = 'inline-block';
    }
}

function uploadData() {
    var reader = new FileReader();
    reader.onload = (function(theFile) {
        return function(e) {
            $.getJSON(e.target.result, function (data) {
                var newgeojson = L.geoJson(data, {
                    pointToLayer: function (feature, latlng) {
                        var marker = create_simple_marker(feature, latlng);
                        latlngs.push([latlng['lat'], latlng['lng']])

                        marker.on('click', OnMarkerClick(feature));

                        if (marker != null) {
                            return marker;
                        }
                    }
                });
                // Add the geojson layer of places to map
                newgeojson.addTo(map);

                var newplaces = new L.LayerGroup();
                Object.keys(markers).forEach(function(key) {
                    markers[key].addTo(newplaces);
                });

                layerGroup = L.layerGroup(newplaces).addTo(map);
                layerControl.addOverlay(layerGroup , "New Places");
            });
        }
    })(placesfile);

    reader.readAsDataURL(placesfile);

    var reader2 = new FileReader();
    reader2.onload = (function(theFile) {
        return function(e) {
            index_zoom(markers,type_size);
            $.getJSON(e.target.result, function (data) {
                var routes = L.geoJson(data, {
                    onEachFeature: handle_routes
                });
                //init_graph(route_features);
                //graph_dijks = createMatrix(route_features);
                var rl = routeLayer.addLayer(routes);
                rl.addTo(map);
                rl.bringToBack();
                Object.keys(route_points).forEach(function(rp) {
                    for (var i = 0; i < route_points[rp].length - 1; i++) {
                        for (var j = 1; j < route_points[rp].length; j++) {
                            if (route_points[rp][i]["end"] == route_points[rp][j]["end"]) {
                                customLineStyle(route_points[rp][i]["route"], "#003ef5", 2, 1);
                                customLineStyle(route_points[rp][j]["route"], "#003ef5", 2, 1);
                            }
                        }
                    }
                });
            }).error(function(data) {
                console.log("Error!");
            });
        }
    })(routesfile);

    reader2.readAsDataURL(routesfile);
}

document.getElementById('placesfile').addEventListener('change', handlePlacesFileSelect, false);
document.getElementById('routesfile').addEventListener('change', handleRoutesFileSelect, false);
document.getElementById('uploaddata_btn').style.display = 'none';
