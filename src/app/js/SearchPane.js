/**
 * This widget allows users to enter search values.
 */
define([ "dojo/_base/declare", 
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!app/templates/SearchPane.html",
	"dijit/layout/ContentPane",
	"dijit/form/Button",
	"app/js/SearchTextBox"], 
	function (dojo_declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, 
		templateString) {
	var proto = {
		templateString: templateString,
		baseClass: 'search-pane',
		
		_searchClicked: function(value) {
			this.emit('Search', {}, [value])
		},
		
		onSearch: function() { }
	};

	return dojo_declare("js.SearchPane", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], proto);
});
