$(function() {
	$(".navbar-toggler").click(function(e) {
		$(".wrapper").toggleClass("toggled");
	});

	function moveImage(that) {
	var $img = $(that).find(".contact__photo"),
		$clone = $img.clone().addClass("cloned");

		$(".panel__chat").append($clone);
		$clone.css("top");
		$clone.css({top: "6rem", left: "25rem"});
	}


	$(document).on("click", ".contact", function(e) {
		var that = this,
			name = $(this).find(".contact__name").text(),
			online = $(this).find(".contact__status").hasClass("online");
		$(".chat__name").text(name);
		$(".chat__online").removeClass("active");
		if (online) $(".chat__online").addClass("active");
		$(".panel__chat").addClass("active");
		//ripple($(that),e);
		moveImage(that);
	});

	$(document).on("click", ".chat__back", function() {
		$(".panel__chat").removeClass("active");
		$(".cloned").addClass("removed");
	});

});