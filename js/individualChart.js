//Create a horizontal stacked bar chart 

function createIndividualChart(svg, color, chartScale, offsetX, offsetY, filename, cssClass, title) {
  
    ////////////////////////////////////////////////////////////
    ///////////////////// Read in data /////////////////////////
    ////////////////////////////////////////////////////////////
    
    d3.json(filename, function (error, data) {
      if (error) throw error;

      //Size
      var margin = {top: 50*chartScale, right: 0, left: 15*chartScale, bottom: 10*chartScale},
      width = 450*chartScale - margin.left - margin.right,
      height = 400*chartScale - margin.top - margin.bottom;
      
      d3.select("." + cssClass)
      .attr("transform", "translate(" + offsetX + "," + 
              (offsetY - (0.5*height + margin.top + margin.bottom) ) + ")");
      
      ////////////////////////////////////////////////////////////
      /////////////////// Create the bar chart ///////////////////
      ////////////////////////////////////////////////////////////

      //sort bars based on value (=number of medals)
      data = data.sort(function (a, b) {
          return d3.descending(a.value, b.value);
      });  
     
      var barWidth = d3.scaleLinear()
            .range([0, width])
            .domain([0, d3.max(data, function (d) {
                return d.value;
            })]);
            
      var countryLocation = d3.scaleBand()
	    	.domain(data.map(function(d) { return d.name; }))
	    	.range([0, height])
	    	.padding(0.4);
	    	
	    //Create a group for all countries
      var bars = svg.selectAll(".countries")
      .data(data)
      .enter();
      
      // add rects
      bars.append("rect")
      .attr("class", "countries")
      .attr("y", function(d) { return countryLocation(d.name);})
      .attr("width", function (d) {return barWidth(d.value);})
      .attr("height", countryLocation.bandwidth())
      .style("fill", function (d) {return color(d.con) } )
      .on("mouseover", function(d) { showTooltipIndividual(d, color); })
    	.on("mouseout", hideTooltipIndividual);
      
      //add a value label to the right of each bar
      bars.append("text")
          .attr("class", "label")
          //y position of the label is halfway down the bar
          .attr("y", function (d) {
              return countryLocation(d.name) + countryLocation.bandwidth() / 2 + 4;
          })
          //x position is 3 pixels to the right of the bar
          .attr("x", function (d) {
              return barWidth(d.value) + 3;
          })
          .text(function (d) {
              return d.value;
          });
          
    ////////////////////////////////////////////////////////////
		////////////////////// Create the axes /////////////////////
		////////////////////////////////////////////////////////////

		//The names to the left
		svg.selectAll(".discipline-other-label")
			.data(countryLocation.domain())
			.enter().append("text")
			.attr("class", "discipline-other-label")
			.attr("x", -120*chartScale)
			.attr("y", function(d) { return countryLocation(d) + countryLocation.bandwidth() / 3; })
			.attr("dy", "0.7em")
			.style("font-size", 13*chartScale + "px")
			.text(function(d) { return d; });
      
      ////////////////////////////////////////////////////////////
      ///////////////////////// Add title ///////////////////////
      ////////////////////////////////////////////////////////////
        
      svg.append("text")
      .attr("class", "individual-title")
      .attr("x", 0)
      .attr("y", -margin.top + 30*chartScale)
      .attr("dy", "0.5em")
      .text(title)
      .style("font-size", 18*chartScale + "px")
      .call(wrap, 400*chartScale, 1.3);
      
    });//d3.csv
    
}//createCountryChart

