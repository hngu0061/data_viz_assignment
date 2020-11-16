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
    var projection = d3
      .geoMercator()
      .translate([country_map_width / 2, country_map_height / 2])

    var country_info = data.filter(function (d) {
      return d.country === country
    })

    let pastel_colors = ["#e6f5c9", "#fff2ae"]

    var country_color =
      pastel_colors[Math.floor(Math.random() * pastel_colors.length)]

    var dot_colors = d3
      .scaleSequential()
      .domain([80, 95])
      .interpolator(d3.interpolateReds)

    // Color legend
    var countryColorLegend = d3
      .legendColor()
      .shapeWidth(30)
      .cells(5)
      .title("Point range")
      .orient("vertical")
      .scale(dot_colors)

    // Add a scale for bubble size
    var size = d3
      .scaleLinear()
      .domain([80, 95]) // What's in the data
      .range([5, 12]) // Size in pixel

    // Choosing scale for each country
    var scale_unit = 1200
    if (["USA", "Canada", "China"].includes(country)) {
      scale_unit = 460
    } else if (
      ["Argentina", "Chile", "Brazil", "India", "Australia"].includes(country)
    ) {
      scale_unit = 600
    }

    // update projection based on country lat long and scale unit
    projection
      .center([country_info[0].longitude, country_info[0].latitude])
      .scale(scale_unit)

    // create tooltip div
    let regiontooltipDiv = d3
      .select("#country_map")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)

    // function to display tooltip
    let mouseOver = function (d) {
      regiontooltipDiv.transition().duration(200).style("opacity", 0.9)
      regiontooltipDiv
        .html(
          `<strong>${d.region}</strong><br/>Avg points: ${Number(
            d.mean_points
          ).toFixed(2)}`
        )
        .style("left", d3.event.pageX + 15 + "px")
        .style("top", d3.event.pageY - 40 + "px")
    }

    // function to hide tooltip
    let mouseLeave = function (d) {
      regiontooltipDiv.transition().duration(300).style("opacity", 0)
    }

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

    // Draw circles for blinking animation
    country_map_svg
      .selectAll("regionCircles")
      .data(region_points)
      .enter()
      .append("circle")
      .classed("pulse", true)
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

    // Drawing another circle as transparent element to display tooltip
    country_map_svg
      .selectAll("regionCircles")
      .data(region_points)
      .enter()
      .append("circle")
      .attr("class", "regionCircles")
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
      .style("opacity", 0)
      .on("mouseover", mouseOver)
      .on("mouseleave", mouseLeave)

    // Add color legend
    country_map_svg
      .append("g")
      .attr("class", "countryColorLegend")
      .attr("transform", "translate(0,385)")

    country_map_svg.select(".countryColorLegend").call(countryColorLegend)
  })
}
