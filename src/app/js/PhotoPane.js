/**
 * This widget allows users to enter search values.
 */
define([ "dojo/_base/declare", 
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"app/js/FlickrWrapper",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/when",
	"dijit/MenuItem",
	"dojo/text!app/templates/PhotoPane.html",
	"dijit/layout/ContentPane",
	"dijit/form/Button",
	"dijit/form/DropDownButton",
	"dijit/DropDownMenu"], function (dojo_declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, 
		FlickrWrapper, array, lang, domClass, domConstruct, when, MenuItem, templateString) {

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

		// private variables
		_count: 50,
		_page: 1,
		_sort: null,
		_searchEnabled: false, // if false, display public photos, otherwise use search call

		postCreate: function() {
			this.inherited(arguments);
			this._createMenuItem('Relevance', 'Relevance');
			this._createMenuItem('DatePostedAsc', 'Date Posted Ascending');
			this._createMenuItem('DatePostedDesc', 'Date Posted Descending');
			this._createMenuItem('DateTakenAsc', 'Date Taken Ascending');
			this._createMenuItem('DateTakenDesc', 'Date Taken Descending');
		},

		startup: function() {
			this.inherited(arguments);
			this._loadPhotos();
		},

		// PRIVATE FUNCTIONS //
		/*
		* Load photos in the container
		*/
		_loadPhotos: function() {
			// if we are on page one, make sure the container is empty
			if (this._page === 1) 
				this.photosContainer

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

			when(FlickrWrapper.getPublicPhotos(parms), lang.hitch(this, function(results) {
				this._createPhotos(results.photo);
			}));
		},

		/*
		* Uses Flickr API to retrieve photos based on filter values
		*/
		_searchPhotos: function() {
			var parms = {};
			this._sort && (parms['sort'] = this._sort);
			parms['count'] = this._count;
			parms['page'] = this._page;

			when(FlickrWrapper.searchPhotos(parms), lang.hitch(this, function(results) {
				this._createPhotos(results.photo);
			}));
		},

		/*
		* Create a photo item node
		*/
		_createPhotos: function(photos) {
			// display no results label if there are no results
			var hideLabel = (photos && photos.length > 0) || this._page > 1;
			domClass.toggle(this.noResultsContainer, 'hidden', hideLabel);

			array.forEach(photos, function(photo) {
				var url = FlickrWrapper.getPhotoUrl(photo);
				var node = domConstruct.create('img', {'class': 'photo', src: url});
				domConstruct.place(node, this.photosContainer, 'last');
			}, this)
		},

		/*
		* Create a menu item
		*/
		_createMenuItem: function(field, label) {
			this.menu.addChild(
				new MenuItem ( {
					field: field,
					label: label,
					ref: this,
					onClick:this._menuItemClicked
				}));
		},

		// EVENT HANDLERS //
		/*
		* When load more button is clicked, load more photos
		*/
		_loadClicked: function() {
			this._page++;
			this._loadPhotos();
		},

		/*
		* When sort type changes, automatically reload photos
		*/
		_menuItemClicked: function(item) {
			var ref = this.ref;


			ref.dropButton.set('label', this.label);
			ref._page = 1; // go back to first page
			ref._sort = ref.sortType[this.field];
			ref._searchEnabled = true;
			ref._loadPhotos();
		}
	};

	return dojo_declare("js.PhotoPane", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], proto);
});
