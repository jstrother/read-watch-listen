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
			function(similar) {
				console.log(similar);
				
			}
		);
	});
});

// paramaters:
//     q: search query
//     type: specifies type of result (book, movie, etc)
//     info: set to 1 to get more info
//     limit: max number of returns, default 20
//     k: 201615-ReadWatc-D43NAQ4H
//     callback: jsonp

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