$("#iknow").on("click", function(){
	$("#toHideLocation").toggle();
});

$("#noidea").on("click", function(){
	$("#toHideNoidea").toggle();
});

$('#submitIknow').on('click', function(e){
        var venue = $("#location").val();
        var venueSearch= 'http://api.artsholland.com/sparql?query=PREFIX+ah%3A+%3Chttp%3A%2F%2Fpurl.org%2Fartsholland%2F1.0%2F%3E%0D%0APREFIX+dc%3A+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%3E%0D%0A%0D%0ACONSTRUCT+WHERE+%7B%0D%0A++%09%3Fevent+rdf%3Atype+ah%3AEvent+%3B%0D%0A%09++++ah%3Avenue+%3Fvenue.%0D%0A%09%09%0D%0A%09%3Fvenue+dc%3Atitle+%22'+venue+'%22%40en.%0D%0A%09%0D%0A%7D+%0D%0ALIMIT+10'
      $.ajax({
                headers: {
                        Accept: "text/turtle"
                },
         url: venueSearch,
         type: "GET",
         success: function(response) { 
                     $.post('/store',data={'data': response}, function(data){
                     })
                }
        });
});

$('#submitNoidea').on('click', function(e){ 
        //var venueType = $("#selectGenre option:selected").html();
        var venueType="Muziektheater";
        var lng = "4.890198";
        var lat = "52.37111";
         var locationSearch='http://api.artsholland.com/sparql?query=PREFIX+ah%3A+<http%3A%2F%2Fpurl.org%2Fartsholland%2F1.0%2F>%0D%0APREFIX+geo%3A+<http%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23>%0D%0APREFIX+rdf%3A+<http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23>%0D%0APREFIX+rdfs%3A+<http%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23>%0D%0A%0D%0ACONSTRUCT+%7B%0D%0A%09%3Fvenue+geo%3Alat+%3Flat.%0D%0A%09%3Fvenue+geo%3Along+%3Flong.%0D%0A%7D%0D%0AWHERE+%7B%0D%0A++%09%3Fevent+rdf%3Atype+ah%3AEvent+%3B%0D%0A%09++++ah%3Avenue+%3Fvenue+%3B%0D%0A%09%09ah%3Aproduction+%3Fproduction.%0D%0A%09%0D%0A%09%3Fproduction+ah%3Agenre+%3Fgenre.%0D%0A%0D%0A%09%3Fgenre+rdfs%3Alabel+%22'+venueType+'%22%5E%5Exsd%3Astring.%0D%0A%09%3Fvenue+geo%3Alat+%3Flat.%0D%0A%09%3Fvenue+geo%3Along+%3Flong.%0D%0A%0D%0AFILTER+%28+%3Flong+%3E+%22'+lng+'%22%5E%5Exsd%3Afloat+-+%220.025%22%5E%5Exsd%3Afloat+%26%26+%3Flong+%3C+%22'+lng+'%22%5E%5Exsd%3Afloat+%2B+%220.025%22%5E%5Exsd%3Afloat+%0D%0A%09%09%26%26+%3Flat+%3E+%22'+lat+'%22%5E%5Exsd%3Afloat+-+%220.015%22%5E%5Exsd%3Afloat+%26%26+%3Flat+%3C+%22'+lat+'%22%5E%5Exsd%3Afloat+%2B+%220.015%22%5E%5Exsd%3Afloat%29%0D%0A%7D%0D%0A%0D%0A+LIMIT+10'

        $.ajax({
                headers: {
                        Accept: "text/turtle"
                },
         url: locationSearch,
         type: "GET",
         success: function(response) { 
                     $.post('/store',data={'data': response}, function(response){
                     })
                }
    });
});

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

