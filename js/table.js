/* global D3 */
var highlightedBTypes = new Array();
var highlightedZips = new Array();

function table() {

    // Based on Mike Bostock's margin convention
    // https://bl.ocks.org/mbostock/3019563
    let ourBrush = null,
      selectableElements = d3.select(null),
      dispatcher;
    
  
    // Create the chart by adding an svg to the div with the id 
    // specified by the selector using the given data
    function chart(selector, data) {
      let table = d3.select(selector)
        .append("table")
          .classed("my-table", true),
      thead = table.append("thead"),
      tbody = table.append("tbody");
  
      // Here, we grab the labels of the first item in the dataset
      //  and store them as the headers of the table.
      let tableHeaders = Object.keys(data[0]);

      table.classed("text-unselectable", true);
  
      // You should append these headers to the <table> element as <th> objects inside
      // a <th>
      // See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table
  
      // YOUR CODE HERE
  
      thead.append('tr')
          .selectAll('th')
          .data(tableHeaders).enter()
          .append('th')
            .text(function(d) { return d;});
  
      // Then, you add a row for each row of the data.  Within each row, you
      // add a cell for each piece of data in the row.
      // HINTS: For each piece of data, you should add a table row.
      // Then, for each table row, you add a table cell.  You can do this with
      // two different calls to enter() and data(), or with two different loops.
  
      // YOUR CODE HERE
  
      let rows = tbody.selectAll("tr")
          .data(data)
          .enter()
          .append("tr");
  
      //create a cell in each row for each colum
      let cells = rows.selectAll("td")
          .data(function (row) {
            return tableHeaders.map(function (column) {
              return {column: column, value: row[column]};
            });
          })
          .enter()
          .append("td")
            .html(function(d) {
              if (d.column == 'Business/Organization Website') {
                if (!d.value.includes('http')) {
                  var str = 'http://' + d.value
                } else {
                  var str = d.value
                }
                return "<a href="+ str +">" + str + "</a>"
              }
              return d.value;
      });


      var mouseDown = false;
      rows.on("mouseover", highlight);
      rows.on("mouseout", unhighlight);
      rows.on("mousedown", select);
      rows.on("mousemove", shadow);
      rows.on("mouseup", deselect);
  
      // highlight rows
      function highlight() {
        if (d3.select(this).attr("class") === "selected") {
          d3.select(this).attr("class", "");
          d3.select(this).attr("class", "selected");
          highlightedZips.push(d3.select(this)._groups[0][0].cells[3].innerText);
          highlightedBTypes.push(d3.select(this)._groups[0][0].cells[0].innerText);
          updateColor(highlightedZips, highlightedBTypes);
          updateTreemap(highlightedBTypes);
        } else {
          d3.select(this).attr("class", "mouseover");
        }
      }
      
      //unhighlight rows
      function unhighlight() {
        
        if (d3.select(this).attr("class") === "selected"
          || d3.select(this).attr("class") === "mouseover selected") {
          d3.select(this).attr("class", "");
          d3.select(this).attr("class", "selected");
          highlightedZips.push(d3.select(this)._groups[0][0].cells[3].innerText);
          highlightedBTypes.push(d3.select(this)._groups[0][0].cells[0].innerText);
          updateColor(highlightedZips, highlightedBTypes);
          updateTreemap(highlightedBTypes);
        } else {
          d3.select(this).attr("class", "");
        }
      }
      
      // highlight rows and dispath selections
      function select() {
        let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];

        if (!mouseDown) {
          table.selectAll(".selected").attr("class", "")
          dispatcher.call(dispatchString, this, []);
          highlightedBTypes = new Array();
          highlightedZips = new Array();
        }
        d3.select(this).attr("class", "mouseover selected");
        dispatcher.call(dispatchString, this, table.selectAll(".selected").data());
        highlightedZips.push(d3.select(this)._groups[0][0].cells[3].innerText);
        highlightedBTypes.push(d3.select(this)._groups[0][0].cells[0].innerText);
        updateColor(highlightedZips, highlightedBTypes);
        updateTreemap(highlightedBTypes);
        mouseDown = true;
        
        highlightedZips.push(d3.select(this)._groups[0][0].cells[3].innerText);
       
      }
  
      function shadow() {
        if (mouseDown) {
          d3.select(this).attr("class", "mouseover selected");
            let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
            dispatcher.call(dispatchString, this, table.selectAll(".selected").data());
        }
        else {
          //hover(zipListDisplayed(), btypeListDisplayed(), d3.select(this)._groups[0][0].cells[3].innerText)
        }
      }
  
      function deselect() {
        mouseDown = false;
      }
  
            
      return chart
    }
    
  
  
    // Gets or sets the dispatcher we use for selection events
    chart.selectionDispatcher = function (_) {
      if (!arguments.length) return dispatcher;
      dispatcher = _;
      return chart;
    };
  
    // Given selected data from another visualization 
    // select the relevant elements here (linking)
    chart.updateSelection = function (selectedData) {
      if (!arguments.length) return;
  
      // Select an element if its datum was selected
      d3.selectAll('tr').classed("selected", d => {
        return selectedData.includes(d)
      });
    };
  
    return chart;
  
  }
  