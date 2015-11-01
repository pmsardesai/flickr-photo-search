/**
 * The main page.
 */
define([ "dojo/_base/declare", 
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!app/templates/Page.html",
	"dijit/layout/ContentPane",
	"app/js/PhotoPane",
	"app/js/SearchPane"], function (dojo_declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, 
		templateString) {
	var proto = {
		templateString: templateString,
		baseClass: 'page',
		dialog: null,
		startup: function() {
			this.inherited(arguments);
			var test = templateString;
		},

		_sendRequest: function() {
			Ajax.getPublicPhotos();
		}
	};

	return dojo_declare("js.Page", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], proto);
});
