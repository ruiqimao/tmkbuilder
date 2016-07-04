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

// Set up the /build route.
app.post('/build', function(req, res) {
	var attributes = { req: req, res: res };
	// Allow cross-origin requests.
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');

	// Get the files.
	attributes.keymapCommonH = req.body.keymapCommonH;
	attributes.keymapC = req.body.keymapC;
	attributes.ledC = req.body.ledC;
	attributes.matrixC = req.body.matrixC;

	// Begin the operations.
	async.series([
		function(callback) {
			this.callback = callback;

			// Copy the firmware files to a temporary directory.
			this.temp = '/tmp/tmk-' + crypto.randomBytes(16).toString('hex');
			exec('cp -r firmware/tmk_keyboard ' + this.temp, function(error, stdout, stderr) {
				if (error) return sendError(this.res);

				this.callback();
			}.bind(this));

		}.bind(attributes),

		function(callback) {
			this.callback = callback;

			// Copy keymap_common.h.
			fs.writeFile(this.temp + '/keyboard/keymap_common.h', this.keymapCommonH, function(err) {
				if (err) return sendError(this.res);

				this.callback();
			}.bind(this));

		}.bind(attributes),

		function(callback) {
			this.callback = callback;

			// Copy keymap.c.
			fs.writeFile(this.temp + '/keyboard/keymap.c', this.keymapC, function(err) {
				if (err) return sendError(this.res);

				this.callback();
			}.bind(this));

		}.bind(attributes),

		function(callback) {
			this.callback = callback;

			// Copy led.c.
			fs.writeFile(this.temp + '/keyboard/led.c', this.ledC, function(err) {
				if (err) return sendError(this.res);

				this.callback();
			}.bind(this));

		}.bind(attributes),

		function(callback) {
			this.callback = callback;

			// Copy matrix.c.
			fs.writeFile(this.temp + '/keyboard/matrix.c', this.matrixC, function(err) {
				if (err) return sendError(this.res);

				this.callback();
			}.bind(this));

		}.bind(attributes),

		function(callback) {
			this.callback = callback;

			// Make the firmware.
			exec('cd ' + this.temp + '/keyboard && make', function(error, stdout, stderr) {
				if (error) return sendError(this.res);

				this.callback();
			}.bind(this));

		}.bind(attributes),

		function(callback) {
			this.callback = callback;

			// Read the firmware.hex file.
			fs.readFile(this.temp + '/keyboard/firmware.hex', 'utf8', function(err, data) {
				if (err) return sendError(this.res);

				this.hex = data;
				this.callback();
			}.bind(this));

		}.bind(attributes),

		function(callback) {
			this.callback = callback;

			// Send the .hex file over.
			this.res.json({ hex: this.hex });

			this.callback();
		}.bind(attributes),

		function() {

			// Clean up.
			exec('rm -rf ' + this.temp);

		}.bind(attributes)
	]);
});

app.listen(constants.PORT, function() {
	console.log('Listening on port ' + constants.PORT + '...');
});

/*
 * Send an API server error back to the client.
 *
 * @param res The response object.
 */
function sendError(res) {
	res.json({ error: 'API server error.' });
}
