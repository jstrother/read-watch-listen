$(function() {
	$('#submit').click(function(e) {
		e.preventDefault();
		var searchTerm = $('#search-term').val();
		var searchType = $('#type').val();
		var params = {
			q: searchTerm,
			type: searchType,
			info: 1,
			limit: 15,
			k: '201615-ReadWatc-D43NAQ4H',
			callback: 'jsonp'
		};
		makeAjaxRequest(
			'//www.tastekid.com/api/similar',
			params,
			'jsonp',
			'GET',
			function(result) {
				console.log(result);  //returns the Similar Object
				console.log(result.Info);  //says that Similar.Info is 'undefined'
				console.log(result.Results);  //says that Similar.Results is 'undefined'
				// $('#display').html('<h1>' + similar.info[0].name + '</h1>');
			}
		);
	});
});

function makeAjaxRequest(url,params,dataType,type,done) {
	url = (typeof(url) == 'undefined') ? '//www.tastekid.com/api/similar' : url;
	params = (typeof(params) == 'undefined') ? {} : params;
	dataType = (typeof(dataType) == 'undefined') ? 'jsonp' : dataType;
	type = (typeof(type) == 'undefined') ? 'GET' : type;
	done = (typeof(done) == 'undefined') ? null : done;
	$.ajax({
    	url: url,
    	data: params,
    	dataType: dataType,
    	type: type
	}).done(done);
}