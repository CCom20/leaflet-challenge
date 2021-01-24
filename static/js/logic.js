
const eqURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

API_KEY = config.api_key

d3.json(`${eqURL}`, function(data) {
    initMap(data.features); 
})
  
function initMap(data) {

    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.title}</h3>
        <hr /><h3><strong>Date</strong></h3>
        ${new Date(feature.properties.time)}`);
    }

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
    
    eqMap(earthquakes);

}

function eqMap(earthquakes){
   
    let lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    });

    let darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/dark-v10",
        accessToken: API_KEY
    }); 

    let satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
    });

    let plates = new L.LayerGroup();

    let baseMaps = {
        "Light": lightMap,
        "Dark": darkMap,
        "Satellite": satellite
    };

    let overlayMaps = {
        Earthquakes: earthquakes,
        Plates: plates
    }
    
    let myMap = L.map("map-id", {
        center: [45.52, -90.67],
        zoom: 5,
        layers: [lightMap, earthquakes, plates]
    });

    let platesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

    d3.json(`${platesURL}`, function(data){
        L.geoJSON(data, {
                style: function() {
                    return {color: "orange", fillOpacity: 0.5}
                }
            }).addTo(plates)
        });

    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

    var legend = L.control({position: 'bottomright'});

        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),
                depth = ["100 - 80", "79 - 60", "59 - 40", "39 - 20", " 19 - 0"]; 
                labels = [];
            
            div.innerHTML += "<h3>EQ Depth (km)</h3>"

            for (var i = 0; i < depth.length; i++) {

                let scale = [80, 60, 40, 20, 0] 

                div.innerHTML +=
                    '<i style="background:' + colorScale(scale[i]) + '"></i> ' + depth[i] + '<br>';
            }

            return div;
        };

    legend.addTo(myMap);
  

};


function colorScale(depth) {
    return depth >= 80 ? '#b52323' :
    depth >= 60 ? '#c9433f' :
    depth >= 40 ? '#dc605c' :
    depth >= 20 ? '#ed7b79' :
    depth >= 0 ? '#fd9696' :
    'white'; 
};