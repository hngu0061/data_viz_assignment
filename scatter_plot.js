// Credit to: https://www.d3-graph-gallery.com/graph/connectedscatter_select.html
// set the dimensions and margins of the graph

// Function to draw scatter plot
function draw_scatter_plot(data, option = "price") {
  let margin = { top: 10, right: 100, bottom: 30, left: 30 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom

  // append the svg object to the body of the page
  let svg = d3
    .select("#my_scatter_plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  // Read csv data
  var price_range = d3.extent(data, function (data) {
    return Number(data.price)
  })

  var point_range = d3.extent(data, function (data) {
    return Number(data.points)
  })

  var vintage_year_range = d3.extent(data, function (data) {
    return Number(data.vintage_year)
  })

  var domain_range =
    option === "price"
      ? price_range
      : option === "year"
      ? vintage_year_range
      : vintage_year_range

  // Add X axis --> can be price/vintage year
  var x = d3.scaleLinear().domain(domain_range).range([0, width])
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

  // Add Y axis
  var y = d3.scaleLinear().domain(point_range).range([height, 0])
  svg.append("g").attr("class", "yAxis").call(d3.axisLeft(y))

  var myColor = d3
    .scaleSequential()
    .domain(price_range)
    .interpolator(d3.interpolateRdYlBu)

  // Initialize dots with group a
  var dot = svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
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
    .attr("r", 3)
    .style("fill", function (d) {
      if (option === "price_year") {
        return myColor(d.price)
      } else {
        return "#69b3a2"
      }
    })
}

// Load data file
d3.csv("data/data_viz.csv", function (data) {
  console.log(data.length)

  // Draw default scatter plot
  draw_scatter_plot(data)

  // Track change of country
  $("#menuItems").on("click", ".dropdown-item", function () {
    console.log("Change country")
    draw_scatter_plot(data)
  })

  // Track change in radio button
  function change_factor() {
    var form = document.getElementById("scatter_plot_factor")
    var form_val
    for (var i = 0; i < form.length; i++) {
      if (form[i].checked) {
        form_val = form[i].value
      }
    }

    var selected_country = document.querySelector("#dropdown_countries")
    //   console.log(selected_country.textContent);

    draw_scatter_plot(data, form_val)
  }

  var factor_option = d3.select("#scatter_plot_factor")
  factor_option.on("change", change_factor)
})
