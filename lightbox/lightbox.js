/*
Lightbox v2.51
http://lokeshdhakar.com/projects/lightbox2/
*/

//jQuery.easing动画效果插件
jQuery.extend(jQuery.easing,{def:'easeOutQuad',swing:function(x,t,b,c,d){return jQuery.easing[jQuery.easing.def](x,t,b,c,d);},easeInQuad:function(x,t,b,c,d){return c*(t/=d)*t+b;},easeOutQuad:function(x,t,b,c,d){return-c*(t/=d)*(t-2)+b;},easeInExpo:function(x,t,b,c,d){return(t==0)?b:c*Math.pow(2,10*(t/d-1))+b;},easeOutExpo:function(x,t,b,c,d){return(t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b;},easeInBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;return c*(t/=d)*t*((s+1)*t-s)+b;},easeOutBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b;},easeInOutBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;if((t/=d/2)<1)return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b;}});

//完成加载图片后callback
$.fn.imagesLoaded=function(callback){var $this=this,$images=$this.find('img').add($this.filter('img')),len=$images.length,blank='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';function triggerCallback(){callback.call($this,$images);}function imgLoaded(event){if(--len<=0&&event.target.src!==blank){setTimeout(triggerCallback);$images.unbind('load error',imgLoaded);}}if(!len){triggerCallback();}$images.bind('load error',imgLoaded).each(function(){if(this.complete||this.complete===undefined){var src=this.src;this.src=blank;this.src=src;}});return $this;};

