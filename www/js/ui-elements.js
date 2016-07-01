// Radio group behavior.
$('.radio-group button').click(function() {
	// Deactivate all siblings.
	$(this).siblings().removeClass('active');

	// Set self to active.
	$(this).addClass('active');
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
