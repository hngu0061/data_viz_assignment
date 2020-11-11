library(dplyr)


data_viz <- read.csv('data/data_viz.csv')

# Filtered data to remove outlier
filtered_data_viz <- data_viz[data_viz$price < 1000 & data_viz$vintage_year > 1950 & data_viz$country != 'Serbia' , ]

filtered_data_viz$country[filtered_data_viz$country == 'US'] <- 'USA'

usa_data <- filtered_data_viz[filtered_data_viz$country == 'USA',]

write.csv(filtered_data_viz, 'data/filtered_data_viz.csv')

# Generate a country csv file for display in drop-down
countries_list <- unique(filtered_data_viz$country)
write.csv(countries_list, 'data/country.csv')


# Calculate average points for each taster per country
taster_data <- filtered_data_viz %>%
                  group_by(filtered_data_viz$country, filtered_data_viz$taster_name) %>%
                  summarize(
                    count = n(),
                    mean_points = mean(points)
                  )
  

colnames(taster_data) <- c('country', 'taster_name', 'count', 'mean_points')

write.csv(taster_data, 'data/taster_avg_points.csv')


# Check country name differences between two set
geo_countries <- read.csv('data/countries_geo.csv')
wine_countries <- read.csv('data/countries_wine.csv')

geo_countries$new_country = geo_countries$country

merge_result <- merge(x = wine_countries, 
                      y = geo_countries, 
                      by='country', all.x = T)
  

