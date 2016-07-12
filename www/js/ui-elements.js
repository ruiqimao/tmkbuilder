// Radio group behavior.
$('.radio-group button').click(function() {
	// Deactivate all siblings.
	$(this).siblings().removeClass('active');

	// Set self to active.
	$(this).addClass('active');
});

// Number field.
$('input.number').click(function() {
	// Select everything when clicked.
	$(this).select();
});

// Number selector buttons.
$('.number-sm').click(function() {
	// Get the element it corresponds to.
	var box = $('#' + $(this).data('for'));

	// Reduce the element's value if possible.
	if (parseInt(box.prop('min')) < parseInt(box.val())) {
		box.val(parseInt(box.val()) - 1);
		box.change();
	}
});
$('.number-lg').click(function() {
	// Get the element it corresponds to.
	var box = $('#' + $(this).data('for'));

	// Increase the element's value if possible.
	if (parseInt(box.prop('max')) > parseInt(box.val())) {
		box.val(parseInt(box.val()) + 1);
		box.change();
	}
});

// Tooltip.
$(window).mousemove(function() {
	$('.tooltip').hide();
});
$('.tooltip-hover').mousemove(function(e) {
	// Prevent the event from propagating to the window.
	e.stopPropagation();

	// Set the tooltip text.
	$('.tooltip').html($(this).data('text'));

	// Show the tooltip.
	$('.tooltip').show();

	// Move the tooltip to the mouse.
	$('.tooltip').css({
		'top': e.pageY - $('.tooltip').outerHeight() / 2,
		'left': e.pageX + 10
	});
});
