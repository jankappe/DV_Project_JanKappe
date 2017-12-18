google.charts.load('current', {'packages':['scatter', 'corechart', 'controls']});
document.getElementById('timeCheckbox').checked = true;
//google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(initialDraw);

document.getElementById('timeCheckbox').addEventListener( 'change', function() {
    redrawChart()
});

function initialDraw()
{
  drawChart(true, 0)
}

function drawChart(facebookEra, minimumVotes) {
	var minYear = 2005
	var maxYear = 2017
  if(!facebookEra)
  {
    minYear = 1970
  }
  var years = maxYear - minYear

  var columnData = new google.visualization.DataTable();
  columnData.addColumn('number', 'IMDB Score');
  columnData.addColumn('number', "Facebook likes")
  columnData.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}})
  columnData.addColumn({type: 'string', role: 'style'} );
  columnData.addColumn('number', "Title Year")
  columnData.addColumn('string', "Title")

  var rainbow = new Rainbow(); 
  rainbow.setNumberRange(1, years);
  rainbow.setSpectrum('darkblue', 'lightblue');


  var colorArr = []
  for (var i = 0; i < years; i++) {
    colorArr.push(rainbow.colorAt(i))
  }

  movies.forEach(function(m) {
    if(m.imdb_score != null && m.title_year >= minYear && m.title_year <= maxYear && m.num_voted_users >= minimumVotes) 
    {
      var tempArr = [parseFloat(m.imdb_score), 
                     m.movie_facebook_likes, 
                     "<div style='margin: 10px'><font size='3'><b>" + m.movie_title + "</b>" + "<br>Title year: <b>" + m.title_year + "</b><br>Facebook likes: <b>" + m.movie_facebook_likes + "</b><br>IMDB score: <b>" + m.imdb_score + "</b><br>Number of votes: <b>" + m.num_voted_users + "</b></font></div>", 
                     'point {size: 5; fill-color: #' + rainbow.colorAt(m.title_year-minYear),
                     m.title_year,
                     String(m.movie_title)]
      
      columnData.addRow(tempArr)
    } 
  });


  var dashboard = new google.visualization.Dashboard(
  document.getElementById('dashboard_div'));

  var timeSlider = new google.visualization.ControlWrapper({
      'controlType': 'NumberRangeFilter',
      'containerId': 'filter_div',
      'options': {
        'filterColumnLabel': 'Title Year',
        'ui': {
          'format': {pattern:'####'},
          'label': "Filter by year of release"
        }
      }
  });

  var stringFilter = new google.visualization.ControlWrapper({
      'controlType': 'StringFilter',
      'containerId': 'string_filter',
      'options': {
        'matchType': 'any',
        'filterColumnLabel': 'Title',
        'ui': {
          'label': 'Search movies by title'
        }
      }
  });

      var scatter_chart = new google.visualization.ChartWrapper({
          'chartType': 'ScatterChart',
          'containerId': 'chart_div',
          'options': {
            'width': 1200,
            'height': 550,
            'tooltip': {
              'isHtml': true
            },
            'chartArea': {'width': '85%', 'height': '80%'},
            'dataOpacity': 0.8,
            'legend': 'none',
            'hAxis': {title: 'IMDB Score', minValue: 0, maxValue: 10},
            'vAxis': {title: 'Number of Facebook likes', minValue: 0, maxValue: 400000},
          },
          'view': {'columns': [0,1,2,3]}
    });


    var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));

    var view = new google.visualization.DataView(columnData);


    dashboard.bind(timeSlider, scatter_chart)
    dashboard.bind(stringFilter, scatter_chart)

    dashboard.draw(view) 

}

function redrawChart()
{
  var facebookEra = document.getElementById('timeCheckbox').checked;
  var minimumVotes = document.getElementById("minimum").value;

  drawChart(facebookEra, minimumVotes)

}