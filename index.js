var valid = 'https://media2.giphy.com/media/Ewc0W5G3DtTwY/200_s.gif';
var invalid = 'invalid url';
var placeholder = 'http://forum.keshefoundation.org/core/images/default/default_avatar_large.png';
var validImgInstance = document.getElementById('valid');
var invalidImgInstance = document.getElementById('invalid');

function createImg(path) {
    var img = document.createElement('img');
    img.src = path;
    document.body.appendChild(img);
    return img;
}

function anythingToImg(items) {
    function process(itemsArray) {
        return Array.prototype.map.call(itemsArray, function (item) {
            if (typeof item === 'string') {
                return createImg(item);
            } else {
                return item;
            }
        });
    }

    items = Array.isArray(items[0]) ? items[0] : items;
    return process(items);
}

function createPromise(img) {
    return new Promise(function (resolve, reject) {
        if (img.complete) {
            if (typeof img.naturalWidth == "undefined" || img.naturalWidth == 0) {
                reject(img);
            } else {
                resolve(img);
            }
        } else {
            img.addEventListener('load', function () {
                resolve(img);
            });
            img.addEventListener('error', function () {
                reject(img);
            });
        }
    });
}

function createAlwaysResolvedPromise(img) {
    return createPromise(img)
        .then(function (imgObject) {
            return Promise.resolve({img: imgObject, status: 'ok'});
        }, function (imgObject) {
            imgObject.src = this.placeholder ? this.placeholder : imgObject.src;
            return Promise.resolve({img: imgObject, status: 'fail'});
        });
}

function simpleDownload() {
    var images = anythingToImg(arguments);
    return Promise.all(images.map(createPromise));
}


function alwaysResolvedDownload() {
    var images = anythingToImg(arguments);
    return Promise.all(images.map(createAlwaysResolvedPromise));

}

function placeholderDownload() {
    var images = anythingToImg(arguments);
    //there are few possibilities to pass placeholder option,
    //i didn't want to create anonymous function inside Array.map, so i've used bind
    //cause i'm confident that there's no another placeholder field in Window object
    return Promise.all(
        images.map(createAlwaysResolvedPromise.bind({placeholder: placeholder}))
    );
}


function test(method) {
    function onSuccess(arrayOfLoaded) {
        console.log('Successfully loaded:', arrayOfLoaded);
    }

    function onFail(failedPath) {
        console.log('Failed on: ', failedPath)
    }

    var validPaths = [valid, valid, validImgInstance, valid, valid];
    var invalidPaths = [invalidImgInstance, valid, invalid, valid, invalidImgInstance];

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
