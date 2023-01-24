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

//Show information about region
function showProps(e, labels, regionDivision){
  if(e.target.feature.properties !== 'undefined'){
    console.log(e.target.feature.properties[0][regionDivision])
    if(labels){
      var regionCode = e.target.feature.properties[0][regionDivision]
      var regionLabel = labels[0]['subLabels'][regionDivision][regionCode]
    } else {
      var regionLabel = e.target.feature.properties[0][regionDivision]
    }
    console.log(e)
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

async function wrapMap(regionDivision){
  
  window.map.remove()
  window.map = L.map("mapBox", {zoomSnap: 0.1}).setView(centering, zoom);

  var [segmentedRegions, segmentedRegionsProps] = segmentRegions(regionsAll, regionDivision)
  var allFeatures = featureGenerator(segmentedRegions, segmentedRegionsProps)

  var geoJSON = generateGeoJSON(geoModel, allFeatures)
  var geoJSON = assignValueToGeoJsonObject(geoJSON, window.data, regionDivision)

  console.log(geoJSON)

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

  L.geoJson(geoJSON, {
      onEachFeature: onEachFeature,
      style: styleGen,
    }).addTo(map);
}

function fillMapSelection(checkedValues, whereAppend, labels, textTranslations){
  var availableYears = checkedValues['vuosi_']
  var html = ''
  for(k in availableYears){
    html += '<a href="#">' + labels[0]['subLabels']['vuosi_'][availableYears[k]] + '</a>'
  }
  document.getElementById(whereAppend).innerHTML = html
}






