function documentAppender(element, html){
	var div = document.createElement('div');
	div.innerHTML = html;
	while (div.children.length > 0) {
	    element.appendChild(div.children[0]);
	}
}

function initiateDashboard(){
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
				'</div>'+

				'<!-- Box on top of everything. Shows graph based on map hover -->'+
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
				'</div>'+

				'<div class="column dimensionSelector" id="dimensionSelector">'+
				'Graph Control<br>'+
				'<button class="displayBoxButton" id="selectDimensionButton">Select dimensions</button>'+
				'<button id="previousDependent">< Previous dependent variable</button>'+
				'<button id="nextDependent">Next dependent variable > </button>'+
				'<div id="selectedVariables"></div>'+
				'</div>'+

				'<div class="column mapBox" id="mapBox">'+
				'</div>'+

				'<div class="column graphsBox" id="graphsContainer">'+
				'Graphs'+
				'</div>'+
				'</div>'+

				{/* <script src="./tt/data.js"></script> */}
				{/* <script src="./tt/dataProcess.js"></script> */}
				{/* <script src="./src/dataProcessUtils.js"></script> */}
				{/* <script src="./pxWebFunctions/fetchData.js"></script> */}
				{/* <script src="./pxWebFunctions/dataFilter.js"></script> */}
				'<script src="./src/graphFunctions.js"></script>'+
				'<script src="./src/leafLetFunctions.js"></script>'+
				'<script src="./src/mapFunctions.js"></script>'+
				'<script src="./src/dropdownSelection.js"></script> <!-- Renders database selector -->'+
				'<script src="./src/checkBoxSelectors.js"></script> <!-- Renders database selector -->'

	documentAppender(document.head, headHTML)
	documentAppender(document.body, bodyHTML)
}