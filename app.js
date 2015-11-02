var express = require('express'),
	path = require('path'),
	stylus = require('stylus'),
	nib = require('nib');

var app = express();

app.set('port', 5000);

// setup stylus
app.use(stylus.middleware(
	{ 
		src: path.join(__dirname, 'src'),
		compile: function compile(str, path) {
			return stylus(str)
			.set('filename', path)
			.use(nib())
		}
	}
));

app.use(express.static(path.join(__dirname, 'src')));

// get html file which will load dojo and app
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});