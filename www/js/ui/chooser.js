/*** KEY CHOOSER ***/

/*
 * Creates a key chooser.
 *
 * @param callback The callback to use when a key is selected.
 *
 * @return A jQuery object that can be added into the document.
 */
function createChooser(callback) {
	var html = `
		<div class="config-key-chooser">
			<div class="radio-group">
				<button class="config-key-tab active" id="config-key-primary">Primary</button>
				<button class="config-key-tab" id="config-key-secondary">Secondary</button>
				<button class="config-key-tab" id="config-key-keypad">Keypad</button>
				<button class="config-key-tab" id="config-key-system">System</button>
				<button class="config-key-tab" id="config-key-layer">Fn</button>
			</div>
			<br>
			<div class="config-key-pane" id="config-key-primary" style="display:block;">
				<button class="config-key-btn">1</button>
				<button class="config-key-btn">2</button>
				<button class="config-key-btn">3</button>
				<button class="config-key-btn">4</button>
				<button class="config-key-btn">5</button>
				<button class="config-key-btn">6</button>
				<button class="config-key-btn">7</button>
				<button class="config-key-btn">8</button>
				<button class="config-key-btn">9</button>
				<button class="config-key-btn">0</button>
				<br><br>
				<button class="config-key-btn">A</button>
				<button class="config-key-btn">B</button>
				<button class="config-key-btn">C</button>
				<button class="config-key-btn">D</button>
				<button class="config-key-btn">E</button>
				<button class="config-key-btn">F</button>
				<button class="config-key-btn">G</button>
				<button class="config-key-btn">H</button>
				<button class="config-key-btn">I</button>
				<button class="config-key-btn">J</button>
				<button class="config-key-btn">K</button>
				<button class="config-key-btn">L</button>
				<button class="config-key-btn">M</button>
				<br>
				<button class="config-key-btn">N</button>
				<button class="config-key-btn">O</button>
				<button class="config-key-btn">P</button>
				<button class="config-key-btn">Q</button>
				<button class="config-key-btn">R</button>
				<button class="config-key-btn">S</button>
				<button class="config-key-btn">T</button>
				<button class="config-key-btn">U</button>
				<button class="config-key-btn">V</button>
				<button class="config-key-btn">W</button>
				<button class="config-key-btn">X</button>
				<button class="config-key-btn">Y</button>
				<button class="config-key-btn">Z</button>
				<br><br>
				<button class="config-key-btn">-</button>
				<button class="config-key-btn">=</button>
				<button class="config-key-btn">[</button>
				<button class="config-key-btn">]</button>
				<button class="config-key-btn">\\</button>
				<button class="config-key-btn">;</button>
				<button class="config-key-btn">'</button>
				<button class="config-key-btn">\`</button>
				<button class="config-key-btn">,</button>
				<button class="config-key-btn">.</button>
				<button class="config-key-btn">/</button>
				<br><br>
				<button class="config-key-btn">ENTER</button>
				<button class="config-key-btn">ESC</button>
				<button class="config-key-btn">BACKSPACE</button>
				<button class="config-key-btn">TAB</button>
				<button class="config-key-btn">SPACE</button>
				<button class="config-key-btn">CAPS</button>
				<button class="config-key-btn">APP</button>
				<br><br>
				<button class="config-key-btn">LCTRL</button>
				<button class="config-key-btn">LSHIFT</button>
				<button class="config-key-btn">LALT</button>
				<button class="config-key-btn">LGUI</button>
				<button class="config-key-btn">RCTRL</button>
				<button class="config-key-btn">RSHIFT</button>
				<button class="config-key-btn">RALT</button>
				<button class="config-key-btn">RGUI</button>
			</div>
			<div class="config-key-pane" id="config-key-secondary">
				<button class="config-key-btn">F1</button>
				<button class="config-key-btn">F2</button>
				<button class="config-key-btn">F3</button>
				<button class="config-key-btn">F4</button>
				<button class="config-key-btn">F5</button>
				<button class="config-key-btn">F6</button>
				<br>
				<button class="config-key-btn">F7</button>
				<button class="config-key-btn">F8</button>
				<button class="config-key-btn">F9</button>
				<button class="config-key-btn">F10</button>
				<button class="config-key-btn">F11</button>
				<button class="config-key-btn">F12</button>
				<br>
				<button class="config-key-btn">F13</button>
				<button class="config-key-btn">F14</button>
				<button class="config-key-btn">F15</button>
				<button class="config-key-btn">F16</button>
				<button class="config-key-btn">F17</button>
				<button class="config-key-btn">F18</button>
				<br>
				<button class="config-key-btn">F19</button>
				<button class="config-key-btn">F20</button>
				<button class="config-key-btn">F21</button>
				<button class="config-key-btn">F22</button>
				<button class="config-key-btn">F23</button>
				<button class="config-key-btn">F24</button>
				<br><br>
				<button class="config-key-btn">PRTSCR</button>
				<button class="config-key-btn">SCROLL LOCK</button>
				<button class="config-key-btn">PAUSE</button>
				<br><br>
				<button class="config-key-btn">INSERT</button>
				<button class="config-key-btn">DELETE</button>
				<button class="config-key-btn">HOME</button>
				<button class="config-key-btn">END</button>
				<button class="config-key-btn">PGUP</button>
				<button class="config-key-btn">PGDN</button>
				<br>
				<button class="config-key-btn">LEFT</button>
				<button class="config-key-btn">DOWN</button>
				<button class="config-key-btn">UP</button>
				<button class="config-key-btn">RIGHT</button>
			</div>
			<div class="config-key-pane" id="config-key-keypad">
				<button class="config-key-btn">NUM LOCK</button>
				<button class="config-key-btn">P/</button>
				<button class="config-key-btn">P*</button>
				<button class="config-key-btn">P-</button>
				<button class="config-key-btn">P+</button>
				<button class="config-key-btn">P.</button>
				<button class="config-key-btn">P=</button>
				<button class="config-key-btn">PENTER</button>
				<br><br>
				<button class="config-key-btn">P1</button>
				<button class="config-key-btn">P2</button>
				<button class="config-key-btn">P3</button>
				<button class="config-key-btn">P4</button>
				<button class="config-key-btn">P5</button>
				<button class="config-key-btn">P6</button>
				<button class="config-key-btn">P7</button>
				<button class="config-key-btn">P8</button>
				<button class="config-key-btn">P9</button>
				<button class="config-key-btn">P0</button>
			</div>
			<div class="config-key-pane" id="config-key-system">
				<button class="config-key-btn">POWER</button>
				<button class="config-key-btn">SLEEP</button>
				<button class="config-key-btn">WAKE</button>
				<br><br>
				<button class="config-key-btn">MUTE</button>
				<button class="config-key-btn">VOL DN</button>
				<button class="config-key-btn">VOL UP</button>
			</div>
			<div class="config-key-pane" id="config-key-layer">
				<h3>Momentary Layer Switch</h3>
				<button class="config-key-btn">L1</button>
				<button class="config-key-btn">L2</button>
				<button class="config-key-btn">L3</button>
				<button class="config-key-btn">L4</button>
				<button class="config-key-btn">L5</button>
				<button class="config-key-btn">L6</button>
				<button class="config-key-btn">L7</button>
				<br><br>
				<h3>Toggle Layer Switch</h3>
				<button class="config-key-btn">T1</button>
				<button class="config-key-btn">T2</button>
				<button class="config-key-btn">T3</button>
				<button class="config-key-btn">T4</button>
				<button class="config-key-btn">T5</button>
				<button class="config-key-btn">T6</button>
				<button class="config-key-btn">T7</button>
				<br><br>
				<h3>Macro</h3>
				<button class="config-key-btn">M0</button>
				<button class="config-key-btn">M1</button>
				<button class="config-key-btn">M2</button>
				<button class="config-key-btn">M3</button>
				<button class="config-key-btn">M4</button>
				<button class="config-key-btn">M5</button>
				<button class="config-key-btn">M6</button>
				<button class="config-key-btn">M7</button>
			</div>
		</div>`;

	// Create the element.
	var chooser = $(html);

	// Key config tab.
	chooser.find('.config-key-tab').click(function() {
		// Deactivate all siblings.
		$(this).siblings().removeClass('active');

		// Set self to active.
		$(this).addClass('active');

		// Hide all panes.
		$(this).parent().parent().find('.config-key-pane').hide();

		// Show the appropriate one.
		$(this).parent().parent().find('.config-key-pane#' + $(this).prop('id')).show();
	});

	// Button clicks.
	chooser.find('.config-key-btn').each(function() {
		$(this).click(function() {
			this.callback(this.btn.text());
		}.bind({ btn: $(this), callback: callback }));
	});

	// Return the element.
	return chooser;
}
