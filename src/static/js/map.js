var map;

function initialize_map(){
    var myLatlng = new google.maps.LatLng(52.370569, 4.894989);
    
    var mapOptions = {
        zoom: 2,
        center: myLatlng
    }
  
    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
    getLocation();
}


function get_location() {
  if (Modernizr.geolocation) {
    navigator.geolocation.getCurrentPosition(show_map, handle_error);
  } else {
        handle_error();
  }
}

var longitude;
var latitude;
function show_map(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
}

function handle_error(err) {
  if (err.code == 1) {
    window.alert("Uups, something went wrong!");
  }
}

function setMarker(lat, lng, venue){
    var myLatlng = new google.maps.LatLng(lat,lng);
    map.setCenter(myLatlng);
    map.setZoom(12);
    var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: venue
    });
}

var x = document.getElementById("demo");
function getLocation()
  {
    alert("test");
  if (navigator.geolocation)
    {
    navigator.geolocation.getCurrentPosition(showPosition);
    }
  else{x.innerHTML = "Geolocation is not supported by this browser.";}
  }
function showPosition(position)
  {
  x.innerHTML = "Latitude: " + position.coords.latitude + 
  "<br>Longitude: " + position.coords.longitude; 
  }
