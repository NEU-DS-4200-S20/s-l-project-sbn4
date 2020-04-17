// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
function createTable(data, filterValue) {

  d3.csv(data, (data) => {
      
  
      // General event type for selections, used by d3-dispatch
      // https://github.com/d3/d3-dispatch
      const dispatchString = "selectionUpdated";
  
      // Create a line chart given x and y attributes, labels, offsets; 
      // a dispatcher (d3-dispatch) for selection events; 
      // a div id selector to put our svg in; and the data to use.
      
      // let lcYearPoverty = linechart()
      //   .x(d => d.year)
      //   .xLabel("YEAR")
      //   .y(d => d.poverty)
      //   .yLabel("POVERTY RATE")
      //   .yLabelOffset(40)
      //   .selectionDispatcher(d3.dispatch(dispatchString))
      //   ("#linechart", data);
  
      // Create a scatterplot given x and y attributes, labels, offsets; 
      // a dispatcher (d3-dispatch) for selection events; 
      // a div id selector to put our svg in; and the data to use.
      
      // let spUnemployMurder = scatterplot()
      //   .x(d => d.unemployment)
      //   .xLabel("UNEMPLOYMENT RATE")
      //   .y(d => d.murder)
      //   .yLabel("MURDER RATE IN STATE PER 100000")
      //   .yLabelOffset(150)
      //   .selectionDispatcher(d3.dispatch(dispatchString))
      //   ("#scatterplot", data);
  
      // Create a table given the following: 
      // a dispatcher (d3-dispatch) for selection events; 
      // a div id selector to put our table in; and the data to use.
      let tableData = table()
        .selectionDispatcher(d3.dispatch(dispatchString))
        ("#table", filter(data, filterValue));
  
      function filter(data, filterValue) {
        if (filterValue != "All") {
          return data.filter(row => row.Member_Type == filterValue);
        }
        else {
          return data;
        }
      };

      // // When the line chart selection is updated via brushing, 
      // // tell the scatterplot to update it's selection (linking)
      // lcYearPoverty.selectionDispatcher().on(dispatchString, function(selectedData) {
      //   spUnemployMurder.updateSelection(selectedData);
      //   tableData.updateSelection(selectedData);
      //   // ADD CODE TO HAVE TABLE UPDATE ITS SELECTION AS WELL
      // });
  
      // // When the scatterplot selection is updated via brushing, 
      // // tell the line chart to update it's selection (linking)
      // spUnemployMurder.selectionDispatcher().on(dispatchString, function(selectedData) {
      //   lcYearPoverty.updateSelection(selectedData);
      //   tableData.updateSelection(selectedData);
      //   // ADD CODE TO HAVE TABLE UPDATE ITS SELECTION AS WELL
      // });
  
      // // When the table is updated via brushing, tell the line chart and scatterplot
      // // YOUR CODE HERE
      // tableData.selectionDispatcher().on(dispatchString, function(selectedData) {
      //   lcYearPoverty.updateSelection(selectedData);
      //   spUnemployMurder.updateSelection(selectedData);
      // });
    return tableData;
    });
  };

  // function to update table and then update map and treemap
  function updateTableV2(treemapFilters, mapFilters) {
    table = document.getElementById("table");
    tr = table.getElementsByTagName("tbody")[0].rows;

    if (treemapFilters.length == 0 && mapFilters.length == 0) {
      for (i = 0; i < tr.length; i++) {
        tr[i].style.display = "";
      }
    }
    else if (treemapFilters.length == 0) {
      for (i = 0; i < tr.length; i++) {
        zip = tr[i].cells[3].innerText;
        if (mapFilters.indexOf(zip) > -1) {
          tr[i].style.display = "";
        } 
        else {
          tr[i].style.display = "none";
        }
      }
    }
    else if (mapFilters.length == 0) {
      for (i = 0; i < tr.length; i++) {
        bType = tr[i].cells[0].innerText;
        if (treemapFilters.indexOf(bType) > -1) {
          tr[i].style.display = "";
        } 
        else {
          tr[i].style.display = "none";
        }
      }
    }
    else {
      for (i = 0; i < tr.length; i++) {
        bType = tr[i].cells[0].innerText;
        zip = tr[i].cells[3].innerText;
        if (mapFilters.indexOf(zip) > -1 && treemapFilters.indexOf(bType) > -1) {
          tr[i].style.display = "";
        } 
        else {
          tr[i].style.display = "none";
        }
      }
    }
    updateTreemap(btypeListDisplayed());
    updateColor(zipListDisplayed(), treemapFilters);
  };

  // creates initial table
tableD = createTable("data/member_data.csv", "All");

// returns distinct ziplists displayed within the table
function zipListDisplayed() {
  table = document.getElementById("table");
  tr = table.getElementsByTagName("tbody")[0].rows;
  zipsDisplayed = new Array();

  for (i = 0; i < tr.length; i++) {
    zip = tr[i].cells[3].innerText;
    if (tr[i].style.display == "" && zip != "" && zipsDisplayed.indexOf(zip) == -1) {
      zipsDisplayed.push(zip);
    } 
  }
  return zipsDisplayed;
}


// returns distinct business types displayed on the table
function btypeListDisplayed() {
  table = document.getElementById("table");
  tr = table.getElementsByTagName("tbody")[0].rows;
  btypesDisplayed = new Array();

  for (i = 0; i < tr.length; i++) {
    btype = tr[i].cells[0].innerText;
    if (tr[i].style.display == "" && btype != "" && btypesDisplayed.indexOf(btype) == -1) {
      btypesDisplayed.push(btype);
    } 
  }
  return btypesDisplayed;
}


