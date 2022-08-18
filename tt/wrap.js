//var headHTML = '<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">'
//var div = document.createElement('div');

//div.innerHTML = headHTML;
//while (div.children.length > 0) {
  //document.head.appendChild(div.children[0]);
  //}

var textTranslations = {
  selectors: {
    filter: {fin: "Valitse ryhmä", swd: "Välj grupp", eng: "Select Group"},
    previous: {fin: "Edellinen", swd: "Tidigare", eng: "Previous"},
    next: {fin: "Seuraava", swd: "Nästa", eng: "Next"}, 
    shareURL: {fin: "Jaa URL", swd: "Dela URL", eng: "Share URL"}, 
    embedURL: {fin: "Upota URL", swd: "Bädda in URL", eng: "Embed URL"},
    backToTable: {fin: "Takaisin taulukkoon", swd: "Tillbaka till tabel", eng: "Back to table"},
    backToSelection: {fin: "Takaisin valintaan", swd: "Tillbaka till urval", eng: "Back to selection"},
    messageSingle: {fin: ["Yksi valitsin", "Jos haluat valita lisää kohteita tästä luokasta, valitse vain yksi kohde seuraavista luokista: "], 
                    swd: ["Enda väljare", "Om du vill välja fler värden från denna kategori, välj bara ett värde från följande kategorier: "], 
                    eng: ["Single selector", "If you want to select more values from this category, select only one value from the following categories: "]},
  },
  checkboxes: {
    categorySelector: {fin: "Ryhmän valinta", swd: "Gruppval", eng: "Group Selection"},
    renderGraphs: {fin: "Piirrä graafit", swd: "Rita graferna", eng: "Draw graphs"},
    singleSelector: {fin: "Valitse vain yks", swd: "Välja endast en", eng: "Select only one"},
    multipleSelector: {fin: "Voit valita monta", swd: "Du kan välja många", eng: "You can select several"},
    all: {fin: "Vaihda", swd: "Förända", eng: "Change"},
  },
  source: {
    source: {fin: "Lähde: <a href='https://portal.mtt.fi/portal/page/portal/taloustohtori/'>Taloustohtori</a>", 
             swd: "Källa: <a href='https://portal.mtt.fi/portal/page/portal/ekonomidoktorn/'>Ekonomidoktorn</a>",
             eng: "Source: <a href='https://portal.mtt.fi/portal/page/portal/economydoctor/'>Economy Doctor</a>"},
  },
  noGraphs: {
    sorryNoData: {fin: "Anteeksi, valitettavasti tälle valinnalle ei ole tietoja", 
                  swd: "Tyvärr, det finns ingen data för detta val", 
                  eng: "Sorry, there is no data for this selection"},
    pleaseTryDifferent: {fin: "Ole hyvä ja kokeile toista muuttujien yhdistelmää", 
                         swd: "Prova en annan kombination av variabler", 
                         eng: "Please, try a different combination of variables"},
  }
}

//Initiate Map object
var renderMap = false

if(kieli === 1){
  var language = 'fin'
  var logoURL = 'https://portal.mtt.fi/portal/page/portal/taloustohtori/Kuvat/Luke-taloustohtori-200x150px_1.png'
}
if(kieli === 2){
  var language = 'swd'
  var logoURL = 'https://portal.mtt.fi/portal/page/portal/taloustohtori/Kuvat/Luke-ekonomidoktorn-213x150px.png'
}
if(kieli === 3){
  var language = 'eng'
  var logoURL = 'https://portal.mtt.fi/portal/page/portal/taloustohtori/Kuvat/Luke-economydoctor-213x150px.png'
}

initiateDashboardTT(title = '', logo = logoURL, renderMap = renderMap, directory = '.', flipperButton = true, textTranslations, language)

