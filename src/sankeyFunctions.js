//Creates dropdown selectors for order of Sankey nodes. Classifiers are the available classifiers (vuosi_, tuotantosunta, etc...)
function sankeyControls(classifiers){
    var html = '' 
    for(j in classifiers){
      html +=  '<select class="dropdown-btn" id="dropdown-btn' + j + '" onchange="verifySankeyOrder(orderClassifiers)">'
      for(k in classifiers){
        html += '<option value="' + classifiers[k] + '">' + classifiers[k] + '</option>'
      }
      html += '</select>'
    }
    document.getElementById("dimensionSelector").innerHTML += '<div id="sankeyControler"></div>'
    document.getElementById("sankeyControler").innerHTML = html
}

//Verifies which values were selected and assigns it to the global variable orderClassifiers
function verifySankeyOrder(orderClassifiers) {
  var zero = document.getElementById("dropdown-btn0");
  var one = document.getElementById("dropdown-btn1");
  var two = document.getElementById("dropdown-btn2");

  window.orderClassifiers = [zero.options[zero.selectedIndex].value, one.options[one.selectedIndex].value, two.options[two.selectedIndex].value]
}
