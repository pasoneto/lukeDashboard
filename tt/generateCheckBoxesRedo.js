function generateCheckBoxes(classifiers, options, data, dependentVariable, labels = null, textTranslations, language, whereAppend = 'boxTop'){
  var boxTop = document.getElementById("boxTop")

  var header = document.createElement('div');
  header.setAttribute('id', 'categorySelectorHeader');

  var btnDimensionSelector = document.createElement('button');
  btnDimensionSelector.setAttribute('id', 'buttonDimensionSelector2');
  var paragraphHeader = document.createElement('p');
  if(textTranslations){
    var textHeader = textTranslations['checkboxes']['categorySelector'][language] //Header of category selector
    var buttonText = textTranslations['checkboxes']['renderGraphs'][language]
  } else {
    var textHeader = 'Category selector';
    var buttonText = 'Render graphs</button>';
  }

  paragraphHeader.innerHTML = textHeader
  btnDimensionSelector.innerHTML = buttonText
  header.appendChild(paragraphHeader)
  boxTop.appendChild(header)
  boxTop.appendChild(btnDimensionSelector)

  var checkBoxListContainer = document.createElement('div');
  checkBoxListContainer.setAttribute('id', 'checkBoxListContainer');

  for(category in classifiers){

    var classifierCode = classifiers[category]
    
    //Create label (title) of checkbox
    var labelClassifiers = document.createElement('label');
    var labelClassifierID = classifierCode + 'Label'
    labelClassifiers.setAttribute('id', labelClassifierID);
    
    //Add singleMultiple text to label (title) of checkbox
    var singleMultipleDiv = document.createElement("div");
    var singleMultipleDivID = classifierCode + "LabelSingleMultiple"
    singleMultipleDiv.setAttribute('id', singleMultipleDivID);

    if(labels && classifierCode !== dependentVariable){
      var labelText = labels[0]['classifiers'][classifierCode]
    } else {
      var labelText = classifierCode
    }
    
    //Add text and singleMultiple div to label (title)
    labelClassifiers.innerHTML = labelText
    labelClassifiers.appendChild(singleMultipleDiv)

    //Append label (title)
    checkBoxListContainer.appendChild(labelClassifiers)

    var ulElement = document.createElement('ul')
    ulElement.setAttribute('id', classifierCode)

    for(option in options[category]){ 
      //Code of currentOption
      var currentOption = options[category][option]
      var currentOptionId = currentOption + classifierCode

      var linkElement = document.createElement('li')
      var inputElement = document.createElement('input')
      inputElement.setAttribute('type', 'checkbox')
      inputElement.setAttribute('id', currentOptionId)

      linkElement.appendChild(inputElement) 

      //if labels are provided, rendered checkbox will show their names
      if(labels){
        var catItem = options[category][option].toString()
        if(labels[0]['subLabels'][classifiers[category]]){
          var allCats = Object.keys(labels[0]['subLabels'][classifiers[category]])
          var allCats = allCats.map(i=> i.toString())
        } else {
          var allCats = [{}];
        }
        if(allCats.includes(catItem)){ 
          var currentOptionText = labels[0]['subLabels'][classifierCode][currentOption]
        } else {
          var currentOptionText = currentOption 
        }
      } else {
        var currentOptionText = currentOption
      }

      //add text
      var currentOptionText = document.createTextNode(currentOptionText)
      linkElement.appendChild(inputElement) 
      linkElement.appendChild(currentOptionText)
      ulElement.appendChild(linkElement)  
    }

    checkBoxListContainer.appendChild(ulElement)
  }
  
  //Append all check boxes options and titles to boxTop
  boxTop.appendChild(checkBoxListContainer)

  //Add render button at the bottom of boxTop
  var buttonDimensionSelector = document.createElement('button')
  buttonDimensionSelector.setAttribute('id', 'buttonDimensionSelector')
  if(textTranslations){
    var buttonText = textTranslations['checkboxes']['renderGraphs'][language]
  } else {
    var buttonText = 'Render graphs'
  }

  var buttonText = document.createTextNode(buttonText)
  buttonDimensionSelector.appendChild(buttonText)
  boxTop.appendChild(buttonDimensionSelector)

  var boxSelector = document.getElementById("boxTop")
  var headerSelector = document.getElementById("categorySelectorHeader")
  dragElement(boxSelector, headerSelector);

}

