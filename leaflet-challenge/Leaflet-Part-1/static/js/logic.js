// The dataset to fetch is a summary of M2.5+ Earthquakes of the past 7 days.
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson';

// Create a Leaflet map object. The HTML element for holding the map is a <div> element with its id set to 'map'. 
let earthquakeMap = L.map('map', {
    // The center of the map is set to Cancun, Mexico to showcase a region with distinct variations in the earthquake depth.
    center: [21.17429, -86.84656], 
    zoom: 6
});

// Add the open street map as the background.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(earthquakeMap);

// Create a function that takes in the depth of an earthquake and assigns a color to its coordinate marker: earthquakes with greater depth appear darker in color.
function getColor(depth) {
    return depth>90 ? '#ff0000' :
        depth>70 ? '#ff6600' : 
        depth>50 ? '#ffcc00' :
        depth>30 ? '#ffff00' :
        depth>10 ? '#ccff33' : '#99ff33';
}

// Use D3 to connect to the USGS GeoJSON API.
d3.json(url).then(function(earthquakeData) {
    // Create a Leaflet GeoJSON layer. 
    // Note that the Leaflet library allows a LatLng object of 3 numbers (longitude, latitude, altitude) used in GeoJSON for points.
    L.geoJSON(earthquakeData, {
        // Define a custom function for pointToLayer that converts GeoJSON points to circles at their coordinates.
        pointToLayer: function(feature, coords) {
            return L.circle(coords, {
                color: 'black',
                // The circles reflect the magnitude of the earthquake by their radius and the depth of the earthquake by color. 
                radius: feature.properties.mag*10000, 
                fillColor: getColor(coords.alt),
                fillOpacity: 0.8,
                weight: 1
            });
        },
        // Bind a popup to each circle that shows the location, magnitude, and depth of the earthquake.
        onEachFeature: function(feature, layer) {
            layer.bindPopup('<h1>' + feature.properties.place + '</h1><hr>' + 
                '<h2>Magnitude: ' + feature.properties.mag + ', Depth: ' + feature.geometry.coordinates[2].toFixed(2) +' (km) </h2>');
        }
    }).addTo(earthquakeMap);

    // Set up a legend and implement it as a map control so that the container DOM element is returned upon the legend being added to the map.
    let legend = L.control({position: 'bottomright'});
    legend.onAdd = function () {
        // Create a <div> element with its class set to 'info legend' (in line with style.css). DOMUtil is used by Leaflet internally to work with the DOM tree.
        let div = L.DomUtil.create('div', 'info legend');
        // Define depth intervals, and generate a label with a colored square for each depth interval.
        // The intervals chosen here match those in the sample visualization, but they can be improved in the future to better reflect the earthquake depth distribution.
        let depths = [-10, 10, 30, 50, 70, 90];
        // The following for loop is adapted from the choropleth example on the Leaflet website (https://leafletjs.com/examples/choropleth/).
        for (var i = 0; i < depths.length; i++) {
            div.innerHTML += 
                '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' + 
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }
        return div;
    }
    // Add the legend to the map.
    legend.addTo(earthquakeMap);
});