//URLs to fetch map data
var ely = 'http://geo.stat.fi/geoserver/wfs?SERVICE=wfs&version=1.0.0&request=GetFeature&srsName=EPSG:4326&outputFormat=json&typeNames=ely4500k_2022&bbox=17618.920287958812,6569276.976870834,805202.9202879588,7837692.976870834'
var municipality = 'http://geo.stat.fi/geoserver/wfs?SERVICE=wfs&version=1.0.0&request=GetFeature&srsName=EPSG:4326&outputFormat=json&typeNames=kunta4500k_2022'
var maakunta = 'http://geo.stat.fi/geoserver/wfs?SERVICE=wfs&version=1.0.0&request=GetFeature&srsName=EPSG:4326&outputFormat=json&typeNames=maakunta4500k_2022&bbox=52541.815302265575,6583732.733043339,813213.8153022656,7909316.733043339'
var suuralue = 'http://geo.stat.fi/geoserver/wfs?SERVICE=wfs&version=1.0.0&request=GetFeature&srsName=EPSG:4326&outputFormat=json&typeNames=suuralue4500k_2022&bbox=-13897.244162771385,6486387.218574781,914028.2558372286,7927801.468574781'

//determines the region division
//if(Object.keys(data[0]).includes('maakunta')){
  //var mapURL = maakunta
  //var mapDivision = 'maakunta'
  //} else if(Object.keys(data[0].includes('suuralue'))){
    //var mapURL = suuralue
    //var mapDivision = 'suuralue'
    //}

//Initiating global variables
var filteredDataForMap;
var filteredData;
var multiClassClassifiers;
var map;
var reportType = reportType.slice(0, -1) //Remove empty space from report type

//Extracting classifiers from ED file classifierLabels
var classifiers = Object.keys(classifierLabels[0])

//Reshaping json object from wide to long format
var data = reshapeJSON(data, classifiers)

//Merging labels into one object
var allLabels = mergeLabelsObject(classifiers, classifierSubLabels)
allLabels["dependentVariable"] = dependentLabels[0]
classifierLabels[0]['dependentVariable'] = reportType
var labels = [{"dependentVariable": dependentLabels[0], "classifiers": classifierLabels[0], "subLabels": allLabels}]

//Function translates value -1 to its label (because this does not come from ED's backend)
function _averageSubClass(i){if(i === -1){return('Keskiarvo')}else{return(i)}}

//Extracting classifiers and options
var classifiers = Object.keys(data[0])
var classifiers = classifiers.filter(i => i !== 'value')
var options = []
for(k in classifiers){
  var a = data.map(i=>i[classifiers[k]])
  var a = a.filter(onlyUnique)
  var a = a.filter(i => {return i !== "N" && i !== 'eyelain' && i !== 'otos'});
  options.push(a)
}
var options = options.filter(i=> i[0] !== undefined)

//Manually extracting classifiersAndOptions because I want to remove N, Eyelain, and Otos
var classifiersAndOptions = {}
for(k in classifiers){
  var a = data.map(i=>i[classifiers[k]])
  var a = a.filter(onlyUnique)
  var a = a.filter(i => {return i !== "N" && i !== 'eyelain' && i !== 'otos'});
  classifiersAndOptions[classifiers[k]] = a
}

//Generate checkbox inside hidden div
generateCheckBoxes(classifiers, options, data, '', labels, textTranslations, language)

//if(renderMap){
  //document.getElementById('selector-map').innerHTML = '<button id="showMap" onclick="showUnderliningMap(baseTile)">Show underlining map</button>'
  //}

//Add function to show checkboxes div
document.getElementById("selectDimensionButton").onclick = function(){showBoxSelector("boxTop")}

//Once data has been fetched and checkboxes created, Select dimension button will receive the following functions
var buttonsRenderGraph = document.querySelectorAll(`[id^="buttonDimensionSelector"]`)
//Applying render function to these buttons
for(k in buttonsRenderGraph){
  buttonsRenderGraph[k].onclick = function(){
    showBoxSelector("boxTop") //Hide box with checkboxes
    showBoxSelector("dimmer") //Hide box with checkboxes
    completeWrap() 
    displayNonGraphs(window.filteredData, whereToAppend = "graphsContainer", textTranslations, language)
  }
}

//Add back function to show checkboxes div
document.getElementById("selectDimensionButton").onclick = function(){
  showBoxSelector("boxTop")
  showBoxSelector("dimmer") //Hide box with checkboxes
}

//Creates empty object with category keys
var checkedValues = checkedValuesObjectGenerator(classifiers)

//Establishes checkbox verification system. Multiple or single selection
checkBoxVerificationSystem(classifiers, checkedValues, data, filterDataByCheckBox, exception = "dependentVariable", textTranslations = textTranslations) //Value is written inside the global variable checkedValues

