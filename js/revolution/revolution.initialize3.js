if($("#rev_slider_1050_1").length !== 0) {				
		var tpj=jQuery;
			
			var revapi1050;
			tpj(document).ready(function() {
				if(tpj("#rev_slider_1050_1").revolution == undefined){
					revslider_showDoubleJqueryError("#rev_slider_1050_1");
				}else{
					revapi1050 = tpj("#rev_slider_1050_1").show().revolution({
						sliderType:"standard",
						jsFileLocation:"revolution/js/",
						sliderLayout:"fullwidth",
						dottedOverlay:"none",
						delay:5000,
						navigation: {
							keyboardNavigation:"on",
							keyboard_direction: "vertical",
							mouseScrollNavigation:"off",
 							mouseScrollReverse:"default",
							onHoverStop:"off",
							touch:{
								touchenabled:"on",
								swipe_threshold: 75,
								swipe_min_touches: 50,
								swipe_direction: "vertical",
								drag_block_vertical: false
							}
							,
							bullets: {
								enable:true,
								hide_onmobile:true,
								hide_under:640,
								style:"hephaistos",
								hide_onleave:false,
								direction:"vertical",
								h_align:"right",
								v_align:"center",
								h_offset:30,
								v_offset:0,
								space:5,
								tmp:''
							}
						},
						responsiveLevels:[1240, 1025, 780, 490],
						visibilityLevels:[1240, 1025, 780, 490],
						gridwidth:[1370, 1025, 780, 490],
						gridheight:[768,500,500,400],
						lazyType:"none",
						shadow:0,
						spinner:"spinner2",
						stopLoop:"off",
						stopAfterLoops:-1,
						stopAtSlide:-1,
						shuffle:"off",
						autoHeight:"on",
						fullScreenAutoWidth:"off",
						fullScreenAlignForce:"off",
						fullScreenOffsetContainer: "",
						fullScreenOffset: "",
						disableProgressBar:"on",
						hideThumbsOnMobile:"off",
						hideSliderAtLimit:0,
						hideCaptionAtLimit:0,
						hideAllCaptionAtLilmit:0,
						debugMode:false,
						fallbacks: {
							simplifyAll:"off",
							nextSlideOnWindowFocus:"off",
							disableFocusListener:false,
						}
					});
				}
			});	/*ready*/
}
