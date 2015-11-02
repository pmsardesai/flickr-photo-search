/**
 * This widget allows users to enter search values.
 */
define([ "dojo/_base/declare", 
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/dom-class",
	"dojo/text!app/templates/SearchPane.html",
	"dijit/layout/ContentPane",
	"dijit/form/Button",
	"app/js/SearchTextBox",
	"dijit/form/DateTextBox"], 
	function (dojo_declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, 
		domClass, templateString) {
	var proto = {
		templateString: templateString,
		baseClass: 'search-pane',

		text: null,
		
		// PRIVATE FUNCTIONS //
		_getDateValue: function(widget, parms, key) {
			var date = widget.get('value');
			if (date){
				var unixTimestamp = parseInt(date.getTime() / 1000);
				parms[key] = unixTimestamp;
			}
		},

		_emitSearchEvent: function() {
			var parms = {};
			this.text && (parms['text'] = value);

			this._getDateValue(this.datePostedFrom, parms, 'min_upload_date');
			this._getDateValue(this.datePostedTo, parms, 'max_upload_date');
			this._getDateValue(this.dateTakenFrom, parms, 'min_taken_date');
			this._getDateValue(this.dateTakenTo, parms, 'max_taken_date');

			this.emit('Search', {}, [parms])
		},

		_hideFilterPane: function() {
			domClass.remove(this.filterContainer, 'show');
			domClass.remove(this.domNode, 'show-filters');
			this.moreOptions.buttonState = 'hide';
			this.moreOptions.set('label', 'More Options');
		},

		// EVENT HANDLERS //
		_updateFilterState: function() {
			if (this.moreOptions.buttonState === 'hide') {
				domClass.add(this.filterContainer, 'show');
				domClass.add(this.domNode, 'show-filters');
				this.moreOptions.buttonState = 'show';
				this.moreOptions.set('label', 'Hide Options');
			} else {
				this._hideFilterPane();
			}
		},

		_searchButtonClicked: function(value) {
			this.set('text', value);
			this._emitSearchEvent();
			this._hideFilterPane();
		},

		_clearFilters: function(value) {
			this.emit('Clear');
			this._hideFilterPane();

			// clear all the filter values
			this.datePostedFrom.set('value', null);
			this.datePostedTo.set('value', null);
			this.dateTakenFrom.set('value', null);
			this.dateTakenTo.set('value', null);
		},

		_dateChanged: function(value) {
			value && this._emitSearchEvent();
		},
		
		onSearch: function() { },
		onClear: function() { } 
	};

	return dojo_declare("js.SearchPane", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], proto);
});
