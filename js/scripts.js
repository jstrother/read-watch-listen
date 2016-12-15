const $ = require('jquery');

$(function() {
	$('#submit').click(function(e) {
		e.preventDefault();
		// The following take in what you are searching for and what type of work it is.
		var searchTerm = $('#search-term').val(),
			// searchType = $('#type').val(),
			params1 = {
				q: searchTerm,
				type: 'book',
				info: 1,
				limit: 50,
				k: '201615-ReadWatc-D43NAQ4H',
				callback: 'jsonp'
			};
		reset();
		$('#search-term').attr('placeholder', searchTerm);
		// Passing in the parameters of the api callback
		// now it's time to make the actual ajax request
		makeAjaxRequest(
			'//www.tastekid.com/api/similar', //TasteKid API is case-sensitive.  .Name, not .name, and so on.
			params1,
			'jsonp',
			'GET',
			function(result) {
				var results = result.Similar.Results;
				// time to find something new!
				showRecommendations(results);
			}
		);
	});
	$('#reset').click(function(e) {
		e.preventDefault();
		reset();
	});
});
function showRecommendations(results) {
	var itemList = [];
	$.each(results, function(i, item) {
		var resultType = results[i].Type;
		if (resultType === 'book') {
			itemList.push(results[i]);
		}
	});
	var simHeader = $('#show-similar-header').find('h3');
	simHeader.text('Similar Books');
	$.each(itemList, function(i, item) {
		console.log('initial item:', item);
		var params2 = {
				'api-key': 'b5c044b52c6042149b21672f5f28447e',
				'title': item.Name
			},
			newDiv = $('#template').clone().removeClass('hidden'), // clone the similar div
			title = newDiv.find('h2'),
			author = newDiv.find('h4'),
			blurb = newDiv.find('p');
			
		// remove the id 'template' from new clone
		newDiv.removeAttr('id');
		// add item title Name
		title.text(item.Name);
		// make another ajax request to the NY Times api
		makeAjaxRequest(
			'//api.nytimes.com/svc/books/v3/reviews.jsonp',
			params2,
			'jsonp',
			'GET',
			function(item) {
				console.log('NY Times item:', item);
				// retrieve author's name
				author.text(item.results.book_author);
				// retrieve book review
				blurb.text(item.results.summary);
			}
		);
		$('#show-similar').append(newDiv);
	});
	$('#display').show();
}
function makeAjaxRequest(url,params,dataType,type,done) {
	url = (typeof(url) == 'undefined') ? '' : url;
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
function reset() {
	$('#search-term').val('').focus();
	$('#item-title').text('');
	$('#item-desc').text('');
	$('#show-similar').html('');
	$('#display').hide();
}