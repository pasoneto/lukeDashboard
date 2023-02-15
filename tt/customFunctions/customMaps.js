//Model JSON
var geoModel = {
  "type": "FeatureCollection",
  "features": [],
  "totalFeatures": '',
  "numberMatched": '',
  "numberReturned": '',
  "timeStamp": "2022-08-30T21:57:56.647Z",
  "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:EPSG::4326" } }, 
  "bbox": []
}

var tilesLayer; //Define another tile layer (not on use)
var popup; //Define global popup layer

function assignValueToGeoJsonObject(geoJSONObject, filteredDataForMap, regionDivision){
  var groupedData = _.groupBy(filteredDataForMap, regionDivision)
  var features = geoJSONObject.features
  for(k in features){
    geoJSONObject.features[k].properties = groupedData[features[k].properties.code]
  }
  return geoJSONObject
}

function segmentRegions(coordinatesFile, regionDivision){

  var um = groupBy(regionsAll, regionDivision) 
  var um = um.map(i=> groupBy(i, "SEGMENT"))

  var segmentedRegions = []
  var segmentedRegionsProps = []

  for(mkunta in um){
    var segments = []
    for(sgment in um[mkunta]){
      var coords = []
      for(coordinate in um[mkunta][sgment]){
        var x = um[mkunta][sgment][coordinate]['x']
        var y = um[mkunta][sgment][coordinate]['y']
        coords.push([x, y])
      }
      segments.push([coords])
    }
    segmentedRegions.push(segments)
    var props = {name: um[mkunta][0][0]['alue'], code: um[mkunta][0][0][regionDivision]}
    segmentedRegionsProps.push(props)
  }
  return [segmentedRegions, segmentedRegionsProps]
}

function featureGenerator(segmentedRegions, segmentedRegionsProps){
    var allFeatures = [] 
    for(k in segmentedRegions, segmentedRegionsProps){
      var featurePrototype = {"type": "Feature", "id": "", "geometry": { "type": "MultiPolygon", "coordinates": [] }, "geometry_name": "geom", "properties": {} }
      featurePrototype['geometry']['coordinates'] = segmentedRegions[k]
      featurePrototype['properties'] = segmentedRegionsProps[k]
      allFeatures.push(featurePrototype)
    }
    return(allFeatures)
}

function generateGeoJSON(geoModel, allFeatures){
  geoModel['features'] = allFeatures
  return(geoModel)
}

function styleGen(feature){
    var properties = feature.properties
    if(properties){
      var regionCode = properties[0][regionDivision]
      var selectedRegions = window.checkedValues[regionDivision]
      var regionWasSelected = selectedRegions.indexOf(regionCode.toString()) !== -1
      if(regionWasSelected){
        return {weight: 2}
      } else {
        return {fillColor: "lightblue",
                weight: 1}
      }
    } else {
      return {fillColor: "gray",
              weight: 1}
    }
}
function getColor(d, quantList) {
    if(d <= quantList[0]){
      return("#DAF7A6")
    }
    if(d <= quantList[1] && d > quantList[0]){
      return("#FFC300")
    }
    if(d <= quantList[2] && d > quantList[1]){
      return("#FF5733")
    }
    if(d <= quantList[3] && d > quantList[2]){
      return("#C70039")
    }
    if(d <= quantList[4] && d > quantList[3]){
      return("#900C3F")
    }
    if(d <= quantList[5] && d > quantList[4]){
      return("#581845")
    }
}

const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length

// sort array ascending
const asc = arr => arr.sort((a, b) => a - b);
const sum = arr => arr.reduce((a, b) => a + b, 0);
const mean = arr => sum(arr) / arr.length;

// sample standard deviation
const std = (arr) => {
    const mu = mean(arr);
    const diffArr = arr.map(a => (a - mu) ** 2);
    return Math.sqrt(sum(diffArr) / (arr.length - 1));
};

const quantile = (arr, q) => {
    const sorted = asc(arr);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
};

