const $ = require('jquery');

$(function() {
	$('#submit').click(function(e) {
		e.preventDefault();
		// The following take in what you are searching for and what type of work it is.
		var searchTerm = $('#search-term').val();
		var searchType = $('#type').val();
		console.log(searchType);
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
				console.log('result:', result);
				var info = result.Similar.Info;
				var results = result.Similar.Results;
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
	var itemList = [];
	var type = $('#type').val();
	var result = results[i].Type;
	$.each(results, function(i, items) {
		if (result === type) {
			console.log('match:', results[i].Type, i);
			if (!itemList.find(results[i].Name))
			itemList.push(this);
		}
		else {
			console.log('not match:', results[i].Type, i);
		}
		$.each(itemList, function(i, item) {	// clone the similar div
			var newDiv = $('#template').clone().removeClass('hidden');
			newDiv.removeAttr('id');
			// add item title Name
			var title = newDiv.find('h2');
			title.text(item.Name);
			// add item Type
			var type = newDiv.find('h4');
			type.text(item.Type);
			// set link to wikipedia page
			var titleLink = newDiv.find('.similar-wiki');
			titleLink.attr('href', item.wUrl);
			// set link to youtube page
			var ytLink = newDiv.find('.similar-yTpage');
			ytLink.attr('href', '//www.youtube.com/watch?v=' + item.yID);
			$('#show-similar').append(newDiv);
		});
	});
	$('#display').show();
}
function reset() {
	$('#search-term').val('').focus();
	$('#type').val('book');
	$('#item-title').text('');
	$('#item-desc').text('');
	$('#show-similar').html('');
	$('#display').hide();
}