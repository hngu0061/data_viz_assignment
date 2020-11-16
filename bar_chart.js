// Credit to https://www.d3-graph-gallery.com/graph/barplot_horizontal.html

// function to draw bar chart
export function draw_bar_chart(country = "") {
  let bar_chart_margin = { top: 10, right: 100, bottom: 30, left: 100 },
    bar_chart_width = 460 - bar_chart_margin.left - bar_chart_margin.right,
    bar_chart_height = 400 - bar_chart_margin.top - bar_chart_margin.bottom

  d3.selectAll("#bar_chart_area").remove()

  // append the svg object to the body of the page
  let bar_chart_svg = d3
    .select("#my_bar_chart")
    .append("svg")
    .attr("id", "bar_chart_area")
    .attr(
      "width",
      bar_chart_width + bar_chart_margin.left + bar_chart_margin.right
    )
    .attr(
      "height",
      bar_chart_height + bar_chart_margin.top + bar_chart_margin.bottom
    )
    .append("g")
    .attr(
      "transform",
      "translate(" + bar_chart_margin.left + "," + bar_chart_margin.top + ")"
    )

  // create tooltip div
  let tasterTooltipDiv = d3
    .select("#my_bar_chart")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)

  d3.csv("data/taster_avg_points.csv", function (data) {
    let plotting_data = data

    var color_scale = [
      "#1b9e77",
      "#d95f02",
      "#7570b3",
      "#e7298a",
      "#66a61e",
      "#e6ab02",
    ]

    var display_text = document.getElementById("my_bar_chart_text")

    // update chart description
    if (country !== "") {
      display_text.innerHTML = `Taster's average points (country: ${country})`
      plotting_data = data.filter(function (row) {
        return row.country === country
      })
    } else {
      display_text.innerHTML = `Taster's average points (the world)`
    }

    // Add X axis
    var x = d3.scaleLinear().domain([75, 96]).range([0, bar_chart_width])
    bar_chart_svg
      .append("g")
      .attr("transform", "translate(0," + bar_chart_height + ")")
      .call(d3.axisBottom(x))
      .attr("id", "xAxisBarChart")

    // Add Y axis
    var y = d3
      .scaleBand()
      .domain(
        plotting_data.map(function (d) {
          return d.taster_name
        })
      )
      .range([0, bar_chart_height])
      .padding(0.1)
    bar_chart_svg.append("g").attr("id", "yAxisBarChart").call(d3.axisLeft(y))

    // function to display tooltip
    let mouseOver = function (d) {
      tasterTooltipDiv.transition().duration(200).style("opacity", 0.9)
      tasterTooltipDiv
        .html(`Avg points: ${d.mean_points}`)
        .style("left", d3.event.pageX + 15 + "px")
        .style("top", d3.event.pageY - 40 + "px")
    }

    // function to hide tooltip
    let mouseLeave = function (d) {
      tasterTooltipDiv.transition().duration(300).style("opacity", 0)
    }

    // Plotting bars
    bar_chart_svg
      .selectAll("tasterRect")
      .data(plotting_data)
      .enter()
      .append("rect")
      .attr("class", "rect_bar_chart")
      .attr("x", x(75))
      .attr("y", function (d) {
        return y(d.taster_name)
      })
      .attr("width", function (d) {
        return x(Number(d.mean_points))
      })
      .attr("height", y.bandwidth())
      .attr("fill", color_scale[Math.floor(Math.random() * color_scale.length)])
  })
}
