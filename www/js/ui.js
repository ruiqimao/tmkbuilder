/*** GLOBAL VARIABLES ***/

var _keyboard; // The current keyboard object.


/*** PAGE LOAD ***/

$(document).ready(function() {
});


/*** INITIAL SETUP ***/

// Upload button.
$('#tfb-upload').click(function() {
	// Get the file.
	readFile(function(json) {
		try {
			_keyboard = JSON.parse(json);
			
			// Reset and show the config screen.
			resetConfig();
			showScreen('config');
		} catch (e) {
			showError('Bad configuration file.');
		}
	});
});

// Import button.
$('#kle-import').click(function() {
	// Get the contents of the textarea.
	var json = $('#kle').val();

	// Attempt to create the keyboard.
	try {
		_keyboard = fromKLE(json);

		// Reset and show the config screen.
		resetConfig();
		showScreen('config');
	} catch (e) {
		showError('Invalid layout.');
	}
});


/*** CONFIG ***/

/*
 * Reset the config.
 */
function resetConfig() {
}
