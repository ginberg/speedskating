////////////////////////////////////////////////////////////
///////////////////// Read in data /////////////////////////
////////////////////////////////////////////////////////////

d3.json('data/medals.json', function (error, data) {

	if (error) throw error;

	var chartScale = Math.max( Math.min( window.innerWidth/2100, 1), 0.6 );
	var chartScaleFont = Math.max(chartScale, 0.9);

	d3.select("#olympic-wrapper").style("width", 2000*chartScale + "px");
	d3.select("#olympic-chart-legend").style("width", 500*chartScale + "px");

	var outerRadius = 220 * chartScale,
		innerRadius = 40 * chartScale,
		featherPadding = 1.5,
		medalDegree = 320/(50.5*2),
		arcHeight = 8 * chartScale;

	var startYear = 1924,
		endYear = 2018;

	var warYears = [1940, 1944];
	
	//Size
	var margin = {top: 120*chartScaleFont, right: 100*chartScale, bottom: 350*chartScaleFont, left: 100*chartScale}
	var width = 8*outerRadius,
	    height = 9*outerRadius;

	////////////////////////////////////////////////////////////
	////////////////////// Create SVG //////////////////////////
	////////////////////////////////////////////////////////////
				
	var svg = d3.select("#olympic-chart").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .on("mouseover", function() {
	    	hideTooltipEdition();
	    	hideTooltip();
	    })
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	////////////////////////////////////////////////////////////
	//////////////////////// Editions //////////////////////////
	////////////////////////////////////////////////////////////

	var olympicEditions = [
	    {"edition": 1924, "city": "Chamonix", "cityContinent": "Europe"},
	    {"edition": 1928, "city": "St. Moritz", "cityContinent": "Europe"},
	    {"edition": 1932, "city": "Lake Placid", "cityContinent": "Americas"},
	    {"edition": 1936, "city": "Garmisch-Partenkirchen", "cityContinent": "Europe"},
	    {"edition": 1940, "city": "none", "cityContinent": "none"},
	    {"edition": 1944, "city": "none", "cityContinent": "none"},
	    {"edition": 1948, "city": "St. Moritz", "cityContinent": "Europe"},
	    {"edition": 1952, "city": "Oslo", "cityContinent": "Europe"},
	    {"edition": 1956, "city": "Cortina d'Ampezzo", "cityContinent": "Europe"},
	    {"edition": 1960, "city": "Squaw Valley", "cityContinent": "Americas"},
	    {"edition": 1964, "city": "Innsbruck", "cityContinent": "Europe"},
	    {"edition": 1968, "city": "Grenoble", "cityContinent": "Europe"},
	    {"edition": 1972, "city": "Sapporo", "cityContinent": "Europe"},
	    {"edition": 1976, "city": "Innsbruck", "cityContinent": "Europe"},
	    {"edition": 1980, "city": "Lake Placid", "cityContinent": "Europe"},
	    {"edition": 1984, "city": "Sarajevo", "cityContinent": "Europe"},
	    {"edition": 1988, "city": "Calgary", "cityContinent": "Americas"},
	    {"edition": 1992, "city": "Albertville", "cityContinent": "Europe"},
	    {"edition": 1994, "city": "Lillehammer", "cityContinent": "Europe"},
	    {"edition": 1998, "city": "Nagano", "cityContinent": "Asia"},
	    {"edition": 2002, "city": "Salt Lake City", "cityContinent": "Americas"},
	    {"edition": 2006, "city": "Turin", "cityContinent": "Europe"},
	    {"edition": 2010, "city": "Vancouver", "cityContinent": "Americas"},
	    {"edition": 2014, "city": "Sochi", "cityContinent": "Asia"},
	    {"edition": 2018, "city": "Pyeongchang", "cityContinent": "Asia"}
	];

	var tickEditions = [
	    {"edition": 1940, "city": "none", "cityContinent": "none"},
	    {"edition": 1960, "city": "Squaw Valley", "cityContinent": "Americas"},
	    {"edition": 1980, "city": "Lake Placid", "cityContinent": "Europe"},
	    {"edition": 1998, "city": "Nagano", "cityContinent": "Asia"},
	    {"edition": 2014, "city": "Sochi", "cityContinent": "Asia"}
	];

	////////////////////////////////////////////////////////////
	//////////////////// Colors & Scales ///////////////////////
	////////////////////////////////////////////////////////////
					
	//Although not designed to represent continents (https://en.wikipedia.org/wiki/Olympic_symbols) 
	//I will use the general accepted coloring of:
	//Americas - Red
	//Europe - Blue
	//Asia - Yellow

	var continents = ["Europe","Asia","Americas"];
	var arcColors = ["#1482C6","#FAB349","#EA1F46"];
	//Colors for the medals
	var color = d3.scaleOrdinal()
    	.domain(continents)
    	.range(arcColors)
    	.unknown("#c6c6c6");

  var timeScale = d3.scaleLinear()
  	.domain([startYear, endYear])
  	.range([innerRadius, outerRadius]);

	var dotScale = d3.scaleSqrt()
		.domain([startYear, endYear])
		.range([0.4,1]);
		
	
	////////////////////////////////////////////////////////////
	///////////////////////// Gradients ////////////////////////
	////////////////////////////////////////////////////////////

	var defs = svg.append("defs");

	//Create gradient for the annotation lines
	var annotationGradients = defs.selectAll(".annotation-gradient")
		.data(arcColors)
		.enter().append("linearGradient")
		.attr("class", "annotation-gradient")
		.attr("id", function(d,i) { return "annotation-gradient-" + continents[i]; })
		.attr("x1", "0%")
		.attr("y1", "100%")
		.attr("x2", "0%")
		.attr("y2", "0%");
	annotationGradients.append("stop")
		.attr("offset", "0%")
		.attr("stop-color", "black");
	annotationGradients.append("stop")
		.attr("offset", "50%")
		.attr("stop-color", function(d) { return d; });

	////////////////////////////////////////////////////////////
	/////////////////////// Arc set-up /////////////////////////
	////////////////////////////////////////////////////////////

  var arc = d3.arc()
    	.outerRadius(function(d) { return timeScale(this.parentNode.__data__.edition) + arcHeight; })
    	.innerRadius(function(d) { return timeScale(this.parentNode.__data__.edition); })
    	.startAngle(function(d) { return -(d.pos - 1) * Math.PI/4; })
    	.endAngle(function(d) { return -(d.pos) * Math.PI/4; });

  var femaleArc = d3.arc()
    	.outerRadius(function(d) { return timeScale(this.parentNode.__data__.edition) + arcHeight; })
    	.innerRadius(function(d) { return timeScale(this.parentNode.__data__.edition); })
    	.startAngle(function(d) { return (d.pos - 1) * Math.PI/4; })
    	.endAngle(function(d) { return (d.pos) * Math.PI/4; });

	////////////////////////////////////////////////////////////
	/////////////////// Create tails/circles ///////////////////
	////////////////////////////////////////////////////////////

  var summaryChartLocations = [
    {x: margin.left, y: outerRadius},
    {x: margin.left + 2.9*outerRadius, y: outerRadius},
    {x: margin.left + 5.8*outerRadius, y: outerRadius}
  ];

	//Locations of each circle
	var circleLocations = [
		{id: 1, x: outerRadius, y: height - 5.1 * outerRadius},
		{id: 2, x: outerRadius * 4, y: height - 5.1 * outerRadius},
		{id: 3, x: outerRadius * 7, y: height - 5.1 * outerRadius},
		{id: 4, x: outerRadius * 2.5, y: height - 2.75 * outerRadius},
		{id: 5, x: outerRadius * 5.5, y: height - 2.75 * outerRadius},
		{id: 6, x: outerRadius, y: height},
		{id: 7, x: outerRadius * 4, y: height},
		{id: 8, x: outerRadius * 7, y: height}
	];

	//Create a group for each circle
	var tails = svg.selectAll(".tail")
		.data(data)
		.enter().append("g")
		.attr("class", function(d,i) { return "tail " + removeSpace(d.group); })
		.attr("transform", function(d,i) { 
			return "translate(" + circleLocations[i].x + "," + circleLocations[i].y + ")"; 
		});

	// Group texts
	tails.append("text")
		.attr("class", "tails-text")
		.attr("x", 0)
		.attr("y", -1.2*outerRadius)
		.attr("dy", "0.35em")
		.text(function(d) { return d.group; });	

	////////////////////////////////////////////////////////////
	//////////////////// Create city arcs //////////////////////
	////////////////////////////////////////////////////////////

	var cityArcs = tails.append("g")
		.attr("class", "city-arcs");

	cityArcs.selectAll(".city-arc")
		.data(olympicEditions)
		.enter().append("path")
		.attr("class", "city-arc")
		.attr("d", function(d) {
			var cityStartAngle = 0.75 * Math.PI;
			var cityEndAngle = 1.25 * Math.PI; 
			if(this.parentNode.__data__.group == "3000m"){
			  cityEndAngle = 1.1*Math.PI;
			}

			return d3.arc()
	    		.outerRadius(function(d) { return timeScale(d.edition) + arcHeight; })
	    		.innerRadius(function(d) { return timeScale(d.edition); })
	    		.startAngle( cityStartAngle )
	    		.endAngle( cityEndAngle )(d);
		})
		.on("mouseover",function(d) {
			d3.event.stopPropagation();
			
			if(this.parentNode.__data__.group == "Team pursuit" && d.edition < 2006){return}
			
			//Highlight the medals of the hovered over edition
			d3.selectAll(".edition")
				.style("opacity", function(m) {
					return m.edition === d.edition ? 1 : 0.15;
				});

			//Make the arc a bit more apperant
			d3.selectAll(".city-arc")
				.style("opacity", function(m) {
					return m.edition === d.edition ? 0.75 : 0;
				});

			showTooltipEdition(d, color); 
		})
		.on("mouseout",function(d) {
			//Make all medals the same
			d3.selectAll(".edition")
				.style("opacity", 1);

			//Hide the year arc
			d3.selectAll(".city-arc")
				.style("opacity", null);

			hideTooltipEdition();
		});
	
	////////////////////////////////////////////////////////////
	//////////////////// Create time axes //////////////////////
	////////////////////////////////////////////////////////////

	var groupYears = d3.range(startYear + 20, endYear, 20);
	var ticks = d3.range(startYear, endYear + 4, 4);
	ticks = ticks.filter(function(d) { return groupYears.indexOf(d) === -1; });

	var timeAxes = tails.append("g")
		.attr("class", "time-axis")
		.attr("transform", function(d,i) { return "rotate(" + -d.circleRotation + ")"; });

	timeAxes.append("text")
		.attr("class", "time-axis-outer-years")
		.attr("x", 0)
		.attr("y", 0)
		.attr("dy", "0.35em")
		.style("font-size", 13*chartScale + "px")
		.text(function(d){if(this.parentNode.__data__.group == "Team pursuit"){return ""} else return startYear});

	timeAxes.append("text")
		.attr("class", "time-axis-outer-years")
		.attr("x", 0)
		.attr("y", timeScale(2030))
		.attr("dy", "0.35em")
		.style("font-size", 13*chartScale + "px")
		.text(endYear);

	//Create the small years within the axis
	timeAxes.selectAll(".time-axis-small-year")
		.data(tickEditions)
		.enter().append("text")
		.attr("class", "time-axis-small-year")
		.attr("x", 0)
		.attr("y", function(d) { return timeScale(d.edition) + arcHeight/2; })
		.attr("dy", "0.35em")
		.style("font-size", 8*chartScale + "px")
		.text(function(d) { if(this.parentNode.__data__.group == "Team pursuit" && d.edition < 2006){return ""} else return d.edition; });
		
	////////////////////////////////////////////////////////////
	///////////////////// Create Medal arcs ////////////////////
	////////////////////////////////////////////////////////////

	var editions = tails.selectAll(".edition")
		.data(function(d) { return d.editions; })
		.enter().append("g")
		.attr("class", function(d,i) { return "edition year_" + d.edition; });
		
	var medalArcs = editions.append("g")
	  .attr("class", "medal-arcs");
		
	//Finally append the paths
	medalArcs.selectAll(".medal-arc")
	  	.data(function(d) {return d.male})
	  	.enter().append("path")
		  .attr("class", "medal-arc")
		  .attr("d", arc)
		  .style("fill", function(d) { 
    		return color(d.con); 
    	})
    	.on("mouseover",function(d) {
		    d3.event.stopPropagation();

			  showTooltip(d, color, this.parentNode.__data__.edition, this.parentNode.__data__.city); 
		  })
		  .on("mouseout",function(d) {
  			//Make all medals the same
  			d3.selectAll(".edition")
  				.style("opacity", 1);
  
  			//Hide the year arc
  			d3.selectAll(".city-arc")
  				.style("opacity", null);
  
  			hideTooltip();
		  });
  		
  var fedalArcs = editions.append("g")
		.attr("class", "fedal-arcs");
		
	  //Append the paths
	  fedalArcs.selectAll(".fedal-arc")
	  	.data(function(d) {return d.female})
	  	.enter().append("path")
		  .attr("class", "fedal-arc")
		  .attr("d", femaleArc)
		  .style("fill", function(d) { 
    		return color(d.con); 
      })
      .on("mouseover",function(d) {
		    d3.event.stopPropagation();

			  showTooltip(d, color, this.parentNode.__data__.edition, this.parentNode.__data__.city); 
		  })
		  .on("mouseout",function(d) {
  			//Make all medals the same
  			d3.selectAll(".edition")
  				.style("opacity", 1);
  
  			//Hide the year arc
  			d3.selectAll(".city-arc")
  				.style("opacity", null);
  
  			hideTooltip();
		  });
     
  ////////////////////////////////////////////////////////////
	/////////////////// Create annotations /////////////////////
	////////////////////////////////////////////////////////////

	var annotationGroup = svg.append("g")
		.attr("class", "annotation-wrapper");

	createAnnotations(annotationGroup, timeScale, color, circleLocations, chartScale);
	
	////////////////////////////////////////////////////////////
	///////////////////// Create legend ////////////////////////
	////////////////////////////////////////////////////////////

	createColorLegend(color, outerRadius, chartScale, chartScale);
	
	////////////////////////////////////////////////////////////
	////// Create headers, country and individual charts   /////
	////////////////////////////////////////////////////////////
		
	// header above the country and individual charts
	svg.append("foreignObject")
    .attr("class", "sep-text")
    .attr("x", 7*summaryChartLocations[0].x)
    .attr("y", -margin.top)
    .attr("dy", "0.5em")
    .attr("width", "500")
    .attr("height", "50")
    .html("<u>Best country and individuals</u>")
    .style("font-size", 18*chartScale + "px");
      
      
	var countryChart = svg.append("g")
		.attr("class", "country-wrapper");
	var countryChartX = summaryChartLocations[0].x;
	var countryChartY = summaryChartLocations[0].y;	

	createCountryChart(countryChart, color, chartScale, countryChartX, countryChartY);
	
	cssClass = "individual-wrapper";
	var individualChart = svg.append("g").attr("class", cssClass);
	createIndividualChart(individualChart, color, chartScale, summaryChartLocations[1].x, summaryChartLocations[1].y, 'data/medals_ind_woman.json', cssClass, "Woman medal leaders");
	
	cssMenClass = "individual-men-wrapper";
	var topMenChart = svg.append("g").attr("class", cssMenClass);
	createIndividualChart(topMenChart, color, chartScale, summaryChartLocations[2].x, summaryChartLocations[2].y, 'data/medals_ind_men.json', cssMenClass, "Man medal leaders");
	
	// separator to circles
	svg.append("foreignObject")
      .attr("class", "sep-text")
      .attr("x", 7*summaryChartLocations[0].x)
      .attr("y", 1.9*summaryChartLocations[0].y)
      .attr("dy", "0.5em")
      .attr("width", "500")
      .attr("height", "50")
      .html("<u>All individual medalist per discipline</u>")
      .style("font-size", 18*chartScale + "px");
	
	////////////////////////////////////////////////////////////
	////// Create mass start text                          /////
	////////////////////////////////////////////////////////////
	
	var massStart = svg.append("g")
		.attr("class", "massstart-wrapper");
		
	 massStart.append("text")
      .attr("class", "mass-title")
      .attr("x", circleLocations[7].x)
      .attr("y", circleLocations[7].y - 1.2*outerRadius)
      .attr("dy", "0.5em")
      .text("Mass start")
      .style("font-size", 18*chartScale + "px")
      .call(wrap, 300*chartScale, 1.3);
      
    massStart.append("foreignObject")
      .attr("class", "mass-title")
      .attr("x", circleLocations[7].x - 1.2*outerRadius)
      .attr("y", circleLocations[7].y - outerRadius)
      .attr("dy", "0.5em")
      .attr("width", "500")
      .attr("height", "500")
      .html("Mass start is a new olympic discipline in 2018.<p> As the name implies, all competitors are on the ice at one time and start simultaneously, racing over 16 laps of the 400m oval. The Olympic competition begins with two semifinal heats. The top eight skaters from each semifinal advance to the final. <p> But the results of the race aren’t just based on the finish. During the race there are three intermediate sprints (after four, eight and 12 laps). Skaters are awarded points for the sprint (five for first, three for second, one for third) that count towards the final standings. There is also one final sprint. Skaters are awarded 60 points for first, 40 points for second, and 20 points for third, ensuring that the first three finishers of the final sprint will also be ranked as the top three in the race results and get the medals.<p> <img src='images/massstart.jpg' title='Ivani Blondin (Canada) is one of the favorites for the mass start in Pyeongchang.'/>");
	
	
	////////////////////////////////////////////////////////////
	////// Team pursuit image/text                         /////
	////////////////////////////////////////////////////////////
	
	var teamPursuitStart = svg.append("g")
		.attr("class", "teampursuit-wrapper");

    teamPursuitStart.append("foreignObject")
      .attr("class", "pursuit-image")
      .attr("x", circleLocations[6].x - 0.75*outerRadius)
      .attr("y", circleLocations[6].y - 0.4*outerRadius)
      .attr("width", 1.4*outerRadius)
      .attr("height", 0.9*outerRadius)
      .html("<img src='images/dutch_team_pursuit.jpg' width=" + 1.4*outerRadius + " height=" +0.9*outerRadius + " title='The team pursuit is introduced in 2006. It is the only team discipline in speed skating. This image shows the Dutch men in the Olypmic final in Sochi.'></img>");

});//d3.csv

