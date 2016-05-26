/*** GLOBAL VARIABLES ***/

var _keyboard; // The current keyboard object.
var _activeId; // The current active key id.


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

// Wires checkbox.
$('#wires').click(function() {
	alert('hi');
});

/*
 * Reset the config.
 */
function resetConfig() {
	// Create the new keyboard UI.
	createKeyboardUI();
}

/*
 * Create a new keyboard UI.
 */
function createKeyboardUI() {
	// Clear the keyboard.
	$('#keyboard').empty();

	// Set the size of the keyboard.
	$('#keyboard').css('width', _keyboard.cols * UI_KEY_SIZE + 'rem');
	$('#keyboard').css('height', _keyboard.rows * UI_KEY_SIZE + 'rem');

	// Add the keys.
	for (var i in _keyboard.keys) {
		var key = _keyboard.keys[i];

		// Create a new key.
		var uiKey = $('<div class="key"><div class="key-inner"></div></div>');

		// Set the key's size.
		uiKey.css('width', key.width * UI_KEY_SIZE + 'rem');
		uiKey.css('height', key.height * UI_KEY_SIZE + 'rem');

		// Set the key's position.
		uiKey.css('left', key.x * UI_KEY_SIZE + 'rem');
		uiKey.css('top', key.y * UI_KEY_SIZE + 'rem');

		// Store which key this is.
		uiKey.data('id', i);

		// Register the key's click event.
		uiKey.click(function() {
			// Set the active key.
			setActiveKey($(this));
		});

		// Add the key to the keyboard.
		$('#keyboard').append(uiKey);
	}
}

/*
 * Set the active key.
 *
 * @param key The UI key to set to be active.
 */
function setActiveKey(key) {
	// Set the active ID.
	_activeId = parseInt(key.data('id'));

	// Erase the active class from all keys.
	$('.key').removeClass('active');

	// Set the current key to be active.
	key.addClass('active');

	// Reload key config data.
	reloadKeyConfig();
}

/*
 * Reload the key config data.
 */
function reloadKeyConfig() {
}
