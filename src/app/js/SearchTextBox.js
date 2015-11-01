/**
 * This widget allows users to enter search values.
 */
define([ "dojo/_base/declare", 
	"dijit/form/TextBox",
	"app/js/FlickrWrapper",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/on"], function (dojo_declare, _TextBox, FlickrWrapper, lang, domClass, domConstruct, on) {

	var proto = {
		postCreate: function() {
			this.inherited(arguments);
			domClass.add(this.domNode, "search-box");

			var searchNode = domConstruct.create("a", {'class': 'fa-search fa'}, this.domNode, 'last');
			this.own(on(searchNode, 'click', lang.hitch(this, function() {
				this.emit('Search')
			})));
			this.own(on(searchNode, 'keypress', lang.hitch(this, function() {
				this.emit('Search')
			})));
		},

		// DEFAULT EVENTS //
		onSearch: function() { }
	};

	return dojo_declare("js.SearchTextBox", [_TextBox], proto);
});
