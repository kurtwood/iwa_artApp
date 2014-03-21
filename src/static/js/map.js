var map;

function initialize_map(){
    var myLatlng = new google.maps.LatLng(52.370569, 4.894989);
    
    var mapOptions = {
        zoom: 5,
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

  google.maps.event.addListener(marker, 'click', function() {
    var query = 'PREFIX time: <http://www.w3.org/2006/time#> \n PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> \n PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n PREFIX ah: <http://purl.org/artsholland/1.0/> \n PREFIX dc: <http://purl.org/dc/terms/> \n SELECT DISTINCT ?title ?long ?lat ?start  WHERE { \n    ?event rdf:type ah:Event ; \n          ah:venue ?venue ; \n       time:hasBeginning ?start ; \n      ah:production ?production . \n    ?production  dc:title ?title . \n    ?venue dc:title "'+venue+'"@en ; \n            geo:long ?long; \n              geo:lat ?lat . \n FILTER (langMatches(lang(?title), "NL")) . \n} \n ORDER BY ASC (?start) \n LIMIT 10';
    var endpoint = 'http://localhost:8080/openrdf-sesame/repositories/artApp';
    var format = 'JSON';

    $.get('/sparql',data={'endpoint': endpoint, 'query': query, 'format': format}, function(json){
    
        try {
            
            var vars = json.head.vars;

            var ul = $('<ul></ul>');
            ul.addClass('list-group');

            $.each(json.results.bindings, function(index,value){
                var li = $('<li></li>');
                li.addClass('list-group-item');

                $.each(vars, function(index, v){

                    if (index == 0) {
                        li.append('<strong>'+value.title.value+'</strong>');
                        li.append('    Start: <strong>' + value.start.value);
                        li.append('</br>');
                    }
                });
                ul.append(li);
                
            });
            $('#linkOutput').html(ul);
        } catch(err) {
            $('#linkOutput').html('Something went wrong!');
            console.log('Something went wrong');
        }
    });
});
