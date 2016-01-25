var valid = 'https://media2.giphy.com/media/Ewc0W5G3DtTwY/200_s.gif';
var invalid = 'invalid url';
var placeholder = 'http://forum.keshefoundation.org/core/images/default/default_avatar_large.png';
var validImgInstance = createImg('http://cs311530.vk.me/v311530220/2b09/l7UVU3_lTVA.jpg');
var invalidImgInstance = createImg('invalid img instance');

function createImg(path) {
	var img = document.createElement('img');
	img.src = path;

	return img;
}

function anythingToImg(items) {
	items = Array.isArray(items[0]) ? items[0] : items;

	return Array.prototype.map.call(items, function(item) {
		if (typeof item === 'string') {
			return createImg(item);
		} else {
			return item;
		}
	});
}

function simpleDownload() {
	var images = anythingToImg(arguments);
	var promises = images.map(function(img) {
		var p = new Promise(function(resolve, reject) {
			img.addEventListener('load', function() {
				resolve(img);
			});
			img.addEventListener('error', function() {
				reject(img);
			});
		});
		document.body.appendChild(img);
		return p;
	});
	return Promise.all(promises);
}

function alwaysResolvedDownload() {
	var images = anythingToImg(arguments);
	var promises = images.map(function(img) {
		var p = new Promise(function(resolve, reject) {
			img.addEventListener('load', function() {
				resolve({img: img.src, status: 'ok'});
			});
			img.addEventListener('error', function() {
				resolve({img: img.src, status: 'fail'});

			});
		});
		document.body.appendChild(img);
		return p;
	});
	return Promise.all(promises);
}

function placeholderDownload() {
	var images = anythingToImg(arguments);
	var promises = images.map(function(img) {
		var p = new Promise(function(resolve, reject) {
			img.addEventListener('load', function() {
				resolve({path: img.src, status: 'ok'});
			});
			img.addEventListener('error', function() {
				resolve({path: img.src, status: 'fail'});
				img.src = placeholder;
			});
		});
		document.body.appendChild(img);
		return p;
	});
	return Promise.all(promises);
}


function test(method) {
	function onSuccess(arrayOfLoaded) {
		console.log('Successfully loaded:', arrayOfLoaded);
	}

	function onFail(failedPath) {
		console.log('Failed on: ', failedPath)
	}
	var validPaths = [valid, valid, validImgInstance, valid, valid];
	var invalidPaths = [valid, invalid, valid, invalidImgInstance];

	//array
	method(validPaths).then(onSuccess, onFail);
	method(invalidPaths).then(onSuccess, onFail);
	//mixed
	method(valid, validImgInstance, invalid).then(onSuccess, onFail);
	method(invalidImgInstance, valid).then(onSuccess, onFail);

}

test(simpleDownload);
test(alwaysResolvedDownload);
test(placeholderDownload);
