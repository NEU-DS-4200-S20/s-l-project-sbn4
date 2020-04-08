var w = 960;
var h = 620;


var canvas = d3.select("#vis-svg").append("svg")
    .attr("width", w)
    .attr("height", h)

d3.json("data/zip-codes.json", function(error, data) {
  console.log(data)

  var center = [d3.geoCentroid(data)[0]-.25,d3.geoCentroid(data)[1]]
     
     var group = canvas.selectAll('g')
      	.data(data.features)
      	.enter()
      	.append('g')
     
    var projection = d3.geoMercator()
    	.center(center)
    	.scale(12000)
    	.translate([w/2.5,h/3.2]);
    var path = d3.geoPath().projection(projection);
      
    var areas = group.append("path")
        .attr("d", path)
        .attr("class", "areas")
        .attr("fill", "#4A777A");
  
});