(function() {
  var $, Lightbox;
  $ = jQuery;

  function LightboxOptions() {
    this.resizeDuration = 500;
    this.OVERLAY = null;
    this.LIGHTBOX = null;
  }

  Lightbox = (function() {

    function Lightbox(options) {
      this.options = options;
      this.album = [];
      this.currentImageIndex = void 0;
      this.init();
    }

    Lightbox.prototype.init = function() {
      this.enable();
      return this.build();
    };

    Lightbox.prototype.enable = function() {
      var _this = this;
      return $('body').on('click', 'a[rel^=lightbox]', function(e) {
        _this.start($(e.currentTarget));
        return false;
      });
    };

    Lightbox.prototype.build = function() {
      var $lightbox,
        _this = this;
      $('body').append('<div id="lightboxOverlay"></div><div id="lightbox"><div class="lb-outerContainer"><div class="lb-container"><img class="lb-image" src="http://img.nala.com.cn/nami/style2012/images/kong.gif"><div class="lb-nav"><a href="javascript:;" hideFocus="true" class="lb-prev"></a><a href="javascript:;" hideFocus="true" class="lb-next"></a></div><div class="lb-loader">&nbsp;</div></div></div><div class="lb-dataContainer"><div class="lb-data"><div class="lb-details"><span class="lb-caption"></span><span class="lb-number"></span></div><a hideFocus="true" href="javascript:;" class="lb-close"></a></div></div></div>');

      _this.OVERLAY = $('#lightboxOverlay');
      _this.LIGHTBOX = $('#lightbox');

      _this.OVERLAY.on('click', function(e) {
        _this.end();
        return false;
      });

      _this.LIGHTBOX.on('click', function(e) {
        var target = e.target;
        if (target.id === 'lightbox'){
          _this.end();
        }
        if (target.className === 'lb-prev') {
           _this.changeImage(_this.currentImageIndex - 1);
        } else if (target.className === 'lb-next') {
           _this.changeImage(_this.currentImageIndex + 1);
        } else if (target.className === 'lb-close') {
           _this.end();
        } 
      });
      
    };

    Lightbox.prototype.start = function($link) {
      var $window = $(window), _this = this, a, i, imageNumber, _len, _ref;
      $('select').css({
        visibility: "hidden"
      });
      _this.OVERLAY.css({
        'opacity': 0.8,
        'width':$window.width(),
        'height':$(document).height()
      }).fadeIn();
      _this.album = [];
      imageNumber = 0;
      if ($link.attr('rel') === 'lightbox') {
        _this.album.push({
          link: $link.attr('href'),
          title: $link.attr('title')
        });
      } else {
        _ref = $($link.prop("tagName") + '[rel="' + $link.attr('rel') + '"]');
        for (i = 0, _len = _ref.length; i < _len; i++) {
          a = _ref[i];
          _this.album.push({
            link: $(a).attr('href'),
            title: $(a).attr('title')
          });
          if ($(a).attr('href') === $link.attr('href')) imageNumber = i;
        }
      }
      _this.LIGHTBOX.css('top',parseInt($window.height()/2-100)).fadeIn(function () {
         $(this).find('.lb-loader').show();
         _this.changeImage(imageNumber);
      });
      
    };

    Lightbox.prototype.changeImage = function(imageNumber) {
      var $lightbox, preloader, $window = $(window),
        _this = this;
      this.disableKeyboardNav();
      $lightbox = _this.LIGHTBOX;
      $lightbox.find('.lb-image, .lb-nav, .lb-prev, .lb-next, .lb-dataContainer, .lb-error').hide();
      preloader = new Image();
      preloader.src = _this.album[imageNumber].link;
      $(preloader).imagesLoaded(function() {
        var width = preloader.width,
        height = preloader.height,
        maxWidth = $window.width()-100,
        maxHeight = $window.height()-100;
        if(height>maxHeight){
          width = parseInt(maxHeight*width/height);
          height = maxHeight;
          if(width>maxWidth){
            height = parseInt(maxWidth*height/width);
            width = maxWidth;
          }
        }else if(width==0 || height==0){
          $lightbox.find('.lb-loader').hide();
          $lightbox.find('.lb-outerContainer').append('<div class="lb-error">刷新后重试</div>');
          return false;
        }
        $lightbox.find('.lb-image').css({'width':width,'height':height}).attr('src', _this.album[imageNumber].link);
        _this.sizeContainer(width, height);
        _this.currentImageIndex = imageNumber;
      });
    };

    Lightbox.prototype.sizeContainer = function(imageWidth, imageHeight) {
      var _this = this,
        $window = $(window),
        $lightbox = _this.LIGHTBOX,
        $outerContainer = $lightbox.find('.lb-outerContainer'),
        newWidth = imageWidth + 20,
        newHeight = imageHeight + 20,
        ltop = $window.scrollTop() + Math.floor(($window.height()-newHeight-35)/2);
      $lightbox.animate({top: ltop + 'px'},_this.options.resizeDuration, 'swing');
      $outerContainer.animate({
        width: newWidth,
        height: newHeight
      }, _this.options.resizeDuration, 'swing',function () {
        $lightbox.find('.lb-dataContainer').width(newWidth);
        $lightbox.find('.lb-nav').width(newWidth);
        _this.showImage();
      });
      
    };

    Lightbox.prototype.showImage = function() {
      var $lightbox = this.LIGHTBOX;
      $lightbox.find('.lb-loader').hide();
      $lightbox.find('.lb-image').fadeIn();
      this.updateNav();
      this.updateDetails();
      this.preloadNeighboringImages();
      this.enableKeyboardNav();
    };

    Lightbox.prototype.updateNav = function() {
      var $lightbox = this.LIGHTBOX;
      $lightbox.find('.lb-nav').show();
      if (this.currentImageIndex > 0) {
        $lightbox.find('.lb-prev').show();
      }
      if (this.currentImageIndex < this.album.length - 1) {
        $lightbox.find('.lb-next').show();
      }
    };

    Lightbox.prototype.updateDetails = function() {
      var $lightbox = this.LIGHTBOX;
      /*if (typeof this.album[this.currentImageIndex].title !== 'undefined' && this.album[this.currentImageIndex].title !== "") {
        $lightbox.find('.lb-caption').html(this.album[this.currentImageIndex].title).fadeIn('fast');
      }*/
      if (this.album.length > 1) {
        $lightbox.find('.lb-number').html('Image ' + (this.currentImageIndex + 1) + ' of ' + this.album.length).fadeIn();
      } else {
        $lightbox.find('.lb-number').hide();
      }
      $lightbox.find('.lb-dataContainer').fadeIn(this.options.resizeDuration);
    };

    Lightbox.prototype.preloadNeighboringImages = function() {
      var preloadNext, preloadPrev;
      if (this.album.length > this.currentImageIndex + 1) {
        preloadNext = new Image;
        preloadNext.src = this.album[this.currentImageIndex + 1].link;
      }
      if (this.currentImageIndex > 0) {
        preloadPrev = new Image;
        preloadPrev.src = this.album[this.currentImageIndex - 1].link;
      }
    };

    Lightbox.prototype.enableKeyboardNav = function() {
      $(document).on('keyup.keyboard', $.proxy(this.keyboardAction, this));
    };

    Lightbox.prototype.disableKeyboardNav = function() {
      $(document).off('.keyboard');
    };

    Lightbox.prototype.keyboardAction = function(event) {
      var KEYCODE_ESC, KEYCODE_LEFTARROW, KEYCODE_RIGHTARROW, key, keycode;
      KEYCODE_ESC = 27;
      KEYCODE_LEFTARROW = 37;
      KEYCODE_RIGHTARROW = 39;
      keycode = event.keyCode;
      key = String.fromCharCode(keycode).toLowerCase();
      if (keycode === KEYCODE_ESC || key.match(/x|o|c/)) {
        this.end();
      } else if (key === 'p' || keycode === KEYCODE_LEFTARROW) {
        if (this.currentImageIndex !== 0) {
          this.changeImage(this.currentImageIndex - 1);
        }
      } else if (key === 'n' || keycode === KEYCODE_RIGHTARROW) {
        if (this.currentImageIndex !== this.album.length - 1) {
          this.changeImage(this.currentImageIndex + 1);
        }
      }
    };

    Lightbox.prototype.end = function() {
      var ntop, _this = this,
      $lightbox = _this.LIGHTBOX;
      _this.disableKeyboardNav();
      ntop = $lightbox.offset().top + Math.floor($lightbox.height()/2-100);
      $lightbox.find('.lb-dataContainer, .lb-image, .lb-nav').hide();
      $lightbox.find('.lb-outerContainer').stop().animate({
        'width':'50px',
        'height':'50px',
        'top':ntop
      },_this.options.resizeDuration,'easeInBack',function () {
        this.style.cssText = '';
        $lightbox.hide().css('top',0);
        _this.OVERLAY.fadeOut();
        $('select').css('visibility',"visible");
      });
    };

    return Lightbox;

  })();

  $(function() {
    var lightbox, options;
    options = new LightboxOptions;
    return lightbox = new Lightbox(options);
  });

}).call(this);