define([ "dojo/_base/declare", 
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"app/js/FlickrWrapper",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/mouse",
	"dojo/on",
	"dojo/when",
	"dijit/Tooltip",
	"dojo/text!app/templates/PhotoBox.html",
	"dijit/layout/ContentPane",
	"dojox/mvc/Output"], function (dojo_declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, 
		FlickrWrapper, lang, domClass, domStyle, mouse, on, when, Tooltip, templateString) {
	var proto = {
		templateString: templateString,
		baseClass: 'photo',

		photo: null,
		title: null,

		// private variables
		_tooltip: null,

		postCreate: function() {
			this.inherited(arguments);

			this.titleLabel.set('value', this.photo.title);
			var url = FlickrWrapper.getPhotoUrl(this.photo);
			domStyle.set(this.image, 'backgroundImage', lang.replace('url({0})', [url]));

			this.own(on(this.domNode, mouse.enter, lang.hitch(this,this._showDetails)));
			this.own(on(this.domNode, mouse.leave, lang.hitch(this,this._hideDetails)));
		}, 

		startup: function() {
			this.inherited(arguments);

			when(FlickrWrapper.getPhotoInfo(this.photo), lang.hitch(this, function(result) {
				var comments = result.photo.comments._content;
				if (comments === "0") {
					domStyle.set(this.commentIcon, 'display', 'none');
				} else {
					this.commentNum.set('value', result.photo.comments._content);
				}

				var tags = result.photo.tags.tag.length;
				if (tags === "0") {
					domStyle.set(this.tagIcon, 'display', 'none');
				} else {
					this.tagNum.set('value', result.photo.tags.tag.length);
				}

				var dateTaken = this._parseDate(result.photo.dates.taken);
				this.dateTaken.set('value', 'Taken: ' + dateTaken);

				var datePosted = this._parseDate(result.photo.dates.posted);
				this.datePosted.set('value', 'Posted: ' + datePosted);
			}));
		},

		// parse date
		_parseDate: function(dateString) {
			var date = new Date(dateString);
			if (isNaN(date)) {
				var intVal = parseInt(dateString); // could be unix timestamp
				intVal = intVal * 1000;
				date = new Date(intVal);
			}

			if (date) {
				dateString = date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric'});
			}

			return dateString;
		},

		_showDetails: function() {
			domClass.add(this.domNode, 'show-details');

			// only add tooltip if the title does not fit
			if (!this._tooltip) {
				var titleDom = this.titleLabel.domNode;
				if (titleDom.clientWidth < titleDom.scrollWidth) {
					this.own(this._tooltip = new Tooltip({
						label: this.photo.title,
						connectId: [this.titleLabel]
					}));

					this._tooltip.startup();
				}
			}
		},
		_hideDetails: function() {
			domClass.remove(this.domNode, 'show-details');
		}
	};

	return dojo_declare("js.PhotoBox", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], proto);
});
