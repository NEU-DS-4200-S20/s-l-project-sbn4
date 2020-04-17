// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
width = 400 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

var mouseDown = false;
var mouseDownCell = new Array();

// append the svg object to the body of the page
var svg = d3.select("#vis-svg")
.append("svg")
.attr("width", 3.5 * width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
  "translate(" + 2.4 * width + "," + margin.top + ")");

// Read data
d3.csv('data/NewAggregatedMemberList.csv', function(data) {

// stratify the data: reformatting for d3.js
var root = d3.stratify()
.id(function(d) { return d.name; })   // Name of the entity (column name is name in csv)
.parentId(function(d) { return d.parent; })   // Name of the parent (column name is parent in csv)
(data);
root.sum(function(d) { return +d.value })   // Compute the numeric value for each entity

// Then d3.treemap computes the position of each element of the hierarchy
// The coordinates are added to the root object above
d3.treemap()
.size([width, height])
.padding(4)
(root)


const toolTip = d3
        .select("#treemap-holder")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);



// use this information to add rectangles:
const cell = svg.selectAll('g')
            .data(root.leaves())
            .enter()
            .append('g')
            .attr('transform', d => `translate(${d.x0},${d.y0})`)
            .on('mousedown', select)
            .on('mousemove', d => {
              toolTip.transition()
                      .duration(200)
                      .style('opacity', 0.75);
              toolTip.attr('data-value', d.data.value);
              toolTip.html(
                'Name: ' + d.data.name + '<br>' +
                'Value: ' + d.data.value
              )
                .style('top', `${d3.event.pageY + 10}px`)
                .style('left', `${d3.event.pageX + 8}px`);
            })
            .on('mouseout', d => {
              toolTip.transition()
                      .duration(200)
                      .style('opacity', 0);
            });

      // creates treemap cells
      cell.append('rect')
          .attr('id', d => d.data.id)
          .attr('class', 'tile')
          .attr('data-name', d => d.data.name)
          .attr('data-value', d => d.data.value)
          .attr('data-category', d => d.data.category)
          .attr('width', d => d.x1 - d.x0)
          .attr('height', d => d.y1 - d.y0)
          .attr('fill', d => { return determineColor(d.data.name)})
          .style("stroke", "black")
          .style("stroke-width", 0);
          

      // on mouse event select and filter 
      function select() {
        selectedType = d3.select(this).attr("class", "mouseover selected")._groups[0][0].getElementsByClassName("tile")[0].dataset.name;
        mapFilters = getMapFilters();

        if (!mouseDown && mouseDownCell.length == 0) {
          d3.select(this).select("rect")._groups[0][0].style.stroke = "black";
          
          d3.select(this).select("rect")._groups[0][0].style.strokeWidth = 3;
          mouseDown = true;
          mouseDownCell.push(selectedType);
          tableD = updateTableV2(mouseDownCell, mapFilters);
        }
        else if (mouseDown && mouseDownCell.indexOf(selectedType) > -1) {
          index = mouseDownCell.indexOf(selectedType);
          if (index > -1) {
            mouseDownCell.splice(index, 1);
          }
          if (mouseDownCell.length == 0) {
            mouseDown = false;
            mouseDownCell = new Array();
            tableD = updateTableV2(mouseDownCell, mapFilters);
            d3.select(this).select("rect")._groups[0][0].style.stroke = determineColor(selectedType);
            d3.select(this).select("rect")._groups[0][0].style.strokeWidth = 0;
          }
          else {
            d3.select(this).select("rect")._groups[0][0].style.stroke = determineColor(selectedType);
            d3.select(this).select("rect")._groups[0][0].style.strokeWidth = 0;
            tableD = updateTableV2(mouseDownCell, mapFilters);
          }
        }
        else if (mouseDown && !(selectedType > -1)) {
          d3.select(this).select("rect")._groups[0][0].style.stroke = "black";
          d3.select(this).select("rect")._groups[0][0].style.strokeWidth = 3;
          mouseDownCell.push(selectedType);
          tableD = updateTableV2(mouseDownCell, mapFilters);
        }
        else {
          d3.select(this).select("rect")._groups[0][0].style.stroke = "black";
          d3.select(this).select("rect")._groups[0][0].style.strokeWidth = 3;
          mouseDown = true;
          mouseDownCell = new Array().push(selectedType);
          tableD = updateTableV2(mouseDownCell, mapFilters);
        }

        if (mouseDown && mouseDownCell.length == 0) {
          mouseDown = false;
          mouseDownCell = new Array();
        }
      }
        });
function norm2(x, y) { return x * x + y * y; }

  // business type and respective colors for legend and treemap
  btypes = ['Financial Service', 'Consulting', 'Health Service', 'Restaurant/Cafe', 'Caterer', 'Food Delivery Service', 'Energy and Utilities', 'Legal Service', 'Marketing', 'Fresh Food Producer', 'Food Product', 'Food Product - Beverage', 'Hotel/Housing', 'Consumer Service', 'Consumer Product', 'Commercial Service'];
  colors = ['#008000', '#00FF00', '#FF0000', '#FF8C00', '#FF6347', '#8B0000', '#FFFF00', '#000000', '#FF00FF', '#87CEFA', '#00BFFF', '#0000CD', '#8B008B', '#008080', '#FFC0CB', '#D3D3D3'];

  // determines color fo business type
  function determineColor(name) {
    for (i = 0; i < btypes.length; i++) {
      if (btypes[i] == name) {
        return colors[i];
      }
    }
  };
   
// return treemap filters
function getTreemapFilters() {
  return mouseDownCell;
}

// updates treemap for selection by updating their outline
function updateTreemap(treemapFilters) {
  if (treemapFilters.length == 16) {
    treemapFilters = new Array();
  }
  d3.selectAll("rect")
        .transition()
        .duration(2000)
        .style("stroke", function(d) { return determineStrokeOrWidth(d, treemapFilters, false)})
        .style("stroke-width", function(d) { return determineStrokeOrWidth(d, treemapFilters, true)});
};

// determines the color and stroke of treemap outline according to inputted filters
function determineStrokeOrWidth(d, treemapFilters, widthHuh) {
  btype = d.data.name
  if (treemapFilters.indexOf(btype) > -1) {
    if (widthHuh) {
      return 4;
    }
    else {
      return "black";
    }
  }
  else {
    if (widthHuh) {
      return 0;
    }
    else {
      return determineColor(btype);
    }
  }
}