function completeWrap(){
  //Verifies if user chose at least one options for each classifier. If not, random assignment is made
  verifyAllClassifiersChecked(checkedValues)

  //Selects classifiers which will be used as group and xAxis  
  pickMultiClassClassifiers(checkedValues, classifiers)

  var nMulticlassClassifiers = window.multiClassClassifiers.length

  //For when there are 2 milticlass classifier
  if(nMulticlassClassifiers == 2){

    renderGraphBoxes(nMulticlassClassifiers, renderMap)

    var group1 = window.multiClassClassifiers[1]
    var group2 = window.multiClassClassifiers[0]

    var xAxisName1 = window.multiClassClassifiers[0]
    var xAxisName2 = window.multiClassClassifiers[1]

    window.filteredDataForMap = filterDataByCheckBox(classifiers, data, window.checkedValues)

    var [yAxis1, labels1] = separateDataInGroups(window.filteredData, group1, checkedValues)
    var [yAxis2, labels2] = separateDataInGroups(window.filteredData, group2, checkedValues)
    
    var xAxis1 = window.checkedValues[xAxisName1]
    var xAxis2 = window.checkedValues[xAxisName2]

    //Filtering null and missing values
    var [yAxis1, xAxis1, labels1] = nullsOut(yAxis1, xAxis1, labels1)
    var [yAxis2, xAxis2, labels2] = nullsOut(yAxis2, xAxis2, labels2)
    //End of filtering null and missing values

    //Translating subClassifier codes to labels
    var xAxis1 = xAxis1.map(i => labels[0]['subLabels'][xAxisName1][i])
    var xAxis2 = xAxis2.map(i => labels[0]['subLabels'][xAxisName2][i])

    var labels1 = labels1.map(i => labels[0]['subLabels'][group1][i])
    var labels2 = labels2.map(i => labels[0]['subLabels'][group2][i])

    var group1Label = labels[0]['classifiers'][group1]
    var group2Label = labels[0]['classifiers'][group2]

    //Display single variable names
    var singleLabels = singleLabelExtractor(window.checkedValues, labels)
    //displaySelectedSingleVariables(window.checkedValues, exception = "dependentVariable", labels)

    var singleClassifiers = Object.keys(singleLabels)
    var singleOptions = Object.values(singleLabels)
    
    var title1 = ''
    for(m in singleClassifiers){
      title1 += '<b>' + singleClassifiers[m] + '</b>' + ': ' + '<i>' + singleOptions[m] + '</i>' + '    '
    }
    var title1 = title1.slice(0, -2)

    document.getElementById('selectedVariables').innerHTML = title1

    graphCustom(xAxis1, yAxis1, labels1, "myChart", "line", '', showLegend = true)
    graphCustom(xAxis2, yAxis2, labels2, "myChart1", "bar", '', showLegend = true)

    //Rendering up to 3 pieCharts
    var pieColors = colorGenerator(xAxis1)
    var htmlPieCharts = '';

    var nPieCharts = Math.min(yAxis1.length, 3)
    generatePieChartsContainers(nPieCharts)

    for (var i = 2; i < Math.min(yAxis1.length, 3)+2; i++){
      //var all0 = yAxis1[i-2].every(i => i === 0)
      graphCustomPie(xAxis1, yAxis1[i-2], "myChart" + i, "doughnut", labels1[i-2], pieColors)
    }

  } 
  
  ///////For when there is only 1 milticlass classifier
  if(nMulticlassClassifiers == 1) {

    renderGraphBoxes(nMulticlassClassifiers, renderMap)

    var group1 = window.multiClassClassifiers[0]
    var xAxisName1 = classifiers.filter(i=>i !== group1)[0]

    window.filteredDataForMap = filterDataByCheckBox(classifiers, data, window.checkedValues)

    var [yAxis1, labels1] = separateDataInGroups(window.filteredData, group1, checkedValues)

    var xAxis1 = window.checkedValues[xAxisName1]

    //Filtering null and missing values
    var [yAxis1, xAxis1, labels1] = nullsOut(yAxis1, xAxis1, labels1)
    
    //End of filtering null and missing values
    
    //Translating subClassifier codes to labels
    var xAxis1 = xAxis1.map(i => labels[0]['subLabels'][xAxisName1][i])
    var labels1 = labels1.map(i => labels[0]['subLabels'][group1][i])
    var group1Label = labels[0]['classifiers'][group1]

    //Display single variable names
    var singleLabels = singleLabelExtractor(window.checkedValues, labels)
    var singleClassifiers = Object.keys(singleLabels)
    var singleOptions = Object.values(singleLabels)

    var title1 = ''
    for(m in singleClassifiers){
      title1 += '<b>' + singleClassifiers[m] + '</b>' + ': ' + singleOptions[m] + '    '
    }
    var title1 = title1.slice(0, -1)

    document.getElementById('selectedVariables').innerHTML = title1

    graphCustom(labels1, [yAxis1.map(i=> i[0])], '', "myChart", 'line', '', showLegend=false)
    
    //Rendering up to 3 pieCharts
    var pieColors = colorGenerator(labels1)

    var nPieCharts = Math.min(yAxis1.length, 3)
    generatePieChartsContainers(2)
 
    //Define position of legend based on number of classifiers
    if(labels1.length >= 15){
      var position = 'right'
    } else {
      var position = 'bottom'
    }
    graphCustom(xAxis1, yAxis1, labels1, "myChart3", 'bar', '', position=position)
    graphCustomPie(labels1, yAxis1.map(i=>i[0]), "myChart2", "doughnut", 'Proportions', pieColors, legend=true, position=position)

  } if(nMulticlassClassifiers < 1) {
    
    renderGraphBoxes(nMulticlassClassifiers, renderMap)

    var group1 = classifiers[0]
    var xAxisName1 = classifiers[1]

    window.filteredDataForMap = filterDataByCheckBox(classifiers, data, window.checkedValues)

    var [yAxis1, labels1] = separateDataInGroups(window.filteredData, group1, checkedValues)

    var xAxis1 = window.checkedValues[xAxisName1]

    //Filtering null and missing values
    var [yAxis1, xAxis1, labels1] = nullsOut(yAxis1, xAxis1, labels1)
    //End of filtering null and missing values

    //Translating subClassifier codes to labels
    var xAxis1 = xAxis1.map(i => labels[0]['subLabels'][xAxisName1][i])
    var labels1 = labels1.map(i => labels[0]['subLabels'][group1][i])

    //Display single variable names
    var singleLabels = singleLabelExtractor(window.checkedValues, labels)
    var singleClassifiers = Object.keys(singleLabels)
    var singleOptions = Object.values(singleLabels)

    var title1 = ''
    for(m in singleClassifiers){
      title1 += '<b>' + singleClassifiers[m] + '</b>' + ': ' + singleOptions[m] + '    '
    }
    var title1 = title1.slice(0, -1)

    document.getElementById('selectedVariables').innerHTML = title1

    graphCustom(xAxis1, yAxis1, labels1, "myChart", 'bar', '')

  }
  if(renderMap){
    //Getting only region codes that exist in data
    var mrc = renameMapRegions(filteredDataForMap);
    drawMap(mapURL, mapDivision, mrc, filteredDataForMap, map, zoom = 4.7, centering = [65.3, 25], labels)
  }
}

