import $ from 'jquery';

// there are two API calls made.  one calls TasteDive and sends the info directly to the other, which calls Google Books.  the second call displays all info

$(() => {
	$('#submit').click(function(e) {
		e.preventDefault();
		// The following take in what you are searching for and what type of work it is.
		let searchTerm = $('#search-term').val(),
			params = {
				q: searchTerm,
				type: 'book',
				info: 1,
				limit: 50,
				k: '201615-ReadWatc-D43NAQ4H',
				callback: 'jsonp'
			};
		$('#search-how-to').hide();
		reset();
		$('#search-term').attr('placeholder', searchTerm);
		// Passing in the parameters of the api callback
		// now it's time to make the actual ajax request
		makeAjaxRequest(
			'/www.tastedive.com/api/similar/', //TasteDive API is case-sensitive.  .Name, not .name, and so on.
			params,
			'jsonp',
			'GET',
			result => {
				let results = result.Similar.Results;
				// time to find something new!
				showRecommendations(results);
			}
		);
	});
	$('#reset').click(e => {
		e.preventDefault();
		reset();
	});
});

function showRecommendations(results) {
	let itemList = [];
	$.each(results, (i, item) => {
		let resultType = results[i].Type;
		if (resultType === 'book') {
			itemList.push(results[i]);
		}
	});
	let simHeader = $('#show-similar-header').find('h3');
	simHeader.text('Similar Books');
	$.each(itemList, (i, item) => {
		// console.log('initial item:', item);
		let params = {
				'api-key': 'AIzaSyBNsI5sZCDK4Bv7Py29TO1Ta6auOtsardw',
				'q': item.Name
			},
			newDiv = $('#template').clone(), // clone the similar div
			title = newDiv.find('h2'),
			author = newDiv.find('h4'),
			moreLink = newDiv.find('a'),
			coverImg = newDiv.find('img'),
			blurb = newDiv.find('p');
			
		// remove the id 'template' from new clone
		newDiv.removeAttr('id');
		// make another ajax request to the Google Books api
		makeAjaxRequest(
			'/www.googleapis.com/books/v1/volumes/',
			params,
			'jsonp',
			'GET',
			item => {
				console.log('Google Books item:', item);
				// add item title Name
				title.text(item.items[0].volumeInfo.title);
				// retrieve author's name
				author.text(`by ${item.items[0].volumeInfo.authors[0]}`);
				// get the cover image
				coverImg.attr({
					src: item.items[0].volumeInfo.imageLinks.smallThumbnail, 
					alt: `${item.items[0].volumeInfo.title} Cover`
				});
				// retrieve snippet
				blurb.text(decodeURIComponent(item.items[0].searchInfo.textSnippet));
				// link to full review
				moreLink.attr('href', item.items[0].volumeInfo.infoLink);
				// this if block makes sure that if there is an error, the div doesn't show
				// most common error is 'exceeding usage limits' on a free api
				if (title.length >= 1) {
					newDiv.removeClass('hidden');
				}
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
    	url,
    	data: params,
    	dataType,
    	type
	}).done(done);
}

function reset() {
	$('#search-term').val('').focus();
	$('#item-title').text('');
	$('#item-desc').text('');
	$('#show-similar').html('');
	$('#display').hide();
}