////////////////////////////////////////////////////////////
////////////////////// Medal tooltips //////////////////////
////////////////////////////////////////////////////////////

//Show the tooltip on hover
function showTooltip(d, color, olympicYear, olympicCity) {
		
	//Find location of mouse on page
	var xpos =  d3.event.pageX - 15;
	var ypos =  d3.event.pageY - 15;

	//Rest font-style
	d3.select("#tooltip-country").style("font-size", null);

	//Set the title and discipline
	var medal = "";
	if(d.pos == 1){
	  medal = "gold";
	} else if(d.pos == 2){
	  medal = "silver";
	} else{
	  medal = "bronze";
	}
	d3.select("#tooltip .tooltip-event").text(medal);

	//Set athlete
	var athlete = '';
	if(olympicYear === 2018) {
		athlete = "To be decided in the coming event";
	} else if (d.names === "") {
		athlete = "";
		d3.select("#tooltip-country").style("font-size", "13px");
	} else {
		athlete = d.names;
	}//else
	d3.select("#tooltip-athlete").text(athlete);

	//Set country
	var country = "";
	if( d.country === "NA") {
		country = "";
	} else {
		country = d.country + " - " + d.con ;
	}//else
	d3.select("#tooltip-country")
		.style("color", color(d.con))
		.text(country);

	//Set edition
	d3.select("#tooltip-edition")
		.html('<span>' + olympicCity + "</span> - " + olympicYear + "</span>");

	//Set the tooltip in the right location and have it appear
	d3.select("#tooltip")
		.style("top", ypos + "px")
		.style("left", xpos + "px")
		.transition().duration(0)
		.style("opacity", 1);
}//showTooltip	