//If user is entering for the first time, random selection is done.
//Otherwise, if the page has url parameters, page will render the selection previously made
var urlCheckBoxes = checkBoxesFromUrl() //Does the url have checkbox parameters?
if(urlCheckBoxes === false){ //If no, run random simulation of elements
  //Selecting two multiclass classifiers
  var multi = ["vuosi_"]; //Vuosi is always present, so we pick this as one multiclassifier
  var classifiersNoVuosi = classifiers.filter(i=>i !== "vuosi_" && i !== "dependentVariable")
  var randomElement = classifiersNoVuosi[Math.floor(Math.random() * classifiersNoVuosi.length)];
  multi.push(randomElement)

  //Establishing the single classifiers
  var single = classifiers.filter(i => multi.includes(i) == false)
  if(classifiers.length == 2){
    multi = ["vuosi_"]
  }

  //Running click simulation
  simulateSelection(multi, single)
  singleCheck('dependentVariable', 0)
  completeWrap()
  displayNonGraphs(window.filteredData, whereToAppend = "graphsContainer", textTranslations, language)

} else { //If yes, check checkboxes according to the parameters of the urlCheckBoxes
  hideSelectors() //If user intends to embed url, there will be a parameter called embed. If embed is true, headers and selectors will be hiden for compactness.
  var checkKeys = Object.keys(urlCheckBoxes)
  for(l in checkKeys){
    targetCheck(checkKeys[l], urlCheckBoxes[checkKeys[l]])
  }
  completeWrap()
  displayNonGraphs(window.filteredData, whereToAppend = "graphsContainer", textTranslations, language)
}

