var w = 960;
var h = 620;
var mouseDownMap = false;
var mouseDownCellMap = new Array();
var zipFilters = new Array();
var areas;
var group;
var displayedZipCodes = new Array();

var canvas = d3.select("#vis-svg").append("svg")
    .attr("width", w)
    .attr("height", h)

var zipIndex = new Array();

d3.csv("data/AggregatedZipData.csv", function(data){

    btypes = ['Financial Service', 'Consulting', 'Health Service', 'Restaurant/Cafe', 'Caterer', 'Food Delivery Service', 'Energy and Utilities', 'Legal Service', 'Marketing', 'Fresh Food Producer', 'Food Product', 'Food Product - Beverage', 'Hotel/Housing', 'Consumer Service', 'Consumer Product', 'Commercial Service'];
    colors = ['#008000', '#00FF00', '#FF0000', '#FF8C00', '#FF6347', '#8B0000', '#FFFF00', '#000000', '#FF00FF', '#87CEFA', '#00BFFF', '#0000CD', '#8B008B', '#008080', '#FFC0CB', '#D3D3D3'];

    function determineColor(name) {
        for (i = 0; i < btypes.size; i++) {
        if (btypes[i] == name) {
            return colors[i];
        }
      }
    };

    var onlineCompanies = 0

    d3.json("data/zip-codes.json", function(json) {

    //Merge the agriculture and GeoJSON data
    //Loop through once for each agriculture data value
    onlineCompanies = parseInt(data[0].Value);
    
    //find the corresponding zip inside the GeoJSON
        for(n = 0; n < json.features.length; n++){
            json.features[n].properties.value = 0;
                    
            // properties name gets the zip code
             var jsonZip = json.features[n].properties.ZCTA5CE10;
             
             for(i = 1; i < data.length; i++){
                 // grab zip code
                var dataZip = data[i].ZipCode;

                var dataValue = parseInt(data[i].Value);
                // if statment to merge by name of state
                if(dataZip == jsonZip){
                    //Copy the data value into the JSON
                    displayedZipCodes.push(dataZip);
                    // basically creating a new value column in JSON data
                    json.features[n].properties.value = dataValue;
                    zipIndex.push(n);
                    //stop looking through the JSON
                    break;
                }
            } 
        }


  var center = [d3.geoCentroid(json)[0]-.25,d3.geoCentroid(json)[1]]
     
     group = canvas.selectAll('g')
      	.data(json.features)
      	.enter()
      	.append('g');
     

    var projection = d3.geoMercator()
    	.center(center)
    	.scale(12000)
    	.translate([w/2.5,h/3.2]);
    var path = d3.geoPath().projection(projection);
      
    areas = group.append("path")
        .attr("d", path)
        .attr("class", "areas")
        .attr("fill", d => unfilter(d))
        .on('mousedown', select);

    function select() {
        selectedData = d3.select(this).attr("class", "mouseover selected")._groups[0][0].__data__;
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
            d3.select(this).attr("fill", d => unfilter(d));
          }
          else {
          d3.select(this).attr("fill", d => unfilter(d));
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

function unfilter(data) {
    zip = data.properties.ZCTA5CE10
    if (displayedZipCodes.indexOf(zip) > -1) {
        return "green";
    }
    else {
        return "grey";
    }
}

function updateColor(zipList, treemapFilters) {
    d3.selectAll("path")
        .transition()
        .duration(2000)
        .style("fill", function(d) { return determineColors(d, zipList, treemapFilters)});
}

function determineColors(d, zipList, treemapFilters) {
    zip = d.properties.ZCTA5CE10
    if (treemapFilters.length == 1 && zipList.indexOf(zip) > -1) {
        return(determineColor(treemapFilters[0]));
    }
    else if (treemapFilters.length == 0 && zipList.length == 0) {
        return unfilter(d);
    }
    else if (zipList.length == 51) {
        return unfilter(d);
    }
    else if (zipList.indexOf(zip) > -1) {
        return "yellow";
    }
    else {
        return "grey";
    }
}  

function hover(zipList, treemapFilters, zip) {
    d3.selectAll("path")
        .transition()
        .duration(2000)
        .style("fill", function(d) { return determineColorsHover(d, zipList, treemapFilters, zip)});     
}

function determineColorsHover(d, zipList, treemapFilters, zipTable) {
    zip = d.properties.ZCTA5CE10
    if (zip == zipTable) {
        return "black";
    }
    else if (treemapFilters.length == 1 && zipList.indexOf(zip) > -1) {
        return(determineColor(treemapFilters[0]));
    }
    else if (treemapFilters.length == 0 && zipList.length == 0) {
        return unfilter(d);
    }
    else if (zipList.length == 51) {
        return unfilter(d);
    }
    else if (zipList.indexOf(zip) > -1) {
        return "yellow";
    }
    else {
        return "grey";
    }
}  