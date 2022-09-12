Chart.plugins.register({
   beforeInit: function(chart) {
      try{
        var data = chart.data.datasets[0].data;
        var isAllZero = data.reduce((a, b) => a + b) > 0 ? false : true;
      } catch{
        console.log("All null")
      }
      if (!isAllZero) return;
      // when all data values are zero...
      chart.data.datasets[0].data = data.map((e, i) => i > 0 ? 0 : 1); //add one segment
      chart.data.datasets[0].backgroundColor = '#d2dee2'; //change bg color
      chart.data.datasets[0].borderWidth = 0; //no border
      chart.options.tooltips = false; //disable tooltips
   }
});

