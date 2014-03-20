/*
Javascript for my web application - Intelligent Wab Application
*/

//When the user click on the 'submit' button
$("#button").on("click", function(){
	var venue = $("#inputNameVenue").val();
	var location = $("#inputLocation").val();
	var baseUrl = "https://api.foursquare.com/v2/venues/search?client_id=OLDX4OTKR25DA53PAZTNDZH2CYBT5CUXMEPTIWEI0PO1GCNP&client_secret=TCK5PHUTZUFYY20GEBWMTVQJOEHROF2JPOEKNMCPBC3I2SGJ&v=20140305";
	var finalUrl = baseUrl+"&query="+location+"&near="+venue;
	var page_content;
	$.get(finalUrl, function(json){
		var pre = $("<pre></pre>");
		pre.text(JSON.stringify(json));
		$("#linkOutput").html(pre);

	});


});


