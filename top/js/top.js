$(window).on('load scroll', function () {
	add_class_in_scrolling($('.lead-section'));
	add_class_in_scrolling($('.curriculum-section'));
	add_class_in_scrolling($('.kunugi-section'));
	add_class_in_scrolling($('.friends-section'));
	add_class_in_scrolling($('.shukuhaku-section'));
	add_class_in_scrolling($('.year-section'));
	add_class_in_scrolling($('.gallery-section'));
	add_class_in_scrolling($('.kouryu-section'));
	add_class_in_scrolling($('.curriculum-eigo'));
	add_class_in_scrolling($('.curriculum-chinese'));
	// add_class_in_scrolling($('.curriculum-sansu'));
	add_class_in_scrolling($('.curriculum-art'));
	add_class_in_scrolling($('.curriculum-prg'));
	add_class_in_scrolling($('.page-navi-wrap'));
	add_class_in_scrolling($('.friends-section .photo-box'));
	add_class_in_scrolling($('.gallery-photo'));
	add_class_in_scrolling($('.kouryu-section .photo-box'));
});

function add_class_in_scrolling(target) {
	var winScroll = $(window).scrollTop();
	var winHeight = $(window).height();
	var scrollPos = winScroll + winHeight;

	if (typeof(target) !== 'undefined' && target.length > 0 && target.offset().top < scrollPos - 50) {
		target.addClass('is-show');
	}
}

$(function () {

	//modal
	$(".show-modal").click(function () {

		var modalName = $(this).attr("href");
		$(".modal-wrap").addClass("is-show");
		$(modalName).addClass("is-show");
		$(".modal-bg").fadeIn(300);

		if ($(this).hasClass("swipe-image")) {
			var photo = $(this).eq(0).closest("ul").children();
			var photoNum = $(photo).index($(this).closest("li"))
			//console.log(photoNum)
			//var photoNum = $(this).attr("data-photo");
			modalswiper = new Swiper('.modal-swipe', {
				initialSlide: photoNum,
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
				}
			});
		}
		if ($(this).hasClass("play-movie")) {
			var youtubeId = $(this).attr("data-movie")
			$(modalName).find(".modal-movie").append('<iframe width="560" height="315" src="https://www.youtube.com/embed/' + youtubeId + '?rel=0&autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>')
		}
		return false;
	});
	$(".close-modal,.modal-bg").click(function () {
		setTimeout(function () {
			$(".modal-wrap").removeClass("is-show");
		}, 200);
		$(".modal-box").removeClass("is-show");
		$(".modal-bg").fadeOut(300);
		$(".modal-movie").empty();
		return false;
	});
	//動画のモーダル

	/*降園*/
	$(".shukuhaku-thumb li").click(function () {
		var imgsrc = $("img", this).attr("src");
		var catchtxt = $(this).attr("data-catch");
		$(".shukuhaku-photo img").attr("src", imgsrc);
		$(".shukuhaku-photo p").html(catchtxt);
		$(".shukuhaku-thumb li").removeClass("current");
		$(this).addClass("current");
		return false;
	});

	/*年間行事*/
	$(".year-tab span").click(function () {
		var tab = $(this).attr("href");
		$(".year-tab span").removeClass("current");
		$(this).addClass("current");
		$(".year-slides").removeClass("current");
		$(tab).addClass("current");
		return false;
	});
});



var yearswiper;
$(window).load(function () {
	yearswiper = new Swiper('.year-swiper', {
		loop: false,
		slidesPerView: 3,
		breakpoints: {
			768: {
				slidesPerView: 1,
				//navigation: {
				//						nextEl: '.swiper-button-next',
				//						prevEl: '.swiper-button-prev',
				//					},
				pagination: {
					el: '.swiper-pagination2',
					type: 'bullets',
				}
			}
		}
	});
});




var modalswiper;
$(window).load(function () {
	modalswiper = new Swiper('.modal-swipe', {
		loop: false,
		slidesPerView: 1,
		// pagination: {
		// 	el: '.swiper-pagination',
		// 	type: 'bullets',
		//   },
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		// breakpoints: {
		//   768: {
		// 	slidesPerView: 1,
		// 	  navigation: {
		// 		nextEl: '.swiper-button-next',
		// 		prevEl: '.swiper-button-prev',
		// 	  }
		//   }
		// }
	});
});