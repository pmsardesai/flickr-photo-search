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

		_searchClicked: function(value) {
			this.photoPane.set('searchParms', value);
		},

		_clearClicked: function() {
			//this.photoPane.
		}
	};

	return dojo_declare("js.Page", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], proto);
});
