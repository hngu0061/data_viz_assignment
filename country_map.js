export function draw_country_map(country_geo, country) {
  let country_map_width = 500,
    country_map_height = 500

  // append the svg object to the body of the page
  let country_map_svg = d3
    .select("#country_map")
    .append("svg")
    .attr("width", country_map_width)
    .attr("height", country_map_height)

  // Map and projection
  var path = d3.geoPath()
  var projection = d3
    .geoMercator()
    .translate([country_map_width / 2, country_map_height / 2])

  d3.csv("./data/world_country_centroids.csv", function (data) {
    var country_info = data.filter(function (d) {
      return d.country === country
    })

    let scale_unit = 1000

    let pastel_colors = [
      "#b3e2cd",
      "#fdcdac",
      "#cbd5e8",
      "#f4cae4",
      "#e6f5c9",
      "#fff2ae",
      "#f1e2cc",
      "#cccccc",
    ]

    var country_color =
      pastel_colors[Math.floor(Math.random() * pastel_colors.length)]

    if (["USA", "Canada"].includes(country)) {
      scale_unit = 300
    } else if (
      ["Argentina", "Chile", "Brazil", "India", "China", "Australia"].includes(
        country
      )
    ) {
      scale_unit = 400
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
      // draw each country
      .attr("d", d3.geoPath().projection(projection))
      // set the color of each country
      .attr("fill", country_color)
      .style("stroke", country_color)
  })
}
