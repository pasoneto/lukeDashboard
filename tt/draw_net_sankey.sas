/* Dataset is generated here by ED's system */

/* Generates json file */
filename jsonout1 "json.txt" encoding="utf-16be";
proc json out=jsonout1 pretty;
	export graf_data_ / nosastags;
run;

/* /data/taloustohtoritulosteet/rap/ */

/*labels for variables. Tulvarastonmuutos -> Varaston muutos  */
filename jsonout2 "json_lab.txt" encoding="utf-16be";
proc json out=jsonout2 pretty;
	export graf_label_ / nosastags;
run;

/*labels for names of classifiers (e.g. vuosi_ -> Vuosi, Tuotantosuuntaso -> Tuotantosuunta)*/
filename jsonout3 "json_classifierLabels.txt" encoding="utf-16be";
proc json out=jsonout3 pretty;
	export graf_classlabel_ / nosastags;
run;

/*labels for subclass of classifiers. So, this is subclass labels, like with maakunta: Etelä-Savo, Pohjois-Savo */
filename jsonout4 "json_classSubLab.txt" encoding="utf-16be";
proc json out=jsonout4 pretty;
	export graf_subclasslabel_ / nosastags;
run;

/* Creates first half of HTML page */
data _null_;
  /* change directory here */
	file "test.txt";

    put '<!DOCTYPE html>';
    put '<html lang="en">';
    put '<meta charset="UTF-8">';

    put '<head>';
      put '<script src="https://unpkg.com/smartdasher@1.1.9/dist/bundle.js">';

      put '<script src="./customFunctions/customFunctions.js"></script>';
      put '<script src="./dataProcess.js"></script>';

      put '<script src="https://pasoneto.github.io/lukeDashboard/pxWebFunctions/dataFilter.js"></script>';
      put '<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js"></script>';
      put '<script src="https://cdn.anychart.com/releases/8.11.0/js/anychart-core.min.js"></script>';
      put '<script src="https://cdn.anychart.com/releases/8.11.0/js/anychart-sankey.min.js"></script>';
      put '<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>';
      put '<meta charset="UTF-8">';
      put '<link rel="stylesheet" href="https://unpkg.com/smartdasher@1.1.2/dist/main.css"> <!--NEW-->';
    put '</head>';

    put '<body>';
    put '</body>';

	  put '<script>';
	  put 'var data =';
run;

/* Inserts the data in json format into the HTML page */
data _null_;
  /* change directory here */
	infile "json.txt";
	input;
  /* change directory here */
	file "test.txt" mod;
	put _infile_;
run;

data _null_;
  /* change directory here */
	file "test.txt" mod;
	put 'var dependentLabels =';
run;

/* Inserts the labels in json format into the HTML page */
data _null_;
  /* change directory here */
  infile "json_lab.txt";
	input;
  /* change directory here */
	file "test.txt" mod;
	put _infile_;
run;

/* Adding classifier label translator */
data _null_;
  /* change directory here */
	file "test.txt" mod;
	put 'var classifierSubLabels =';
run;

/* Inserts the classlabels in json format into the HTML page */
data _null_;
  /* change directory here */
  infile "json_classSubLab.txt";
	input;
  /* change directory here */
	file "test.txt" mod;
	put _infile_;
run;

/* Adding classifier label translator */
data _null_;
  /* change directory here */
	file "test.txt" mod;
	put 'var classifierLabels =';
run;

/* Inserts the classlabels in json format into the HTML page */
data _null_;
  /* change directory here */
  infile "json_classifierLabels.txt";
	input;
  /* change directory here */
	file "test.txt" mod;
	put _infile_;
run;

/* Generates the second half of the HTML page */
data _null_;
  /* change directory here */
	file "test.txt" mod;

	  put '</script>';
    put '<script src="https://pasoneto.github.io/lukeDashboard/tt/sankey/sankeyFunctions.js"></script>';

    put '</html>';
run;

/* Takes all the text written by previous functions and writes it to an HTML file */
data _null_;
  /* change directory here */
	file "test.html";
  /* change directory here */
	infile "test.txt";
	input;
	put _infile_;
run;

ODS HTML CLOSE;
ODS LISTING;
data _null_;
	infile "test.html" truncover;
	input rivi $2000.;
	file _webout;
	put rivi;
run;
ODS HTML CLOSE;
ODS LISTING;
