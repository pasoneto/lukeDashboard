//Enables click on each reagion and applies arbitrary function to each region
function clickableMap(mapRegionsCode, func){
  for(i in mapRegionsCode){
    document.getElementById(mapRegionsCode[i]).addEventListener("click", function(){
      func("oi")
    }, false);
  }
}

//Changes style of map by region id
function showMap(regionIDS){ 
  for(k in regionIDS) {
      document.getElementById(regionIDS[k]).classList.remove('area')
      document.getElementById(regionIDS[k]).classList.add('areaAvailable')
    }
}
