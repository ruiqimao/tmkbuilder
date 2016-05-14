/*
 * Display an error.
 *
 * @param error The error.
 */
function showError(error) {
	$('#err').text(error);
	$('#msg').hide();
	$('#err').show();
}

/*
 * Display a message.
 *
 * @param message The message.
 */
function showMessage(message) {
	$('#msg').text(message);
	$('#err').hide();
	$('#msg').show();
}

/*
 * Clears all messages.
 */
function clearMessages() {
	$('#err').hide();
	$('#msg').hide();
}


/*
 * Read a text file.
 *
 * @param callback Function to call with the data.
 */
function readFile(callback) {
	// Create the file input object.
	var input = $(document.createElement('input'));
	input.attr('type', 'file');

	// Click the object.
	input.trigger('click');

	// Catch the change.
	input.change(function() {
		// Grab the file.
		var file = this.input[0].files[0];
		if (file) {
			// Create a new reader.
			var reader = new FileReader();
			reader.onload = function(evt) {
				var contents = evt.target.result;

				// Call the callback.
				this.callback(contents);
			}.bind(this);

			// Read the file.
			reader.readAsText(file, 'utf-8');
		}
	}.bind({ input: input, callback: callback }));
}
