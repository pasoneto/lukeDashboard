/* Expanding dataset to have all combinations of classifiers */
/*proc iml;
	run ExportDataSetToR("graf_classlabel_","graf_classlabel_"); 
	submit / R;

    graf_classlabel_ = graf_classlabel_$testColumn
    /*dfExpanded = graf_data_ %>% select(classifiers)
    dfExpanded = do.call(expand, c(list(dfExpanded), lapply(names(dfExpanded), as.symbol)))

    graf_data_ = merge(dfExpanded, graf_data_, all = T)

	  endsubmit;
run ImportDataSetFromR("graf_data_","graf_data_");
quit; */
