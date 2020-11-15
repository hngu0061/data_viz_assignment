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

  d3.csv("data/filtered_data_viz.csv", function (data) {
    let plotting_data = data

    var color_scale = [
      "#1b9e77",
      "#d95f02",
      "#7570b3",
      "#e7298a",
      "#66a61e",
      "#e6ab02",
    ]

    var dot_color = color_scale[Math.floor(Math.random() * color_scale.length)]

    if (country !== "") {
      plotting_data = data.filter(function (row) {
        return row.country === country
      })
    }

    // Read csv data
    var price_range = d3.extent(plotting_data, function (plotting_data) {
      return Number(plotting_data.price)
    })

    var point_range = d3.extent(plotting_data, function (plotting_data) {
      return Number(plotting_data.points)
    })

    var vintage_year_range = d3.extent(plotting_data, function (plotting_data) {
      return Number(plotting_data.vintage_year)
    })

    var domain_range = option === "price" ? price_range : vintage_year_range

    // Add X axis --> can be price/vintage year
    var x = d3.scaleLinear().domain(domain_range).range([0, width])
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .attr("id", "xAxis")

    // Add Y axis
    var y = d3.scaleLinear().domain(point_range).range([height, 0])
    svg.append("g").attr("id", "yAxis").call(d3.axisLeft(y))

    var myColor = d3
      .scaleSequential()
      .domain(price_range)
      .interpolator(d3.interpolateRdPu)

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
  })
}
