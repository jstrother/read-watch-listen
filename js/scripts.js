const $ = require('jquery');

$(function() {
	$('#submit').click(function(e) {
		e.preventDefault();
		// The following take in what you are searching for and what type of work it is.
		var searchTerm = $('#search-term').val(),
			searchType = $('#type').val(),
			params = {
				q: searchTerm,
				type: searchType,
				info: 1,
				limit: 21,
				k: '201615-ReadWatc-D43NAQ4H',
				callback: 'jsonp'
			};
		reset();
		$('#search-term').attr('placeholder', searchTerm);
		$('#type').val(searchType);
		console.log(searchType);
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
	var itemList = [],
		closeList = [],
		selectedType = $('#type').val();
	$.each(results, function(i, item) {
		var resultType = results[i].Type,
			resultName = results[i].Name;
		if (resultType === selectedType) {
			console.log('match:', resultType, i);
			if (!($.inArray(resultName, itemList)))
			console.log('resultName', resultName);
			itemList.push(results[i]);
			console.log('itemList', itemList);
		}
		else {
			console.log('not match:', resultType, i);
			closeList.push(results[i]);
			console.log('closeList', closeList);
		}
	});
	var simHeader = $('#show-similar-header').find('h3');
	simHeader.text('similar ' + selectedType + 's');
	$.each(itemList, function(i, item) {
		// clone the similar div
		var newDiv = $('#template').clone().removeClass('hidden'),
			title = newDiv.find('h2'),
			type = newDiv.find('h4'),
			titleLink = newDiv.find('.similar-wiki'),
			ytLink = newDiv.find('.similar-yTpage');
		// remove the id 'template' from new clone
		newDiv.removeAttr('id');
		// add item title Name
		title.text(item.Name);
		// add item Type
		type.text(item.Type);
		// set link to wikipedia page
		titleLink.attr('href', item.wUrl);
		// set link to youtube page
		ytLink.attr('href', '//www.youtube.com/watch?v=' + item.yID);
		$('#show-similar').append(newDiv);
	});
	$.each(closeList, function(i, item) {
		// clone the similar div
		var newDiv = $('#template').clone().removeClass('hidden'),
			title = newDiv.find('h2'),
			type = newDiv.find('h4'),
			titleLink = newDiv.find('.similar-wiki'),
			ytLink = newDiv.find('.similar-yTpage');
		// remove the id 'template' from new clone
		newDiv.removeAttr('id');
		// add item title Name
		title.text(item.Name);
		// add item Type
		type.text(item.Type);
		// set link to wikipedia page
		titleLink.attr('href', item.wUrl);
		// set link to youtube page
		ytLink.attr('href', '//www.youtube.com/watch?v=' + item.yID);
		$('#show-close').append(newDiv);
	});
	$('#display').show();
}
function reset() {
	$('#search-term').val('').focus();
	$('#type').val('book');
	$('#item-title').text('');
	$('#item-desc').text('');
	$('#show-similar').html('');
	$('#show-close').html('');
	$('#display').hide();
}