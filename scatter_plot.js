// Credit to: https://www.d3-graph-gallery.com/graph/connectedscatter_select.html
// set the dimensions and margins of the graph

// Function to draw scatter plot
function draw_scatter_plot(data, option = "price") {
  let margin = { top: 10, right: 100, bottom: 30, left: 30 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  let svg = d3
    .select("#my_scatter_plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Read csv data
  var price_range = d3.extent(data, function (data) {
    return Number(data.price);
  });

  var point_range = d3.extent(data, function (data) {
    return Number(data.points);
  });

  var vintage_year_range = [0, 2000];
  //   var vintage_year_range = d3.extent(data, function (data) {
  //     return Number(data.vintage_year);
  //   });

  var domain_range =
    option === "price"
      ? price_range
      : option === "year"
      ? vintage_year_range
      : [0, 100];

  // Add X axis --> can be price/vintage year
  var x = d3.scaleLinear().domain(domain_range).range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear().domain(point_range).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));
}

// //Read the data
// d3.csv(
//   "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_connectedscatter.csv",
//   function (data) {
//     // List of groups (here I have one group per column)
//     // var allGroup = ["Price", "Vintage Year", "Price and Vintage Year"];
//     var allGroup = ["valueA", "valueB", "valueC"];

//     // add the options to the button
//     d3.select("#selectButton")
//       .selectAll("myOptions")
//       .data(allGroup)
//       .enter()
//       .append("option")
//       .text(function (d) {
//         return d;
//       }) // text showed in the menu
//       .attr("value", function (d) {
//         return d;
//       }); // corresponding value returned by the button

//     // Add X axis --> it is a date format
//     var x = d3.scaleLinear().domain([0, 10]).range([0, width]);
//     svg
//       .append("g")
//       .attr("transform", "translate(0," + height + ")")
//       .call(d3.axisBottom(x));

//     // Add Y axis
//     var y = d3.scaleLinear().domain([0, 20]).range([height, 0]);
//     svg.append("g").call(d3.axisLeft(y));

//     // Initialize dots with group a
//     var dot = svg
//       .selectAll("circle")
//       .data(data)
//       .enter()
//       .append("circle")
//       .attr("cx", function (d) {
//         return x(+d.time);
//       })
//       .attr("cy", function (d) {
//         return y(+d.valueA);
//       })
//       .attr("r", 7)
//       .style("fill", "#69b3a2");

//     // A function that update the chart
//     function update(selectedGroup) {
//       // Create new data with the selection?
//       var dataFilter = data.map(function (d) {
//         return { time: d.time, value: d[selectedGroup] };
//       });

//       dot
//         .data(dataFilter)
//         .transition()
//         .duration(1000)
//         .attr("cx", function (d) {
//           return x(+d.time);
//         })
//         .attr("cy", function (d) {
//           return y(+d.value);
//         });
//     }

//     // When the button is changed, run the updateChart function
//     d3.select("#selectButton").on("change", function (d) {
//       // recover the option that has been chosen
//       var selectedOption = d3.select(this).property("value");
//       // run the updateChart function with this selected option
//       update(selectedOption);
//     });
//   }
// );

// Load data file
d3.csv("data/winemag-data-130k-v2.csv", function (data) {
  console.log(data.length);

  // Draw default scatter plot
  draw_scatter_plot(data);

  // Track change of country
  $("#menuItems").on("click", ".dropdown-item", function () {
    console.log("Change country");
    draw_scatter_plot(data);
  });

  // Track change in radio button
  function change_factor() {
    var form = document.getElementById("scatter_plot_factor");
    var form_val;
    for (var i = 0; i < form.length; i++) {
      if (form[i].checked) {
        form_val = form[i].value;
      }
    }

    var selected_country = document.querySelector("#dropdown_countries");
    //   console.log(selected_country.textContent);

    draw_scatter_plot(data, form_val);
  }

  var factor_option = d3.select("#scatter_plot_factor");
  factor_option.on("change", change_factor);
});
