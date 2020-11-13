export function draw_country_map(country_geo, region_points, country) {
  d3.csv("./data/world_country_centroids.csv", function (data) {
    d3.selectAll("#country_map_path").remove()
    d3.selectAll("#country_map_svg").remove()
    d3.selectAll(".region_points").remove()

    let country_map_width = 500,
      country_map_height = 500

    // append the svg object to the body of the page
    let country_map_svg = d3
      .select("#country_map")
      .append("svg")
      .attr("id", "country_map_svg")
      .attr("width", country_map_width)
      .attr("height", country_map_height)

    // Map and projection
    var path = d3.geoPath()
    var projection = d3
      .geoMercator()
      .translate([country_map_width / 2, country_map_height / 2])

    var country_info = data.filter(function (d) {
      return d.country === country
    })

    let pastel_colors = [
      "#b3e2cd",
      "#cbd5e8",
      "#f4cae4",
      "#e6f5c9",
      "#fff2ae",
      "#f1e2cc",
      "#cccccc",
    ]

    var country_color =
      pastel_colors[Math.floor(Math.random() * pastel_colors.length)]

    var dot_colors = d3
      .scaleSequential()
      .domain([80, 100])
      .interpolator(d3.interpolateReds)

    // Add a scale for bubble size
    var size = d3
      .scaleLinear()
      .domain([80, 100]) // What's in the data
      .range([8, 18]) // Size in pixel

    var scale_unit = 1200
    if (["USA", "Canada", "China"].includes(country)) {
      scale_unit = 460
    } else if (
      ["Argentina", "Chile", "Brazil", "India", "Australia"].includes(country)
    ) {
      scale_unit = 600
    }

    projection
      .center([country_info[0].longitude, country_info[0].latitude])
      .scale(scale_unit)

    // Draw the map
    country_map_svg
      .append("g")
      .selectAll("path")
      .data(country_geo)
      .enter()
      .append("path")
      .attr("id", "country_map_path")
      .attr("d", d3.geoPath().projection(projection))
      // set the color of each country
      .attr("fill", country_color)
      .style("stroke", country_color)

    console.log(region_points)
    // Draw region points
    country_map_svg
      .selectAll("regionCircles")
      .data(region_points)
      .enter()
      .append("circle")
      .attr("class", "region_points")
      .attr("cx", function (d) {
        return projection([+d.long, +d.lat])[0]
      })
      .attr("cy", function (d) {
        return projection([+d.long, +d.lat])[1]
      })
      .attr("r", function (d) {
        return size(+d.mean_points)
      })
      .style("fill", function (d) {
        return dot_colors(+d.mean_points)
      })
      .attr("stroke", function (d) {
        return dot_colors(+d.mean_points)
      })
  })
}
