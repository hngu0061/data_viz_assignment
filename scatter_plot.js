// Credit to: https://www.d3-graph-gallery.com/graph/connectedscatter_select.html
// set the dimensions and margins of the graph

// Function to draw scatter plot
export function draw_scatter_plot(option = "price", country = "") {
  let margin = { top: 10, right: 100, bottom: 30, left: 30 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom

  d3.selectAll("#scatter_plot_area").remove()

  // append the svg object to the body of the page
  let svg = d3
    .select("#my_scatter_plot")
    .append("svg")
    .attr("id", "scatter_plot_area")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  // add spinner, credit to http://bl.ocks.org/eesur/cf81a5ea738f85732707
  // loader settings
  var opts = {
    lines: 9,
    length: 9,
    width: 5,
    radius: 14,
    color: "#EE3124",
    speed: 1.9,
    trail: 40,
    className: "spinner",
  }

  var target = document.getElementById("my_scatter_plot")
  var spinner = new Spinner(opts).spin(target)

  setTimeout(function () {
    d3.csv("data/filtered_data_viz.csv", function (data) {
      spinner.stop()

      let plotting_data = data

      var color_scale = [
        "#1b9e77",
        "#d95f02",
        "#7570b3",
        "#e7298a",
        "#66a61e",
        "#e6ab02",
      ]

      var dot_color =
        color_scale[Math.floor(Math.random() * color_scale.length)]

      var display_text = document.getElementById("my_scatter_plot_text")

      var text_option =
        option === "price"
          ? "price"
          : option === "year"
          ? "vintage year"
          : "both of price and year"

      if (country !== "") {
        display_text.innerHTML = `Correlation between points and ${text_option} (country: ${country})`
        plotting_data = data.filter(function (row) {
          return row.country === country
        })
      } else {
        display_text.innerHTML = `Correlation between points and ${text_option} (The world)`
      }

      // Read csv data
      var price_range = d3.extent(plotting_data, function (plotting_data) {
        return Number(plotting_data.price)
      })

      var point_range = d3.extent(plotting_data, function (plotting_data) {
        return Number(plotting_data.points)
      })

      var vintage_year_range = d3.extent(plotting_data, function (
        plotting_data
      ) {
        return Number(plotting_data.vintage_year)
      })

      var domain_range =
        option === "price"
          ? [price_range[0] - 4, price_range[1]]
          : [vintage_year_range[0] - 5, vintage_year_range[1]]

      // Add X axis --> can be price/vintage year
      var x = d3.scaleLinear().domain(domain_range).range([0, width])
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .attr("id", "xAxis")
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)")

      // Add Y axis
      var y = d3.scaleLinear().domain([79, 100]).range([height, 0])
      svg.append("g").attr("id", "yAxis").call(d3.axisLeft(y))

      var myColor = d3
        .scaleSequential()
        .domain([price_range[0] - 300, price_range[1]])
        .interpolator(d3.interpolateRdPu)

      // Color legend
      var dotColorLegend = d3
        .legendColor()
        .shapeWidth(20)
        .cells(5)
        .title("Price range")
        .scale(myColor)

      // Initialize dots with group a
      var dot = svg
        .selectAll("circle")
        .data(plotting_data)
        .enter()
        .append("circle")
        .attr("class", "dot_circle")
        .attr("cx", function (d) {
          if (option === "price") {
            return x(d.price)
          } else {
            return x(d.vintage_year)
          }
        })
        .attr("cy", function (d) {
          return y(d.points)
        })
        .attr("r", 4)
        .style("fill", function (d) {
          if (option === "price_year") {
            return myColor(d.price)
          } else {
            return dot_color
          }
        })

      if (option === "price_year") {
        // Add color legend
        svg
          .append("g")
          .attr("class", "dotColorLegend")
          .attr("transform", "translate(340,40)")

        svg.select(".dotColorLegend").call(dotColorLegend)
      }
    })
  }, 1500)
}
