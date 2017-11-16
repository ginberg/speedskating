////////////////////////////////////////////////////////////
/////////////////// Create annotations /////////////////////
////////////////////////////////////////////////////////////

function createAnnotations(annotationGroup, timeScale, color, circleLocations, chartScale) {

	var annotationRadius = 4*chartScale;

	var chartScaleFont = Math.max(chartScale, 0.8);
	var chartScaleDownLine = Math.max( Math.min( window.innerWidth/2100, 1), 0.7 ),
		chartScaleDownLineDucks = chartScaleDownLine < 1 ? chartScaleDownLine/1.2 : 1;

	var annotationTextOfsset = 10*chartScaleFont,
		annotationTitlePadding = 25*chartScaleFont;

	var extraPullUp = 0;
	if(chartScale <= 0.6) { extraPullUp = 10; }
	else if(chartScale <= 0.65) { extraPullUp = 5; }
	else if(chartScale <= 0.675) { extraPullUp = 0; }
	else if(chartScale <= 0.71) { extraPullUp = -3; }
	else if(chartScale <= 0.75) { extraPullUp = -6; }
	else if(chartScale <= 0.8) { extraPullUp = -11; }
	else if(chartScale <= 0.9) { extraPullUp = -14; }
	else if(chartScale <= 0.95) { extraPullUp = -6; }

	var fontsizeTitle = 16*chartScaleFont,
		fontsizeText = 12*chartScaleFont,
		lineHeight = 1.6*chartScaleFont,
		lineWidth = 1.5*chartScaleFont,
		circleStrokeWidth = 2*chartScaleFont;

	////////////////////////////////////////////////////////////
	//////////////////// Dutch sweep 2014 //////////////////////
	////////////////////////////////////////////////////////////

	var dutchLength = -120*chartScaleFont;
	var dutchAnn = annotationGroup.append("g")
		.attr("class", "annotation ann-OR500m")
		.attr("transform", "translate(" + (circleLocations[0].x + timeScale(2014) * Math.cos(-130 * Math.PI/180)) + "," + 
										  (circleLocations[0].y + timeScale(2014) * Math.sin(-130 * Math.PI/180)) + ")");
	//rect
	dutchAnn.append("rect")
		.attr("class", "annotation-line")
		.style("fill", "url(#annotation-gradient-Europe)")
		.attr("width", lineWidth)
		.attr("x", -lineWidth/2)
		.attr("height", -dutchLength)
		.attr("y", dutchLength);
	//circle
	dutchAnn.append("circle")
		.attr("class", "annotation-circle")
		.attr("r", annotationRadius)
		.style("stroke-width", circleStrokeWidth);
	//title
	dutchAnn.append("text")
		.attr("class", "annotation-text-title")
		.attr("x", annotationTextOfsset + 1.1*dutchLength)
		.attr("y", dutchLength)
		.attr("dy", "1em")
		.style("fill", color("Europe"))
		.style("font-size", fontsizeTitle + "px")
		.text("Dutch sweep");
	//text
	dutchAnn.append("text")
		.attr("class", "annotation-text")
		.attr("x", annotationTextOfsset + 1.3*dutchLength)
		.attr("y", dutchLength + annotationTitlePadding)
		.attr("dy", "1em")
		.style("font-size", fontsizeText + "px")
		.text("In Sochi (2014) the Dutch won all the medals at the 500m's men.")
		.call(wrap, 140*chartScaleFont, lineHeight);
		
	
	////////////////////////////////////////////////////////////
	//////////////////// Johan Olav Koss 1994 //////////////////////
	////////////////////////////////////////////////////////////

	var kossLength = -500*chartScaleFont;
	var kossAnn = annotationGroup.append("g")
		.attr("class", "annotation ann-koss")
		.attr("transform", "translate(" + (circleLocations[4].x + timeScale(1994) * Math.cos(-100 * Math.PI/180)) + "," + 
										  (circleLocations[4].y + timeScale(1994) * Math.sin(-100 * Math.PI/180)) + ")");
	//rect
	kossAnn.append("rect")
		.attr("class", "annotation-line")
		.style("fill", "url(#annotation-gradient-Europe)")
		.attr("width", -kossLength)
		.attr("x", 0)
		.attr("height", lineWidth)
		.attr("y", -annotationRadius - lineWidth);
	//circle
	kossAnn.append("circle")
		.attr("class", "annotation-circle")
		.attr("r", annotationRadius)
		.attr("transform", "translate(" + -annotationRadius + "," + -annotationRadius + ")")
		.style("stroke-width", circleStrokeWidth);
	//title
	kossAnn.append("text")
		.attr("class", "annotation-text-title")
		.attr("x", -0.84*kossLength)
		.attr("y", -annotationTitlePadding)
		.attr("dy", "1em")
		.style("fill", color("Europe"))
		.style("font-size", fontsizeTitle + "px")
		.text("King Koss");
	//text
	kossAnn.append("text")
		.attr("class", "annotation-text")
		.attr("x", -0.4*kossLength)
		.attr("y", 0.3*annotationTitlePadding)
		.attr("dy", "1em")
		.style("font-size", fontsizeText + "px")
		.text("Johann Olav Koss is the king of the 1994 Olypics where he wins the 1500m, the 5k and 10k with world records. His absolute masterpiece is the 10k where he dominates the event by winning with 19 seconds on number 2 Kjell Storelid. Bart Veldkamp, olympic champion in 1992, ends in 3rd place and speaks the famous words: 'this is just not possible'.")
		.call(wrap, 300*chartScaleFont, lineHeight);

////////////////////////////////////////////////////////////
	//////////////////// 10k cancelled 1928 //////////////////////
	////////////////////////////////////////////////////////////

	var cancelledLength = -500*chartScaleFont;
	var canceledAnn = annotationGroup.append("g")
		.attr("class", "annotation ann-cancelled")
		.attr("transform", "translate(" + (circleLocations[4].x + timeScale(1928) * Math.cos(-220 * Math.PI/180)) + "," + 
										  (circleLocations[4].y + timeScale(1928) * Math.sin(-220 * Math.PI/180)) + ")");
	//rect
	canceledAnn.append("rect")
		.attr("class", "annotation-line")
		.style("fill", "url(#annotation-gradient-Europe)")
		.attr("width", -cancelledLength)
		.attr("x", 0)
		.attr("height", lineWidth)
		.attr("y", -lineWidth);
	//circle
	canceledAnn.append("circle")
		.attr("class", "annotation-circle")
		.attr("r", annotationRadius)
		.attr("transform", "translate(" + -annotationRadius + "," + 0 + ")")
		.style("stroke-width", circleStrokeWidth);
	//title
	canceledAnn.append("text")
		.attr("class", "annotation-text-title")
		.attr("x", -0.84*cancelledLength)
		.attr("y", -annotationTitlePadding)
		.attr("dy", "1em")
		.style("fill", color("Europe"))
		.style("font-size", fontsizeTitle + "px")
		.text("Poor Ice");  
	//text
	canceledAnn
	  .append("text")
		.attr("class", "annotation-text")
		.attr("x", -0.4*cancelledLength)
		.attr("y", 0.3*annotationTitlePadding)
		.attr("dy", "1em")
		.style("font-size", fontsizeText + "px")
		.text("In 1928, the event was cancelled halfway through the running due to poor ice conditions.")
		.on('click', "http://www.google.com")
		.call(wrap, 300*chartScaleFont, lineHeight);

	////////////////////////////////////////////////////////////
	//////////////////// Shani Davis 2006 //////////////////////
	////////////////////////////////////////////////////////////

	var davisLength = -150*chartScaleFont;
	var davisAnn = annotationGroup.append("g")
		.attr("class", "annotation ann-davis")
		.attr("transform", "translate(" + (circleLocations[1].x + timeScale(2006) * Math.cos(-130 * Math.PI/180)) + "," + 
										  (circleLocations[1].y + timeScale(2006) * Math.sin(-130 * Math.PI/180)) + ")");
	//rect
	davisAnn.append("rect")
		.attr("class", "annotation-line")
		.style("fill", "url(#annotation-gradient-Americas)")
		.attr("width", lineWidth)
		.attr("x", -lineWidth/2)
		.attr("height", -davisLength)
		.attr("y", davisLength);
	//circle
	davisAnn.append("circle")
		.attr("class", "annotation-circle")
		.attr("r", annotationRadius)
		.style("stroke-width", circleStrokeWidth);
	//title
	davisAnn.append("text")
		.attr("class", "annotation-text-title")
		.attr("x", annotationTextOfsset + 0.8*davisLength)
		.attr("y", davisLength)
		.attr("dy", "1em")
		.style("fill", color("Americas"))
		.style("font-size", fontsizeTitle + "px")
		.text("Shani Davis");
	//text
	davisAnn.append("text")
		.attr("class", "annotation-text")
		.attr("x", annotationTextOfsset + 1.5*davisLength)
		.attr("y", davisLength + annotationTitlePadding)
		.attr("dy", "1em")
		.style("font-size", fontsizeText + "px")
		.text("Shani Davis became in 2006 the first black athlete to win a gold medal in an individual sport at the Olympic Winter Games.")
		.call(wrap, 210*chartScaleFont, lineHeight);
		
	////////////////////////////////////////////////////////////
	//////////////////// Eric Heiden 1980 //////////////////////
	////////////////////////////////////////////////////////////

	var heidenLength = -200*chartScaleFont;
	var heidenAnn = annotationGroup.append("g")
		.attr("class", "annotation ann-davis")
		.attr("transform", "translate(" + (circleLocations[2].x + timeScale(1980) * Math.cos(-130 * Math.PI/180)) + "," + 
										  (circleLocations[2].y + timeScale(1980) * Math.sin(-130 * Math.PI/180)) + ")");
	//rect
	heidenAnn.append("rect")
		.attr("class", "annotation-line")
		.style("fill", "url(#annotation-gradient-Americas)")
		.attr("width", lineWidth)
		.attr("x", -lineWidth/2)
		.attr("height", -heidenLength)
		.attr("y", heidenLength);
	//circle
	heidenAnn.append("circle")
		.attr("class", "annotation-circle")
		.attr("r", annotationRadius)
		.style("stroke-width", circleStrokeWidth);
	//title
	heidenAnn.append("text")
		.attr("class", "annotation-text-title")
		.attr("x", annotationTextOfsset + 0.6*heidenLength)
		.attr("y", heidenLength)
		.attr("dy", "1em")
		.style("fill", color("Americas"))
		.style("font-size", fontsizeTitle + "px")
		.text("Eric Heiden");
	//text
	heidenAnn.append("text")
		.attr("class", "annotation-text")
		.attr("x", annotationTextOfsset + 1.2*heidenLength)
		.attr("y", heidenLength + annotationTitlePadding)
		.attr("dy", "1em")
		.style("font-size", fontsizeText + "px")
		.text("Eric Heiden won 5 gold medals at the Lake Placid Games in 1980. He is still the most successful Winter Olympian from a single edition of any Winter Olympics.")
		.call(wrap, 210*chartScaleFont, lineHeight);

  ////////////////////////////////////////////////////////////
	//////////////////// Seung-hoon Lee 2010 //////////////////////
	////////////////////////////////////////////////////////////

	var leeLength = -400*chartScaleFont;
	var leeAnn = annotationGroup.append("g")
		.attr("class", "annotation ann-koss")
		.attr("transform", "translate(" + (circleLocations[3].x + timeScale(2010) * Math.cos(-140 * Math.PI/180)) + "," + 
										  (circleLocations[3].y + timeScale(2010) * Math.sin(-140 * Math.PI/180)) + ")");
	//rect
	leeAnn.append("rect")
		.attr("class", "annotation-line")
		.style("fill", "url(#annotation-gradient-Asia)")
		.attr("width", -leeLength)
		.attr("x", leeLength)
		.attr("height", lineWidth)
		.attr("y", -lineWidth);
	//circle
	leeAnn.append("circle")
		.attr("class", "annotation-circle")
		.attr("r", annotationRadius)
		.attr("transform", "translate(" + -annotationRadius + "," + 0 + ")")
		.style("stroke-width", circleStrokeWidth);
	//title
	leeAnn.append("text")
		.attr("class", "annotation-text-title")
		.attr("x", leeLength)
		.attr("y", -annotationTitlePadding)
		.attr("dy", "1em")
		.style("fill", color("Asia"))
		.style("font-size", fontsizeTitle + "px")
		.text("Asian sprinters?");
	//text
	leeAnn.append("text")
		.attr("class", "annotation-text")
		.attr("x", leeLength)
		.attr("y", 0.3*annotationTitlePadding)
		.attr("dy", "1em")
		.style("font-size", fontsizeText + "px")
		.text("Seung-hoon Lee is the first Asian man to win an Olympic medal at one of the longer distances. He won a silver medal at the 5k in 2010 and to everyone's surprise he won the 10k in the same year. The big favourite for the 10k, Sven Kramer was disqualified after taking a wrong lane.")
		.call(wrap, 300*chartScaleFont, lineHeight);
		
	// Kramer-10k
	// Woman since 1960
	// 1928 severe weather
	
	////////////////////////////////////////////////////////////
	//////////////////// Claudia Pechstein 2002 //////////////////////
	////////////////////////////////////////////////////////////

	var pechsteinLength = -400*chartScaleFont;
	var pechsteinAnn = annotationGroup.append("g")
		.attr("class", "annotation ann-koss")
		.attr("transform", "translate(" + (circleLocations[5].x + timeScale(2002) * Math.cos(-60 * Math.PI/180)) + "," + 
										  (circleLocations[5].y + timeScale(2002) * Math.sin(-60 * Math.PI/180)) + ")");
	//rect
	pechsteinAnn.append("rect")
		.attr("class", "annotation-line")
		.style("fill", "url(#annotation-gradient-Asia)")
		.attr("width", -pechsteinLength)
		.attr("x", pechsteinLength)
		.attr("height", lineWidth)
		.attr("y", -lineWidth);
	//circle
	pechsteinAnn.append("circle")
		.attr("class", "annotation-circle")
		.attr("r", annotationRadius)
		.style("stroke-width", circleStrokeWidth);
	//title
	pechsteinAnn.append("text")
		.attr("class", "annotation-text-title")
		.attr("x", pechsteinLength)
		.attr("y", -annotationTitlePadding)
		.attr("dy", "1em")
		.style("fill", color("Asia"))
		.style("font-size", fontsizeTitle + "px")
		.text("Most successful speed skater");
	//text
	pechsteinAnn.append("text")
		.attr("class", "annotation-text")
		.attr("x", pechsteinLength)
		.attr("y", 0.3*annotationTitlePadding)
		.attr("dy", "1em")
		.style("font-size", fontsizeText + "px")
		.text("Claudia Pechstein is the most successful olympic speed skater by winning 9 medals. She is the most successful German Winter Olympian of all-time. She won her first medal in Albertville (1992) where she became 3rd at the 5000m. She won the gold medal at the 5000m in three consecutive Olympics (1994, 1998, 2002). After the World Championships in February 2009, the International Skating Union accused Pechstein of blood doping and banned her from all competitions for two years. This ban was based on irregular levels of reticulocytes in her blood. Claudia has always denied that she took doping and claims the irregular levels are caused by spherocytosis, a form of blood anemia.")
		.call(wrap, 250*chartScaleFont, lineHeight);
		
	////////////////////////////////////////////////////////////
	//////////////////// Ireen Wust 2006 //////////////////////
	////////////////////////////////////////////////////////////

	var wustLength = -160*chartScaleFont;
	var wustAnn = annotationGroup.append("g")
		.attr("class", "annotation ann-wust")
		.attr("transform", "translate(" + (circleLocations[2].x + timeScale(2010) * Math.cos(-63 * Math.PI/180)) + "," + 
										  (circleLocations[2].y + timeScale(2010) * Math.sin(-63 * Math.PI/180)) + ")");
	//rect
	wustAnn.append("rect")
		.attr("class", "annotation-line")
		.style("fill", "url(#annotation-gradient-Europe)")
		.attr("width", lineWidth)
		.attr("x", -lineWidth/2)
		.attr("height", -wustLength)
		.attr("y", wustLength);
	//circle
	wustAnn.append("circle")
		.attr("class", "annotation-circle")
		.attr("r", annotationRadius)
		.style("stroke-width", circleStrokeWidth);
	//title
	wustAnn.append("text")
		.attr("class", "annotation-text-title")
		.attr("x", annotationTextOfsset)
		.attr("y", wustLength)
		.attr("dy", "1em")
		.style("fill", color("Europe"))
		.style("font-size", fontsizeTitle + "px")
		.text("Ireen Wust");
	//text
	wustAnn.append("text")
		.attr("class", "annotation-text")
		.attr("x", annotationTextOfsset)
		.attr("y", wustLength + annotationTitlePadding)
		.attr("dy", "1em")
		.style("font-size", fontsizeText + "px")
		.text("Ireen Wust is the 2nd most successful olympic speed skater by winning 8 medals so far. Will she beat Claudia Pechstein as medal leader in Pyeongchang?")
		.call(wrap, 200*chartScaleFont, lineHeight);
	
	////////////////////////////////////////////////////////////
	//////////////////// Clara Hughes 1996 //////////////////////
	////////////////////////////////////////////////////////////

	var hughesLength = -700*chartScaleFont;
	var hughesAnn = annotationGroup.append("g")
		.attr("class", "annotation ann-hughes")
		.attr("transform", "translate(" + (circleLocations[3].x + timeScale(2010) * Math.cos(45 * Math.PI/180)) + "," + 
										  (circleLocations[3].y + timeScale(2010) * Math.sin(45 * Math.PI/180)) + ")");
	//rect
	hughesAnn.append("rect")
		.attr("class", "annotation-line")
		.style("fill", "url(#annotation-gradient-Asia)")
		.attr("width", -hughesLength)
		.attr("x", hughesLength)
		.attr("height", lineWidth)
		.attr("y", -lineWidth);
	//circle
	hughesAnn.append("circle")
		.attr("class", "annotation-circle")
		.attr("r", annotationRadius)
		.attr("transform", "translate(" + annotationRadius + "," + 0 + ")")
		.style("stroke-width", circleStrokeWidth);
	//title
	hughesAnn.append("text")
		.attr("class", "annotation-text-title")
		.attr("x", hughesLength)
		.attr("y", -annotationTitlePadding)
		.attr("dy", "1em")
		.style("fill", color("Asia"))
		.style("font-size", fontsizeTitle + "px")
		.text("Clara Hughes");
	//text
	hughesAnn.append("text")
		.attr("class", "annotation-text")
		.attr("x", hughesLength)
		.attr("y", 0.3*annotationTitlePadding)
		.attr("dy", "1em")
		.style("font-size", fontsizeText + "px")
		.text("Canadian Clara Hughes is the only athlete to have won multiple medals at both the Summer and Winter Olympics. She who won two bronze medals at the 1996 Summer Olympics in the cycling event (road race and time trial). In speed skating she won two bronze medals at the 5k in 2002 and 2010.")
		.call(wrap, 250*chartScaleFont, lineHeight);
}//createAnnotations


