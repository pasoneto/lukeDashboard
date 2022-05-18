library("dplyr")
library("data.table")
library("ggplot2")

df = fread("./housing.csv")
df2 = fread("./housing.csv")

df$rooms = "2 rooms"
df2$rooms = "1 room"

df$value = df$value - rnorm(length(df$rooms), 2, 0.2)

df = bind_rows(df, df2)
df2 = df
df$sauna = "With sauna"
df2$sauna = "Without sauna"

df$value = df$value + rnorm(length(df$rooms), 0, 0.3)

df = bind_rows(df, df2)

df2 = df
df$balcony = "With balcony"
df2$balcony = "Without balcony"

df$value = df$value + rnorm(length(df$rooms), 1, 0.1)

df = bind_rows(df, df2)

#Overall
df %>%
  filter(region == "wholecontry") %>%
  filter(sauna == "With sauna") %>%
  filter(balcony == "With balcony") %>%
  filter(subsidy == "nonSubsidised") %>%
  summarise(price = mean(value)) %>%
  ggplot(aes(x = "2015-2021", y = price, fill = as.factor(0)))+
    geom_point(stat = "identity", width= 0.5) +
    xlab("") +
    ylab("eur/"~m^2) +
    theme(legend.position="none")

ggsave("./1.png")

#With years
df %>%
  filter(region == "wholecontry") %>%
  filter(subsidy == "nonSubsidised") %>%
  filter(balcony == "With balcony") %>%
  filter(sauna == "With sauna") %>%
  filter(rooms == "1 room") %>%
  group_by(years) %>%
  summarise(price = mean(value)) %>%
  ggplot(aes(x = years, y = price))+
    geom_point() +
    geom_path()+
    xlab("")

ggsave("./2.png")

#With regions
df %>%
  filter(subsidy == "nonSubsidised") %>%
  filter(rooms == "1 room") %>%
  filter(balcony == "With balcony") %>%
  filter(sauna == "With sauna") %>%
  ggplot(aes(x = years, y = value, color = region))+
    geom_point() +
    geom_path()+
    xlab("")+
    ylab("eur/"~m^2)

ggsave("./3.png")

#With rooms
df %>%
  filter(region != "wholecontry") %>%
  filter(subsidy == "nonSubsidised") %>%
  filter(balcony == "With balcony") %>%
  filter(sauna == "With sauna") %>%
  ggplot(aes(x = years, y = value, color = region))+
    facet_wrap(~rooms)+
    geom_point() +
    geom_path()+
    xlab("")+
    ylab("eur/"~m^2)

ggsave("./4.png")

#With rooms and subsity
df %>%
  filter(region != "wholecontry") %>%
  filter(sauna == "With sauna") %>%
  filter(balcony == "With balcony") %>%
  ggplot(aes(x = years, y = value, color = region))+
    facet_wrap(~subsidy+rooms)+
    geom_point() +
    geom_path()+
    xlab("")+
    ylab("eur/"~m^2)

ggsave("./5.png")

#Subsidised vs non subsidised
df %>%
  filter(region != "wholecontry") %>%
  filter(balcony == "With balcony") %>%
  ggplot(aes(x = years, y = value, color = region))+
    facet_wrap(~subsidy+rooms+sauna)+
    geom_point() +
    geom_path()+
    xlab("")+
    ylab("eur/"~m^2)

ggsave("./6.png")

#Subsidised vs non subsidised
df %>%
  filter(region != "wholecontry") %>%
  ggplot(aes(x = years, y = value, color = region))+
    facet_wrap(~subsidy+rooms+sauna+balcony)+
    geom_point() +
    geom_path()+
    xlab("")+
    ylab("eur/"~m^2)

ggsave("./7.png")
