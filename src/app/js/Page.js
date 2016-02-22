/**
 * The main page.
 */
define([ "dojo/_base/declare", 
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"app/js/FlickrWrapper",
	"dijit/focus",
	"dijit/popup",
	"dojo/_base/lang",
	"dojo/when",
	"dojo/text!app/templates/Page.html", // template
	"dijit/DropDownMenu",
	"dijit/MenuItem",
	"dijit/layout/ContentPane",
	"dojox/mvc/Output",
	"app/js/PhotoPane",
	"app/js/SearchPane"], function (dojo_declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, 
		FlickrWrapper, focus, popup, lang, when, templateString) {
	var proto = {
		templateString: templateString,
		baseClass: 'page',

		postCreate: function() {
			// get user info
			when(FlickrWrapper.getUserInfo(), lang.hitch(this, function(results) {
				// looks like I will have to use _content (private) to get the 
				// real/user name.
				var real = results.person.realname._content;
				this.realname.set('value', real);
				var username = results.person.username._content;
				this.username.set('value', username);
			}));

			this.inherited(arguments);

			this.own(this.menu);
			popup.moveOffScreen(this.menu);
		},

		_profileMenuClicked: function() {
			var me = this;
			popup.open({
		        parent: this,
		        popup: this.menu,
		        around: this.profileInfo,
		        orient: ['below-alt'],
		        onExecute: function(){ me._closeMenu(); },
		        onCancel: function(){ me._closeMenu(); }
		    });

			// add focus to dropdown so that it hides on blur
		    focus.focus(this.menu.domNode);
		},

		_closeMenu: function() {
			popup.close(this.menu);
		},

		_searchClicked: function(value) {
			this.photoPane.set('searchParms', value);
		},

		_clearClicked: function() {
			this.photoPane.set('searchParms', null);
		},

		_onTotalUpdated: function(value) {
			this.searchPane.set('total', value);
		}
	};

	return dojo_declare("js.Page", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], proto);
});
