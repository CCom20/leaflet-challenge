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

function geoData(){
    d3.json(`${eqURL}`, function(response){
        console.log(response);

        let coordinates = []; 

        response.features.forEach(item => {coordinates.push(item.geometry.coordinates)});
        
        let magnitude = []; 

        response.features.forEach(item => {magnitude.push(item.properties.mag)});
        
        response.features.forEach(item => {
            let circle = L.circle([item.geometry.coordinates[1], item.geometry.coordinates[0]], {
                color: 'green',
                fillColor: 'green',
                fillOpacity: 0.5, 
                radius: item.properties.mag * 10000
            }).addTo(myMap)
        })
    })
};

geoData(); 