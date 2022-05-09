//Enables click on each reagion and applies arbitrary function to each region
function clickableMap(mapRegionsCode, func){
  var paths = document.getElementsByTagName("path")
  for(i in mapRegionsCode){
    paths[mapRegionsCode[i]].addEventListener("click", function(){
      func(mapRegionsCode[i])
    }, false);
  }
}

//Changes style of map by region id
function showMap(regionIDS){ 
  var paths = document.getElementsByTagName("path")
  for(k in regionIDS) {
      paths[regionIDS[k]].classList.remove('area')
      paths[regionIDS[k]].classList.add('areaAvailable')
    }
}
