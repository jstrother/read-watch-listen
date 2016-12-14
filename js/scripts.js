const $ = require('jquery');

$(function() {
	$('#submit').click(function(e) {
		e.preventDefault();
		// The following take in what you are searching for and what type of work it is.
		var searchTerm = $('#search-term').val(),
			// searchType = $('#type').val(),
			params = {
				q: searchTerm,
				type: 'book',
				info: 1,
				limit: 100,
				k: '201615-ReadWatc-D43NAQ4H',
				callback: 'jsonp'
			};
		reset();
		$('#search-term').attr('placeholder', searchTerm);
		// Passing in the parameters of the api callback
		// now it's time to make the actual ajax request
		makeAjaxRequest(
			'//www.tastekid.com/api/similar', //TasteKid API is case-sensitive.  .Name, not .name, and so on.
			params,
			'jsonp',
			'GET',
			function(result) {
				console.log('result:', result);
				var info = result.Similar.Info,
					results = result.Similar.Results;
				console.log('results:', results);
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
		reset();
	});
});
function showRecommendations(results) {
	var itemList = [];
	$.each(results, function(i, item) {
		var resultType = results[i].Type,
			resultName = results[i].Name;
		if (resultType === 'book') {
			console.log('match:', resultType, i);
			if (!($.inArray(resultName, itemList)))
			console.log('resultName', resultName);
			itemList.push(results[i]);
			console.log('itemList', itemList);
		}
	});
	var simHeader = $('#show-similar-header').find('h3');
	simHeader.text('Similar Books');
	$.each(itemList, function(i, item) {
		// clone the similar div
		var newDiv = $('#template').clone().removeClass('hidden'),
			title = newDiv.find('h2'),
			description = newDiv.find('p');
		// remove the id 'template' from new clone
		newDiv.removeAttr('id');
		// add item title Name
		title.text(item.Name);
		// use NY Times api to retrieve author's name
		// and book review
		$('#show-similar').append(newDiv);
	});
	$('#display').show();
}
function reset() {
	$('#search-term').val('').focus();
	$('#item-title').text('');
	$('#item-desc').text('');
	$('#show-similar').html('');
	$('#display').hide();
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