source("/Users/pdealcan/Documents/github/sabara/code/utils.R")
library(tidyr)
library(dplyr)

df = read.csv("./dataCSV.csv", header = TRUE)

classifiers = c("vuosi_", "maakunta", "omaluok")
dfExpanded = df %>% select(classifiers)
dfExpanded = do.call(expand, c(list(dfExpanded), lapply(names(dfExpanded), as.symbol)))

df %>% 
  group_by(omaluok) %>%
  summarise(vuosi_ = length(unique(vuosi_)),
            maakunta = length(unique(maakunta)))

dfExpanded %>%
  group_by(omaluok) %>%
  summarise(vuosi_ = length(unique(vuosi_)),
            maakunta = length(unique(maakunta)))

mergedDF = merge(dfExpanded, df, all = T) 

mergedDF %>%
  group_by(omaluok) %>%
  summarise(vuosi_ = length(unique(vuosi_)),
            maakunta = length(unique(maakunta)))
