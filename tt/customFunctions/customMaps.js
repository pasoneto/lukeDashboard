//Model JSON
var geoJSON = {
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
    var regionName = feature.properties.name
    var available = regionName !== ''
    if(available === true){
      return {weight: 2}
    } else {
      return {fillColor: "gray",
              weight: 1}
    }
}
