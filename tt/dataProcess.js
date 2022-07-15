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

//Function receives object and changes its key to fit with system keys
//filters object to keep only keys with value
//Output is a dictionary of codes and its labels. Used for sub-classifier labels
function renameKeys(object, classifierLabel){
  var oldKeys = Object.keys(object)
  var newKeys = oldKeys.map(i => i.replace('r', ''))
  for(k in oldKeys){
    delete Object.assign(object, {[newKeys[k]]: object[oldKeys[k]] })[oldKeys[k]];
  }
  object['code'] = classifierLabel
  object['-1'] = 'Keskiarvo' //Add labels that don't extis from ED
  var object = Object.entries(object).filter(([key, value]) => value !== "");
  var object = Object.fromEntries(object);
  return(object)
}

//For each classifier, creates a dictionary of sub classifier labels
function mergeLabelsObject(classifiers, classifierSubLabels){
  var json = {}
  for (let k = 0; k < classifiers.length; k++) {
    var ob = renameKeys(classifierSubLabels[k], classifiers[k])
    json[classifiers[k]] = ob
  }
  return(json)
}

//Function translates value -1 to its label (because this does not come from ED's backend)
function averageSubClass(i){if(i === -1){return('Keskiarvo')}else{return(i)}}

//Shuffle array
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