//Hide the tooltip
function hideTooltip() {		
	d3.select("#tooltip")
		.transition().duration(100)
		.style("opacity", 0);	
}//hideTooltip

////////////////////////////////////////////////////////////
//////////////////// Edition tooltips //////////////////////
////////////////////////////////////////////////////////////

function showTooltipEdition(d, color) {
		
	//Find location of mouse on page
	var xpos =  d3.event.pageX - 10;
	var ypos =  d3.event.pageY + 80;

	//Set the title and discipline
	d3.select("#tooltip-edition-wrapper #tooltip-edition-edition").text(d.edition);
	
	//Set city and continent
	var city, continent, contColor = "";
	if (d.city === "none") {
		city = "No Olympics - WW II";
		continent = "-";
		contColor = "#d2d2d2";
	} else {
		city = d.city;
		continent = d.cityContinent;
		contColor = color(continent);
	}

	d3.select("#tooltip-edition-wrapper #tooltip-edition-city").text(city);
	d3.select("#tooltip-edition-wrapper #tooltip-edition-continent")
		.style("color", contColor)
		.text(continent);

	//Set the tooltip in the right location and display it
	d3.select("#tooltip-edition-wrapper")
		.style("top", ypos + "px")
		.style("left", xpos + "px")
		.transition().duration(0)
		.style("opacity", 1);
}//showTooltipEdition