function styleGenColors(feature){
    var properties = feature.properties
    if(properties){
      var regionCode = properties[0][regionDivision]
      var selectedRegions = window.checkedValues[regionDivision]
      var regionWasSelected = selectedRegions.indexOf(regionCode.toString()) !== -1

      //Setting up colors for each region
      var currentRegionProperties = filteredData.filter(i => i[regionDivision] == regionCode)
      var currentRegionValues = currentRegionProperties.map(i => i.value)
      var currentRegionValues = currentRegionValues.filter(Number) //Removing null values
      
      var allValues = filteredData.map(i => i.value) //Getting all values for all regions selected
      var allValues = allValues.filter(Number) //Filtering nulls
      
      var quantilesList = [0.2, 0.4, 0.6, 0.7, 0.8] //Sets the boundaries in terms of 7 quantiles
      var quantilesCalculated = quantilesList.map(i => quantile(allValues, i))

      var currentValueReg = arrAvg(currentRegionValues)
      
      var quantilesList = [0, 0.2, 0.4, 0.6, 0.7, 0.8] //Sets the boundaries in terms of 7 quantiles
      window.legend = L.control({position: 'bottomright'});
      legend.onAdd = function (map) {
          var div = L.DomUtil.create('div', 'info legend')
          var grades = ["#DAF7A6", "#FFC300", "#FF5733", "#C70039", "#900C3F"]
          // loop through our density intervals and generate a label with a colored square for each interval
          for(var i=0; i<grades.length; i++) {
              div.innerHTML +=
              '<i style="background:' + grades[i] + '; color:' + grades[i] + '">A</i>     ' + Math.round(quantilesCalculated[i]) + '<br>';
          }
          return div;
      };

      if(regionWasSelected){
        return {fillColor: getColor(currentValueReg, quantilesCalculated),
                color: 'white', 
                weight: 0.5}
      } else {
        return {fillColor: "gray",
                color: 'white', 
                weight: 1}
      }
    } else {
      return {fillColor: "gray",
              color: 'white', 
              weight: 1}
    }
}

//Manipulate size of the map
function openNav() {

  window.expanded = window.expanded == false;
  console.log(window.expanded)

  if(window.expanded == true){
    document.getElementById("graphsContainer").style.display = 'none'
    document.getElementById("mapBox").style.width = "100vw";
    document.getElementById("mapBox").style.height = "76vh";

    setTimeout(function(){ 
      wrapMap(regionDivision, zoom + 0.35)
    }, 300);

    var expandMapDiv = document.querySelector('.expandMap')
    expandMapDiv.innerHTML = "<"

  } else {
    document.getElementById("graphsContainer").style.display = ''
    document.getElementById("mapBox").style.width = "20vw";
    document.getElementById("mapBox").style.height = "";

    setTimeout(function(){ 
      wrapMap(regionDivision, zoom)
    }, 300);

  }

}

function closeNav() {
}

//Global variable indicating if map shoul or should not be presented in expanded form 
var expanded = false;
var showNames = false;

//Show information about region
function showProps(e, labels, regionDivision){
  if(e.target.feature.properties !== 'undefined'){
    if(labels){
      var regionCode = e.target.feature.properties[0][regionDivision]
      var regionLabel = labels[0]['subLabels'][regionDivision][regionCode]
    } else {
      var regionLabel = e.target.feature.properties[0][regionDivision]
    }
    info.update(regionLabel);
    //document.getElementById("showRegionHover").innerHTML = regionLabel
    //window.popup = L.popup({autoPan: false})
    //.setLatLng(e.latlng) 
    //.setContent(regionLabel)
    //.openOn(map);
  }
};

//Close pop up
function closePopup(e) {
    map.closePopup(window.popup);
    window.popup = null;
}

