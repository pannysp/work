/**
 * 下雪特效
 */
(function($){
	
	$.fn.snow = function(options){
			if(!window.XMLHttpRequest){
				return;
			}
			var $flake = $('<div style="position:fixed; top:-50px; display:block; width:20px; height:20px; background: url(http://img.nala.com.cn/nami/style2012/images/snow.png) no-repeat 0 0; z-index:9999;" />'),
				wHeight 	= $(window).height(),
				wWidth	= $(window).width(),
				bg = -1,
				defaults	= {
									speed : 300
								},
				options	= $.extend({}, defaults, options);
				
			
			var interval		= setInterval( function(){
				var startPositionLeft 	= Math.random() * wWidth,
				 	Opacity		= 0.5 + Math.random(),
					Zoom = 0.5 + Math.random() * 0.5,
					endPositionTop		= wHeight - 20,
					endPositionLeft		= startPositionLeft - 200 + Math.random() * 300,
					durationFall		= wHeight * 10 + Math.random() * 5000;
					bg++;
					if(bg===5){
						bg=0;
					}
				$flake
					.clone()
					.appendTo('body')
					.css(
						{
							'left': startPositionLeft,
							'opacity': Opacity,
							'Zoom':Zoom,
							'background-position': -bg*20+'px 0'
						}
					)
					.animate(
						{
							'top': endPositionTop,
							'left': endPositionLeft
						},
						durationFall,
						function() {
							var that = $(this)
							that.stop().delay(500).fadeOut("600",function(){
								that.remove();
							});
						}
					);
			}, options.speed);
	
	};
	
})(jQuery);
/* 启动下雪 */
$.fn.snow();