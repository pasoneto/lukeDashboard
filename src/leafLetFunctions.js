const script = document.createElement('script');
const script2 = document.createElement('script');
const script3 = document.createElement('script');

script.setAttribute(
  'src',
  'https://unpkg.com/leaflet@1.6.0/dist/leaflet.js',
);
script2.setAttribute(
  'src',
  'https://cdn.rawgit.com/aparshin/leaflet-boundary-canvas/f00b4d35/src/BoundaryCanvas.js">',
);
script3.setAttribute(
  'src',
  "https://cdn.rawgit.com/aparshin/leaflet-boundary-canvas/f00b4d35/src/BoundaryCanvas.js",
);

document.head.appendChild(script);
document.head.appendChild(script2);
document.head.appendChild(script3);


//<link rel="stylesheet" href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css" />
//<script src="https://cdn.rawgit.com/aparshin/leaflet-boundary-canvas/f00b4d35/src/BoundaryCanvas.js"></script>
  
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
  console.log(names)
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
      var layer = e.target;
      var regionHovered = e.target.feature.properties[regionDivision] //Getting current hovered region code
      
      //Updating external box on hover
      var regionHovered = e.target.feature.properties['name'] //Getting current hovered region code
      var stat = e.target.feature.properties['population'] //Getting current hovered region code
      console.log(e.target.feature.properties)
      document.getElementById("mapInfo").innerHTML = '<br><b>' + regionHovered + '</b><br>' +
                                                     '<b>Population:</b>  ' + stat
      //End of updating external box on hover

      var available = regionsIn.indexOf(regionHovered) != -1;
      if(available){
        layer.setStyle({
            weight: 4,
            fillOpacity: 0.5
        });
      }
      //Some browsers do not support this
      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          layer.bringToFront();
      }
  }

  function resetHighlight(e) {
      tilesLayer.resetStyle(e.target);
  }

  function onEachFeature(feature, layer) {
      layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
      });
  }
  
  function assignValueToGeoJsonObject(geoJSONObject, statistics, regionDivision){
    var reCodes = Object.keys(statistics)
    for(i in reCodes){
      var value = statistics[reCodes[i]]
      for(k in Object.values(geoJSONObject.features)){
        var regionMatches = geoJSONObject.features[k].properties[regionDivision] == reCodes[i]
        if(regionMatches){ //Assign statistics value
          geoJSONObject.features[k].properties['population'] = value
        }
      }
    }
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
