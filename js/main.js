/*jslint node: true */
/*global $, jQuery, alert, google */

"use strict";


var map;
var panorama;

function geocodeAddress(geocoder, resultsMap) {
  var address = document.getElementById('address').value;
  geocoder.geocode({
    'address': address
  }, function (results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      resultsMap.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function processSVData(data, status) {
  if (status === google.maps.StreetViewStatus.OK) {
    var marker = new google.maps.Marker({
      position: data.location.latLng,
      map: map,
      title: data.location.description
    });

    panorama.setPano(data.location.pano);
    panorama.setPov({
      heading: 90,
      pitch: 0
    });
    panorama.setVisible(true);

    marker.addListener('click', function () {
      var markerPanoID = data.location.pano;
      // Set the Pano to use the passed panoID.
      panorama.setPano(markerPanoID);
      panorama.setPov({
        heading: 180,
        pitch: 0
      });
      panorama.setVisible(true);
    });
  } else {
    console.error('Street View data not found for this location.');
  }
}

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

var maps = function () {
  document.getElementById('panel').style.display = 'block';
  document.getElementById('controls2').style.display = 'none';
  document.getElementById('pano').style.display = 'none';
  document.getElementById('directions-panel').style.display = 'none';
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

  
  document.getElementById('d-btn').addEventListener('click', onChangeHandler);
};

var maps1 = function () {
  document.getElementById('panel').style.display = 'none';
  document.getElementById('directions-panel').style.display = 'none';
  document.getElementById('controls2').style.display = 'block';
  document.getElementById('pano').style.display = 'block';
  var nyc = {
    lat: 40.750806,
    lng: -73.992252
  },
    sv = new google.maps.StreetViewService(),
    geocoder = new google.maps.Geocoder(),
    infoWindow = new google.maps.InfoWindow({
      map: map
    });

  panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'));

  // Set up the map.
  map = new google.maps.Map(document.getElementById('map'), {
    center: nyc,
    zoom: 15,
    streetViewControl: false
  });

  document.getElementById('s-btn').addEventListener('click', function () {
    geocodeAddress(geocoder, map);
  });

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
  }
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      map.setCenter(pos);
      // Set the initial Street View camera to the geolocation
      sv.getPanorama({
        location: pos,
        radius: 50
      }, processSVData);

    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  
    // Look for a nearby Street View panorama when the map is clicked.
    // getPanoramaByLocation will return the nearest pano when the
    // given radius is 50 meters or less.
  map.addListener('click', function (event) {
    sv.getPanorama({
      location: event.latLng,
      radius: 50
    }, processSVData);
  });
};

document.getElementById('directions-btn').addEventListener('click', maps);

document.getElementById('search-btn').addEventListener('click', maps1);