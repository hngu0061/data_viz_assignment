import { draw_country_map } from "./country_map.js"
import { draw_scatter_plot } from "./scatter_plot.js"
import { draw_bar_chart } from "./bar_chart.js"

let map_width = 1000,
  map_height = 600

// append the svg object to the body of the page
let choropleth_map_svg = d3
  .select("#choropleth_map")
  .append("svg")
  .attr("width", map_width)
  .attr("height", map_height)

// create tooltip div
let tooltipDiv = d3
  .select("#choropleth_map")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)

// Map and projection
var projection = d3
  .geoMercator()
  .scale(120)
  .center([0, 20])
  .translate([map_width / 2, map_height / 2])

// Data and color scale
var data = d3.map()
var colorScale = d3
  .scaleThreshold()
  .domain([79, 82, 85, 88, 91, 93, 97, 100])
  .range(d3.schemeBlues[7])

// Color legend
var choroplethColorLegend = d3
  .legendColor()
  .shapeWidth(20)
  .cells(5)
  .title("Point range")
  .scale(colorScale)

// Load external data and boot
d3.queue()
  .defer(d3.json, "data/world.geojson")
  .defer(d3.csv, "data/region_point.csv")
  .defer(d3.csv, "data/country_point.csv", function (d) {
    data.set(d.country, +d.mean_points)
  })
  .await(ready)

function ready(error, topo, region) {
  let mouseOver = function (d) {
    d3.selectAll(".Country").transition().duration(200).style("opacity", 0.5)
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "grey")
    tooltipDiv.transition().duration(200).style("opacity", 0.9)
    tooltipDiv
      .html(
        `<strong>${d.properties.name}</strong><br/>${
          data.get(d.properties.name)
            ? "Avg point: " +
              data.get(d.properties.name).toFixed(2) +
              "<br/>Click for more info"
            : "No rating"
        }`
      )
      .style("left", d3.event.pageX + 15 + "px")
      .style("top", d3.event.pageY - 40 + "px")
  }

  let mouseLeave = function (d) {
    d3.selectAll(".Country").transition().duration(200).style("opacity", 0.9)
    d3.select(this).transition().duration(100).style("stroke", "transparent")
    tooltipDiv.transition().duration(300).style("opacity", 0)
  }

  let mouseClick = function (d) {
    var wine_countries = [
      "Portugal",
      "USA",
      "Spain",
      "Italy",
      "France",
      "Germany",
      "Argentina",
      "Chile",
      "Australia",
      "Austria",
      "South Africa",
      "New Zealand",
      "Israel",
      "Hungary",
      "Greece",
      "Romania",
      "Canada",
      "Mexico",
      "Turkey",
      "Czech Republic",
      "Slovenia",
      "Croatia",
      "Georgia",
      "Uruguay",
      "England",
      "Lebanon",
      "Serbia",
      "Brazil",
      "Moldova",
      "Morocco",
      "Peru",
      "India",
      "Bulgaria",
      "Cyprus",
      "Armenia",
      "Switzerland",
      "Bosnia and Herzegovina",
      "Slovakia",
      "Macedonia",
      "Ukraine",
      "Luxembourg",
      "China",
    ]

    if (wine_countries.includes(d.properties.name)) {
      $("#dropdown_countries").text(d.properties.name)
      var country_map_area = document.getElementById("country_map_area")
      var country_map_title = document.getElementById("country_map_title")

      country_map_area.style.display = "block"
      country_map_title.style.display = "block"

      country_map_title.innerHTML = `Wine review for regions in ${d.properties.name}`

      var country_points = region.filter(function (data) {
        return data.country === d.properties.name
      })

      var country_map = topo.features.filter(function (data) {
        return data.properties.name === d.properties.name
      })

      draw_country_map(country_map, country_points, d.properties.name)

      // Redraw scatter plot and bar chart
      var factor = document.getElementById("scatter_plot_factor")
      var factor_choice
      for (var i = 0; i < factor.length; i++) {
        if (factor[i].checked) {
          factor_choice = factor[i].value
        }
      }

      // draw a new plot
      draw_scatter_plot(factor_choice, d.properties.name)
      draw_bar_chart(d.properties.name)
    } else {
      alert(`There is no info for ${d.properties.name}`)
    }
  }

  // Draw the map
  choropleth_map_svg
    .append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
    // draw each country
    .attr("d", d3.geoPath().projection(projection))
    // set the color of each country
    .attr("fill", function (d) {
      d.total = data.get(d.properties.name) || 0
      return colorScale(d.total)
    })
    .style("stroke", "transparent")
    .attr("class", function (d) {
      return "Country"
    })
    .style("opacity", 0.8)
    .on("mouseover", mouseOver)
    .on("mouseleave", mouseLeave)
    .on("click", mouseClick)

  // Add color legend
  choropleth_map_svg
    .append("g")
    .attr("class", "choroplethColorLegend")
    .attr("transform", "translate(20,400)")

  choropleth_map_svg
    .select(".choroplethColorLegend")
    .call(choroplethColorLegend)
}
