// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
width = 400 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#vis-svg")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
  "translate(" + margin.left + "," + margin.top + ")");

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

console.log(root.leaves())

const toolTip = d3
        .select("#vis-svg")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

var mouseDown = false;

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


      cell.append('rect')
          .attr('id', d => d.data.id)
          .attr('class', 'tile')
          .attr('data-name', d => d.data.name)
          .attr('data-value', d => d.data.value)
          .attr('data-category', d => d.data.category)
          .attr('width', d => d.x1 - d.x0)
          .attr('height', d => d.y1 - d.y0)
          .attr('fill', d => { return color(d.data.name)});


      function select() {
        if (!mouseDown) {
          cell.selectAll(".selected").attr("class", "")
          d3.select(this).attr("class", "mouseover selected");
          d3.select(this).attr("fill", "white");
          mouseDown = true;
          console.log(d3.select(this).attr("class", "mouseover selected"));
          console.log(mouseDown);
        }
        else {
          console.log('poo')
          d3.select(this).attr('fill', 'black');
          mouseDown = false;
        }
      }
      function deselect() {
        mouseDown = false;

      }

      cell.append('text')
          .selectAll('tspan')
          .each(function(d) {
            var rect,
                r2 = d.r * d.r,
                s = d.r * 2,
                t = d3.select(this);
            do {
              t.style("font-size", s-- + "px");
              rect = this.getBBox();
            } while (norm2(rect.x, rect.y) > r2
              || norm2(rect.x + rect.width, rect.y) > r2
              || norm2(rect.x + rect.width, rect.y + rect.height) > r2
              || norm2(rect.x, rect.y + rect.height) > r2);
          })
          .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
          .enter()
          .append('tspan')
          .attr("font-size", "5px")
          .attr('x', 4)
          .attr('y', (d, i) => 8 + 10*i)
          .text(d => d);
          });

          function norm2(x, y) { return x * x + y * y; }
          color = d3.scaleOrdinal(d3.schemeCategory10)
          

