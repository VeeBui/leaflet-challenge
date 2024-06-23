// Create map object
let myMap = L.map("map", {
    center: [20, 10],
    zoom: 2.5
  });

// Add a tile layer.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Legend
let legend = L.control({ position: "bottomleft" });
legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let limits = [10,30,50,70,90];
    let colors = ["#ead0a9","#dda1b5","#cb85d6","#9d73d3","#4c3aa6","#231942"];
    let labels = ["< 10","10 - 30","30 - 50","50 - 70","70 - 90","> 90"];

    // Start legend 
    div.innerHTML = "<h1>Depth</h1>";

    for (let i = 0; i < colors.length; i++) {
        div.innerHTML += "<ul>" + "<li style=\"background-color: " + colors[i] + "\"></li> " + labels[i] + "</ul>";
    };
    return div;
}
// Adding the legend to the map
legend.addTo(myMap);


// Perform a GET request to the query URL/
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (response) {

    features = response.features;

    // get desired location, depth, magnitude
    for (let i = 0; i < features.length; i++) {

        // Get size based on 
        let mag = features[i].properties.mag;
        let circSize = 0;
        if (mag < 0) {
            circSize = 0;
        }
        else {
            circSize = 100000*Math.sqrt(mag);
        }
        
        // Get colour based on depth
        let depth = features[i].geometry.coordinates[2];
        let circColour = "";
        if (depth > 90) {
            circColour = "#231942"
        }
        else if (depth > 70) {
            circColour = "#4c3aa6"
        }
        else if (depth > 50) {
            circColour = "#9d73d3"
        }
        else if (depth > 30) {
            circColour = "#cb85d6"
        }
        else if (depth > 10) {
            circColour = "#dda1b5"
        }
        else {
            circColour = "#ead0a9"
        }

        // Get location
        let circLocation = [features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]]



        // Pop-up info
        let title = features[i].properties.title;

        let date = new Date(features[i].properties.time);
        let iso = date.toISOString().match(/(\d{4}\-\d{2}\-\d{2})T(\d{2}:\d{2}:\d{2})/);
        let dateString = iso[1] + ' ' + iso[2] + " UTC";

        let detail = features[i].properties.detail;

        let popupString = `<h1>${title}</h1>
        <h3>Date: ${dateString}</h3>
        <a href=${detail}>Details</a>
        `;



        // Create circle
        L.circle(circLocation, {
            fillOpacity: 1,
            color: "black",
            fillColor: circColour,
            radius: circSize
        }).bindPopup(popupString).addTo(myMap);
    }

  });


