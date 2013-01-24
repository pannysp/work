/*
** 星星评分插件
** update 2013.1.15
*/
;(function ($) {
	$.fn.pingStars = function (options) {
		var defaultProgram = {
			//starUrl：[灰星，黄星] 默认最小的星星
			starUrl : ['ping1.png','ping3.png'],
			//评分标题
			title : '',
			//发送后端的name名称
			postName: 'total_scores',
			//是否显示分值提示
			showTip : true,
			tipText : ['很差','较差','还行','推荐','力荐']
		};
		options = $.extend(defaultProgram,options);
		return this.each(function () {
			var $this = $(this),
			img = $('<img src="'+options.starUrl[0]+'" /><img src="'+options.starUrl[0]+'" /><img src="'+options.starUrl[0]+'" /><img src="'+options.starUrl[0]+'" /><img src="'+options.starUrl[0]+'" />'),
			tip = null;

			if(options.title != ''){
				$this.append('<input type="hidden" name="'+options.postName+'" value="0" /><span>'+options.title+'：</span>');
			}else{
				$this.append('<input type="hidden" name="'+options.postName+'" value="0" />');
			}

			img.appendTo($this);

			if(options.showTip){
				tip = $('<em />').appendTo($this);
			}

			//重置默认图标
			function resetStars() {
				img.each(function () {
					this.src = options.starUrl[0];
				});
				if(options.showTip){
					tip.empty();
				}
			}

			//显示星星图标
			function showStars(index) {
				for (var j = 0; j <= index; j++) {
					img.eq(j).attr('src',options.starUrl[1]);
				};

				if(options.showTip){
					tip.text(options.tipText[index]);
				}
			}

			$this.on('mouseover','img',function () {
				//移入显示星星
				var index = img.index(this);
				//先重置下
				resetStars();
				//再显示
				showStars(index);
				return false;
			}).on('click','img',function () {
				//点击锁定星星
				var index = img.index(this) + 1;
				$this.find('input').val(index);
				return false;
			}).on('mouseleave',function () {
				//绑定移出,重置星星
				//用mouseout：会出现鼠标移到图片间隔处就开始重置的小bug
				resetStars();
				var scores = parseInt($this.find('input').val())-1;
				if (scores > -1) {
					showStars(scores);
				}
				return false;
			});
		});
	}
})(jQuery);