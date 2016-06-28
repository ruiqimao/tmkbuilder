/*** GLOBAL VARIABLES ***/

var _keyboard; // The current keyboard object.
var _activeId; // The current active key id.
var _configMode = MODE_WIRE; // The current config mode.

var _keys = []; // List of key elements on the keyboard.
var _rowLines = {}; // List of row line elements on the keyboard.
var _colLines = {}; // List of column line elements on the keyboard.
var _rowInds = []; // List of row indicators.
var _colInds = []; // List of column indicators.

var _rowPins = []; // List of row pin elements.
var _colPins = []; // List of column pin elements.
