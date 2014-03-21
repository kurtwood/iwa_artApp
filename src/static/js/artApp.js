var toggleIknow = false;
var toggleNoidea = false;

$("#iknow").on("click", function(){
    $("#toHideLocation").toggle();
    toggleIknow = !toggleIknow;
    if (toggleNoidea == true){
       $("#toHideNoidea").toggle();
       toggleNoidea = false;
    }
});

$("#noidea").on("click", function(){
    $("#toHideNoidea").toggle();
    toggleNoidea = !toggleNoidea;
    if(toggleIknow == true){
        $("#toHideLocation").toggle();
        toggleIknow = false;
    }
});

$('#submitIknow').on('click', function(e){
    var venue = $("#location").val();
    //var venueSearch = 'http://api.artsholland.com/sparql?query=PREFIX+geo%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23%3E+%0D%0APREFIX+ah%3A+%3Chttp%3A%2F%2Fpurl.org%2Fartsholland%2F1.0%2F%3E%0D%0APREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0D%0APREFIX+dc%3A+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%3E%0D%0A%0D%0ACONSTRUCT+WHERE+%7B%0D%0A%09%3Fevent+rdf%3Atype+ah%3AEvent+%3B%0D%0A%09%09+++ah%3Avenue+%3Fvenue+%3B%0D%0A%09%09%09ah%3Aproduction+%3Fproduction+.%0D%0A%09%0D%0A%09%3Fproduction+dc%3Atitle+%3Ftitle+.%0D%0A%09%09%09%09%0D%0A%09%3Fvenue+dc%3Atitle+%22'+venue+'%22%40en+%3B%0D%0A%09%09+++geo%3Along+%3Flong+%3B%0D%0A%09%09+++geo%3Alat+%3Flat+.%0D%0A%09%09+++%09%0D%0A%7D%0D%0ALIMIT+10';
    var venueSearch = 'http://api.artsholland.com/sparql?query=PREFIX+ah%3A+%3Chttp%3A%2F%2Fpurl.org%2Fartsholland%2F1.0%2F%3E%0D%0APREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0D%0APREFIX+dc%3A+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%3E%0D%0APREFIX+geo%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23%3E%0D%0APREFIX+time%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Ftime%23%3E%0D%0A%0D%0ACONSTRUCT+WHERE+%7B%0D%0A%09%3Fevent+rdf%3Atype+ah%3AEvent+%3B%0D%0A%09%09+++ah%3Avenue+%3Fvenue+%3B%0D%0A%09%09+++time%3AhasBeginning+%3Fstart+%3B%0D%0A%09%09+++time%3AhasEnd+%3Fend+%3B%0D%0A%09%09+++ah%3Aproduction+%3Fproduction+.%0D%0A%09%0D%0A%09%3Fproduction+dc%3Atitle+%3Ftitle+.%0D%0A%09%09%09%09%0D%0A%09%3Fvenue+dc%3Atitle+%22'+venue+'%22%40en+%3B%0D%0A%09%09+++geo%3Along+%3Flong+%3B%0D%0A%09%09+++geo%3Alat+%3Flat+.%0D%0A%09%09+++%09%0D%0A%7D%0D%0ALIMIT+10'
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

    var query = 'PREFIX time: <http://www.w3.org/2006/time#> \n PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> \n PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n PREFIX ah: <http://purl.org/artsholland/1.0/> \n PREFIX dc: <http://purl.org/dc/terms/> \n SELECT DISTINCT ?title ?long ?lat ?start ?end WHERE { \n    ?event rdf:type ah:Event ; \n          ah:venue ?venue ; \n       time:hasBeginning ?start ; \n     time:hasEnd ?end ;      \n ah:production ?production . \n    ?production  dc:title ?title . \n    ?venue dc:title "Melkweg"@en ; \n            geo:long ?long; \n              geo:lat ?lat . \n } LIMIT 10';
    var endpoint = 'http://localhost:8080/openrdf-sesame/repositories/artApp';
    var format = 'JSON';

    $.get('/sparql',data={'endpoint': endpoint, 'query': query, 'format': format}, function(json){
    
    var lat = json.results.bindings[0].lat.value;
    var lng = json.results.bindings[0].long.value;

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
                        li.append('</strong>    End: <strong>' + value.end.value+'</strong>');
                        li.append('</br>');
                    }
                });
                ul.append(li);
                
            });
            $('#linkOutput').html(ul);
            console.log('Bravo:' + ul);
        } catch(err) {
            $('#linkOutput').html('Something went wrong!');
            console.log('Something went wrong');
        }
    });
});

$('#submitNoidea').on('click', function(e){ 
    //var venueType = $("#selectGenre option:selected").html();
    var venueType="Muziektheater";
    var longitude = 0;
    var latitude = 0;
    //get_location();

    var locationSearch='http://api.artsholland.com/sparql?query=PREFIX+ah%3A+<http%3A%2F%2Fpurl.org%2Fartsholland%2F1.0%2F>%0D%0APREFIX+geo%3A+<http%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23>%0D%0APREFIX+rdf%3A+<http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23>%0D%0APREFIX+rdfs%3A+<http%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23>%0D%0A%0D%0ACONSTRUCT+%7B%0D%0A%09%3Fvenue+geo%3Alat+%3Flat.%0D%0A%09%3Fvenue+geo%3Along+%3Flong.%0D%0A%7D%0D%0AWHERE+%7B%0D%0A++%09%3Fevent+rdf%3Atype+ah%3AEvent+%3B%0D%0A%09++++ah%3Avenue+%3Fvenue+%3B%0D%0A%09%09ah%3Aproduction+%3Fproduction.%0D%0A%09%0D%0A%09%3Fproduction+ah%3Agenre+%3Fgenre.%0D%0A%0D%0A%09%3Fgenre+rdfs%3Alabel+%22'+venueType+'%22%5E%5Exsd%3Astring.%0D%0A%09%3Fvenue+geo%3Alat+%3Flat.%0D%0A%09%3Fvenue+geo%3Along+%3Flong.%0D%0A%0D%0AFILTER+%28+%3Flong+%3E+%22'+longitude+'%22%5E%5Exsd%3Afloat+-+%220.025%22%5E%5Exsd%3Afloat+%26%26+%3Flong+%3C+%22'+longitude+'%22%5E%5Exsd%3Afloat+%2B+%220.025%22%5E%5Exsd%3Afloat+%0D%0A%09%09%26%26+%3Flat+%3E+%22'+latitude+'%22%5E%5Exsd%3Afloat+-+%220.015%22%5E%5Exsd%3Afloat+%26%26+%3Flat+%3C+%22'+latitude+'%22%5E%5Exsd%3Afloat+%2B+%220.015%22%5E%5Exsd%3Afloat%29%0D%0A%7D%0D%0A%0D%0A+LIMIT+10'

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

function handle_error(err) {
  if (err.code == 1) {
    window.alert("Uups, something went wrong!");
  }
}

