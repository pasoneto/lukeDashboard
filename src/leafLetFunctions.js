function styleGen(feature, codesIn, regionDivision){
    var regionCode = feature.properties[regionDivision]
    var available = codesIn.indexOf(regionCode) == -1;
    if(available){
      return {fillColor: "#989898",
              weight: 1}
    }
}
async function loadArea(url) {
  const response = await fetch(url);
  const names = await response.json();
  return(names); 
} 

var map = L.map("mapBox", {zoomSnap: 0.1}).setView([65.3, 25], 4.7);

var baseTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
})

var baseTilePresent = false;
document.getElementById('selector-map').innerHTML = '<button id="showMap" onclick="showUnderliningMap(baseTile)">Show underlining map</button>'
function showUnderliningMap(baseTile){
  if(baseTilePresent == false){
    baseTile.addTo(map);
    document.getElementById('selector-map').innerHTML = '<button id="showMap" onclick="showUnderliningMap(baseTile)">Hide underlining map</button>'
  } else {
    document.getElementById('selector-map').innerHTML = '<button id="showMap" onclick="showUnderliningMap(baseTile)">Show underlining map</button>'
    map.removeLayer(baseTile);
  }
  window.baseTilePresent = baseTilePresent == false  
}

map.options.minZoom = 4;
var ely = 'http://geo.stat.fi/geoserver/wfs?SERVICE=wfs&version=1.0.0&request=GetFeature&srsName=EPSG:4326&outputFormat=json&typeNames=ely4500k_2022&bbox=17618.920287958812,6569276.976870834,805202.9202879588,7837692.976870834'
var municipality = 'http://geo.stat.fi/geoserver/wfs?SERVICE=wfs&version=1.0.0&request=GetFeature&srsName=EPSG:4326&outputFormat=json&typeNames=kunta4500k_2022'
var maakunta = 'http://geo.stat.fi/geoserver/wfs?SERVICE=wfs&version=1.0.0&request=GetFeature&srsName=EPSG:4326&outputFormat=json&typeNames=maakunta4500k_2022&bbox=52541.815302265575,6583732.733043339,813213.8153022656,7909316.733043339'

async function drawMap(url, regionDivision, regionsIn, statistics){

  function hoverBox(e) { //Function generates box over each hovered region

      var hiddenDiv = document.getElementById("boxTopMap")

      var layer = e.target;
      var regionHovered = e.target.feature.properties[regionDivision] //Getting current hovered region code

      //Updating external box on hover
      var regionHovered = e.target.feature.properties['name'] //Getting current hovered region code
    
      //Data is accessible here. If map region not selected, code throws error
      var currentTarget = e.target.feature.properties['data']

      if(currentTarget !== undefined){
        var stat = currentTarget.map(i=>i.value)
        console.log("I am valid")
        showBoxSelector("boxTopMap")
        //showBoxSelector("tip-container")
        //hiddenDiv.innerHTML = stat

        var group1 = window.dropdownCategories[1]
        var xAxisName1 = window.dropdownCategories[0]

        var [yAxis1, labels1] = separateDataInGroups(currentTarget, group1, checkedValues)
        var xAxis1 = window.checkedValues[xAxisName1]

        var [yAxis1, labels1] = filterNull(yAxis1, labels1)
        var [yAxis1, xAxis1, labels1] = removeNullColumns(yAxis1, xAxis1, labels1)
        
        var randomColors1 = colorGenerator(yAxis1);
        console.log(xAxis1)
        console.log(yAxis1)
        console.log(labels1)
        hiddenDiv.innerHTML = '<canvas id="box5"></canvas>'
        if(yAxis1[0].length <= 2){
          graphCustom(xAxis1, yAxis1, labels1, "box5", "bar", "Showing " + labels[0]['classifiers'][group1] + " for " + regionHovered, randomColors1)
        } else {
          graphCustom(xAxis1, yAxis1, labels1, "box5", "line", "Showing " + labels[0]['classifiers'][group1] + " for " + regionHovered, randomColors1)
        }

      }
      document.getElementById("mapInfo").innerHTML = '<br><b>' + regionHovered + '</b>'
      //End of updating external box on hover
  }
  
  function applyMousePositionToBox(e){
    var hiddenDiv = document.getElementById("boxTopMap")
    //var tip = document.getElementById("tip-container")
    if(e.target.feature.properties.data){
      x = e.containerPoint['x']
      y = e.containerPoint['y']
      hiddenDiv.style.left = x - 8 + 'px'
      hiddenDiv.style.top = y - 118 + 'px'

      //tip.style.left = x + 10 + 'px'
      //tip.style.top = y + 158 + 'px'
    }
  }

  function resetHighlight(e) {
      tilesLayer.resetStyle(e.target);

      var currentTarget = e.target.feature.properties['data']
      if(currentTarget !== undefined){
        showBoxSelector("boxTopMap")
        //showBoxSelector("tip-container")
      }
  }

  function onEachFeature(feature, layer) {
      layer.on({
        mouseover: hoverBox,
        mouseout: resetHighlight,
        mousemove: applyMousePositionToBox,
      });
       
  }
  
  //Rename TT region codes
  function renameOne(regionCode){
      if(regionCode < 10){
        return("0" + regionCode.toString())
      } else {
        return(regionCode.toString())
      }
  }

  function assignValueToGeoJsonObject(geoJSONObject, filteredDataForMap, regionDivision){
    for(i in mrc){
      var value = Object.values(filteredDataForMap).filter(k=> renameOne(k['maakunta']) == mrc[i])
      console.log(value)
      for(k in Object.values(geoJSONObject.features)){
        var regionMatches = geoJSONObject.features[k].properties[regionDivision] == mrc[i]
        if(regionMatches){ //Assign statistics value
          geoJSONObject.features[k].properties['data'] = value
        }
      }
    }
    console.log(geoJSONObject)
    return(geoJSONObject)
  }

  var tilesLayer;
  var geoJSON = await loadArea(url);
  var geoJSON = assignValueToGeoJsonObject(geoJSON, statistics, regionDivision)
  var tilesLayer = L.geoJSON(geoJSON, {
        style: function(feature){ return( styleGen(feature, regionsIn, regionDivision) )},
        onEachFeature: onEachFeature
      }).addTo(map);
}

//Removing Leaflet credits
var a = document.querySelector(".leaflet-control-container")
a.querySelector(".leaflet-control-attribution.leaflet-control").innerHTML = ""
