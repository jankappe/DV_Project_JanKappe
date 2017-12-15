google.charts.load('current', {'packages':['scatter', 'corechart', 'controls']});
//google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);


function drawChart() {
	var minYear = 2005
	var maxYear = 2017
  var years = maxYear - minYear

  var columnData = new google.visualization.DataTable();
  columnData.addColumn('number', 'IMDB Score');
  columnData.addColumn('number', "Likes")
  columnData.addColumn({type: 'string', role: 'tooltip'});
  columnData.addColumn({type: 'string', role: 'style'} );

  var rainbow = new Rainbow(); 
  rainbow.setNumberRange(1, years);
  rainbow.setSpectrum('darkblue', 'lightblue');


  var colorArr = []
  for (var i = 0; i < years; i++) {
    colorArr.push(rainbow.colorAt(i))
  }

  movies.forEach(function(m) {
    if(m.imdb_score != null && m.title_year >= minYear && m.title_year <= maxYear) 
    {
      var tempArr = [parseFloat(m.imdb_score), 
                     m.movie_facebook_likes, 
                     m.movie_title + "\nTitle year: " + m.title_year + "\nFacebook likes: " + m.movie_facebook_likes + "\nIMDB score: " + m.imdb_score, 
                     'point {size: 5; fill-color: #' + rainbow.colorAt(m.title_year-minYear)]
      
      columnData.addRow(tempArr)
    } 
  });

  console.log(columnData)

  var formatter = new google.visualization.NumberFormat(
    {pattern:'####'});

	//create a gradient palette using RainbowVis

        var options = {
            width: 1200,
            height: 550,
            tooltip: {
              isHtml: true
            },
            chartArea: {width: '80%', height: '90%'},
            dataOpacity: 0.8,
            legend: 'none',
            hAxis: {title: 'IMDB Score', minValue: 0, maxValue: 10},
            vAxis: {title: 'Number of Facebook likes', minValue: 0, maxValue: 400000},
          }

        var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));

        chart.draw(columnData, options);  


}