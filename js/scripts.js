$(function() {
	$('#submit').click(function(e) {
		e.preventDefault();
		// The following take in what you are searching for and what type of work it is.
		var searchTerm = $('#search-term').val();
		var searchType = $('#type').val();
		// Passing in the parameters of the api callback
		var params = {
			q: searchTerm,
			type: searchType,
			info: 1,
			limit: 21,
			k: '201615-ReadWatc-D43NAQ4H',
			callback: 'jsonp'
		};
		// now it's time to make the actual ajax request
		makeAjaxRequest(
			'//www.tastekid.com/api/similar', //TasteKid API is case-sensitive.  .Name, not .name, and so on.
			params,
			'jsonp',
			'GET',
			function(result) {
				var info = result.Similar.Info;
				var results = result.Similar.Results;
				console.log(results);
				// show some basic info about what was searched for
				$('#item-title').text(info[0].Name);
				$('#item-desc').text(info[0].wTeaser);
				// time to find something new!
				showRecommendations(results);
			}
		);
	});
	$('#reset').click(function(e) {
		e.preventDefault();
		$('#search-term').val('').focus();
		$('#type').val('book');
		$('#item-title').text('');
		$('#item-desc').text('');
		$('#show-similar').html('');
		$('#display').hide();
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
function showRecommendations(results) {
	$.each(results, function(i, item) {
		// clone the similar div
		var result = $('#template').clone().removeClass('hidden');
		result.removeAttr('id');
		// add item title Name
		var title = result.find('h2');
		title.text(item.Name);
		// add item Type
		var type = result.find('h4');
		type.text(item.Type);
		// set link to wikipedia page
		var titleLink = result.find('.similar-wiki');
		titleLink.attr('href', item.wUrl);
		// set link to youtube page
		var ytLink = result.find('.similar-yTpage');
		ytLink.attr('href', '//www.youtube.com/watch?v=' + item.yID);
		$('#show-similar').append(result);
	});
	$('#display').show();
}