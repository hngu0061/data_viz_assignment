// Credit to https://www.d3-graph-gallery.com/graph/treemap_basic.html
import { draw_country_map } from "./country_map.js"
import { draw_scatter_plot } from "./scatter_plot.js"
import { draw_bar_chart } from "./bar_chart.js"

// set the dimensions and margins of the graph
var treemap_margin = { top: 10, right: 10, bottom: 10, left: 10 },
  treemap_width = 1000 - treemap_margin.left - treemap_margin.right,
  treemap_height = 600 - treemap_margin.top - treemap_margin.bottom

// append the svg object to the body of the page
var treemap_svg = d3
  .select("#treemap")
  .append("svg")
  .attr("width", treemap_width + treemap_margin.left + treemap_margin.right)
  .attr("height", treemap_height + treemap_margin.top + treemap_margin.bottom)
  .append("g")
  .attr(
    "transform",
    "translate(" + treemap_margin.left + "," + treemap_margin.top + ")"
  )

// Color scale
var myColor = d3
  .scaleSequential()
  .domain([1, 37000])
  .interpolator(d3.interpolateGreens)

// Color legend
var treemapColorLegend = d3
  .legendColor()
  .shapeWidth(20)
  .cells(5)
  .title("Number of reviews")
  .scale(myColor)

// create tooltip div
let treemapTooltip = d3
  .select("#treemap")
  .append("div")
  .attr("class", "treemapTooltip")
  .style("opacity", 0)

// Read data
d3.queue()
  .defer(d3.json, "data/world.geojson")
  .defer(d3.csv, "data/region_point.csv")
  .defer(d3.csv, "data/treemap_data.csv")
  .await(ready)

function ready(error, topo, region, data) {
  // stratify the data: reformatting for d3.js
  var root = d3
    .stratify()
    .id(function (d) {
      return d.country
    })
    .parentId(function (d) {
      return d.parent
    })(data)
  root.sum(function (d) {
    return +d.count
  }) // Compute the numeric value for each entity

  // Then d3.treemap computes the position of each element of the hierarchy
  // The coordinates are added to the root object above
  d3.treemap().size([treemap_width, treemap_height]).padding(4)(root)

  // create function when mouse hovers on a rect
  let mouseOver = function (d) {
    d3.selectAll(".rectLeave").transition().duration(200).style("opacity", 0.2)
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "grey")
    treemapTooltip.transition().duration(200).style("opacity", 0.9)
    treemapTooltip
      .html(
        `<strong>${d.data.country}</strong><br/>No. reviews: ${d.data.count}<br/>Click for more info`
      )
      .style("left", d3.event.pageX + 15 + "px")
      .style("top", d3.event.pageY - 50 + "px")
  }

  // create function when mouse leaves treemap

  let mouseLeave = function () {
    d3.selectAll(".rectLeave").transition().duration(200).style("opacity", 1)
    d3.selectAll(".treemapTooltip").transition().style("opacity", 0)
  }

  // create function when mouse clicks on a rect
  let mouseClick = function (d) {
    $("#dropdown_countries").text(d.data.country)
    console.log(d.data.country)

    var country_map_area = document.getElementById("country_map_area")
    var country_map_title = document.getElementById("country_map_title")

    country_map_area.style.display = "block"
    country_map_title.style.display = "block"

    country_map_title.innerHTML = `Wine review for regions in ${d.data.country}`

    var country_points = region.filter(function (data) {
      return data.country === d.data.country
    })

    var country_map = topo.features.filter(function (data) {
      return data.properties.name === d.data.country
    })

    draw_country_map(country_map, country_points, d.data.country)

    // Redraw scatter plot and bar chart
    var factor = document.getElementById("scatter_plot_factor")
    var factor_choice
    for (var i = 0; i < factor.length; i++) {
      if (factor[i].checked) {
        factor_choice = factor[i].value
      }
    }

    // draw a new plot
    draw_scatter_plot(factor_choice, d.data.country)
    draw_bar_chart(d.data.country)
  }

  // use this information to add rectangles:
  treemap_svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr("class", "rectLeave")
    .attr("x", function (d) {
      return d.x0
    })
    .attr("y", function (d) {
      return d.y0
    })
    .attr("width", function (d) {
      return d.x1 - d.x0
    })
    .attr("height", function (d) {
      return d.y1 - d.y0
    })
    .style("stroke", "black")
    .style("fill", function (d) {
      return myColor(+d.data.count)
    })
    .on("click", mouseClick)
    .on("mouseover", mouseOver)
    .on("mouseleave", mouseLeave)
}
