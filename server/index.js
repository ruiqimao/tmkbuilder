var express = require('express'),
	bodyParser = require('body-parser'),
	crypto = require('crypto'),
	exec = require('child_process').exec,
	async = require('async'),
	fs = require('fs'),
	constants = require('./constants');

// Create the express app.
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

// Set up the /api/build route.
app.post('/api/build', function(req, res) {
	var attributes = { req: req, res: res };
	// Allow cross-origin requests.
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');

	// Get the files.
	attributes.configH = req.body.configH;
	attributes.keymapCommonH = req.body.keymapCommonH;
	attributes.keymapC = req.body.keymapC;
	attributes.ledC = req.body.ledC;
	attributes.matrixC = req.body.matrixC;
	attributes.makefile = req.body.makefile;

	// Begin the operations.
	async.series([
		function(callback) {
			this.callback = callback;

			// Copy the firmware files to a temporary directory.
			this.temp = '/tmp/tmk-' + crypto.randomBytes(16).toString('hex');
			exec('cp -rp firmware/tmk_keyboard ' + this.temp, function(error, stdout, stderr) {
				if (error) return sendError(this);

				this.callback();
			}.bind(this));

		}.bind(attributes),

		function(callback) {
			this.callback = callback;

			// Copy config.h.
			fs.writeFile(this.temp + '/keyboard/config.h', this.configH, function(err) {
				if (err) return sendError(this);

				this.callback();
			}.bind(this));

		}.bind(attributes),

		function(callback) {
			this.callback = callback;

			// Copy keymap_common.h.
			fs.writeFile(this.temp + '/keyboard/keymap_common.h', this.keymapCommonH, function(err) {
				if (err) return sendError(this);

				this.callback();
			}.bind(this));

		}.bind(attributes),

		function(callback) {
			this.callback = callback;

			// Copy keymap.c.
			fs.writeFile(this.temp + '/keyboard/keymap.c', this.keymapC, function(err) {
				if (err) return sendError(this);

				this.callback();
			}.bind(this));

		}.bind(attributes),

		function(callback) {
			this.callback = callback;

			// Copy led.c.
			fs.writeFile(this.temp + '/keyboard/led.c', this.ledC, function(err) {
				if (err) return sendError(this);

				this.callback();
			}.bind(this));

		}.bind(attributes),

		function(callback) {
			this.callback = callback;

			// Copy matrix.c.
			fs.writeFile(this.temp + '/keyboard/matrix.c', this.matrixC, function(err) {
				if (err) return sendError(this);

				this.callback();
			}.bind(this));

		}.bind(attributes),

		function(callback) {
			this.callback = callback;

			// Copy Makefile.
			fs.writeFile(this.temp + '/keyboard/Makefile', this.makefile, function(err) {
				if (err) return sendError(this);

				this.callback();
			}.bind(this));

		}.bind(attributes),

		function(callback) {
			this.callback = callback;

			// Make the firmware.
			exec('cd ' + this.temp + '/keyboard && make', function(error, stdout, stderr) {
				if (error) return sendError(this);

				this.callback();
			}.bind(this));

		}.bind(attributes),

		function(callback) {
			this.callback = callback;

			// Read the firmware.hex file.
			fs.readFile(this.temp + '/keyboard/firmware.hex', 'utf8', function(err, data) {
				if (err) return sendError(this);

				this.hex = data;
				this.callback();
			}.bind(this));

		}.bind(attributes),

		function() {

			// Send the .hex file over.
			this.res.json({ hex: this.hex });

			// Clean up.
			cleanUp(this);
		}.bind(attributes)
	]);
});

app.listen(constants.PORT, function() {
	console.log('Listening on port ' + constants.PORT + '...');
});

/*
 * Send an API server error back to the client.
 *
 * @param attr Object with all attributes of the request.
 */
function sendError(attr) {
	attr.res.json({ error: 'API server error.' });
	cleanUp(attr);
}

/*
 * Cleans up.
 *
 * @param attr Object with all attributes of the request.
 */
function cleanUp(attr) {
	if (attr.temp) {
		exec('rm -rf ' + attr.temp);
	}
}
