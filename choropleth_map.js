import { draw_country_map } from "./country_map.js"

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
var path = d3.geoPath()
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

// Load external data and boot
d3.queue()
  .defer(
    d3.json,
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
  )
  .defer(d3.csv, "data/region_point.csv")
  .defer(d3.csv, "data/country_point.csv", function (d) {
    data.set(d.country, +d.mean_points)
  })
  .await(ready)

function ready(error, topo, region) {
  var france_map = topo.features.filter(function (d) {
    return d.properties.name === "Australia"
  })

  console.log(france_map)

  draw_country_map(france_map, "Australia")
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
            ? "Avg point: " + data.get(d.properties.name).toFixed(3)
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
    $("#dropdown_countries").text(d.properties.name)
    console.log(d.properties.name)
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
}
