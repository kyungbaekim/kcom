app.controller('mapsController', function($scope) {
  function initMap(){
    var map = new google.maps.Map(document.getElementById('display_map'), {
      center: {lat: 47.6053837, lng: -122.344292},
      zoom: 15
    });
    // var infoWindow = new google.maps.InfoWindow({map: map});

    // Try HTML5 geolocation to get current location
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        console.log(pos)
        var marker = new google.maps.Marker({
          position: pos,
          map: map,
          title: 'Hello World!'
        });
        // infoWindow.setPosition(pos);
        // infoWindow.setContent('Location found.');
        map.setCenter(pos);
      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
	}

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.');
  }

  initMap();
});
