/* Dataset is generated here by ED's system */

/* Generates json file */
/* change directory here */
proc json out="/data/taloustohtoritulosteet/rap/json.txt" pretty;
	export graf_data_ / nosastags;
run;

/*labels for variables. Tulvarastonmuutos -> Varaston muutos  */
proc json out="/data/taloustohtoritulosteet/rap/json_lab.txt" pretty;
	export graf_label_ / nosastags;
run;


/*labels for names of classifiers (e.g. vuosi_ -> Vuosi, Tuotantosuuntaso -> Tuotantosuunta)*/
proc json out="/data/taloustohtoritulosteet/rap/json_classifierLabels.txt" pretty;
	export graf_classlabel_ / nosastags;
run;

/*labels for subclass of classifiers. So, this is subclass labels, like with maakunta: Etelä-Savo, Pohjois-Savo */
proc json out="/data/taloustohtoritulosteet/rap/json_classSubLab.txt" pretty;
	export graf_subclasslabel_ / nosastags;
run;


/* Creates first half of HTML page */
data _null_;
  /* change directory here */
	file "/data/taloustohtoritulosteet/rap/test.txt";

    put '<!DOCTYPE html>';
    put '<html lang="en">';
    put '<meta charset="UTF-8">';

    put '<head>';
    put   '<title>Luke - Economy doctor dashboard</title>';
    put   '<meta charset="UTF-8">';
    put   '<meta name="viewport" content="width=device-width, initial-scale=1">';
    put   '<!--<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">-->';
    put   '<link rel="stylesheet" href="https://pasoneto.github.io/lukeDashboard/styles/stylesGeneral.css">';
    put   '<link rel="stylesheet" href="https://pasoneto.github.io/lukeDashboard/styles/stylesMap.css">';
    put   '<link rel="stylesheet" href="https://pasoneto.github.io/lukeDashboard/styles/stylesGraph.css">';
    put   '<link rel="stylesheet" href="https://pasoneto.github.io/lukeDashboard/styles/stylesSelectors.css">';
    put   '<link rel="stylesheet" href="https://pasoneto.github.io/lukeDashboard/styles/stylesBoxSelector.css">';
    put   '<link rel="stylesheet" href="https://pasoneto.github.io/lukeDashboard/styles/checkBoxes.css">';
    put   '<link rel="stylesheet" href="https://pasoneto.github.io/lukeDashboard/styles/stylesMobile.css">';
    put   '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css"/>';
    put   '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">';
    put '</head>';

    put '<body>';
    put '</body>';

    put '</html>';

	  put '<script>';
    put 'var reportType ="';
    put &rapotsikko;
    put '"';
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
	put 'var dependentLabels =';
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
	put 'var classifierSubLabels =';
run;

/* Inserts the classlabels in json format into the HTML page */
data _null_;
  /* change directory here */
  infile "/data/taloustohtoritulosteet/rap/json_classSubLab.txt";
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
  infile "/data/taloustohtoritulosteet/rap/json_classifierLabels.txt";
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

    put '<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js"></script>';
    put '<script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js" integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew==" crossorigin=""></script>';
    put '<script src="https://pasoneto.github.io/lukeDashboard/src/generateHTMLstructure.js"></script>';
    put '<script src="https://pasoneto.github.io/lukeDashboard/tt/dataProcess.js"></script>';
    put '<script src="https://pasoneto.github.io/lukeDashboard/src/dataProcessUtils.js"></script>';
    put '<script src="https://pasoneto.github.io/lukeDashboard/src/graphFunctions.js"></script>';
    put '<script src="https://pasoneto.github.io/lukeDashboard/src/leafLetFunctions.js"></script>';
    put '<script src="https://pasoneto.github.io/lukeDashboard/src/mapFunctions.js"></script>';
    put '<script src="https://pasoneto.github.io/lukeDashboard/src/dropdownSelection.js"></script>';
    put '<script src="https://pasoneto.github.io/lukeDashboard/src/shareFunctions.js"></script>';
    put '<script src="https://pasoneto.github.io/lukeDashboard/src/checkBoxSelectors.js"></script>';
    put '<script src="https://pasoneto.github.io/lukeDashboard/tt/wrap.js"></script>';

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
