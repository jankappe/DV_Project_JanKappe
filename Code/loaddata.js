google.charts.load('current', {'packages':['scatter', 'corechart', 'controls']});
//google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);


function drawChart() {
	var minYear = 2005
	var maxYear = 2016
	var testData = [['IMDB', 'titleyear']];

	var years = maxYear - minYear
	for (var i = 0; i < years; i++) {
		testData[0].push(String((minYear + i)))
	}

	movies.forEach(function(m) {
		if(m.imdb_score != null && m.title_year >= minYear && m.title_year <= maxYear) //parseInt(m.movie_facebook_likes) > 100 && 
		{
			tempArr = [parseFloat(m.imdb_score), m.title_year]
			for (var i = 0; i < years; i++) {
				if(i == m.title_year - minYear)
				{
					tempArr.push(m.movie_facebook_likes)
				}
				else
				{
					tempArr.push(null)
				}
			}
			testData.push(tempArr)
		}	
	});

	//create a gradient palette using RainbowVis
    var rainbow = new Rainbow(); 
    rainbow.setNumberRange(1, years);
    rainbow.setSpectrum('darkblue', 'lightblue');


    var colorArr = []
    for (var i = 0; i < years; i++) {
    	colorArr.push(rainbow.colorAt(i))
    }

    var data = google.visualization.arrayToDataTable(testData);

        // Create a dashboard.
        var dashboard = new google.visualization.Dashboard(
            document.getElementById('dashboard_div'));

        // Create a range slider, passing some options
        var donutRangeSlider = new google.visualization.ControlWrapper({
          'controlType': 'NumberRangeFilter',
          'containerId': 'filter_div',
          'options': {
            'filterColumnLabel': 'titleyear'
          }
        });

        var viewArr = [0]
        for (var i = 0; i < years; i++) {
        	viewArr.push(i+2)
        }
        console.log(viewArr)


        // Create a pie chart, passing some options
        var scatter_chart = new google.visualization.ChartWrapper({
          'chartType': 'ScatterChart',
          'containerId': 'chart_div',
          'options': {
          	'titel': "Does a movie's Facebook likes say anything about the quality?",
            'width': 1500,
            'height': 700,
            'colors': colorArr,
            'legend': 'right',
            'hAxis': {title: 'IMDB Score', minValue: 0, maxValue: 10},
          	'vAxis': {title: 'Number of Facebook likes', minValue: 0, maxValue: 400000}
          },
          'view': {'columns': viewArr}
        });

        // Establish dependencies, declaring that 'filter' drives 'pieChart',
        // so that the pie chart will only display entries that are let through
        // given the chosen slider range.
        dashboard.bind(donutRangeSlider, scatter_chart);

        // Draw the dashboard.
        dashboard.draw(testData);    


}