//Hide the tooltip
function hideTooltipEdition() {		
	d3.select("#tooltip-edition-wrapper")
		.transition().duration(100)
		.style("opacity", 0);	
}//hideTooltipEdition


////////////////////////////////////////////////////////////
//////////////////// Top individuals tooltips //////////////////////
////////////////////////////////////////////////////////////

function showTooltipIndividual(d, color) {
		
	//Find location of mouse on page
	var xpos =  d3.event.pageX - 10;
	var ypos =  d3.event.pageY - 10;

	//Set the title and discipline
	d3.select("#tooltip-individual-wrapper #tooltip-country").html('<span>' + d.country + "</span> - " + d.con + " </span>");
	
	d3.select("#tooltip-individual-wrapper #tooltip-medals").html('<span>' + d.medals[0] + " gold </span> - " + d.medals[1] + " silver</span> - " + d.medals[2] + " bronze</span>");
	d3.select("#tooltip-individual-wrapper #tooltip-active").text("Active: " + d.active);

	//Set the tooltip in the right location and have it appear
	d3.select("#tooltip-individual-wrapper")
		.style("top", ypos + "px")
		.style("left", xpos + "px")
		.transition().duration(0)
		.style("opacity", 1);
}//showTooltipIndividual

//Hide the tooltip
function hideTooltipIndividual() {		
	d3.select("#tooltip-individual-wrapper")
		.transition().duration(100)
		.style("opacity", 0);	
}//hideTooltipIndividual

