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

document.getElementsByTagName("head")[0].insertAdjacentHTML(
  'beforeend',
  '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css" />',
);

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function reshapeJSON(data, classifiers){
  var additionalClassifiers = Object.keys(data[0]).filter(i => classifiers.indexOf(i) == -1)
  var reshaped = []
  for(k in additionalClassifiers){
    for(i in data){
      categoryReshaped = {}
      categoryReshaped['dependentVariable'] = additionalClassifiers[k]
      categoryReshaped['value'] = data[i][additionalClassifiers[k]]
      for(j in classifiers){
        categoryReshaped[classifiers[j]] = data[i][classifiers[j]]
      }
    reshaped.push(categoryReshaped)
    }
  }
  return(reshaped)
}

//Filter values from reshapedJSON output to match only checked values from checkboxes
function filterDataByCheckBoxSelectorTT(categories, data, checkedValues){
  var filteredData = data
  for(k in categories){
    var selectedCategories = window.checkedValues[categories[k]]
    if(selectedCategories.length > 0){
      var filteredData = filteredData.filter(i => selectedCategories.indexOf(i[categories[k]].toString()) !== -1)
    }
  }
  return(filteredData)
}
  
//Selects only categories which received 2 or more checks in checkboxes
function pickMultiClassCategories(checkedValues, categories, whereStore){
  window.dropdownCategories = []
  for(k in categories){
    var nChecks = window.checkedValues[categories[k]].length
    if(nChecks > 1){
      window.whereStore.push(categories[k])
    }
  }
}

//Renames map regions
function renameMapRegions(fData){
  //Extracting map regions that exist in data
  var mapRegionsCode = fData.map(i => i['maakunta']).filter(onlyUnique)
  //Reformat region codes to match with maping codes
  mrc = []
  for(k in mapRegionsCode){
    if(mapRegionsCode[k] < 10){
      mrc.push("0" + mapRegionsCode[k].toString())
    } else {
      mrc.push(mapRegionsCode[k].toString())
    }
  }
  return mrc
}
