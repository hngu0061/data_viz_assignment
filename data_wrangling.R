library(dplyr)


data_viz <- read.csv('data/data_viz.csv')

filtered_data_viz <- data_viz[data_viz$price < 1000 & data_viz$vintage_year > 1950,]

# write.csv(filtered_data_viz, 'data/filtered_data_viz.csv')

taster_data <- filtered_data_viz %>%
                  group_by(filtered_data_viz$country, filtered_data_viz$taster_name) %>%
                  summarize(
                    count = n(),
                    mean_points = mean(points)
                  )
  

colnames(taster_data) <- c('country', 'taster_name', 'count', 'mean_points')

write.csv(taster_data, 'data/taster_avg_points.csv')
  

