var w = 960;
var h = 620;
var mouseDownMap = false;
var mouseDownCellMap = new Array();

var canvas = d3.select("#vis-svg").append("svg")
    .attr("width", w)
    .attr("height", h)

d3.csv("data/AggregatedZipData.csv", function(data){

    color.domain([d3.min(data, function(d){ return d.value; }),
      d3.max(data, function(d){ return d.value; })
      ]);

    var onlineCompanies = 0

    d3.json("data/zip-codes.json", function(json) {
        console.log(data);

    //Merge the agriculture and GeoJSON data
    //Loop through once for each agriculture data value
    
    

    //find the corresponding zip inside the GeoJSON
        for(var n = 0; n < json.features.length; n++){
            json.features[n].properties.value = 0;
                    
            // properties name gets the zip code
             var jsonZip = json.features[n].properties.ZCTA5CE10;

             for(var i = 0; i < data.length; i++){
                 // grab zip code
                var dataZip = data[i].ZipCode;
                if (dataZip == 0) {
                    onlineCompanies = parseInt(data[i].Value);
                    break;
                    }
                else {
                    var dataValue = parseInt(data[i].Value);

                    // if statment to merge by name of state
                    if(dataZip == jsonZip){
                        //Copy the data value into the JSON
                        // basically creating a new value column in JSON data
                        json.features[n].properties.value = dataValue;
                
                        //stop looking through the JSON
                        break;
                    }
                }
            } 
        }


  var center = [d3.geoCentroid(json)[0]-.25,d3.geoCentroid(json)[1]]
     
     var group = canvas.selectAll('g')
      	.data(json.features)
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
        .attr("fill", "black")
        .on('mousedown', select);

    function select() {

        selectedZip = d3.select(this).attr("class", "mouseover selected")._groups[0][0].__data__.properties.ZCTA5CE10.toString();
        console.log(selectedZip.toString());
        console.log(mouseDownMap);
        console.log(mouseDownCellMap);

        treemapFilters = getTreemapFilters();
        console.log(treemapFilters);

        if (!mouseDownMap && mouseDownCellMap.length == 0) {
          areas.selectAll(".selected").attr("class", "")
          d3.select(this).attr("class", "mouseover selected");
          d3.select(this).attr("fill", "yellow");
          mouseDownMap = true;
          mouseDownCellMap.push(selectedZip);
          tableD = updateTableV2(treemapFilters, mouseDownCellMap);
          console.log(1);
        }
        else if (mouseDownMap && mouseDownCellMap.indexOf(selectedZip) > -1) {
          console.log(2);
          index = mouseDownCellMap.indexOf(selectedZip);
          if (index > -1) {
            mouseDownCellMap.splice(index, 1);
          }
          if (mouseDownCellMap.length == 0) {
            mouseDownMap = false;
            mouseDownCellMap = new Array();
            tableD = updateTableV2(treemapFilters, mouseDownCellMap);
            d3.select(this).attr("fill", "black");
          }
          else {
          d3.select(this).attr("fill", "black");
          tableD = updateTableV2(treemapFilters, mouseDownCellMap);
          }
        }
        else if (mouseDownMap && !(mouseDownCellMap.indexOf(selectedZip) > -1)) {
          console.log(3);
          d3.select(this).attr("fill", "yellow");
          mouseDownCellMap.push(selectedZip);
          tableD = updateTableV2(treemapFilters, mouseDownCellMap);
        }
        else {
          console.log(4);
          areas.selectAll(".selected").attr("class", "");
          d3.select(this).attr("class", "mouseover selected");
          d3.select(this).attr("fill", "yellow");
          mouseDownMap = true;
          mouseDownCellMap = new Array().push(selectedZip);
          tableD = updateTableV2(treemapFilters, mouseDownCellMap);
        }

        if (mouseDownMap && mouseDownCellMap.length == 0) {
            mouseDownMap = false;
            mouseDownCellMap = new Array();
        }
      }
    
})});

function getMapFilters() {
    return mouseDownCellMap;
}