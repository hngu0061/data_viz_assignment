// Credit to https://www.w3schools.com/howto/howto_js_filter_dropdown.asp
// I followed this tutorial to customize the dropdown menu for countries

import { draw_country_map } from "./country_map.js"

d3.queue()
  .defer(d3.csv, "data/country.csv")
  .defer(d3.json, "data/world.geojson")
  .defer(d3.csv, "data/region_point.csv")
  .await(ready)

function ready(error, data, topo, region) {
  let names = []

  for (var i = 0; i < data.length; i++) {
    names.push(data[i].x)
  }

  //Find the input search box
  let search = document.getElementById("searchCountry")

  //Find every item inside the dropdown
  let items = document.getElementsByClassName("dropdown-item")
  function buildDropDown(values) {
    let contents = []
    for (let name of values) {
      contents.push(
        '<input type="button" class="dropdown-item" type="button" value="' +
          name +
          '"/>'
      )
    }
    $("#menuItems").append(contents.join(""))

    //Hide the row that shows no items were found
    $("#empty").hide()
  }

  //Capture the event when user types into the search box
  window.addEventListener("input", function () {
    filter(search.value.trim().toLowerCase())
  })

  //For every word entered by the user, check if the symbol starts with that word
  //If it does show the symbol, else hide it
  function filter(word) {
    let length = items.length
    let collection = []
    let hidden = 0
    for (let i = 0; i < length; i++) {
      if (items[i].value.toLowerCase().startsWith(word)) {
        $(items[i]).show()
      } else {
        $(items[i]).hide()
        hidden++
      }
    }

    //If all items are hidden, show the empty view
    if (hidden === length) {
      $("#empty").show()
    } else {
      $("#empty").hide()
    }
  }

  //If the user clicks on any item, set the title of the button as the text of the item and display the country map
  $("#menuItems").on("click", ".dropdown-item", function () {
    $("#dropdown_countries").text($(this)[0].value)
    $("#dropdown_countries").dropdown("toggle")

    var country = $(this)[0].value

    var country_points = region.filter(function (data) {
      return data.country === country
    })

    var country_map = topo.features.filter(function (data) {
      return data.properties.name === country
    })

    draw_country_map(country_map, country_points, country)

    var country_area = document.getElementById("country_map_area")
    var country_map_title = document.getElementById("country_map_title")
    country_map_title.innerHTML = `Wine review for regions in ${country}`

    country_area.style.display = "block"
    country_map_title.style.display = "block"
  })

  buildDropDown(names)
}