//Select single region
function selectRegion(feature, regionDivision){
  var a = document.getElementById(regionDivision)
  var a = Array.from(a.getElementsByTagName("input"))
  for(k in a){
    if(a[k].checked === true){
      a[k].click()
    }
  }
  for(k in a){
    var regionCode = feature.target.feature.properties[0][regionDivision] + regionDivision
    if(a[k].id === regionCode){
      a[k].click()
    }
  }
  completeWrap() 
  SmartDasher.displayNonGraphs(window.filteredData, whereToAppend = "graphsContainer", textTranslations, language)
}

function onEachFeature(feature, layer) {
    layer.on({
      mouseover: function(feature){showProps(feature, labels, regionDivision)},
      mouseout: closePopup,
      click: function(feature){selectRegion(feature, regionDivision)}
      //mousemove: applyMousePositionToBox,
    });
}

function onEachFeatureWithNames(feature, layer) {
    layer.on({
      mouseover: function(feature){showProps(feature, labels, regionDivision)},
      mouseout: closePopup,
      click: function(feature){selectRegion(feature, regionDivision)}
      //mousemove: applyMousePositionToBox,
    });
    
    //Adding region names
    if(feature.properties){
      var regionCode = feature.properties[0][regionDivision]
      var nameRegionLabel = labels[0]['subLabels'][regionDivision][regionCode]
      layer.bindTooltip("<span style='font-size:10px'>" + nameRegionLabel + "</span>", {
        className: "label",
        permanent: true,
        direction: "center"
      }).openTooltip();
    }
}

async function wrapMap(regionDivision, zoom){
  
  window.map.remove()
  window.map = L.map("mapBox", {zoomSnap: 0.1, crs: crs}).setView(centering, zoom);

  var [segmentedRegions, segmentedRegionsProps] = segmentRegions(regionsAll, regionDivision)
  var allFeatures = featureGenerator(segmentedRegions, segmentedRegionsProps)

  var geoJSON = generateGeoJSON(geoModel, allFeatures)
  var geoJSON = assignValueToGeoJsonObject(geoJSON, window.data, regionDivision)

  //console.log(geoJSON)

  info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
      this.update();
      return this._div;
  };
  // method that we will use to update the control based on feature properties passed
  info.update = function (prop) {
      this._div.innerHTML = (prop ? prop : '');
  };
  info.addTo(map);
  
  if(window.expanded){
    if(showNames){
      L.geoJson(geoJSON, {
          onEachFeature: onEachFeatureWithNames,
          style: styleGenColors,
        }).addTo(map);
      window.legend.addTo(map);
    } else {
      L.geoJson(geoJSON, {
          onEachFeature: onEachFeatureWithNames,
          style: styleGen,
        }).addTo(map);
    }
  } else {
      L.geoJson(geoJSON, {
          onEachFeature: onEachFeature,
          style: styleGen,
        }).addTo(map);
  }

  //Creating map extension box
  var expandMapDiv = L.DomUtil.create('div', 'expandMap');
  var mapTypeDiv = L.DomUtil.create('div', 'mapType');
  var controlDivs = document.querySelector(".leaflet-control-zoom.leaflet-bar.leaflet-control")

  controlDivs.append(expandMapDiv);
  if(window.expanded){
    controlDivs.append(mapTypeDiv);
  }

  mapTypeDiv.innerHTML = "i"

  if(window.expanded){
    expandMapDiv.innerHTML = "<"
  } else {
    expandMapDiv.innerHTML = ">"
  }

  expandMapDiv.onclick = function(){
    openNav()    
  }

  mapTypeDiv.onclick = function(){
    window.showNames = window.showNames == false;
    wrapMap(regionDivision, zoom)
  }

}

function fillMapSelection(checkedValues, whereAppend, labels, textTranslations){
  var availableYears = checkedValues['vuosi_']
  var html = ''
  for(k in availableYears){
    html += '<a href="#">' + labels[0]['subLabels']['vuosi_'][availableYears[k]] + '</a>'
  }
  document.getElementById(whereAppend).innerHTML = html
}






