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
    var venueSearch = 'http://api.artsholland.com/sparql?query=PREFIX+ah%3A+%3Chttp%3A%2F%2Fpurl.org%2Fartsholland%2F1.0%2F%3E%0D%0APREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0D%0APREFIX+owl%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2002%2F07%2Fowl%23%3E%0D%0APREFIX+xsd%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E%0D%0APREFIX+dc%3A+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%3E%0D%0APREFIX+time%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Ftime%23%3E%0D%0APREFIX+geo%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23%3E%0D%0A%0D%0ACONSTRUCT+%7B%3Fevent+rdf%3Atype+ah%3AEvent+%3B%0D%0A%09%09%09%09++ah%3Avenue+%3Fvenue+%3B%0D%0A%09%09++%09%09++time%3AhasBeginning+%3Fstart+%3B%0D%0A%09%09++++++++++time%3AhasEnd+%3Fend+%3B%0D%0A%09%09++++++++++ah%3Aproduction+%3Fproduction+.%0D%0A%09%09+++%0D%0A%09%09+++%3Fproduction+dc%3Atitle+%3Ftitle+%3B%09%0D%0A%09%09%09%09%09+++ah%3Agenre+%3Fgenre+.%0D%0A%09%09+++%0D%0A%09%09+++%3Fvenue+dc%3Atitle+%22'+venue+'%22%40en+%3B%0D%0A%09%09+++%09%09geo%3Along+%3Flong+%3B%0D%0A%09%09+++%09%09geo%3Alat+%3Flat+.%0D%0A%7D+WHERE+%7B%0D%0A%09%3Fevent+rdf%3Atype+ah%3AEvent+%3B%0D%0A%09%09+++ah%3Avenue+%3Fvenue+%3B%0D%0A%09%09+++time%3AhasBeginning+%3Fstart+%3B%0D%0A%09%09+++time%3AhasEnd+%3Fend+%3B%0D%0A%09%09+++ah%3Aproduction+%3Fproduction+.%0D%0A%09%09+++%0D%0A%09%0D%0A%09%3Fproduction+dc%3Atitle+%3Ftitle+%3B%09%0D%0A%09%09%09%09ah%3Agenre+%3Fgenre+.%0D%0A%09%09%09%09%0D%0A%09%3Fvenue+dc%3Atitle+%22'+venue+'%22%40en+%3B%0D%0A%09%09+++geo%3Along+%3Flong+%3B%0D%0A%09%09+++geo%3Alat+%3Flat+.%0D%0A%0D%0A%09%0D%0A%09FILTER%28%3Fend+%3E%3D+%22'+getToday()+'T11%3A04%3A14Z%22%5E%5Exsd%3AdateTime%29+.+%0D%0A%09%0D%0A%7D%0D%0ALIMIT+100';
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

    var query = 'PREFIX time: <http://www.w3.org/2006/time#> \n PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> \n PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n PREFIX ah: <http://purl.org/artsholland/1.0/> \n PREFIX dc: <http://purl.org/dc/terms/> \n SELECT DISTINCT ?title ?long ?lat ?start  WHERE { \n    ?event rdf:type ah:Event ; \n          ah:venue ?venue ; \n       time:hasBeginning ?start ; \n      ah:production ?production . \n    ?production  dc:title ?title . \n    ?venue dc:title "Melkweg"@en ; \n            geo:long ?long; \n              geo:lat ?lat . \n FILTER (langMatches(lang(?title), "NL")) . \n} \n ORDER BY ASC (?start) \n LIMIT 10';
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

function getToday() {
        var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    } 

    if(mm<10) {
        mm='0'+mm
    } 
    today = yyyy+'-'+mm+'-'+dd;
    return today;
}
