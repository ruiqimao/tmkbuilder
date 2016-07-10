/*** GLOBAL VARIABLES ***/

var _keyboard; // The current keyboard object.
var _activeId; // The current active key id.
var _activeLayer = 0; // The current active layer.
var _activeMacro = 0; // The current active macro.
var _macroMode = MACRO_DOWN; // The macro action mode.
var _configMode = MODE_WIRE; // The current config mode.
var _keyboardInput = false; // Whether to take keyboard input to assign keys.
var _displayFlip = false; // Whether to display the keyboard flipped.
var _recording = false; // Whether a macro is currently being recorded.
var _recordingMacro = []; // The currently recording macro.

var _keys = []; // List of key elements on the keyboard.
var _rowLines = {}; // List of row line elements on the keyboard.
var _colLines = {}; // List of column line elements on the keyboard.
var _rowInds = []; // List of row indicators.
var _colInds = []; // List of column indicators.
