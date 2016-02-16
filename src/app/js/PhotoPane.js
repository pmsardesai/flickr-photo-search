/**
 * This widget allows users to enter search values.
 */
define([ "dojo/_base/declare", 
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"app/js/FlickrWrapper",
	"app/js/PhotoBox",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/when",
	"dojo/text!app/templates/PhotoPane.html",
	"dijit/layout/ContentPane",
	"dijit/form/Button",
	"dojox/mvc/Output"], function (dojo_declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, 
		FlickrWrapper, Photo, array, lang, domClass, domConstruct, when, templateString) {

	var proto = {
		templateString: templateString,
		baseClass: 'photo-pane',

		sortType: {
			Relevance: 'relevance',
			DatePostedAsc: 'date-posted-asc',
			DatePostedDesc: 'date-posted-desc',
			DateTakenAsc: 'date-taken-asc',
			DateTakenDesc: 'date-taken-desc'
		},
		searchParms: null,

		// private variables
		_count: 50,
		_page: 1,
		_searchEnabled: false, // if false, display public photos, otherwise use search call
		_currentDeferred: null, // used to determine whether or not search is in progress

		startup: function() {
			this.inherited(arguments);
			this._loadPhotos();
		},

		// GETTERS AND SETTERS //
		/*
		* Sets the new search parms and refresh photos container
		*/
		_setSearchParmsAttr: function(value) {
			this._set('searchParms', value)

			this._page = 1;
			this._searchEnabled = !!value;
			this._loadPhotos();
		},

		// PRIVATE FUNCTIONS //
		/*
		* Load photos in the container
		*/
		_loadPhotos: function() {
			// if there is a search in progress, ignore the current call
			if (this._currentDeferred && !this._currentDeferred.isResolved()) {
				return;
			}

			// if we are on page one, make sure the container is empty
			if (this._page === 1) 
				domConstruct.empty(this.photosContainer);

			if (this._searchEnabled) {
				this._searchPhotos();
			} else {
				this._getPublicPhotos();
			}
		},

		/*
		* Uses Flickr API to retrieve public photos
		*/
		_getPublicPhotos: function() {
			var parms = {
				per_page: this._count,
				page: this._page
			};

			this._currentDeferred = FlickrWrapper.getPublicPhotos(parms);
			when(this._currentDeferred, lang.hitch(this, function(results) {
				this._createPhotos(results.photos);
			}));
		},

		/*
		* Uses Flickr API to retrieve photos based on filter values
		*/
		_searchPhotos: function() {
			var parms = this.searchParms || {};
			parms['count'] = this._count;
			parms['page'] = this._page;

			this._currentDeferred = FlickrWrapper.searchPhotos(parms);
			when(this._currentDeferred, lang.hitch(this, function(results) {
				this._createPhotos(results.photos);
			}));
		},

		/*
		* Create a photo item node
		*/
		_createPhotos: function(photos) {
			// display no results label if there are no results
			domClass.toggle(this.noResultsContainer, 'dijitHidden', photos.pages > 0);

			// if we have one page of results, or we are on the last page, hide load more container
			var hideLoadMoreContainer = photos.pages === 0 || photos.pages === this._page;
			domClass.toggle(this.loadMoreContainer, 'dijitHidden', hideLoadMoreContainer);

			var photos = photos.photo;
			array.forEach(photos, function(photo) {
				// create a photo node and place in container
				var node = new Photo({photo: photo});
				node.startup();
				this.own(node);
				domConstruct.place(node.domNode, this.photosContainer, 'last');
			}, this)
		},

		// EVENT HANDLERS //
		/*
		* When load more button is clicked, load more photos
		*/
		_loadClicked: function() {
			this._page++; // increment so that we can get the next page
			this._loadPhotos();
		}
	};

	return dojo_declare("js.PhotoPane", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], proto);
});
