//Group object into list of classifiers
function groupBy(collection, property) {
    var i = 0, val, index,
        values = [], result = [];
    for (; i < collection.length; i++) {
        val = collection[i][property];
        index = values.indexOf(val);
        if (index > -1)
            result[index].push(collection[i]);
        else {
            values.push(val);
            result.push([collection[i]]);
        }
    }
    return result;
}

//Show information about region
function showProps(e){
  if(e.target.feature.properties.name !== ''){
    window.popup = L.popup()
        .setLatLng(e.latlng) 
        .setContent(e.target.feature.properties.name)
        .openOn(map);
  }
};

//Close pop up
function closePopup(e) {
    map.closePopup(window.popup);
    window.popup = null;
}
function onEachFeature(feature, layer) {
    layer.on({
      mouseover: showProps,
      mouseout: closePopup,
      //mousemove: applyMousePositionToBox,
    });
}

