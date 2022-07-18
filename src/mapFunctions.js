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

//Filters data. Change function to make it more abstract
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
  graphCustom(xAxis1, yAxis1, labels1, "myChart5", 'line', labels1[0], ["#00ff0080"], showLegend = false, fill = true)

}

function changePositionBasedOnMouse(elementID, whereApply){
  var el = document.querySelector(elementID)
  var hiddenDiv = document.getElementById(whereApply)
  el.addEventListener('mousemove', e => {
    x = e.clientX;
    y = e.clientY;
    hiddenDiv.style.left = x + 10 + 'px'
    hiddenDiv.style.top = y - 150 + 'px'
  });
}

//Function applies filter hover to list of map regions and shows map box on hover
//i is the element gotten from getElementById, or getElementByTagName 
function applyFunctionMap(i, mapRegionsCode, filteredDataForMap, whereShow){
  if(mapRegionsCode.indexOf(i.id) !== -1){
    i.onmouseover = function(){
      changePositionBasedOnMouse(i.id, whereShow)
      showBoxSelector("boxTopMap")
      //filterHoverMap(Number(i.id), filteredDataForMap)
    }
    i.onmouseout = function(){
      showBoxSelector("boxTopMap")
    }
  }
}
//Tuki alue / Subsidy region: a, b, c1, c2, c2p, c3, c4
//
