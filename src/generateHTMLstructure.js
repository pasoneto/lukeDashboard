function documentAppender(element, html){
	var div = document.createElement('div');
	div.innerHTML = html;
	while (div.children.length > 0) {
	    element.appendChild(div.children[0]);
	}
}

async function initiateDashboard(renderMap = false){
	var headHTML = '<title>Example dashboard</title>'+
				'<meta charset="UTF-8">'+
				'<meta name="viewport" content="width=device-width, initial-scale=1">'+
				'<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">'+
				'<link rel="stylesheet" href="../styles/stylesGeneral.css">'+
				'<link rel="stylesheet" href="../styles/stylesMap.css">'+
				'<link rel="stylesheet" href="../styles/stylesGraph.css">'+
				'<link rel="stylesheet" href="../styles/stylesMobile.css">'+
				'<link rel="stylesheet" href="../styles/stylesSelectors.css">'+
				'<link rel="stylesheet" href="../styles/stylesBoxSelector.css">'+
				'<link rel="stylesheet" href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css" />'+
				'<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">'+
				'<script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js" integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew==" crossorigin=""></script>'+
				'<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js"></script>'

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
                '<div id="tip-container">'+
                '<div id="popup-tip"></div>'+
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
              'Graphs'+
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
