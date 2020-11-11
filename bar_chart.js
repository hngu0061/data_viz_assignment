let bar_chart_margin = { top: 10, right: 100, bottom: 30, left: 100 },
  bar_chart_width = 460 - bar_chart_margin.left - bar_chart_margin.right,
  bar_chart_height = 400 - bar_chart_margin.top - bar_chart_margin.bottom;

// append the svg object to the body of the page
let bar_chart_svg = d3
  .select("#my_bar_chart")
  .append("svg")
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
  );

// function to draw bar chart

function draw_bar_chart(data, country = "") {
  let plotting_data = data;

  var color_scale = [
    "#1b9e77",
    "#d95f02",
    "#7570b3",
    "#e7298a",
    "#66a61e",
    "#e6ab02",
  ];

  if (country !== "") {
    plotting_data = data.filter(function (row) {
      return row.country === country;
    });
  }

  // Add X axis
  var x = d3.scaleLinear().domain([75, 95]).range([0, width]);
  bar_chart_svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .attr("id", "xAxisBarChart");

  // Add Y axis
  var y = d3
    .scaleBand()
    .domain(
      plotting_data.map(function (d) {
        return d.taster_name;
      })
    )
    .range([0, height])
    .padding(0.1);
  bar_chart_svg.append("g").attr("id", "yAxisBarChart").call(d3.axisLeft(y));

  // Plotting bars
  bar_chart_svg
    .selectAll("tasterRect")
    .data(plotting_data)
    .enter()
    .append("rect")
    .attr("class", "rect_bar_chart")
    .attr("x", x(75))
    .attr("y", function (d) {
      return y(d.taster_name);
    })
    .attr("width", function (d) {
      return x(Number(d.mean_points));
    })
    .attr("height", y.bandwidth())
    .attr("fill", color_scale[Math.floor(Math.random() * color_scale.length)]);
}

// Load data file
d3.csv("data/taster_avg_points.csv", function (data) {
  // Draw default scatter plot
  draw_bar_chart(data);

  // Track change of country
  $("#menuItems").on("click", ".dropdown-item", function () {
    var country = $(this)[0].value;

    //get rid of everything and re-draw
    d3.selectAll(".rect_bar_chart").remove();
    d3.selectAll("#yAxisBarChart").remove();
    d3.selectAll("#xAxisBarChart").remove();

    draw_bar_chart(data, country);
  });
});
