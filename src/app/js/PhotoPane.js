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
	"dojo/text!app/templates/PhotoPane.html",
	"dijit/layout/ContentPane",
	"dijit/form/Button"], function (dojo_declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, 
		FlickrWrapper, array, lang, domClass, domConstruct, when, templateString) {

	var proto = {
		templateString: templateString,
		baseClass: 'photo-pane',

		// private variables
		_page: 1,
		_count: 50,

		startup: function() {
			this.inherited(arguments);
			this._getPublicPhotos();
		},

		// PUBLIC FUNCTIONS //
		reset: function() {
			this._page = 1;
		},

		// PRIVATE FUNCTIONS //
		_getPublicPhotos: function() {
			var parms = {
				per_page: this._count,
				page: this._page
			};

			when(FlickrWrapper.getPublicPhotos(parms), lang.hitch(this, function(results) {
				var photos = results.photo;

				// display no results label if there are no results
				var hideLabel = (photos && photos.length > 0) || this._page > 1;
				domClass.toggle(this.noResultsContainer, 'hidden', hideLabel);

				array.forEach(photos, function(photo) {
					var url = FlickrWrapper.getPhotoUrl(photo);
					var node = domConstruct.create('img', {src: url});
					domConstruct.place(node, this.photosContainer, 'last');
				}, this)
			}));
		},

		// EVENT HANDLERS //
		_loadClicked: function() {
			this._page++;
			this._getPublicPhotos();
		}
	};

	return dojo_declare("js.PhotoPane", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], proto);
});
