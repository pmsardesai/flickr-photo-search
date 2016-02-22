/**
 * This widget allows users to enter search values.
 */
define([ "dojo/_base/declare", 
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/dom-class",
	"dijit/focus",
	"dijit/MenuItem",
	"dijit/popup",
	"dojo/text!app/templates/SearchPane.html", // template
	"app/js/SearchTextBox",
	"dijit/DropDownMenu",
	"dijit/form/Button",
	"dijit/form/DateTextBox",
	"dijit/form/DropDownButton",
	"dijit/form/ToggleButton",
	"dijit/layout/ContentPane",
	"dojox/mvc/Output"], 
	function (dojo_declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, 
	domClass, focus, MenuItem, popup, templateString) {
	var proto = {
		templateString: templateString,
		baseClass: 'search-pane',
		total: 0,

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
		_activeMenuItem: null,
		
		postCreate: function() {
			this.inherited(arguments);
			this._createMenuItem('Relevance', 'Relevance', null, true);
			this._createMenuItem('DatePostedAsc', 'Date Posted', true);
			this._createMenuItem('DatePostedDesc', 'Date Posted', false);
			this._createMenuItem('DateTakenAsc', 'Date Taken', true);
			this._createMenuItem('DateTakenDesc', 'Date Taken', false);
		},

		// SETTERS //
		_setTotalAttr: function(value) {
			this._set('total', value);
			if (value === 0) {
				this.totalLabel.innerHTML = '';
			} else {
				this.totalLabel.innerHTML = value + ' results found';
			}
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
			this._hideFilterPane(); // collapse pane
		},

		_hideFilterPane: function() {
			domClass.remove(this.filterContainer, 'show');
			domClass.remove(this.domNode, 'show-filters');
			this.searchText.set('filterState', false);
		},

		/*
		* Create a menu item
		*/
		_createMenuItem: function(field, label, isAscending, isActive) {
			if (isAscending !== null) {
				var sortType = isAscending ? "fa-sort-asc" : "fa-sort-desc";
				label += '<span class="fa ' + sortType + '"></span>';
			}

			var menuItem = new MenuItem ( {
				field: field,
				label: label,
				ref: this,
				onClick:this._menuItemClicked
			});
			this.menu.addChild(menuItem);

			if (isActive) {
				this._activeMenuItem = menuItem;
				domClass.add(menuItem.domNode, 'active');
			}
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

		_sortClicked: function() {
			var me = this;
			popup.open({
		        parent: this,
		        popup: this.menu,
		        around: this.searchText.domNode,
		        orient: ['below'],
		        onExecute: function(){ popup.close(this.menu); },
		        onCancel: function(){ popup.close(this.menu); }
		    });

			// add focus to dropdown so that it hides on blur
		    focus.focus(this.menu.domNode);
		},
		_closeMenu: function() {
			popup.close(this.menu);
		},

		/*
		* When sort type changes, automatically reload photos
		*/
		_menuItemClicked: function() {
			var ref = this.ref;

			// if same menu item clicked, don't do anything!
			if (this === this.ref._activeMenuItem)
				return;

			ref.dropButton.set('label', this.label);
			ref._sort = ref.sortType[this.field];
			ref._emitSearchEvent();

			// remove active class from previous item and add to the new one
			ref._activeMenuItem && domClass.remove(ref._activeMenuItem.domNode, 'active');
			ref._activeMenuItem = this;
			domClass.add(this.domNode, 'active');
		},
		
		onSearch: function() { },
		onClear: function() { } 
	};

	return dojo_declare("js.SearchPane", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], proto);
});
