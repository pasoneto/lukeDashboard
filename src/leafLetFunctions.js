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


async function drawMap(url, regionDivision, regionsIn, statistics){

  function highlightFeature(e) {

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
        showBoxSelector("tip-container")
        hiddenDiv.innerHTML = stat
      }
      document.getElementById("mapInfo").innerHTML = '<br><b>' + regionHovered + '</b>'
      //End of updating external box on hover
  }
  
  function applyMousePositionToBox(e){
    var hiddenDiv = document.getElementById("boxTopMap")
    var tip = document.getElementById("tip-container")
    if(e.target.feature.properties.data){
      x = e.containerPoint['x']
      y = e.containerPoint['y']
      hiddenDiv.style.left = x - 10 + 'px'
      hiddenDiv.style.top = y + 'px'

      tip.style.left = x + 10 + 'px'
      tip.style.top = y + 158 + 'px'
    }
  }

  function resetHighlight(e) {
      tilesLayer.resetStyle(e.target);

      var currentTarget = e.target.feature.properties['data']
      if(currentTarget !== undefined){
        showBoxSelector("boxTopMap")
        showBoxSelector("tip-container")
      }
  }

  function onEachFeature(feature, layer) {
      layer.on({
        mouseover: highlightFeature,
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

//var statistics = {"148": 1000, "698": 2000 }
//var regionsIn = ["148", "698"]
//drawMap(municipality, 'kunta', regionsIn, statistics)

//Removing Leaflet credits
var a = document.querySelector(".leaflet-control-container")
a.querySelector(".leaflet-control-attribution.leaflet-control").innerHTML = ""
