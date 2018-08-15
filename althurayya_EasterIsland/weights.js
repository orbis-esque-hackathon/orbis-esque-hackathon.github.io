

function onSubmitChecks() {

    var elements = document.getElementById("weightCheckBoxes").elements;

    for (var weightBoxes = 0, element; element = elements[weightBoxes++];) {
        if (element.type == "checkbox" && element.checked == true) {
            checkTruth = 1
        }
        else if (element.type == "checkbox" && element.checked == false) {
            checkTruth = 0
        }

        for (mop in weWeights) {
            if (weWeights[mop][0] == element.value && checkTruth == 1) {
                weWeights[mop][2] = 1;
            }
            else if (weWeights[mop][0] == element.value && checkTruth == 0) {
                weWeights[mop][2] = 0;
            }
        }
    }
    // console.log(weWeights)
    init_graph(route_features);
    graph_dijks = create_dijk_graph(route_features);
}
// add checkboxes to the tab for each weighting item
var weights_div = d3.select("#weightCheckBoxes").append("div").attr("id", "weights_div");
// weights_div.selectAll("label")
//     .data(Object.keys(typeTranslator))
//     .append("text")
//     .text(function(d) { return d; });
    // weights_div.selectAll("label")
    //     .append("select")
    //     // .attr("name", "terrain")
    //     .selectAll("option")
    //     .data(Object.entries(typeTranslator).map(([key, value]) => ({key,value})))
    //     .enter()
    //     .append("option")
    //     .attr("text", function(d) { return d.value; });
// weights_div.selectAll("input")
//     .data(weWeights)
//     .enter()
//     .append('label')
//     //     .attr('for',function(d){  return d[0]; })
//     //     .text(function(d){ return d[0];})
//     .append("input")
//     .attr("value", function(d){ return d[0];})
//         .attr("checked", function (d) {
//             console.log(d[2])
//             if (d[2] == 1)
//                 return true;
//             else
//                 return false;
//         })
//         .attr("type", "checkbox")
//         .attr("id", function(d) { return 'chBox' + d[0]; });
// weights_div.selectAll("label")
//     .data(weWeights)
//     .append("text")
//     .text(function(d) { return d[0]; })
//     .append("br");
// weights_div.append("br");
    // .attr("onClick", "change(this)");

weights_div.append("input")
    .attr("type", "button")
    .attr("value","Change Graph")
    .on("click", onSubmitChecks);
