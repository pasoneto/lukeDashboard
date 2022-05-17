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

//Filters data
function filterHoverMap(region, filteredData){
  var mapCheckedValues = window.checkedValues
  mapCheckedValues["maakunta"] = [region]

  var group1 = window.dropdownCategories[1]
  var xAxisName1 = window.dropdownCategories[0]

  var [yAxis1, labels1] = separateDataInGroups(filteredDataForMap.filter(i=>i['maakunta'] == region), group1, mapCheckedValues)
  console.log(labels1)
  var xAxis1 = mapCheckedValues[xAxisName1]

  var box5 = document.getElementById("box5")
  box5.innerHTML = '<canvas id="myChart5"></canvas>'
  graphCustom(xAxis1, yAxis1, labels1, "myChart5", 'line', labels1[0], ["#0E6251"], showLegend = false)

}
