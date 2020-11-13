library(dplyr)

data_viz <- read.csv('data/data_viz.csv')

# Filtered data to remove outlier
filtered_data_viz <- data_viz[data_viz$price < 1000 & data_viz$vintage_year > 1950 & data_viz$country != 'Serbia' , ]


filtered_data_viz$country[filtered_data_viz$country == 'US'] <- 'USA'

usa_data <- filtered_data_viz[filtered_data_viz$country == 'USA',]

write.csv(filtered_data_viz, 'data/filtered_data_viz.csv')

# Generate a country csv file for display in drop-down
# countries_list <- unique(filtered_data_viz$country)
# write.csv(countries_list, 'data/country.csv')


# Calculate average points for each taster per country
taster_data <- filtered_data_viz %>%
                  group_by(filtered_data_viz$country, filtered_data_viz$taster_name) %>%
                  summarize(
                    count = n(),
                    mean_points = mean(points)
                  )
  

colnames(taster_data) <- c('country', 'taster_name', 'count', 'mean_points')

write.csv(taster_data, 'data/taster_avg_points.csv')


# Calculate average points for each country
country_point <- filtered_data_viz %>%
                  group_by(filtered_data_viz$country) %>%
                  summarize(
                    mean_points = mean(points)
                  )

colnames(country_point) <- c('country', 'mean_points')



# Calculate average points for each region per country

# Calculate average points for each country
country_point <- filtered_data_viz %>%
  group_by(filtered_data_viz$country) %>%
  summarize(
    mean_points = mean(points)
  )

colnames(country_point) <- c('country', 'mean_points')

write.csv(country_point, 'data/country_point.csv')

# Calculate average points for each country
region_point <- filtered_data_viz %>%
  group_by(filtered_data_viz$country, filtered_data_viz$province) %>%
  summarize(
    mean_points = mean(points)
  )

colnames(region_point) <- c('country', 'region', 'mean_points')

region_geocoding <- read.csv('data/region_geocoding.csv')

colnames(region_geocoding) <- c('country', 'region', 'region_edited', 'lat', 'long')

region_merge <- merge(x = region_point, 
                      y = region_geocoding, 
                      by = 'region')

final_region_point <- region_merge[, c('region', 'country.x', 'mean_points','lat','long')]

colnames(final_region_point)[2] <- 'country'

write.csv(final_region_point, 'data/region_point.csv')

# Check country name differences between two set
geo_countries <- read.csv('data/countries_geo.csv')
wine_countries <- read.csv('data/countries_wine.csv')

geo_countries$new_country = geo_countries$country

merge_result <- merge(x = wine_countries, 
                      y = geo_countries, 
                      by='country', all.x = T)

# Check country centroid

country_centroids <- read.csv('data/world_country_centroids.csv')

colnames(country_centroids)

centroids_data <- country_centroids[,c('country', 'latitude', 'longitude')]

merge_centroids <- merge(x=wine_countries,
                         y=centroids_data,
                         by='country', all.x=T)



# Create data for treemap

treemap_data <- filtered_data_viz %>% 
                  group_by(filtered_data_viz$country) %>%
                  summarise(count=n())

colnames(treemap_data) <- c('country','count')

treemap_data$parent <- 'world'

treemap_data <- add_row(treemap_data, parent='world', .before=1)


dat1_frame %>%
  group_by(MONTH.YEAR) %>%
  summarise(count=n())


write.csv(treemap_data, 'data/treemap_data.csv', row.names = F)
