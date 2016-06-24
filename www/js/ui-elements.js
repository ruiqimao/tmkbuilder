// Radio group behavior.
$('.radio-group button').click(function() {
	// Deactivate all siblings.
	$(this).siblings().removeClass('active');

	// Set self to active.
	$(this).addClass('active');
});
