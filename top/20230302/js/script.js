jQuery(document).ready(function(){
	"use strict";

	/*===== Parallax =====*/
	if ($.isFunction($.fn.scrolly)) {
		$('.parallax').scrolly({bgParallax: true});
	}

	/*===============================
		Search Form JS
	=================================*/
	$('.search-area .icon').on( "click", function(){
		$('.search-area').toggleClass('active');
	});

	/*===== Counter For Funfacts =====*/
	function counter_Up($counters) {
		if ( typeof counterUp ===  'function' ) {
			$counters.each(function (ignore, counter) {
				counterUp(counter, {
					duration: 1000,
					delay: 16
				});
			});
		}
	}
	if ( $(".counter").length ) {
		var $counters = $(".counter");
		if ( $.isFunction($.fn.waypoint) ) {
			new Waypoint( {
				element: $counters,
				handler: function() { 
					counter_Up($counters)
					this.destroy()
				},
				offset: 'bottom-in-view',
			} );
		}
	}

	/*===== Sticky Header =====*/
	 if($(".main-bar").hasClass("stick")){
        var full_menu_height = $(".main-bar").innerHeight();
        var full_menu_offset = $(".main-bar").offset().top;
        $(window).on("scroll", function() {
            var scroll = $(window).scrollTop();
            if (scroll >= full_menu_offset) {
                $(".stick").addClass("sticky");
                $(".full-menu-height").css({
                    "height":full_menu_height
                });
            } else if (scroll < full_menu_offset){
                $(".stick").removeClass("sticky");
                $(".full-menu-height").css({
                    "height":0
                });
            }
        });
    }

	/*===== Scroll Up =====*/
	$(".scroll-top").on("click", function(){
		$('html, body').animate({
			scrollTop: $(".theme-layout").offset().top
		}, 1000);
	});

	/*===== PerfectScrollbar =====*/
	if ( typeof PerfectScrollbar === 'function' && $('.side-menu > ul').length ) {
		new PerfectScrollbar('.side-menu > ul');
	}

	/*====== Gallery Carousel =====*/
	if ($.isFunction($.fn.owlCarousel)) {
		$('.gallery-car').owlCarousel({
			autoplay: true,
			autoplayTimeout: 2500,
			smartSpeed: 2000,
			autoplayHoverPause: true,
			loop: true,
			dots: false,
			nav:false,
			//navText:['<span class="arrow-icn"><i class="fa fa-arrow-left"></i></span>','<span class="arrow-icn"><i class="fa fa-arrow-right"></i></span>'],
			navText:['',''],
			margin: 0,
			mouseDrag: true,
			singleItem: true,
			items: 3,
			responsive:{
				0:{
					autoplay: true,
					items:1,
					nav:false
				},
				640:{
					autoplay: true,
					items:2,
					nav:false
				},
				1000:{
					items:3,
					nav:true
				},
				1600: {
					items: 4,
					nav:true
				}
			}
		});
	}

	/*===== Skip owl carousel cloned item for fancybox =====*/
	if ( $.isFunction($.fn.fancybox) ) {
		$().fancybox({
			selector : '.gallery-car .owl-item:not(.cloned) a',
			backFocus : false
		});
	}

	/*====== Testimonial Carousel =====*/
	if ($.isFunction($.fn.owlCarousel)) {
		$('.testimonial-car').owlCarousel({
			autoplay: true,
			autoplayTimeout: 3500,
			smartSpeed: 2500,
			autoplayHoverPause: true,
			loop: true,
			dots: false,
			nav:false,
			navText:['',''],
			margin: 30,
			mouseDrag: true,
			singleItem: true,
			items: 2,
			responsive:{
				0:{
					items:1,
					nav:true
				},
				768:{
					items:1,
					nav:false
				},
				1000:{
					items:2,
					nav:true
				}
			}
		});
	}

	/*===== Footer Gallery Carousel ======*/
	if ($.isFunction($.fn.owlCarousel)) {
		$('.gallery-car2').owlCarousel({
			autoplay: false,
			autoplayTimeout: 2500,
			smartSpeed: 2000,
			autoplayHoverPause: true,
			loop: true,
			dots: true,
			nav:false,
			margin: 10,
			mouseDrag: true,
			singleItem: true,
			items: 1,
			responsive:{
				0:{
					items:2,
					nav:true
				},
				480:{
					items:2,
					nav:false
				},
				768:{
					items:2,
					nav:false
				},
				640:{
					items:1,
					nav:false
				},
				1000:{
					items:1,
					nav:true
				}
			}
		});
	}

	/*===== Sponsor Carousel =====*/
	if ($.isFunction($.fn.owlCarousel)) {
		$('.sponsor-car').owlCarousel({
			autoplay: false,
			autoplayTimeout: 2500,
			smartSpeed: 2000,
			autoplayHoverPause: true,
			loop: true,
			dots: false,
			nav:true,
			navText:['<span class="arrow-icn"><i class="fa fa-arrow-left"></i></span>','<span class="arrow-icn"><i class="fa fa-arrow-right"></i></span>'],
			margin: 80,
			mouseDrag: true,
			singleItem: true,
			items: 5,
			responsive:{
				0:{
					items:2,
					nav:false,
					autoplay: true,
					margin: 20
				},
				375:{
					items:3,
					nav:false,
					autoplay: true,
					margin: 10
				},
				480:{
					items:3,
					nav:false,
					autoplay: true,
					margin: 20
				},
				600:{
					items:3,
					nav:false,
					autoplay: true,
					margin: 30
				},
				768:{
					items:4,
					nav:false,
					autoplay: true,
					margin: 30
				},
				1000:{
					items:5,
					nav:false,
					autoplay: true,
					margin: 50
				},
				1100:{
					items:5,
					nav:true,
					margin: 50
				}
			}
		});
	}

	/*===== About Tab =====*/
	$( '.about-tab .butn' ).on( 'click', function(){
		$(this).parent().addClass('active').siblings().removeClass('active');
	});

	/*===== Fotter Quick Link Tab =====*/
	$( '.quick-link-bar strong' ).on( 'click', function(){
		$('.quick-link').slideToggle();
	});

	/*===== Responsive nav dropdowns =====*/
	$('.resp-btn').on('click', function () {
		$('.menu-wraper').addClass('menu-active');
		return false;
	});
	$('.close-menu').on('click', function () {
		$('.menu-wraper').removeClass('menu-active');
		return false;
	});
	$('.side-menu ul li.menu-item-has-children > a').on('click', function () {
	    $(this).parent().siblings().children('ul').slideUp();
	    $(this).parent().siblings().removeClass('active');
	    $(this).parent().children('ul').slideToggle();
	    $(this).parent().toggleClass('active');
	    return false;
	});

	/*===== Popup =====*/
	$( '.get-login-register' ).on( 'click', function(){
	    $( '.cust-modal' ).addClass( 'show-model' );
	    $( 'body' ).addClass( 'modal-visible' );
	    return false;
	});

	$( '.modal-overlay, .model-close' ).on( 'click', function(){
	    if ( $( 'body' ).hasClass( 'modal-visible' ) ) {
	        $( 'body' ).removeClass( 'modal-visible' );
	        $( '.cust-modal' ).removeClass( 'show-model' );
	    }
	});

	$( '.register-form > a' ).on( 'click', function(){
		$(this).parent().slideUp().siblings().slideDown();
	});

});

/*===== Loader =====*/
$(window).on('load', function(){
	$('.se-pre-con').fadeOut('slow');
});