function documentAppender(element, html){
	var div = document.createElement('div');
	div.innerHTML = html;
	while (div.children.length > 0) {
	    element.appendChild(div.children[0]);
	}
}

async function initiateDashboard(renderMap = false, directory = '../'){
	var bodyHTML = '<div class="header" id="header">'+
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
              '<button class="displayBoxButton" id="selectDimensionButton" onclick=showBoxSelector("boxTop")>Select dimensions</button>'+
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

	documentAppender(document.body, bodyHTML)

  if(renderMap === false){
    document.getElementById("graphsContainer").style.width = '100vw'
    document.getElementById("dimensionSelector").style.width = '100vw'
  }

  console.log("Rendered all boxes")
}

//nMulticlassClassifiers is the length of the output from function pickMultiClassCategories
//Function renders spaces for 3 graphs if multiclass, and space for 1 graph if single class
function renderGraphBoxes(nMulticlassClassifiers, map=true){
  var html = ''
  if(nMulticlassClassifiers == 2){
    html += '<div class="row" id="mainGraphs">'+
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
    htmlPieCharts += '<div class="column graphBox3" id="box' + i + '">'+
                     '<canvas id="myChart' + i + '"></canvas>'+
                     '</div>'
  }
  document.getElementById("pieChartsContainer").innerHTML = htmlPieCharts
}

//Initiate html of TT
async function initiateDashboardTT(title, logo, renderMap = false, directory = '.', flipperButton = true, sourceText){

  var bodyHTML = '<body>'+
      '<div class="header" id="header">'+
        '<img id="logo" src="' + logo + '">'+
        '<div id="title">' + title + '</div>'+
      '</div>'+

      '<!-- Box on top of everything. Selects classifiers -->'+
      '<div id="boxTop">'+
      '</div>'+
      '<!-- Box on top of everything. Selects classifiers -->'

  if(renderMap){
    bodyHTML += '<!-- Box on top of everything. Shows graph based on map hover -->'+
      '<div id="boxTopMap">'+
      '</div>'+
      '<div id="tip-container">'+
        '<div id="popup-tip"></div>'+
      '</div>'+
      '<!-- Box on top of everything. Shows graph based on map hover -->'+

      '<div class="row">'+
        '<div class="column statisticsSelector" id="statisticsSelector">'+
           'Map Control'+
          '<div id="selector-map"></div>'+
          '<div id="mapInfo">Hover over map</div>'+
      '</div>'
  }
  bodyHTML += '<div class="column dimensionSelector" id="dimensionSelector">'+
                '<button class="displayBoxButton" id="selectDimensionButton" onclick=showBoxSelector("boxTop")><i class="fa fa-filter" aria-hidden="true"></i> Filter</button>'

  if(flipperButton){
    bodyHTML += '<button id="previousDependent"><i class="fa fa-arrow-circle-left"></i> Previous</button>'+
                '<button id="nextDependent">Next <i class="fa fa-arrow-circle-right"></i></button>'
  }

  bodyHTML += '<button id="shareDashboardButton" onclick=shareDashboard("url")>Share URL<i class="fa fa-share-alt" aria-hidden="true"></i></button>'+
              '<button onclick=shareDashboard("embed")>Embed URL<i class="fa fa-share-alt" aria-hidden="true"></i></button>'+
              '</div>'
    //'<div id="selectedVariables"></div>'

  if(renderMap){
    bodyHTML += '<div class="column mapBox" id="mapBox">'+
                '</div>'
  }

  bodyHTML += '<div class="column graphsBox" id="graphsContainer">'+
          'Graphs'+
        '</div>'+
      '</div>'

  bodyHTML += '<div id="footer"><div id="footerText">Source: ' + sourceText + '</div></div>'

	documentAppender(document.body, bodyHTML)

  if(renderMap === false){
    document.getElementById("graphsContainer").style.width = '100vw'
    document.getElementById("dimensionSelector").style.width = '100vw'
    if(document.getElementById("graphSingleBox") !== null){
      document.getElementsByClassName("graphSingleBox").style.width = '100vw'
    }
  }
  console.log("Rendered all boxes")
}
