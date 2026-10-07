var map = L.map('earthquakemap').setView([38, -95], 4);

var basemap = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }
).addTo(map);

function getColor(magnitude) {
  if (magnitude >= 6) return "red";
  if (magnitude >= 4) return "orange";
  if (magnitude >= 2) return "yellow";
  return "green";
}

fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
  .then(response => response.json())
  .then(data => {

    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {

        var magnitude = feature.properties.mag;

        return L.circleMarker(latlng, {
          radius: Math.max(magnitude * 2, 4),
          fillColor: getColor(magnitude),
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });

      },

      onEachFeature: function (feature, layer) {

        layer.bindPopup(
          "<b>" + feature.properties.place + "</b><br>" +
          "Magnitude: " + feature.properties.mag + "<br>" +
          "Time: " + new Date(feature.properties.time).toLocaleString()
        );

      }
    }).addTo(map);

  })
  .catch(error => console.error(error));

var legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {

  var div = L.DomUtil.create('div', 'legend');

  div.innerHTML =
    '<h4>Magnitude</h4>' +
    '<i style="background:green"></i> Less than 2<br>' +
    '<i style="background:yellow"></i> 2 - 3.9<br>' +
    '<i style="background:orange"></i> 4 - 5.9<br>' +
    '<i style="background:red"></i> 6+';

  return div;
};

legend.addTo(map);