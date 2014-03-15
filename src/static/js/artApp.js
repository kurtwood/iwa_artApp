$('#submit').on('click', function(e){
	var message = $('#venueInput').val();
	var data; 
	var rdf_data;

	var query = 'PREFIX ah: <http://purl.org/artsholland/1.0/>\n PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n PREFIX dc: <http://purl.org/dc/terms/>\n SELECT DISTINCT ?event WHERE {\n	?event rdf:type ah:Event;\n ah:venue ?venue . \n?venue dc:title "'+message+'"@en.\n} LIMIT 10';
	var endpoint = 'http://api.artsholland.com/sparql?'; //?
	var format = 'RDF';

	$.get('/sparql',data={'endpoint': endpoint, 'query': query, 'format': format}, function(data){
		var pre = $('<pre></pre>');
		pre.text(data);
		$('#submittarget').html(pre);

		$.post('/store', rdf_data={'data': data}, function(data){
			var pre = $('<pre></pre>');
			pre.text(rdf_data);
			$('#submittarget').html(pre);
		});		
	});
});
