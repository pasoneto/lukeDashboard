function documentAppender(element, html){
	var div = document.createElement('div');
	div.innerHTML = html;
	while (div.children.length > 0) {
	    element.appendChild(div.children[0]);
	}
}

async function initiateDashboard(renderMap = false, directory = null){
	var headHTML = '<title>Example dashboard</title>'+
				'<meta charset="UTF-8">'+
				'<meta name="viewport" content="width=device-width, initial-scale=1">'+
				'<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">'
  
  //If user chooses to work from a different directory
  if(directory){
    headHTML += '<link rel="stylesheet" href="' + directory + '/styles/stylesGeneral.css">'+
				'<link rel="stylesheet" href="' + directory + '/styles/stylesMap.css">'+
				'<link rel="stylesheet" href="' + directory + '/styles/stylesGraph.css">'+
				'<link rel="stylesheet" href="' + directory + '/styles/stylesMobile.css">'+
				'<link rel="stylesheet" href="' + directory + '/styles/stylesSelectors.css">'+
				'<link rel="stylesheet" href="' + directory + '/styles/stylesBoxSelector.css">'
  } else {
    headHTML += '<link rel="stylesheet" href="../styles/stylesGeneral.css">'+
				'<link rel="stylesheet" href="../styles/stylesMap.css">'+
				'<link rel="stylesheet" href="../styles/stylesGraph.css">'+
				'<link rel="stylesheet" href="../styles/stylesMobile.css">'+
				'<link rel="stylesheet" href="../styles/stylesSelectors.css">'+
				'<link rel="stylesheet" href="../styles/stylesBoxSelector.css">'
  }
  headHTML += 
				'<link rel="stylesheet" href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css" />'+
				'<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">'+
				'<script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js" integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew==" crossorigin=""></script>'

	var bodyHTML = '<div class="header">'+
				'<h1>Initial dashboard</h1>'+
				'<div id="title"></div>'+
				'</div>'+

				'<!-- Box on top of everything. Selects classifiers -->'+
				'<div id="boxTop">'+
				'</div>'

  if(renderMap){
    bodyHTML += '<!-- Box on top of everything. Shows graph based on map hover -->'+
                '<div id="boxTopMap">'+
                '</div>'+
                '<div class="row">'+
                '<div class="column statisticsSelector" id="statisticsSelector">'+
                  'Map Control'+
                '<div id="selector-map"></div>'+
                '<div id="mapInfo"></div>'+
                '</div>'
  }

  bodyHTML += '<div class="column dimensionSelector" id="dimensionSelector">'+
              'Graph Control<br>'+
              '<button class="displayBoxButton" id="selectDimensionButton">Select dimensions</button>'+
              '<div id="selectedVariables"></div>'+
              '</div>'

  if(renderMap){
    bodyHTML += '<div class="column mapBox" id="mapBox">'+
                '</div>'
  }

  bodyHTML += '<div class="column graphsBox" id="graphsContainer">'+
                '<div id="noGraphContainer">'+
                  '<div id="noGraph" onclick=showBoxSelector("boxTop")>'+
                  '<div id="textNoGraph">'+
                    '<p><i class="fa fa-info-circle" style="margin-right: 10px" aria-hidden="true"></i>'+
                      'Select dimensions to render the graphs</p>'+
                    '</p>'+
                  '</div>'+
                '</div>'+
                '</div>'+
              '</div>'

	documentAppender(document.head, headHTML)
	documentAppender(document.body, bodyHTML)
  if(renderMap === false){
    document.getElementById("graphsContainer").style.width = '100vw'
    document.getElementById("dimensionSelector").style.width = '100vw'
  }
  console.log("Rendered all boxes")
}

//nMulticlassClassifiers is the length of the output from function pickMultiClassCategories
//Function renders spaces for 3 graphs if multiclass, and space for 1 graph if single class
function renderGraphBoxes(nMulticlassClassifiers){
  if(nMulticlassClassifiers == 2){
    html = '<div class="row">'+
                 '<div class="column graphBox" id="box">'+
                   '<canvas id="myChart"></canvas>'+
                   '</div>'+
                   '<div class="column graphBox" id="box1">'+
                   '<canvas id="myChart1"></canvas>'+
                   '</div>'+
                 '</div>'+
                 '<div class="row" id="pieChartsContainer">'+
                   '<div class="column graphBox3" id="box2"></div>'+
                   '<div class="column graphBox3" id="box3"></div>'+
                   '<div class="column graphBox3" id="box4"></div>'+
                 '</div>'+
                 '</div>'
  } else {
    html = '<div class="row">'+
              '<div class="graphSingleBox" id="box">'+
              '<canvas id="myChart"></canvas>'+
              '</div>'+
           '</div>'
  }
  document.getElementById("graphsContainer").innerHTML = html
}

function generatePieChartsContainers(nPieCharts){
  var htmlPieCharts = '';
  for (var i = 2; i < nPieCharts+2; i++){
    if(nPieCharts == 3){
      var dimensionGraph = '32.35%'
    }
    if(nPieCharts == 2){
      var dimensionGraph = '49%'
    }
    if(nPieCharts == 1){
      var dimensionGraph = '98%'
    }
    htmlPieCharts += '<div class="column graphBox3" style="width:' + dimensionGraph + '" id="box' + i + '">'+
                     '<canvas id="myChart' + i + '"></canvas>'+
                     '</div>'
  }
  document.getElementById("pieChartsContainer").innerHTML = htmlPieCharts
}
