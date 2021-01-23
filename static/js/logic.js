// Creating our initial map object
let myMap = L.map("map-id", {
    center: [45.52, -90.67],
    zoom: 5
  });
  
// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
tileSize: 512,
maxZoom: 18,
zoomOffset: -1,
id: "mapbox/streets-v11",
accessToken: API_KEY
}).addTo(myMap);

const eqURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function colorScale(depth) {
    return depth >= 80 ? '#b52323' :
    depth >= 60 ? '#c9433f' :
    depth >= 40 ? '#dc605c' :
    depth >= 20 ? '#ed7b79' :
    depth >= 0 ? '#fd9696' :
    'white'; 
};

function geoData(){
    d3.json(`${eqURL}`, function(response){
        console.log(response);
        
        response.features.forEach(item => {
            let circle = L.circle([item.geometry.coordinates[1], item.geometry.coordinates[0]], {
                color: colorScale(item.geometry.coordinates[2]),
                fillColor: colorScale(item.geometry.coordinates[2]),
                fillOpacity: 0.9, 
                radius: item.properties.mag * 10000
            }).addTo(myMap)

            circle.bindPopup(`<h3>${item.properties.title}</h3>
                <hr /><h3><strong>Date</strong></h3>
                ${new Date(item.properties.time)}`);

        })

        var legend = L.control({position: 'bottomright'});

        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),
                magnitudes = ["100 - 80", "79 - 60", "59 - 40", "39 - 20", " 19 - 0"]; 
                labels = [];

            for (var i = 0; i < magnitudes.length; i++) {

                let scale = [80, 60, 40, 20, 0] 

                div.innerHTML +=
                    '<i style="background:' + colorScale(scale[i]) + '"></i> ' + magnitudes[i] + '<br>';
            }

            return div;
        };

        legend.addTo(myMap);

    })
};

let platesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

function tectonicPlates() {
    d3.json(`${platesURL}`, function(plates){
        console.log(plates);
    
        plates.features.forEach(item => {
            var polyline = L.polyline([item.geometry.coordinates]).addTo(myMap);
        })
    })

    myMap.fitBounds(polyline.getBounds());
};

tectonicPlates(); 
geoData();
