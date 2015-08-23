/*jslint node: true */
/*global $, jQuery, alert, google */

"use strict";


var map;
var panorama;

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  var start = document.getElementById('start').value,
    end = document.getElementById('end').value;
  directionsService.route({
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING
  }, function (response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      document.getElementById('directions-panel').style.display = "inline";
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

function maps() {
  var nyc = {
    lat: 40.750806,
    lng: -73.992252
  },
    directionsService = new google.maps.DirectionsService(),
    directionsDisplay = new google.maps.DirectionsRenderer(),
    onChangeHandler = function () {
      calculateAndDisplayRoute(directionsService, directionsDisplay);
    };

  // Set up the map.
  map = new google.maps.Map(document.getElementById('map'), {
    center: nyc,
    zoom: 7
  });

  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('directions-panel'));

  
  document.getElementById('btn').addEventListener('click', onChangeHandler);
}


google.maps.event.addDomListener(window, 'load', maps);

/*document.getElementById('search-btn').addEventListener('click', function () {
  document.getElementById('search-btn').style.display = "none";
  document.getElementById('controls2').style.display = "block";
document.getElementById('directions-btn').style.display = "block";
  document.getElementById('panel').style.display = "none";
});

document.getElementById('directions-btn').addEventListener('click', function () {
  document.getElementById('directions-btn').style.display = "none";
  document.getElementById('panel').style.display = "block";
  document.getElementById('pano').style.display = "none";
  document.getElementById('search-btn').style.display = "block";
  document.getElementById('controls2').style.display = "none";
});*/