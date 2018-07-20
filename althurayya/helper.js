
function createMatrix(postdata) {
    edgeMap = {};
    nodeHash = {};
	// Section to find longest single edge, for percentage transforms
	longedge = 0;
    for (x in postdata) {
	if(postdata[x].properties.Meter > longedge){
	longedge = postdata[x].properties.Meter;
	}
	}
	// Section to calculate the edge weights
    for (x in postdata) {
        var sName = postdata[x].properties.sToponym;
        var eName = postdata[x].properties.eToponym;
		if (use_multifactor == 0){
        var weightsystem = postdata[x].weights;
		var arrayweights = [];
		monoweigh = 1
		for(var i in weightsystem){
    	arrayweights.push([i, weightsystem [i]]);
		}
		
		for(var j in arrayweights){
		if (weweights[j][2] == 1){
		//console.log(weweights[j][0])
		if (weweights[j][1] == "Num"){
		monoweigh = monoweigh * arrayweights[j][1];
		}
		else if (weweights[j][1] == "Typ"){
		type_tr = typetranslator[weweights[j][3]]
		for (thing in type_tr){
		if (type_tr[thing][0] == arrayweights[j][1]){
		monoweigh = monoweigh * type_tr[thing][1];
		}
		}
		}
		}
		}
		
		cost = monoweigh;
		
		}
		// Alternative system
		else if (use_multifactor == 1) {
		postdata[x].properties.Values[0] = postdata[x].properties.Meter/longedge;
		if (postdata[x].properties.Values[1] > 0){
		postdata[x].properties.Values[1] = 1/postdata[x].properties.Values[1];
		}
		else{
		postdata[x].properties.Values[1] = 1
		}
        var line = postdata[x].geometry.coordinates;
        var metdist = postdata[x].properties.Meter;
        console.log(postdata[x].properties.Values[0]);
        var lS = line[0];
        var lE = line[line.length - 1];
        var nA = [lS, lE];
		
		//Cost calculation section
		var numFactors = 0;
        var cost = 0;
        var costings = [];
        var modifs = [];
		
		for (item in postdata[x].properties.Values) {
		value = postdata[x].properties.Values[item];
		//console.log(value)
		// Factor (with no state variable involved)
		if (weight_types[item][1] == 1){
		costadd = (value*weight_types[item][3]);
		costings.push([item,costadd]);
		//console.log(weight_types[item][0] + ', ' + value + ', ' + costadd);
		}
		// Multiplier (still unsure how to implement correctly)
		else if (weight_types[item][1] == 2){
		num_arb = 1;
		}
		// Switch based on global variable
		else if (weight_types[item][1] == 3){
		//If value is 1 (true) and global switch is 0, we switch off
		if (value == 1 && state_types[weight_types[item][2]] == 0){
		costings.push([item,1000000000000000000000000000000000000000000000000]);
		}
		}
		// Factor with accompanying state variable
		else if (weight_types[item][1] == 4){
		costadd = (value*weight_types[item][3]*state_types[weight_types[item][2]]);
		costings.push([item,costadd]);
		console.log(weight_types[item][0] + ', ' + value + ', ' + costadd);
		}
		// Choke: replaces a state variable with a fixed value
		else if (weight_types[item][1] == 5){
		if (value == 1){
		modifs.push([weight_types[item][2],weight_types[item][4]]);
		console.log('Water route activated');
		}
		}
		
		}
		
		//Apply chokes etc
		for (unit in costings){
		for (modif in modifs){
		if (weight_types[costings[unit][0]][2] == modifs[modif][0]){
		costings[unit][1] = costings[unit][1]/state_types[modifs[modif][0]]
		costings[unit][1] = costings[unit][1]*modifs[modif][1]
		console.log('Water route applied');
		}
		}
		}
		
		for (costpiece in costings){
		cost += costings[costpiece][1]
		}
		console.log(postdata[x].properties.id + ', ' + cost)
		}
		
		// Apply costs to edges
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

function displayPath(pathData) {

    //if (prevPath != undefined) {
    //    prevPath.forEach(function(path) {
    //       customLineStyle(path, path.options.default_color);
    //    });
    //}
    //prevPath = [];
    all_route_layers.forEach(function(lay) {
        if (pathData.indexOf(lay.feature.properties.sToponym) !== -1
                && pathData.indexOf(lay.feature.properties.eToponym) !== -1) {
            customLineStyle(lay, "red", 3, 1);
            //prevPath.push(lay);
            //console.log("lay "+lay)
        }
        else {
            customLineStyle(lay, lay.options.default_color, 1, 0.2);
        }
    });
    Object.keys(markers).forEach(function(keys) {
        if (pathData.indexOf(marker_properties[keys].cornu_URI) !== -1)
            customMarkerStyle(markers[keys], "red", 0.8);
        else
        // new structure of places.geojson file
        //    customMarkerStyle(markers[keys], colorLookup[marker_properties[keys].region], 0.2);
            customMarkerStyle(markers[keys], regions[marker_properties[keys].region]['color'], 0.2);
    });

    //if (pathData) {
    //    // Set the style for route sections of the path
    //    d3.selectAll("path").filter(function (d) {
    //        console.log("path: " + d);
    //        return pathData.indexOf(d.properties.sToponym) > -1
    //            && pathData.indexOf(d.properties.eToponym) > -1;
    //    }).transition().duration(2000).style("stroke", "red")
    //        .style("stroke-width", 1);
    //
    //    d3.selectAll("circle").filter(function (d) {
    //        return pathData.indexOf(d.topURI) > -1
    //    }).transition().duration(2000)
    //        .style("fill", "orange")
    //        .style("stroke", "orange")
    //        .attr("r", function (d) {
    //            var size = (parseInt(countries[d['topURI']]));
    //            if (isNaN(size)) return 5;
    //            return rscale(size);
    //        });
    //
    //    d3.selectAll("circle").filter(function (d) {
    //        return (pathData.indexOf(d.topURI) <= -1 // is this line needed to be checked? for 949 to 1300 it seems it's needed!
    //        || Object.keys(countries).indexOf(d.topURI) <= -1 )
    //    }).transition().duration(2000)
    //        .attr("r", "0");
    //
    //    var pDataArray = d3.selectAll("path").filter(function (d) {
    //        return pathData.indexOf(d.properties.sToponym) > -1
    //            && pathData.indexOf(d.properties.eToponym) > -1
    //    }).data();
        // var totalLength = d3.sum(pDataArray, function(d) {return d.properties.cost});
        // d3.select("#pathdata").html("<span style='font-weight: 900'>Total Distance:</span> " + formatter(totalLength) + "km");
    //}
    //else {
    //    d3.select("#personSlider").html("NO ROUTE");
    //}
}

function updateRoutes(id) {
    var trav = 0;
    d3.selectAll("path").transition().duration(1000).style("stroke", function (d, i) {
        return "black"
    }).style("stroke-width", "2px");

    var country = peopleMap[id]['city'].split(',');
    for (var x = 0; x < country.length; x++) {
        for (var y = x + 1; y < country.length; y++) {
            var pData = dijks_graph.findShortestPath(country[x], country[y]);
            trav++;
            if (pData) {
                //console.log("pathdata: ", JSON.stringify(pData));
                displayPath(pData);
            }
        }
    }
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