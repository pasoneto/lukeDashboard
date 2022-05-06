//Renders database selection
var optionNames = ["Green house gass emission",
                   "Vegetables grown in the open",
                   "Agricultural enterprises",
                   "Crop yiealds"]

var options = ['http://statdb.luke.fi/PXWeb/api/v1/en/LUKE/08%20Indikaattorit/02%20Ilmastonmuutos/02%20Maatalouden%20kasvihuonekaasupäästöt/01_Maatal_kasvihuonekaasupaastot.px',
               'http://statdb.luke.fi/PXWeb/api/v1/en/LUKE/02%20Maatalous/04%20Tuotanto/20%20Puutarhatilastot/05_Vihannesviljely_avomaa_kokonaistuotanto.px',
               'http://statdb.luke.fi/PXWeb/api/v1/en/LUKE/02%20Maatalous/02%20Rakenne/02%20Maatalous-%20ja%20puutarhayritysten%20rakenne/01_Maatalous_ja_puutarhayrit_lkm_ELY.px',
               'http://statdb.luke.fi/PXWeb/api/v1/en/LUKE/02%20Maatalous/04%20Tuotanto/14%20Satotilasto/01_Viljelykasvien_sato.px']

//Rendering selector for database
var optionIDS = ['Database']
dropDownSelection('dropdown-btn', options, optionNames, optionIDS, 'statisticsSelector', nRuns = 1)

//Adding event listener for database selector
var dataBaseSelector = document.getElementById('Database')
dataBaseSelector.addEventListener('change', async function() {

  var url = checkSelected('Database')
  console.log(url)

  //Add base data call here, which will determine optionIDS below
  var categories = ['Year', 'Region', 'Size']
  var optionsYear = ['2010', '2011', '2012', '20']
  var optionsRegion = ['USA', 'FIN', 'CAN']
  var optionsSize = ['Small', 'Medium', 'Big']
  var options = [optionsYear, optionsRegion, optionsSize]

  //Generate checkbox inside button
  generateCheckBoxes(categories, options, 'boxTop')

  //Add function to hide selection box to the click of button inside dimension selection box
  document.getElementById("buttonDimensionSelector").onclick = function(){showBoxSelector("boxTop")}
  //Add function to hide selection box to the click of Select Dimension button
  document.getElementById("selectDimensionButton").onclick = function(){showBoxSelector("boxTop")} 

  //Creates empty object with category keys
  var checkedValues = checkedValuesObjectGenerator(categories)
  var allCheckBoxes = document.querySelectorAll('input');

  establishInitial(allCheckBoxes, categories, checkedValues)

  //Initiate map
  var mapRegionsCode = ['01', '02', '03', '04', '05', '10']
  clickableMap(mapRegionsCode, alert)
  showMap(mapRegionsCode)

});




