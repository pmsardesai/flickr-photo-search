/**
 * This widget allows users to enter search values.
 */
define([ "dojo/_base/declare", 
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/dom-class",
	"dijit/MenuItem",
	"dojo/text!app/templates/SearchPane.html",
	"dijit/layout/ContentPane",
	"dijit/form/Button",
	"app/js/SearchTextBox",
	"dijit/form/DateTextBox",
	"dijit/form/DropDownButton",
	"dijit/DropDownMenu"], 
	function (dojo_declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, 
	domClass, MenuItem, templateString) {
	var proto = {
		templateString: templateString,
		baseClass: 'search-pane',

		sortType: {
			Relevance: 'relevance',
			DatePostedAsc: 'date-posted-asc',
			DatePostedDesc: 'date-posted-desc',
			DateTakenAsc: 'date-taken-asc',
			DateTakenDesc: 'date-taken-desc'
		},

		// private variables
		_sort: null,
		_text: null,
		
		postCreate: function() {
			this.inherited(arguments);
			this._createMenuItem('Relevance', 'Relevance');
			this._createMenuItem('DatePostedAsc', 'Date Posted Ascending');
			this._createMenuItem('DatePostedDesc', 'Date Posted Descending');
			this._createMenuItem('DateTakenAsc', 'Date Taken Ascending');
			this._createMenuItem('DateTakenDesc', 'Date Taken Descending');
		},

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
			this._text && (parms['text'] = this._text);
			this._sort && (parms['sort'] = this._sort);

			this._getDateValue(this.datePostedFrom, parms, 'min_upload_date');
			this._getDateValue(this.datePostedTo, parms, 'max_upload_date');
			this._getDateValue(this.dateTakenFrom, parms, 'min_taken_date');
			this._getDateValue(this.dateTakenTo, parms, 'max_taken_date');

			this.emit('Search', {}, [parms])
		},

		_hideFilterPane: function() {
			domClass.remove(this.filterContainer, 'show');
			domClass.remove(this.domNode, 'show-filters');
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
		_updateFilterState: function(state) {
			if (state) {
				domClass.add(this.filterContainer, 'show');
				domClass.add(this.domNode, 'show-filters');
			} else {
				this._hideFilterPane();
			}
		},

		_searchButtonClicked: function(value) {
			this._text = value;
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

			this.dropButton.set('label', 'Relevance');
			this._sort = null;

			this.searchText.set('value', '');
		},

		_dateChanged: function(value) {
			value && this._emitSearchEvent();
		},

		/*
		* When sort type changes, automatically reload photos
		*/
		_menuItemClicked: function() {
			var ref = this.ref;
			ref.dropButton.set('label', this.label);
			ref._sort = ref.sortType[this.field];
			ref._emitSearchEvent();
		},
		
		onSearch: function() { },
		onClear: function() { } 
	};

	return dojo_declare("js.SearchPane", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], proto);
});
