
// Prepare base maps.
let baseMaps = {
    'Satellite': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'}),
    'Grayscale': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'}),
    'Street': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'})
}

// This dataset is a summary of M2.5+ Earthquakes for the past 7 days.
const earthquakeURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson';

function getColor(depth) {
    return depth>90 ? '#ff0000' :
        depth>70 ? '#ff6600' : 
        depth>50 ? '#ffcc00' :
        depth>30 ? '#ffff00' :
        depth>10 ? '#ccff33' : '#99ff33';
}

// Use D3 to connect to the USGS GeoJSON API.
d3.json(earthquakeURL).then(function(earthquakeData) {
    // Prepare the earthquake data as an overlay.
    let earthquakeOverlay = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, coords) {
            return L.circle(coords, {
                color: 'black',
                radius: feature.properties.mag*30000,
                fillColor: getColor(coords.alt),
                fillOpacity: 0.8,
                weight: 1
            });
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup('<h1>' + feature.properties.place + '</h1><hr>' + 
                '<h2>Magnitude: ' + feature.properties.mag + ', Depth: ' + feature.geometry.coordinates[2].toFixed(2) +' (km) </h2>');
        }
    });

    // Set up a legend for the colored circles in the earthquake overlay.
    let earthquakelegend = L.control({position: 'bottomright'});
    earthquakelegend.onAdd = function () {
        let div = L.DomUtil.create('div', 'info legend');
        let depths = [-10, 10, 30, 50, 70, 90];
        for (var i = 0; i < depths.length; i++) {
            div.innerHTML += 
                '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' + 
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }
        return div;
    }

    // Fetch the JSON data on tectonic plates by making a second request.
    const tectonicplatesURL = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json';
    d3.json(tectonicplatesURL).then(function(tectonicplatesData) {
        // Prepare the tectonic plate boundaries as another overlay.
        let tectonicplatesOverlay = L.geoJSON(tectonicplatesData, {
            style: {color:'red'}
        });

        // Organize the overlays into an object literal as required for creating a layers control. 
        let overlayMaps = {
            'Earthquakes': earthquakeOverlay,
            'Tectonic Plates': tectonicplatesOverlay
        };
    
        // Create a Leaflet map object. Initialize it with the satellite map and the earthquake overlay.
        let earthquakeMap = L.map('map', {
            center: [0, 0],
            zoom: 4,
            layers: [baseMaps.Satellite, earthquakeOverlay]
        });
        // Add the legend to the map. Comment it out if tectonicplatesOverlay is used instead to initialize earthquakeMap.
        earthquakelegend.addTo(earthquakeMap);
    
        // Create a layers control that contains baseMaps and overlayMaps and add it to the map.
        L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(earthquakeMap);

        // Create map events so that the additional/removal of the legend is in line with that of the earthquake overlay.
        earthquakeMap.on({
            overlayadd: function (eventLayer) {
                if (eventLayer.name === 'Earthquakes') { 
                    earthquakelegend.addTo(earthquakeMap);
                }
            },
            overlayremove: function (eventLayer) {
                if (eventLayer.name === 'Earthquakes') {
                    earthquakelegend.remove();
                }
            }
        })
    })

});

