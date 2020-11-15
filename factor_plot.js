import { draw_scatter_plot } from "./scatter_plot.js"
import { draw_bar_chart } from "./bar_chart.js"

// Draw default scatter plot
draw_scatter_plot()

// Draw default scatter plot
draw_bar_chart()

$("#menuItems").on("click", ".dropdown-item", function () {
  var country = $(this)[0].value

  var form = document.getElementById("scatter_plot_factor")
  var form_val
  for (var i = 0; i < form.length; i++) {
    if (form[i].checked) {
      form_val = form[i].value
    }
  }

  // draw a new plot
  draw_scatter_plot(form_val, country)
  draw_bar_chart(country)
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

  var country = document.querySelector("#dropdown_countries")
  var selected_country = country.textContent.includes("Choose a country")
    ? ""
    : country.textContent

  draw_scatter_plot(form_val, selected_country)
}

var factor_option = d3.select("#scatter_plot_factor")
factor_option.on("change", change_factor)
