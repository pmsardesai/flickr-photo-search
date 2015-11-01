/**
 * This file is the application's main JavaScript file. It is listed as a dependency in index.html and will
 * automatically load when index.html loads.
 */
define([ 'app/js/Page', 'dojo/domReady!' ], function (Page) {
	var app = {};

	// Create a new instance of page
	app.page = new Page().placeAt(document.body);
	app.page.startup();
	return app;
});
