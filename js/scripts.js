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
			limit: 25,
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
		$('#display').hide();
		$('#item-title').text('');
		$('#item-desc').text('');
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
	console.log(results);
	$.each(results, function(i, item) {
		console.log(item);
		console.log('1 i=', i);
		var result = $('.similar').clone().removeClass('hidden');
		convertClassID(result, 'similar', i);
		console.log('2 i=', i);
		convertClassID($('button'), 'opener', i);
		console.log('3 i=', i);
		dialogBox(i);
		$('#show-similar').append(result);
	});
	$('#display').show();
}
function dialogBox(i) {
	console.log('dialogBox i=', i);
	$(function() {
		$('#dialog' + i).dialog({
			autoOpen: false,
			show: {
				effect: "blind",
				duration: 1000
			},
			hide: {
				effect: "explode",
				duration: 1000
			}
		});
		$('#opener' + i).click(function() {
			$('#dialog' + i).dialog('open');
		});
	});
}
function convertClassID (item, value, i) {
	console.log('convertClassID i=', i);
	item.removeClass(value).attr('id', value + i);
	return item;
}