// EARTHQUAKE DATA URL CONSTANT
const eqURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// READ JSON DATA AND INITIALIZE MAP
d3.json(`${eqURL}`, function(data) {
    initMap(data.features); 
})

// INITITALIZATION FUNCTION
function initMap(data) {

    // GO THROUGH FEATURES AND BIND POPUP
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.title}</h3>
        <hr /><h3><strong>Date</strong></h3>
        ${new Date(feature.properties.time)}`);
    }

    // GO THROUGH FEATURE DATA AND PLOT CIRCLES 
    let earthquakes = L.geoJSON(data, {
        pointToLayer: function(data, latlng) {
            return L.circle(latlng, {
                color: colorScale(data.geometry.coordinates[2]),
                fillColor: colorScale(data.geometry.coordinates[2]),
                fillOpacity: 0.4, 
                radius: data.properties.mag * 10000
            })
        },
        onEachFeature: onEachFeature
    });
    
    // CALL THE FUNCTION TO CREATE MAPS
    eqMap(earthquakes);

}

// FUNCTION TO CREATE MAP
function eqMap(earthquakes){
   
    // LIGHT MAP VARIABLE
    let lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    });

    // DARK MAP VARIABLE
    let darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/dark-v10",
        accessToken: API_KEY
    }); 

    // SATELLITE MAP VARIABLE
    let satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
    });

    // ADD PLATES AS NEW LAYER GROUP
    let plates = new L.LayerGroup();

    // SET BASE MAP(S)
    let baseMaps = {
        "Light": lightMap,
        "Dark": darkMap,
        "Satellite": satellite
    };

    // SET OVERLAY MAP(S)
    let overlayMaps = {
        Earthquakes: earthquakes,
        Plates: plates
    }
    
    // CREATE AND CALL "MY MAP"
    let myMap = L.map("map-id", {
        center: [45.52, -90.67],
        zoom: 5,
        layers: [lightMap, earthquakes, plates]
    });

    // SET PLATES GEOJSON URL VARIABLE
    let platesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

    // READ AND ADD PLATES DATA TO MAP
    d3.json(`${platesURL}`, function(data){
        L.geoJSON(data, {
                style: function() {
                    return {color: "orange", fillOpacity: 0.5}
                }
            }).addTo(plates)
        });

    // SET CONTROLS FOR MAP
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

    // CREATE LEGEND FOR MAP
    var legend = L.control({position: 'bottomright'});

        legend.onAdd = function (map) {

            // SET NAMES FOR KEY / LEGEND
            var div = L.DomUtil.create('div', 'info legend'),
                depth = ["100 - 80", "79 - 60", "59 - 40", "39 - 20", " 19 - 0"]; 
                labels = [];
            
            // ADD LEGEND TITLE
            div.innerHTML += "<h3>EQ Depth (km)</h3>"

            // FOR EACH KEY IN "DEPTH" ARRAY, ADD KEY TO LEGEND
            for (var i = 0; i < depth.length; i++) {

                let scale = [80, 60, 40, 20, 0] 

                div.innerHTML +=
                    '<i style="background:' + colorScale(scale[i]) + '"></i> ' + depth[i] + '<br>';
            }

            return div;
        };

    // ADD LEGEND TO MAP
    legend.addTo(myMap);
  

};

// SET COLOR SCALE ASSIGNMENT
function colorScale(depth) {
    return depth >= 80 ? '#b52323' :
    depth >= 60 ? '#c9433f' :
    depth >= 40 ? '#dc605c' :
    depth >= 20 ? '#ed7b79' :
    depth >= 0 ? '#fd9696' :
    'white'; 
};