//Establishing initial state of dependentVariable click box
var currentCheck = checkedValues['dependentVariable']
var dependentIndex = classifiersAndOptions['dependentVariable'].indexOf(currentCheck[0])

document.getElementById("nextDependent").onclick = function(){
  nextDependent(classifiersAndOptions, true, window.dependentIndex, "dependentVariable")
  completeWrap()
  displayNonGraphs(window.filteredData, whereToAppend = "graphsContainer", textTranslations, language)
}
document.getElementById("previousDependent").onclick = function(){
  nextDependent(classifiersAndOptions, false, window.dependentIndex, "dependentVariable")
  completeWrap()
  displayNonGraphs(window.filteredData, whereToAppend = "graphsContainer", textTranslations, language)
}
//tulostus=1&dim1paataso=1&dim1alataso=18,19,02,21&nayta=2.dimensio&dim2paataso=13&dim2alataso=1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21&nayta=3.dimensio&dim3paataso=79&dim3alataso=1,5,6
document.getElementById("goBackSelection").onclick = function(){
  javascript:history.go(-2);
  //var urlParameters = new URLSearchParams(window.location.search);
  //var parameters = ['tulostus', 'dim1paataso', 'dim1alataso', 'nayta=2.dimensio', 'dim2paataso', 'dim2alataso', 'nayta=3.dimensio', 'dim3paataso', 'dim3alataso']
  //var filteredParams = ''
  //for(i in parameters){
    //var parameterValue = urlParameters.get(parameters[i])
    //if(parameterValue !== null){
      //filteredParams += parameters[i] + '=' + parameterValue + '&'
      //} else {
        //if(parameters[i] === 'nayta=2.dimensio' || parameters[i] === 'nayta=3.dimensio'){
          //filteredParams += parameters[i] + '&'
          //}
        //else{
          //filteredParams += parameters[i] + '=&'
          //}
        //}
    //}
  //var newLink = 'http://tykhe.mtt.fi:8090/portal/page/portal/taloustohtori/maatalouskehitys/omat_valinnat/taulukko/?' + filteredParams
  //var newLink = newLink.slice(0, -1)
  //console.log(newLink)
  //location.href = newLink 
}

//Changing button displays and functions
var button1 = document.getElementById("shareDashboardButton")
var button2 = document.getElementById("embed")
var button3 = document.getElementById("goBackSelection")

button1.innerHTML = textTranslations['selectors']['backToSelection'][language] + ' <i class="fa fa-hand-o-left" aria-hidden="true"></i>'
button2.style.display = "none"
button3.innerHTML = textTranslations['selectors']['backToTable'][language] + ' <i class="fa fa-hand-o-left" aria-hidden="true"></i>'

button1.onclick = function(){
  javascript:history.go(-2);
}
button3.onclick = function(){
  javascript:history.go(-1);
}

function buttonQuestion(){
  var multiClassChosen = window.multiClassClassifiers.map(i=>labels[0]['classifiers'][i])
  var messageTitle = textTranslations['selectors']['messageSingle'][language][0]
  var messageBody = textTranslations['selectors']['messageSingle'][language][1]
  messageBody += multiClassChosen[0] + ' / ' + multiClassChosen[1]
  Swal.fire(messageTitle, messageBody);
}

try{
  var buttonHowTo = document.getElementById("howToButton")
  buttonHowTo.onclick = function(){
    buttonQuestion()
  }
} catch{
  console.log("No single selector")
}



//Changing styles locally
document.getElementById("header").style.background = "#ffffff"
document.getElementById("header").style.padding = '0'
document.getElementById("dimensionSelector").style.background = "#ffffff"
document.getElementById("dimensionSelector").style.alignItems = 'start'
document.getElementById("dimensionSelector").style.margin = '0'
document.getElementsByTagName("body")[0].style.background = 'white'

