/* Dataset is generated here by ED's system */

/* Generates json file */
/* change directory here */
proc json out="/data/taloustohtoritulosteet/rap/json.txt" pretty;
	export graf_data_pedro / nosastags;
run;

/*labels for subclass of classifiers*/
proc json out="/data/taloustohtoritulosteet/rap/json_lab.txt" pretty;
	export graf_label_pedro1 / nosastags;
run;

/*labels for names of classifiers (e.g. vuosi_ -> Vuosi)*/
proc json out="/data/taloustohtoritulosteet/rap/json_classlab.txt" pretty;
	export graf_classlabel_pedro1 / nosastags;
run;

/* Creates first half of HTML page */
data _null_;
  /* change directory here */
	file "/data/taloustohtoritulosteet/rap/test.txt";
    put '<!DOCTYPE html>';
    put '<html lang="en">';
    put '<head>';
    put '<title>Economy doctor dashboard</title>';
    put '<meta charset="UTF-8">';
    put '<meta name="viewport" content="width=device-width, initial-scale=1">';
    put '<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">';
    put '<link rel="stylesheet" href="https://pasoneto.github.io/lukeDashboard/styles/stylesGeneral.css">';
    put '<link rel="stylesheet" href="https://pasoneto.github.io/lukeDashboard/styles/stylesMap.css">';
    put '<link rel="stylesheet" href="https://pasoneto.github.io/lukeDashboard/styles/stylesGraph.css">';
    put '<link rel="stylesheet" href="https://pasoneto.github.io/lukeDashboard/styles/stylesMobile.css">';
    put '<link rel="stylesheet" href="https://pasoneto.github.io/lukeDashboard/styles/stylesSelectors.css">';
    put '<link rel="stylesheet" href="https://pasoneto.github.io/lukeDashboard/styles/stylesBoxSelector.css">';
    put '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css" />';
    put '<script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js" integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew==" crossorigin=""></script>';
    put '<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js"></script>';
    put '<style>';
    put '</style>';
    put '</head>';

    put '<body>';

    put '<div class="header">';
    put '<h1>Economy doctor dashboard</h1>';
    put '<h3 id="title"></h3>';
    put '</div>';

    put '<!-- Box on top of everything. Selects classifiers -->';
    put '<div id="boxTop">';
    put '</div>';
    put '<!-- Box on top of everything. Selects classifiers -->';

    put '<!-- Box on top of everything. Shows graph based on map hover -->';
    put '<div id="boxTopMap">';
    put '</div>';
    put '<div id="tip-container">';
    put '<div id="popup-tip"></div>';
    put '</div>';
    put '<!-- Box on top of everything. Shows graph based on map hover -->';

    put '<div class="row">';
    put '  <div class="column statisticsSelector" id="statisticsSelector">';
    put '    Map Control';
    put '    <div id="selector-map"></div>';
    put '    <div id="mapInfo"></div>';
    put '  </div>';

    put '<div class="column dimensionSelector" id="dimensionSelector">';
    put ' Graph Control<br>';
    put '<button class="displayBoxButton" id="selectDimensionButton">Select dimensions</button>';
    put '<button id="previousDependent">< Previous dependent variable</button>';
    put '<button id="nextDependent">Next dependent variable > </button>';
    put '</div>';

    put '<div class="column mapBox" id="mapBox">';
    put '</div>';

    put '  <div class="column graphsBox" id="graphsContainer">';
    put '    Graphs';
    put '  </div>';

    put '</div>';

    put '</body>';

	  put '<script>';
	  put 'var data =';
	
run;

/* Inserts the data in json format into the HTML page */
data _null_;
  /* change directory here */
	infile "/data/taloustohtoritulosteet/rap/json.txt";
	input;
  /* change directory here */
	file "/data/taloustohtoritulosteet/rap/test.txt" mod;
	put _infile_;
run;

data _null_;
  /* change directory here */
	file "/data/taloustohtoritulosteet/rap/test.txt" mod;
	put 'var labels =';
run;

/* Inserts the labels in json format into the HTML page */
data _null_;
  /* change directory here */
  infile "/data/taloustohtoritulosteet/rap/json_lab.txt";
	input;
  /* change directory here */
	file "/data/taloustohtoritulosteet/rap/test.txt" mod;
	put _infile_;
run;

/* Adding classifier label translator */
data _null_;
  /* change directory here */
	file "/data/taloustohtoritulosteet/rap/test.txt" mod;
	put 'var classifierLabels =';
run;

/* Inserts the classlabels in json format into the HTML page */
data _null_;
  /* change directory here */
  infile "/data/taloustohtoritulosteet/rap/json_classlab.txt";
	input;
  /* change directory here */
	file "/data/taloustohtoritulosteet/rap/test.txt" mod;
	put _infile_;
run;

/* Generates the second half of the HTML page */
data _null_;
  /* change directory here */
	file "/data/taloustohtoritulosteet/rap/test.txt" mod;
	  put '</script>';
    put '<script src="https://pasoneto.github.io/lukeDashboard/tt/dataProcess.js"></script>';
    put '<script src="https://pasoneto.github.io/lukeDashboard/pxWebFunctions/fetchData.js"></script>';
    put '<script src="https://pasoneto.github.io/lukeDashboard/src/dataProcessUtils.js"></script>';
    put '<script src="https://pasoneto.github.io/lukeDashboard/pxWebFunctions/dataFilter.js"></script>';
    put '<script src="https://pasoneto.github.io/lukeDashboard/src/graphFunctions.js"></script>';
    put '<script src="https://pasoneto.github.io/lukeDashboard/src/leafLetFunctions.js"></script>';
    put '<script src="https://pasoneto.github.io/lukeDashboard/src/mapFunctions.js"></script>';
    put '<script src="https://pasoneto.github.io/lukeDashboard/src/dropdownSelection.js"></script> <!-- Renders database selector -->';
    put '<script src="https://pasoneto.github.io/lukeDashboard/src/checkBoxSelectors.js"></script> <!-- Renders database selector -->';
    put '<!--<script src="./pxWebFunctions/wrapper.js"></script>--> <!-- Complete setup and function calls -->';
    put '<script src="https://pasoneto.github.io/lukeDashboard/tt/wrap.js"></script> <!-- Complete setup and function calls -->';

    put '</html>';
run;

/* Takes all the text written by previous functions and writes it to an HTML file */
data _null_;
  /* change directory here */
	file "/data/taloustohtoritulosteet/rap/test.html";
  /* change directory here */
	infile "/data/taloustohtoritulosteet/rap/test.txt";
	input;
	put _infile_;
run;


ODS HTML CLOSE;
ODS LISTING;
data _null_;
	infile "/data/taloustohtoritulosteet/rap/test.html" truncover;
	input rivi $2000.;
	file _webout;
	put rivi;
run;
ODS HTML CLOSE;
ODS LISTING;
