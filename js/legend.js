(function (d3) {
    'use strict';
  
    const colorLegend = (selection, props) => {
      const {
        colorScale,
        circleRadius,
        spacing,
        textOffset
      } = props;
  
      const groups = selection.selectAll('g')
        .data(colorScale.domain());
      const groupsEnter = groups
        .enter().append('g')
          .attr('class', 'tick');
      groupsEnter
        .merge(groups)
          .attr('transform', (d, i) =>
            `translate(1175, ${i * spacing - 120})`
          );
      groups.exit().remove();
  
      groupsEnter.append('circle')
        .merge(groups.select('circle'))
          .attr('r', circleRadius)
          .attr('fill', colorScale);
  
      groupsEnter.append('text')
        .merge(groups.select('text'))
          .text(d => d)
          .attr('dy', '0.32em')
          .attr('x', textOffset)
          .attr("font-size", "10px");
    };
  
    const svg = d3.select('svg');
  
    const colorScale = d3.scaleOrdinal()
    .domain(['Financial Services', 'Consulting', 'Health Services', 'Restaurant/Cafe', 'Caterer', 'Food Delivery Service', 'Energy and Utilities', 'Legal Services', 'Marketing', 'Fresh Food Producer', 'Food Product', 'Food Product - Beverage', 'Hotel/Housing', 'Consumer Service', 'Consumer Product', 'Commercial Service'])
    .range(['#008000', '#00FF00', '#FF0000', '#FF8C00', '#FF6347', '#8B0000', '#FFFF00', '#000000', '#FF00FF', '#87CEFA', '#00BFFF', '#0000CD', '#8B008B', '#008080', '#FFC0CB', '#D3D3D3'])

  
    svg.append('g')
        .attr('transform', `translate(180,150)`)
        .call(colorLegend, {
          colorScale,
          circleRadius: 7,
          spacing: 20,
          textOffset: 20
        });
  
  }(d3));

  function updateLegend(treemapFilters) {
    d3.selectAll('text')
        .transition()
        .duration(200)
        .ease(d3.easeLinear)
        .style("opacity", d => updateOpacity(d, treemapFilters));
  };
  

  function updateOpacity(data, filters) {
      if (filters.length == 0) {
          return 1;
      }
      else if (filters.indexOf(data) > -1) {
          return 1;
      }
      else {
          return .5;
      }
  };