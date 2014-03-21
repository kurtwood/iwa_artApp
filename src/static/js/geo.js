function geoFindMe() {
var output = document.getElementById("curLoc");
  if (!navigator.geolocation){
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }

  function success(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;

    output.innerHTML = '<div id="latitude">' + latitude + '</div> <br/> <div id="longitude">' + longitude + '</div>';

  };

  function error() {
    output.innerHTML = "Unable to retrieve your location";
  };

  output.innerHTML = "<p>Locating?</p>";
  navigator.geolocation.getCurrentPosition(success, error);
}

