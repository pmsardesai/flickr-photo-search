/**
 * An array of items
 */
define([
	"dojo/_base/lang",
	"dojo/Deferred",
	"dojo/request/xhr"], function (lang, Deferred, xhr) {
	var proto = {
		// authentication
		_apiKey: 'a5e95177da353f58113fd60296e1d250',
		_userId: '24662369@N07',
		_apiUrl: 'https://api.flickr.com/services/rest/?method={0}&api_key={1}&user_id={2}&format=json&nojsoncallback=1',

		_photoUrl: 'https://farm{0}.staticflickr.com/{1}/{2}_{3}{4}.jpg',
		// list of api methods
		_methodGetPublicPhotos: 'flickr.people.getPublicPhotos',
		_methodSearch: 'flickr.photos.search',

		// additional functions
		//_methodGetUserDetails: 'flickr.people.getInfo',
		//_methodGetPhotoInfo: 'flickr.photos.getInfo', // api_key, photo_id, secret
		//_methodGetCommentList: 'flickr.photos.comments.getList',
		//_methodGetPeopleList: 'flickr.photos.people.getList',

// images
/*
var sampleImgObj = { "id": "11738172576", "owner": "12218676@N04", "secret": "37d0aeb353", "server": "3803", "farm": 4, "title": "_IGP1164", "ispublic": 1, "isfriend": 0, "isfamily": 0 };
var urlDefault = 'https://farm' + sampleImgObj.farm + '.staticflickr.com/' + sampleImgObj.server + '/' + sampleImgObj.id + '_' + sampleImgObj.secret + '.jpg';
var urlLarge = 'https://farm' + sampleImgObj.farm + '.staticflickr.com/' + sampleImgObj.server + '/' + sampleImgObj.id + '_' + sampleImgObj.secret + '_b.jpg';

//(500px)   urlDefault = https://farm4.staticflickr.com/3803/11738172576_37d0aeb353.jpg
//(1024px)  urlLarge = https://farm4.staticflickr.com/3803/11738172576_37d0aeb353_b.jpg
*/

		getPublicPhotos: function(optionalParams) {
			return this._makeAjaxRequest(this._methodGetPublicPhotos, optionalParams);
		},

		getPhotoUrl: function(imgObj, isLarge) {
			var smallOrLarge = isLarge ? '_b' : '';
			return lang.replace(this._photoUrl, [imgObj.farm, imgObj.server, imgObj.id, imgObj.secret, smallOrLarge]);
		},

		_makeAjaxRequest: function(method, optionalParams) {
			var deferred = new Deferred();

			// build url
			var url = lang.replace(this._apiUrl, [method, this._apiKey, this._userId]);
			if (optionalParams) {
				for (var key in optionalParams) {
					url += lang.replace("&{0}={1}", [key, optionalParams[key]]);
				}
			}

			// send request
			xhr(url, {
		    	handleAs: "json",
		    	headers: {
		            "X-Requested-With": null
		        }
		    }).then(function(result){
		    	if (result && result.photos) {
			    	deferred.resolve(result.photos);
			    }
		    });

		    return deferred;
		}
	};

	return proto;
});