////////////////////////////////////////////////////////////
//////////////////// Top countries tooltips //////////////////////
////////////////////////////////////////////////////////////

function showTooltipCountry(d, color) {
		
	//Find location of mouse on page
	var xpos =  d3.event.pageX - 10;
	var ypos =  d3.event.pageY - 10;

	d3.select("#tooltip-country-wrapper #tooltip-medals").html('<span>' + d.medals[0] + " gold </span> - " + d.medals[1] + " silver</span> - " + d.medals[2] + " bronze</span>");

	//Set the tooltip in the right location and have it appear
	d3.select("#tooltip-country-wrapper")
		.style("top", ypos + "px")
		.style("left", xpos + "px")
		.transition().duration(0)
		.style("opacity", 1);
}//showTooltipCountry

//Hide the tooltip
function hideTooltipCountry() {		
	d3.select("#tooltip-country-wrapper")
		.transition().duration(100)
		.style("opacity", 0);	
}//hideTooltipCountry

////////////////////////////////////////////////////////////
///////////////////// Other functions //////////////////////
////////////////////////////////////////////////////////////

//Replaces spaces, - and & for use in classes
function removeSpace(str) {
	str = str.replace(/\s+/g, '-');
	str = str.replace(/&/g, '');
	str = str.replace(/\./g,'').toLowerCase();
	return str;
}//removeSpace

//Wrap text in SVG
function wrap(text, width, heightLine) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = (typeof heightLine === "undefined" ? 1.6 : heightLine), // ems
        y = text.attr("y"),
        x = text.attr("x"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}//wrap