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
