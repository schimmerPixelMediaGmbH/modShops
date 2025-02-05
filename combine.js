/*! Exit indent */ 
(function ($) {

    $.stickToMe = function ( configs ) {

        var defaults = {
            layer: "stickLayer",
            fadespeed: 400,
            trigger: ['top'],
            maxtime : 0,
            mintime : 0,
            delay: 0,
            interval: 0,
            maxamount : 1,
            cookie : true,
            bgclickclose : true,
            escclose : true,
            onleave : function(e){},
            disableleftscroll : true
        };

        var settings = $.extend({}, defaults, configs);
        $(settings.layer).hide();

        var startuptime = new Date().getTime();
        var windowHeight = $(window).height();
        var windowWidth = $(window).width();
        var offsetbind = false;
        var howmanytimes = 0;
        var lasttime = 0;
        var chromealert = true;
        var lastx, lasty = 0;

        if (/Chrome/.test(navigator.userAgent)){
            var chrome = true;
            if ($(document).width() > windowWidth && settings.disableleftscroll == true){
                chromealert = false;
            }
        }

        var conth = parseFloat($(settings.layer).css("height"));
        var contw = parseFloat($(settings.layer).css("width"));
        var reqsettings = {
            backgroundcss: {'z-index':'22001','display':'none'},
            boxcss: {'border':'7px solid #04A1B8','z-index':'22010','position':'fixed','left':'50%','top':'50%','height': (conth) + 'px','width': (contw ) + 'px', 'margin-left':(-contw/2)+'px', 'margin-top':(-conth/2) + 'px'}
        };

        $.extend(true, settings, reqsettings);

        $(document).bind('mousemove',function(e){
            lastx = e.pageX;
            lasty = e.pageY;
        });

        $(document).bind('mouseleave', function(e) { setTimeout(function(){ontheleave(e);}, settings.delay); });

        if (chrome){
            $(document).unbind("mouseleave");
            chromefix();
        }

        function chromefix(){
            offsetbind = false;
            $(document).bind('mousemove.bindoffset',function(e){
                if (offsetbind){
                    $(document).bind('mouseleave', function(e) { setTimeout(function(){ontheleave(e);}, settings.delay); });
                    $(document).unbind("mousemove.bindoffset");
                }
                offsetbind = true;
            });
        }

        $(window).resize(function(e){
            windowHeight = $(window).height();
            windowWidth = $(window).width();
        });

        function ontheleave(e){
            var scrolltop = document.documentElement ? document.documentElement.scrollTop : document.body.scrollTop;
            var scrollleft = document.documentElement ? document.documentElement.scrollLeft : document.body.scrollLeft;
            scrolltop = ($(document).scrollTop() > scrolltop) ? $(document).scrollTop() : scrolltop;
            scrollleft = ($(document).scrollLeft() > scrollleft) ? $(document).scrollLeft() : scrollleft;

            if ((Math.round(e.pageX) == -1 || Math.round(e.pageY) == -1) || (e.pageX == -3 || e.pageY == -3)){
                var clienty = -lasty + scrolltop;
                var clientx = lastx - scrollleft;
            } else {
                var clienty = -e.pageY + scrolltop;
                var clientx = e.pageX - scrollleft;
            }

            var ey1 = (-windowHeight / windowWidth) * clientx;
            var ey2 = ((windowHeight / windowWidth) * clientx) - windowHeight;

            var leaveside;
            if (clienty >= ey1){
                if (clienty >= ey2){
                    leaveside = "top";

                } else {
                    leaveside = "right";
                }
            } else {
                if (clienty >= ey2){
                    leaveside = "left";
                } else {
                    leaveside = "bottom";
                }
            }

            if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
                if (clienty < 0 && clienty > -windowHeight && clientx > 0 && clientx < windowWidth){
                    return;
                }
            }

            if ($.inArray(leaveside, settings.trigger) != -1 || $.inArray('all', settings.trigger) != -1){
                var recenttime = new Date().getTime();
                if ((recenttime-startuptime) >= settings.mintime){
                    if ((recenttime-startuptime) <= settings.maxtime || settings.maxtime == 0){
                        if (howmanytimes < settings.maxamount || settings.maxamount == 0){
                            if ((recenttime-lasttime) >= settings.interval || settings.interval == 0){
                                if (chromealert){
                                    var cookiehowm = getamount("ck_stick_visit");
                                    if (settings.cookie == false || (settings.cookie == true && (cookiehowm < settings.maxamount || settings.maxamount == 0))){
                                        settings.onleave.call(this, leaveside);

                                        if (settings.layer != ""){
                                            showbox();
                                        }
                                        howmanytimes++;
                                        if (settings.cookie == true){
                                            cookiehowm++;
                                            if (settings.cookieExpiration > 0) {
                                                var expiresAt = new Date(Date.now() + (settings.cookieExpiration * 1000)).toGMTString();
                                                document.cookie="ck_stick_visit="+cookiehowm+"; expires="+expiresAt+"; path=/; SameSite=lax";
                                            } else {
                                                document.cookie="ck_stick_visit="+cookiehowm+"; path=/; SameSite=lax";
                                            }
                                        }
                                        lasttime = new Date().getTime();
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (chrome)
            {
                $(document).unbind("mouseleave");
                chromefix();
            }

        }

        function showbox(){
			
			/*! welcher typ des exit ident soll angezeigt werden!? Newsletter oder Artikel im Cart */
			if( $(".toolbar .cart .count").html() > 0 ){
				var exitIdenttype = "cart";
				$(".effCosInfo").animate({left:-2000});
				$('#stickLayer .stick_content .openCart').show();
				$('#stickLayer .stick_content .getNewsletter').hide();
				$('#stickLayer .stick_content .openCart #alibaba').html( $(".toolbar .cart .count").html() );
			}else{
				var exitIdenttype = "newsletter";
				$(".effCosInfo").animate({left:-2000});				
				if( read_cookie('newsletteradorned') == "true" ) return; /*! nl bereits abonniert!! */
				$('#stickLayer .stick_content .openCart').hide();
				$('#stickLayer .stick_content .getNewsletter').show();
			}
			
            if ($.data(document.body, "stick_var") != 1){
                $.data(document.body, "stick_var", 1);
                $('<div class="stick_block_layer"></div>').appendTo('body').css(settings.backgroundcss).fadeIn(settings.fadespeed);
                $('<div class="stick_container"></div>').appendTo('body');
				$(settings.layer).clone().show().css(settings.boxcss).appendTo(".stick_container");
				
                if (settings.bgclickclose){
                    $('.stick_block_layer').click(function(){
                        stick_close();
                    });
                }
                if (settings.escclose){
                    $("body").keyup(function(e){
                        if(e.which == 27){
                            stick_close();
                        }
                    });
                }
            }
        }

    };

    function getamount(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
        }
        return 0;
    }

    function stick_close(){
        $('.stick_container').fadeOut(function() { $(this).remove(); });
        $('.stick_block_layer').fadeOut(function() { $(this).remove(); });
        $.removeData( document.body, "stick_var" );
    }

    $.stick_close = function(){
        stick_close();
    }

}( jQuery ));


/*! jquery toggle-switch */
+function ($) {
 	'use strict';

	var Toggle = function (element, options) {
		this.$element  = $(element), 
		this.options   = $.extend({}, this.defaults(), options),
		this.render()
	};

	Toggle.VERSION  = '3.7.0-beta'; 

	Toggle.DEFAULTS = {
		on: 'On',
		off: 'Off',
		onstyle: 'success',
		offstyle: 'light',
		size: 'normal',
		style: 'ios',
		width: null,
		height: null
	}; 

	Toggle.prototype.defaults = function() {
		return {
			on: this.$element.attr('data-on') || Toggle.DEFAULTS.on,
			off: this.$element.attr('data-off') || Toggle.DEFAULTS.off,
			onstyle: this.$element.attr('data-onstyle') || Toggle.DEFAULTS.onstyle,
			offstyle: this.$element.attr('data-offstyle') || Toggle.DEFAULTS.offstyle,
			size: this.$element.attr('data-size') || Toggle.DEFAULTS.size,
			style: this.$element.attr('data-style') || Toggle.DEFAULTS.style,
			width: this.$element.attr('data-width') || Toggle.DEFAULTS.width,
			height: this.$element.attr('data-height') || Toggle.DEFAULTS.height
		};
	};

	Toggle.prototype.render = function () {
		this._onstyle = 'btn-' + this.options.onstyle;
		this._offstyle = 'btn-' + this.options.offstyle;
		var size
			= this.options.size === 'large' || this.options.size === 'lg' ? 'btn-lg'
			: this.options.size === 'small' || this.options.size === 'sm' ? 'btn-sm'
			: this.options.size === 'mini'  || this.options.size === 'xs' ? 'btn-xs'
			: '';
		var $toggleOn = $('<label for="'+ this.$element.prop('id') +'" class="btn">').html(this.options.on).addClass(this._onstyle + ' ' + size);
		var $toggleOff = $('<label for="'+ this.$element.prop('id') +'" class="btn">').html(this.options.off).addClass(this._offstyle + ' ' + size);
		var $toggleHandle = $('<span class="toggle-handle btn btn-light">').addClass(size);
		var $toggleGroup = $('<div class="toggle-group">').append($toggleOn, $toggleOff, $toggleHandle);
		var $toggle = $('<div class="toggle btn" data-toggle="toggle" role="button">').addClass( this.$element.prop('checked') ? this._onstyle : this._offstyle+' off' ).addClass(size).addClass(this.options.style);

		this.$element.wrap($toggle);
		$.extend(this, {
			$toggle: this.$element.parent(),
			$toggleOn: $toggleOn,
			$toggleOff: $toggleOff,
			$toggleGroup: $toggleGroup
		});
		this.$toggle.append($toggleGroup);

		var width = this.options.width || Math.max($toggleOn.outerWidth(), $toggleOff.outerWidth())+($toggleHandle.outerWidth()/2);
		var height = this.options.height || Math.max($toggleOn.outerHeight(), $toggleOff.outerHeight());
		$toggleOn.addClass('toggle-on');
		$toggleOff.addClass('toggle-off');
		this.$toggle.css({ width: width, height: height });
		if (this.options.height) {
			$toggleOn.css('line-height', $toggleOn.height() + 'px');
			$toggleOff.css('line-height', $toggleOff.height() + 'px');
		};
		this.update(true);
		this.trigger(true);
	};

	Toggle.prototype.toggle = function () {
		if (this.$element.prop('checked')){
			this.off();
		}else{
			this.on();
		}
	};

	Toggle.prototype.on = function (silent) {
		if (this.$element.prop('disabled')) return false;
		this.$toggle.removeClass(this._offstyle + ' off').addClass(this._onstyle);
		this.$element.prop('checked', true);
		if (!silent) this.trigger();
	};

	Toggle.prototype.off = function (silent) {
		if (this.$element.prop('disabled')) return false;
		this.$toggle.removeClass(this._onstyle).addClass(this._offstyle + ' off');
		this.$element.prop('checked', false);
		if (!silent) this.trigger();
	};

	Toggle.prototype.enable = function () {
		this.$toggle.removeClass('disabled');
		this.$toggle.removeAttr('disabled');
		this.$element.prop('disabled', false);
	};

	Toggle.prototype.disable = function () {
		this.$toggle.addClass('disabled');
		this.$toggle.attr('disabled', 'disabled');
		this.$element.prop('disabled', true);
	};

	Toggle.prototype.update = function (silent) {
		if (this.$element.prop('disabled')) {
			this.disable();
		}else{
			this.enable();
		}
		if (this.$element.prop('checked')){
			this.on(silent);
		}else{
			this.off(silent);
		}			
		
	};

	Toggle.prototype.trigger = function (silent) {
		this.$element.off('change.bs.toggle');
		if (!silent) this.$element.change(); 
		this.$element.on('change.bs.toggle', $.proxy(function() {
			this.update();
		}, this));
	};

	Toggle.prototype.destroy = function() {
		this.$element.off('change.bs.toggle');
		this.$toggleGroup.remove();
		this.$element.removeData('bs.toggle');
		this.$element.unwrap();
	};

	function Plugin(option) {
		var optArg = Array.prototype.slice.call( arguments, 1 )[0];

		return this.each(function () {
			var $this   = $(this);
			var data    = $this.data('bs.toggle');
			var options = typeof option == 'object' && option;

			if (!data) $this.data('bs.toggle', (data = new Toggle(this, options)));
			if (typeof option === 'string' && data[option] && typeof optArg === 'boolean'){
				data[option](optArg)
			}else if (typeof option === 'string' && data[option]){
				data[option]();
			}	
			
		})
	};

	var old = $.fn.bootstrapToggle;

	$.fn.bootstrapToggle             = Plugin
	$.fn.bootstrapToggle.Constructor = Toggle


	$.fn.toggle.noConflict = function () {
		$.fn.bootstrapToggle = old;
		return this;
	};


	$(function() {
		$('input[type=checkbox][data-toggle^=toggle]').bootstrapToggle();
	});

	$(document).on('click.bs.toggle', 'div[data-toggle^=toggle]', function(e) {
		var $checkbox = $(this).find('input[type=checkbox]');
		$checkbox.bootstrapToggle('toggle');
		e.preventDefault();
	});
}(jQuery);


/*! scripts  */
if( $(".prdoption_configurator").length ){
	setTimeout( function() {
		var data = $("#cart_quantity").serialize()+"&g="+$("#spring_price_plain_net").html()+"&o="+$("#spring_old_price_plain").html();
		 $.ajax({
		  type: "POST",
		  dataType: "json",
		  data: data,
		  async: false,
		  url: "/configurator.php",
		  success: function(data){
		   if(data['total_weight'] !="") $("#ajax_weight").html( " "+data['total_weight']+" kg");
		   if(data['newProductPriceFormatted'] !="") $(".ajax_price").html( data['newProductPriceFormatted']);
		   if(data['productPrice'] !="") $("#configurators_price").val( data['productPrice']);
		  },
		});
	}, 1200 );
}

$(document).on( "change", "#toggle-prices-mode", function(e){
	var mode = $(this).prop('checked');
	var type = "gross";
	if(mode == true){
		type = "net";
	}
	$.ajax({
		type: "POST",
		dataType: "json",
		data: "ext=setProductsPricesTax&mode="+type,
		url: "/ajax.php",
		success: function(data){
			setTimeout( function() {
				if(data['continue_link']) window.location.href=data['continue_link'];
			}, 1200 );
		},
	});
});

$(document).on( "change", ".prdoption_configurator", function(e){
	 var data = $("#cart_quantity").serialize()+"&g="+$("#spring_price_plain_net").html()+"&o="+$("#spring_old_price_plain").html();
     $.ajax({
	  type: "POST",
      dataType: "json",
      data: data,
      async: false,
	  url: "/configurator.php",
 	  success: function(data){
	   if(data['total_weight'] !="") $("#ajax_weight").html( " "+data['total_weight']+" kg");
	   if(data['newProductPriceFormatted'] !="") $(".ajax_price").html( data['newProductPriceFormatted']);
	   if(data['productPrice'] !="") $("#configurators_price").val( data['productPrice']);
      },
     });
});

$(document).on( "change", ".prdoption", function(e){
	 var data = $("#cart_quantity").serialize()+"&g="+$("#spring_price_plain_net").html()+"&o="+$("#spring_old_price_plain").html();
     $.ajax({
	  type: "POST",
      dataType: "json",
      data: data,
      async: false,
	  url: "/prdoption.php",
 	  success: function(data){
		  
		  console.log("s1");
		  
	   if(data['attributes_model'] !=""){
		   $("#ajax_model").html( " "+data['attributes_model']);
	   }else{
		   $("#ajax_model").html( " "+data['productSKU']);
	   }		   
	   if(data['attributes_ean'] !=""){
		   $("#ajax_ean").html( " "+data['attributes_ean']);
	   }else{
		   $("#ajax_ean").html( " "+data['productEAN']);
	   }		   
	   if(data['total_weight'] !="") $("#ajax_weight").html( " "+data['total_weight']+" kg");
	   if(data['newProductPriceFormatted'] !="") $(".ajax_price").html( data['newProductPriceFormatted']);
	   $("#pis_1").attr('src',data['attributes_image']);
	   $("#pip_1").attr('href',data['attributes_image']);
	   $("#pih_1").attr('src',data['attributes_image']);
   	   $("#pip_1").attr("data-size",data['attributes_image_width']+"x"+data['attributes_image_height']);
	   $("#pip_0").attr("data-size",data['attributes_image_width']+"x"+data['attributes_image_height']);
      },
     });
});

		
$(document).on( "click", ".prdvarradio", function(e){
	
	 var prec_kalak = $("#current_kalak_selected").val();
	 var kalak = $(this).attr("kalak");
	 $("#current_kalak_selected").val(kalak);
	 if(prec_kalak){
		$('.dsm_box ul li').html(function(index,html){
			return html.replace(prec_kalak,kalak);
		});		
		$('.dsm_box').html(function(index,html){
			return html.replace(prec_kalak,kalak);
		});		
	 }
	
     var data = $("#cart_quantity").serialize()+"&g="+$("#spring_price_plain_net").html()+"&o="+$("#spring_old_price_plain").html();
	 var ccrbd = $(this).attr("id");
	 $('#products_qty').empty();
     $.ajax({
	  type: "POST",
      dataType: "json",
      data: data,
      async: false,
	  url: "/prdoption.php",
 	  success: function(data){
	   $(".productoptions .wrapper label").removeClass("checked");
	   $(".cc"+ccrbd).addClass("checked");
	   
	   
	   

	   
	   if(data['attributes_stock'] > 0){
		   for (let i = 1; i <= data['attributes_stock']; i++){ 
			$("#products_qty").append(new Option(i, i));
		   }
		   $(".disponible").removeClass("zero");
		   $(".disponible").html( $("#textInStock").html() );
		   $('[psc-act="add-to-cart"]').prop('disabled', false);
		   $("#addCartSection select").prop('disabled', false);
		   $('[psc-act="add-to-cart"]').removeClass("buttonDisabled");
		   $("#paypal_button_section").show();
		   $('.ariba').fadeIn();
		   $("#fecha_estimada_entrega_container").fadeIn();
	   }else{
		   $(".disponible").addClass("zero");
		   $(".disponible").html( $("#textNotInStock").html() );
		   $('[psc-act="add-to-cart"]').prop('disabled', true);
		   $("#addCartSection select").prop('disabled', true);
		   $('[psc-act="add-to-cart"]').addClass("buttonDisabled");
		   $("#products_qty").append(new Option(0, 0));
		   $("#paypal_button_section").hide();
		   $('.ariba').fadeOut();
		   $("#fecha_estimada_entrega_container").fadeOut();
	   }
	   
	   if(data['attributes_model'] !=""){
		   $("#ajax_model").html( " "+data['attributes_model']);
	   }else{
		   $("#ajax_model").html( " "+data['productSKU']);
	   }		   
	   if(data['attributes_ean'] !=""){
		   $("#ajax_ean").html( " "+data['attributes_ean']);
	   }else{
		   $("#ajax_ean").html( " "+data['productEAN']);
	   }		   
	   if(data['total_weight'] !="") $("#ajax_weight").html( " "+data['total_weight']+" kg");
	   if(data['newProductPriceFormatted'] !="") $(".ajax_price").html( data['newProductPriceFormatted']);
	   $("#pis_1").attr('src',data['attributes_image']);
	   $("#pip_1").attr('href',data['attributes_image']);
	   $("#pih_1").attr('src',data['attributes_image']);
   	   $("#pip_1").attr("data-size",data['attributes_image_width']+"x"+data['attributes_image_height']);
	   $("#pip_0").attr("data-size",data['attributes_image_width']+"x"+data['attributes_image_height']);

	   
      },/*! success: function(data)..... */
     });/*! ajax.... */
});


$(document).on( "click", ".sideBarContact_icon .haris", function(e){
		
		$("#sideBar_regfrm").show();
		$("#sideBar_success_alert").hide();
		setTimeout( function() {
			$(".sideBarContact_icon").animate({right:-200});
			$(".sideBarContact").animate({right:0});
			$(".topbar").css("z-index","5");
			$("header").css("z-index","5");
			$("body").addClass("sideBarOverflow");
			$("#sideBarPageOverlay").css("display","block");
		}, 700 );
		
});
	
$(document).on( "click", ".sideBarClose", function(e){
		$("#sideBar_regfrm").show();
		$("#sideBar_success_alert").hide();
		
		setTimeout( function() {
			$(".sideBarContact").animate({right:-1000});
			$(".topbar").css("z-index","9010");
			$("header").css("z-index","9000");
			$("body").removeClass("sideBarOverflow");
			$(".sideBarContact_icon").animate({right:0});
			$("#sideBarPageOverlay").css("display","none");
		}, 200 );
});
	
$("#sideBarForm_submit").click(function(){
		
		var error = false;	
		
		var user_name  = $("#sideBarForm_name").val();
		var user_mail  = $("#sideBarForm_mail").val();
		var user_phone = $("#sideBarForm_phone").val();
		var user_text  = $("#sideBarForm_text").val();
		
		if(user_name == ""){ $("#sideBarForm_name").addClass("sideBarFormError"); error = true;	}
		if(user_text == ""){ $("#sideBarForm_text").addClass("sideBarFormError"); error = true;	}
		if(user_mail == ""){ $("#sideBarForm_mail").addClass("sideBarFormError"); error = true;	}
	 
		if(error) return false;
	 
		$.ajax({
			type: "POST",
			dataType: "json",
			data: "ext=sideBarContact_send&n="+user_name+"&m="+user_mail+"&p="+user_phone+"&r="+user_text,
			url: "/ajax.php",
			success: function(data){
				
				$("#sideBarForm_name").val('');
				$("#sideBarForm_mail").val('');
				$("#sideBarForm_phone").val('');
				$("#sideBarForm_text").val('');
				
				$("#sideBar_regfrm").hide();
				$("#sideBar_success_alert").fadeIn();
/*!				
				setTimeout( function() {
					$("#sideBar_regfrm").fadeIn();
					$("#sideBar_success_alert").hide();
				}, 10200 );
*/				
			},
		});
		
});

jQuery(document).ready(function($) {
	'use strict';
	
	/*! bo exit indent initial */
	$.stickToMe({ layer: '#stickLayer' });
	$(".promo-section-home-1 .container-fluid.max").css("padding","0px");
	
	$( document ).on( 'click', '#stickLayer #exitIdentNewsletter #eimail', function ( event ) {
		$('#stickLayer #exitIdentNewsletter .feedback-message').html("");
	});
		
	$( document ).on( 'submit', '#stickLayer #exitIdentNewsletter', function ( event ) {		
		event.preventDefault();
  	    var eIMail = "";	 
        $("#exitIdentNewsletter input[type=email]").each(function () {
          eIMail = this.value;
		  if(eIMail != ""){
			$.ajax({
				type: "POST",
				dataType: "json",
				data: "ext=newsletter&email="+eIMail+"&action="+$("#stickLayer #exitIdentNewsletter #action").val(),
				url: "/ajax.php",
				success: function(data){
					if( data['error'] == true ){
						$('#exitIdentNewsletter .feedback-message').html(data['message']);
					}else{
						writeCookie("hidenewsletterdisruptor", "true", 90);
						writeCookie("newsletteradorned", "true", 90);
						$('#stickLayer .inner').hide();
						$('#stickLayer .florierend').fadeIn();
					}
				},
			});
		  }
        });
	});
	/*! eo exit indent initial */
	
	
	/*! bo newsletter störer */
		
	var srtz = setInterval(function(){
		if( read_cookie('hidenewsletterdisruptor') != "true" ){
			if( $(window).scrollTop() > 200 ){
				if( $(window).width() <= 1024 ){
					$(".effCosInfo").animate({bottom:0});
					$(".effCosInfo").animate({left:10});
				}else{
					$(".effCosInfo").animate({left:20});
				}
			}
		}
	},6400);
	
	
	$(".effCosInfo .g-l13wo8").on('click', function(){
		$(".effCosInfo").animate({left:-2000});
		writeCookie("hidenewsletterdisruptor", "true", 1);
		clearInterval(srtz);
	});
	
	$(".effCosInfo #submitted_and_ready").on('click', function(){
		$(".effCosInfo").animate({bottom:-2000});
	});
	
	$("#newsletter-stoerer #email").on('focus',function(){
		$('.effCosInfo .feedback-message').html("");
	});
			
	$("#newsletter-stoerer").on('submit', function(){
		event.preventDefault();
		$.ajax({
			type: "POST",
			dataType: "json",
			data: "ext=newsletter&email="+$("#newsletter-stoerer #email").val()+"&action="+$("#newsletter-stoerer #action").val(),
			url: "/ajax.php",
			success: function(data){
				if( data['error'] == true ){
					$('.effCosInfo .feedback-message').html(data['message']);
				}else{
					writeCookie("hidenewsletterdisruptor", "true", 90);
					writeCookie("newsletteradorned", "true", 90);
					$('.effCosInfo .gleft .inner').hide();
					$('.effCosInfo .gleft .florierend').fadeIn();
					clearInterval(srtz);
				}
			},
		});
	});
	/*! eo newsletter störer */
	
	
	$(".dzsparallaxer.pscAutoHeight").fadeIn();
	
	var hasScrollbar = function() {
	  if (typeof window.innerWidth === 'number') {
	    return window.innerWidth > document.documentElement.clientWidth;
		}

	  var rootElem = document.documentElement || document.body;

	  var overflowStyle;

	  if (typeof rootElem.currentStyle !== 'undefined') {
			overflowStyle = rootElem.currentStyle.overflow;
		}

	  overflowStyle = overflowStyle || window.getComputedStyle(rootElem, '').overflow;

	  var overflowYStyle;

	  if (typeof rootElem.currentStyle !== 'undefined') {
			overflowYStyle = rootElem.currentStyle.overflowY;
		}

	  overflowYStyle = overflowYStyle || window.getComputedStyle(rootElem, '').overflowY;

	  var contentOverflows = rootElem.scrollHeight > rootElem.clientHeight;
	  var overflowShown    = /^(visible|auto)$/.test(overflowStyle) || /^(visible|auto)$/.test(overflowYStyle);
	  var alwaysShowScroll = overflowStyle === 'scroll' || overflowYStyle === 'scroll';

	  return (contentOverflows && overflowShown) || (alwaysShowScroll);
	};
	if (hasScrollbar()) {
		$('body').addClass('hasScrollbar');
	}


	var $emptyLink = $('a[href="#"]');
	$emptyLink.on('click', function(e) {
		e.preventDefault();
	});


	function stickyHeader() {
		var $body = $('body');
		var $navbar = $('.navbar-sticky');
		var $topbarH = $('.topbar').outerHeight();
		var $navbarH = $navbar.outerHeight();
		if($navbar.length) {
			$(window).on('scroll', function() {
				if($(this).scrollTop() > $topbarH) {
					$navbar.addClass('navbar-stuck');
					if(! $navbar.hasClass('navbar-ghost')) {
						$body.css('padding-top', $navbarH);
					}
				} else {
					$navbar.removeClass('navbar-stuck');
					$body.css('padding-top', 0);
				}
			});
		}
	}
	stickyHeader();


  function searchActions( openTrigger, closeTrigger, clearTrigger, target ) {
    $( openTrigger ).on( 'click', function() {
      $( target ).addClass( 'search-visible' );
      setTimeout( function() {
        $( target + ' > input' ).focus();
      }, 200);
    } );
    $( closeTrigger ).on( 'click', function() {
      $( target ).removeClass( 'search-visible' );
    } );
    $( clearTrigger ).on('click', function(){
      $( target + ' > input' ).val('');
      setTimeout(function() {
        $( target + ' > input' ).focus();
      }, 200);
    });
  }
  searchActions( '.alias-searcher', '.close-search', '.clear-search', '.site-search' );

	
	$('.lang-currency-switcher').on('click', function() {
		$(this).parent().addClass('show');
		$(this).parent().find('.dropdown-menu').addClass('show');
	});
	$(document).on('click', function (event) {
		if (!$(event.target).closest('.lang-currency-switcher-wrap').length) {
			$('.lang-currency-switcher-wrap').removeClass('show');
			$('.lang-currency-switcher-wrap .dropdown-menu').removeClass('show');
		}
	});
	

	function offcanvasOpen(e) {
		$('#mobile-menu').show();
		$("#mobile-menu").css('visibility', 'visible');
		var $body = $('body');
		var targetEl = $(e.target).attr('href');
		$(targetEl).addClass('active');
		$body.css('overflow', 'hidden');
		$body.addClass('offcanvas-open');
		$('.offcanvas-container').show();
		e.preventDefault();
		$('.overlay').show();
	}
	
	function offcanvasClose() {
		$('.offcanvas-container').removeClass('active');
		$('#mobile-menu').hide();
		$("#mobile-menu").css('visibility', 'hidden');
		$('.offcanvas-container').hide();
		var $body = $('body');
		$('.overlay').hide();
		$body.removeClass('offcanvas-open');
		$body.css('overflow', 'visible');
	}
	
	$('[data-toggle="offcanvas"]').on('click', offcanvasOpen);
	$('.oc-close').on('click', offcanvasClose);


  var menuInitHeight = $( '.offcanvas-menu .menu' ).height(),
      backBtnText = 'Back',
      subMenu = $( '.offcanvas-menu .offcanvas-submenu' );
  
  subMenu.each( function () {
    $( this ).prepend( '<li class="back-btn"><a href="#">' + backBtnText + '</a></li>' );
  } );

  var hasChildLink = $( '.has-children .sub-menu-toggle' ),
      backBtn = $( '.offcanvas-menu .offcanvas-submenu .back-btn' );

  backBtn.on( 'click', function ( e ) {
    var self = this,
      parent = $( self ).parent(),
      siblingParent = $( self ).parent().parent().siblings().parent(),
      menu = $( self ).parents( '.menu' );
    
    parent.removeClass( 'in-view' );
    siblingParent.removeClass( 'off-view' );
    if ( siblingParent.attr( 'class' ) === 'menu' ) {
      menu.css( 'height', menuInitHeight );
    } else {
      menu.css( 'height', siblingParent.height() );
    }

    e.preventDefault();
  } );

  hasChildLink.on( 'click', function ( e ) {
    var self = this,
      parent = $( self ).parent().parent().parent(),
      menu = $( self ).parents( '.menu' );

    parent.addClass( 'off-view' );
    $( self ).parent().parent().find( '> .offcanvas-submenu' ).addClass( 'in-view' );
    menu.css( 'height', $( self ).parent().parent().find( '> .offcanvas-submenu' ).height() );

    e.preventDefault();
    return false;
	} );


	window.addEventListener('load', function() {
		var forms = document.getElementsByClassName('needs-validation');
		var validation = Array.prototype.filter.call(forms, function(form) {
			form.addEventListener('submit', function(event) {
				if (form.checkValidity() === false) {
					event.preventDefault();
					event.stopPropagation();
				}
				form.classList.add('was-validated');
			}, false);
		});
	}, false);


	var $scrollTop = $( '.scroll-to-top-btn' );
	if ( $scrollTop.length > 0 ) {
		$( window ).on( 'scroll', function () {
			if ( $( this ).scrollTop() > 600 ) {
				$scrollTop.addClass( 'visible' );
			} else {
				$scrollTop.removeClass( 'visible' );
			}
		} );
		$scrollTop.on( 'click', function ( e ) {
			e.preventDefault();
			$( 'html' ).velocity( 'scroll', {
				offset: 0,
				duration: 1200,
				easing: 'easeOutExpo',
				mobileHA: false
			} );
		} );
	}


	$( document ).on( 'click', '.scroll-to', function ( event ) {
		var target = $( this ).attr( 'href' );
		if ( '#' === target ) {
			return false;
		}

		var $target = $( target );
		if( $target.length > 0 ) {
			var $elemOffsetTop = $target.data( 'offset-top' ) || 70;
			$( 'html' ).velocity( 'scroll', {
				offset: $( this.hash ).offset().top - $elemOffsetTop,
				duration: 1000,
				easing: 'easeOutExpo',
				mobileHA: false
			} );
		}
		event.preventDefault();
	} );


	function filterList(trigger) {
		trigger.each(function() {
			var self = $(this),
					target = self.data('filter-list'),
					search = self.find('input[type=text]'),
					filters = self.find('input[type=radio]'),
					list = $(target).find('.list-group-item');
			
			search.keyup(function() {
				var searchQuery = search.val();
				list.each(function() {
					var text = $(this).text().toLowerCase();
					(text.indexOf(searchQuery.toLowerCase()) == 0) ? $(this).show() : $(this).hide(); 
				});
			});

			filters.on('click', function(e) {
				var targetItem = $(this).val();
				if(targetItem !== 'all') {
					list.hide();
					$('[data-filter-item=' + targetItem + ']').show();
				} else {
					list.show();
				}
				
			});
		});
	}
	filterList($('[data-filter-list]'));


	function countDownFunc( items, trigger ) {
		items.each( function() {
			var countDown = $(this),
					dateTime = $(this).data('date-time');

			var countDownTrigger = ( trigger ) ? trigger : countDown;
			countDownTrigger.downCount({
		      date: dateTime,
		      offset: +10
		  });
		});
	}
	countDownFunc( $('.countdown') );
	

	$('[data-toast]').on('click', function() {
		
		var self = $(this),
				$type = self.data('toast-type'),
				$icon = self.data('toast-icon'),
				$position = self.data('toast-position'),
				$title = self.data('toast-title'),
				$message = self.data('toast-message'),
				toastOptions = '';
		
		switch ($position) {
			case 'topRight':
				toastOptions = {
					class: 'iziToast-' + $type || '',
					title: $title || 'Title',
					message: $message || 'toast message',
					animateInside: false,
					position: 'topRight',
					progressBar: false,
					icon: $icon,
					timeout: 6200,
					transitionIn: 'fadeInLeft',
					transitionOut: 'fadeOut',
					transitionInMobile: 'fadeIn',
					transitionOutMobile: 'fadeOut'
				};
				break;
			case 'bottomRight':
				toastOptions = {
					class: 'iziToast-' + $type || '',
					title: $title || 'Title',
					message: $message || 'toast message',
					animateInside: false,
					position: 'bottomRight',
					progressBar: false,
					icon: $icon,
					timeout: 6200,
					transitionIn: 'fadeInLeft',
					transitionOut: 'fadeOut',
					transitionInMobile: 'fadeIn',
					transitionOutMobile: 'fadeOut'
				};
				break;
			case 'topLeft':
				toastOptions = {
					class: 'iziToast-' + $type || '',
					title: $title || 'Title',
					message: $message || 'toast message',
					animateInside: false,
					position: 'topLeft',
					progressBar: false,
					icon: $icon,
					timeout: 6200,
					transitionIn: 'fadeInRight',
					transitionOut: 'fadeOut',
					transitionInMobile: 'fadeIn',
					transitionOutMobile: 'fadeOut'
				};
				break;
			case 'bottomLeft':
				toastOptions = {
					class: 'iziToast-' + $type || '',
					title: $title || 'Title',
					message: $message || 'toast message',
					animateInside: false,
					position: 'bottomLeft',
					progressBar: false,
					icon: $icon,
					timeout: 6200,
					transitionIn: 'fadeInRight',
					transitionOut: 'fadeOut',
					transitionInMobile: 'fadeIn',
					transitionOutMobile: 'fadeOut'
				};
				break;
			case 'topCenter':
				toastOptions = {
					class: 'iziToast-' + $type || '',
					title: $title || 'Title',
					message: $message || 'toast message',
					animateInside: false,
					position: 'topCenter',
					progressBar: false,
					icon: $icon,
					timeout: 6200,
					transitionIn: 'fadeInDown',
					transitionOut: 'fadeOut',
					transitionInMobile: 'fadeIn',
					transitionOutMobile: 'fadeOut'
				};
				break;
			case 'bottomCenter':
				toastOptions = {
					class: 'iziToast-' + $type || '',
					title: $title || 'Title',
					message: $message || 'toast message',
					animateInside: false,
					position: 'bottomCenter',
					progressBar: false,
					icon: $icon,
					timeout: 6200,
					transitionIn: 'fadeInUp',
					transitionOut: 'fadeOut',
					transitionInMobile: 'fadeIn',
					transitionOutMobile: 'fadeOut'
				};
				break;
			default:
				toastOptions = {
					class: 'iziToast-' + $type || '',
					title: $title || 'Title',
					message: $message || 'toast message',
					animateInside: false,
					position: 'topRight',
					progressBar: false,
					icon: $icon,
					timeout: 6200,
					transitionIn: 'fadeInLeft',
					transitionOut: 'fadeOut',
					transitionInMobile: 'fadeIn',
					transitionOutMobile: 'fadeOut'
				};
		}

		iziToast.show(toastOptions);
	});

	$('[data-toggle="toast"]').on('click', function() {
		var target = '#' + $(this).data('toast-id');
		$(target).toast('show');
	});


	$('.btn-wishlist').on('click', function() {
		var iteration = $(this).data('iteration') || 1,
				toastOptions = {
					title: 'Product',
					animateInside: false,
					position: 'topRight',
					progressBar: false,
					timeout: 6200,
					transitionIn: 'fadeInLeft',
					transitionOut: 'fadeOut',
					transitionInMobile: 'fadeIn',
					transitionOutMobile: 'fadeOut'
				};

		switch ( iteration) {
			case 1:
				$(this).addClass('active');
				toastOptions.class = 'iziToast-info';
				toastOptions.message = 'added to your wishlist!';
				toastOptions.icon = 'icon-bell';
				break;
			
			case 2:
				$(this).removeClass('active');
				toastOptions.class = 'iziToast-danger';
				toastOptions.message = 'removed from your wishlist!';
				toastOptions.icon = 'icon-ban';
				break;
		}

		iziToast.show(toastOptions);

		iteration++;
		if (iteration > 2) iteration = 1;
		$(this).data('iteration', iteration);
	});

/*!
	if($('.filter-grid').length > 0) {
		var $filterGrid = $('.filter-grid');
		$('.nav-pills').on( 'click', 'a', function(e) {
			e.preventDefault();
			$('.nav-pills a').removeClass('active');
			$(this).addClass('active');
			var $filterValue = $(this).attr('data-filter');
			$filterGrid.isotope({ filter: $filterValue });
		});
	}
*/



	$('[data-toggle="tooltip"]').tooltip();


	$('[data-toggle="popover"]').popover();


	var rangeSlider  = document.querySelector('.ui-range-slider');
	if(typeof rangeSlider !== 'undefined' && rangeSlider !== null) {
		var dataStartMin = parseInt(rangeSlider.parentNode.getAttribute( 'data-start-min' ), 10),
				dataStartMax = parseInt(rangeSlider.parentNode.getAttribute( 'data-start-max' ), 10),
				dataMin 		 = parseInt(rangeSlider.parentNode.getAttribute( 'data-min' ), 10),
				dataMax   	 = parseInt(rangeSlider.parentNode.getAttribute( 'data-max' ), 10),
				dataStep  	 = parseInt(rangeSlider.parentNode.getAttribute( 'data-step' ), 10);
		var valueMin 			= document.querySelector('.ui-range-value-min span'),
				valueMax 			= document.querySelector('.ui-range-value-max span'),
				valueMinInput = document.querySelector('.ui-range-value-min input'),
				valueMaxInput = document.querySelector('.ui-range-value-max input');
		noUiSlider.create(rangeSlider, {
			start: [ dataStartMin, dataStartMax ],
			connect: true,
			step: dataStep,
			range: {
				'min': dataMin,
				'max': dataMax
			}
		});
		rangeSlider.noUiSlider.on('update', function(values, handle) {
			var value = values[handle];
			if ( handle ) {
				valueMax.innerHTML  = Math.round(value);
				valueMaxInput.value = Math.round(value);
			} else {
				valueMin.innerHTML  = Math.round(value);
				valueMinInput.value = Math.round(value);
			}
		});

	}


	var $creditCard = $('.interactive-credit-card');
	if($creditCard.length) {
		$creditCard.card({
			form: '.interactive-credit-card',
			container: '.card-wrapper'
		});
	}


	if($('.gallery-wrapper').length) {
		
		var initPhotoSwipeFromDOM = function(gallerySelector) {
		
			var parseThumbnailElements = function(el) {
				var thumbElements = $(el).find('.gallery-item:not(.isotope-hidden)').get(),
					numNodes = thumbElements.length,
					items = [],
					figureEl,
					linkEl,
					size,
					item;
		
				for (var i = 0; i < numNodes; i++) {
		
					figureEl = thumbElements[i]; 
		
					if (figureEl.nodeType !== 1) {
						continue;
					}
		
					linkEl = figureEl.children[0]; 
					
					if ($(linkEl).data('type') == 'video') {
						item = {
							html: $(linkEl).data('video')
						};
					} else {
						size = linkEl.getAttribute('data-size').split('x');
						item = {
							src: linkEl.getAttribute('href'),
							w: parseInt(size[0], 10),
							h: parseInt(size[1], 10)
						};
					}
		
					if (figureEl.children.length > 1) {
						item.title = $(figureEl).find('.caption').html();
					}
		
					if (linkEl.children.length > 0) {
						item.msrc = linkEl.children[0].getAttribute('src');
					}
		
					item.el = figureEl; 
					items.push(item);
				}
		
				return items;
			};
		
			
			var closest = function closest(el, fn) {
				return el && (fn(el) ? el : closest(el.parentNode, fn));
			};
		
			function hasClass(element, cls) {
				return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
			}
		
			
			var onThumbnailsClick = function(e) {
				
				e = e || window.event;
				e.preventDefault ? e.preventDefault() : e.returnValue = false;
		
				var eTarget = e.target || e.srcElement;
		
				
				var clickedListItem = closest(eTarget, function(el) {
					return (hasClass(el, 'gallery-item'));
				});
		
				if (!clickedListItem) {
					return;
				}
		
				
				
				var clickedGallery = clickedListItem.closest('.gallery-wrapper'),
					childNodes = $(clickedListItem.closest('.gallery-wrapper')).find('.gallery-item:not(.isotope-hidden)').get(),
					numChildNodes = childNodes.length,
					nodeIndex = 0,
					index;
		
				for (var i = 0; i < numChildNodes; i++) {
					if (childNodes[i].nodeType !== 1) {
						continue;
					}
		
					if (childNodes[i] === clickedListItem) {
						index = nodeIndex;
						break;
					}
					nodeIndex++;
				}
		
				if (index >= 0) {
					
					openPhotoSwipe(index, clickedGallery);
				}
				return false;
			};
		
			
			var photoswipeParseHash = function() {
				var hash = window.location.hash.substring(1),
					params = {};
		
				if (hash.length < 5) {
					return params;
				}
		
				var vars = hash.split('&');
				for (var i = 0; i < vars.length; i++) {
					if (!vars[i]) {
						continue;
					}
					var pair = vars[i].split('=');
					if (pair.length < 2) {
						continue;
					}
					params[pair[0]] = pair[1];
				}
		
				if (params.gid) {
					params.gid = parseInt(params.gid, 10);
				}
		
				return params;
			};
		
			var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
				var pswpElement = document.querySelectorAll('.pswp')[0],
					gallery,
					options,
					items;
		
				items = parseThumbnailElements(galleryElement);
		
				
				options = {
					
					closeOnScroll: false,
					
					
					galleryUID: galleryElement.getAttribute('data-pswp-uid'),
		
					getThumbBoundsFn: function(index) {
							
							var thumbnail = items[index].el.getElementsByTagName('img')[0]; 
							if($(thumbnail).length > 0) {
								var   pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
										rect = thumbnail.getBoundingClientRect();
				
								return {
									x: rect.left,
									y: rect.top + pageYScroll,
									w: rect.width
								};
							}
						}
		
				};
		
				
				if (fromURL) {
					if (options.galleryPIDs) {
						for (var j = 0; j < items.length; j++) {
							if (items[j].pid == index) {
								options.index = j;
								break;
							}
						}
					} else {
						
						options.index = parseInt(index, 10) - 1;
					}
				} else {
					options.index = parseInt(index, 10);
				}
		
				
				if (isNaN(options.index)) {
					return;
				}
		
				if (disableAnimation) {
					options.showAnimationDuration = 0;
				}
		
				
				gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
				gallery.init();
		
				gallery.listen('beforeChange', function() {
					var currItem = $(gallery.currItem.container);
					$('.pswp__video').removeClass('active');
					var currItemIframe = currItem.find('.pswp__video').addClass('active');
					$('.pswp__video').each(function() {
						if (!$(this).hasClass('active')) {
							$(this).attr('src', $(this).attr('src'));
						}
					});
				});
		
				gallery.listen('close', function() {
					$('.pswp__video').each(function() {
						$(this).attr('src', $(this).attr('src'));
					});
				});
		
			};
		
			
			var galleryElements = document.querySelectorAll(gallerySelector);
		
			for (var i = 0, l = galleryElements.length; i < l; i++) {
				galleryElements[i].setAttribute('data-pswp-uid', i + 1);
				galleryElements[i].onclick = onThumbnailsClick;
			}
		
			
			var hashData = photoswipeParseHash();
			if (hashData.pid && hashData.gid) {
				openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
			}
		
		};
		
		
		initPhotoSwipeFromDOM('.gallery-wrapper');
	}


	var $productCarousel = $('.product-carousel');
	if($productCarousel.length) {

		$productCarousel.owlCarousel({
			items: 1,
			loop: true,
			dots: false,
			URLhashListener: true,
			startPosition: 'URLHash',
			onTranslate: activeHash
		});
		
		function activeHash(e) {
			var i = e.item.index;
			var $activeHash = $('.owl-item').eq(i).find('[data-hash]').attr('data-hash');
			$('.product-thumbnails li').removeClass('active');
			$('[href="#' + $activeHash + '"]').parent().addClass('active');
			$('.gallery-wrapper .gallery-item').removeClass('active');
			$('[data-hash="' + $activeHash + '"]').parent().addClass('active');
			
		}
	}


	var $googleMap = $('.google-map');
	if($googleMap.length) {
		$googleMap.each(function(){
			var mapHeight = $(this).data('height'),
					address = $(this).data('address'),
					zoom = $(this).data('zoom'),
					controls = $(this).data('disable-controls'),
					scrollwheel = $(this).data('scrollwheel'),
					marker = $(this).data('marker'),
					markerTitle = $(this).data('marker-title'),
					styles = $(this).data('styles');
			$(this).height(mapHeight);
			$(this).gmap3({
          marker:{
            address: address,
            data: markerTitle,
            options: {
            	icon: marker
            },
            events: {
              mouseover: function(marker, event, context){
                var map = $(this).gmap3('get'),
                  	infowindow = $(this).gmap3({get:{name:'infowindow'}});
                if (infowindow){
                  infowindow.open(map, marker);
                  infowindow.setContent(context.data);
                } else {
                  $(this).gmap3({
                    infowindow:{
                      anchor:marker,
                      options:{content: context.data}
                    }
                  });
                }
              },
              mouseout: function(){
                var infowindow = $(this).gmap3({get:{name:'infowindow'}});
                if (infowindow){
                  infowindow.close();
                }
              }
            }
          },
          map:{
            options:{
              zoom: zoom,
              disableDefaultUI: controls,
              scrollwheel: scrollwheel,
              styles: styles
            }
          }
			});
		});
	}

});



/*! rand slider */

/*!! =======================================================
                      VERSION  10.6.1              
========================================================= */
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!! =========================================================
 * bootstrap-slider.js
 *
 * Maintainers:
 *		Kyle Kemp
 *			- Twitter: @seiyria
 *			- Github:  seiyria
 *		Rohit Kalkur
 *			- Twitter: @Rovolutionary
 *			- Github:  rovolution
 *
 * =========================================================
 *
 * bootstrap-slider is released under the MIT License
 * Copyright (c) 2019 Kyle Kemp, Rohit Kalkur, and contributors
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * ========================================================= */

/*!*
 * Bridget makes jQuery widgets
 * v1.0.1
 * MIT license
 */
var windowIsDefined = (typeof window === "undefined" ? "undefined" : _typeof(window)) === "object";

(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(["jquery"], factory);
	} else if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && module.exports) {
		var jQuery;
		try {
			jQuery = require("jquery");
		} catch (err) {
			jQuery = null;
		}
		module.exports = factory(jQuery);
	} else if (window) {
		window.Slider = factory(window.jQuery);
	}
})(function ($) {
	
	var NAMESPACE_MAIN = 'slider';
	var NAMESPACE_ALTERNATE = 'bootstrapSlider';

	
	if (windowIsDefined && !window.console) {
		window.console = {};
	}
	if (windowIsDefined && !window.console.log) {
		window.console.log = function () {};
	}
	if (windowIsDefined && !window.console.warn) {
		window.console.warn = function () {};
	}

	
	var Slider;

	(function ($) {

		'use strict';

		

		var slice = Array.prototype.slice;

		function noop() {}

		

		function defineBridget($) {

			
			if (!$) {
				return;
			}

			

			/*!*
    * adds option method -> $().plugin('option', {...})
    * @param {Function} PluginClass - constructor class
    */
			function addOptionMethod(PluginClass) {
				
				if (PluginClass.prototype.option) {
					return;
				}

				
				PluginClass.prototype.option = function (opts) {
					
					if (!$.isPlainObject(opts)) {
						return;
					}
					this.options = $.extend(true, this.options, opts);
				};
			}

			

			
			
			var logError = typeof console === 'undefined' ? noop : function (message) {
				console.error(message);
			};

			/*!*
    * jQuery plugin bridge, access methods like $elem.plugin('method')
    * @param {String} namespace - plugin name
    * @param {Function} PluginClass - constructor class
    */
			function bridge(namespace, PluginClass) {
				$.fn[namespace] = function (options) {
					if (typeof options === 'string') {
						var args = slice.call(arguments, 1);

						for (var i = 0, len = this.length; i < len; i++) {
							var elem = this[i];
							var instance = $.data(elem, namespace);
							if (!instance) {
								logError("cannot call methods on " + namespace + " prior to initialization; " + "attempted to call '" + options + "'");
								continue;
							}
							if (!$.isFunction(instance[options]) || options.charAt(0) === '_') {
								logError("no such method '" + options + "' for " + namespace + " instance");
								continue;
							}
							var returnValue = instance[options].apply(instance, args);
							if (returnValue !== undefined && returnValue !== instance) {
								return returnValue;
							}
						}
						return this;
					} else {
						var objects = this.map(function () {
							var instance = $.data(this, namespace);
							if (instance) {
								instance.option(options);
								instance._init();
							} else {
								instance = new PluginClass(this, options);
								$.data(this, namespace, instance);
							}
							return $(this);
						});

						if (!objects || objects.length > 1) {
							return objects;
						} else {
							return objects[0];
						}
					}
				};
			}


			/*!*
    * converts a Prototypical class into a proper jQuery plugin
    *   the class must have a ._init method
    * @param {String} namespace - plugin name, used in $().pluginName
    * @param {Function} PluginClass - constructor class
    */
			$.bridget = function (namespace, PluginClass) {
				addOptionMethod(PluginClass);
				bridge(namespace, PluginClass);
			};

			return $.bridget;
		}

		defineBridget($);
	})($);

	/*!************************************************
 			BOOTSTRAP-SLIDER SOURCE CODE
 	**************************************************/

	(function ($) {
		var autoRegisterNamespace = void 0;

		var ErrorMsgs = {
			formatInvalidInputErrorMsg: function formatInvalidInputErrorMsg(input) {
				return "Invalid input value '" + input + "' passed in";
			},
			callingContextNotSliderInstance: "Calling context element does not have instance of Slider bound to it. Check your code to make sure the JQuery object returned from the call to the slider() initializer is calling the method"
		};

		var SliderScale = {
			linear: {
				getValue: function getValue(value, options) {
					if (value < options.min) {
						return options.min;
					} else if (value > options.max) {
						return options.max;
					} else {
						return value;
					}
				},
				toValue: function toValue(percentage) {
					var rawValue = percentage / 100 * (this.options.max - this.options.min);
					var shouldAdjustWithBase = true;
					if (this.options.ticks_positions.length > 0) {
						var minv,
						    maxv,
						    minp,
						    maxp = 0;
						for (var i = 1; i < this.options.ticks_positions.length; i++) {
							if (percentage <= this.options.ticks_positions[i]) {
								minv = this.options.ticks[i - 1];
								minp = this.options.ticks_positions[i - 1];
								maxv = this.options.ticks[i];
								maxp = this.options.ticks_positions[i];

								break;
							}
						}
						var partialPercentage = (percentage - minp) / (maxp - minp);
						rawValue = minv + partialPercentage * (maxv - minv);
						shouldAdjustWithBase = false;
					}

					var adjustment = shouldAdjustWithBase ? this.options.min : 0;
					var value = adjustment + Math.round(rawValue / this.options.step) * this.options.step;
					return SliderScale.linear.getValue(value, this.options);
				},
				toPercentage: function toPercentage(value) {
					if (this.options.max === this.options.min) {
						return 0;
					}

					if (this.options.ticks_positions.length > 0) {
						var minv,
						    maxv,
						    minp,
						    maxp = 0;
						for (var i = 0; i < this.options.ticks.length; i++) {
							if (value <= this.options.ticks[i]) {
								minv = i > 0 ? this.options.ticks[i - 1] : 0;
								minp = i > 0 ? this.options.ticks_positions[i - 1] : 0;
								maxv = this.options.ticks[i];
								maxp = this.options.ticks_positions[i];

								break;
							}
						}
						if (i > 0) {
							var partialPercentage = (value - minv) / (maxv - minv);
							return minp + partialPercentage * (maxp - minp);
						}
					}

					return 100 * (value - this.options.min) / (this.options.max - this.options.min);
				}
			},

			logarithmic: {
				toValue: function toValue(percentage) {
					var offset = 1 - this.options.min;
					var min = Math.log(this.options.min + offset);
					var max = Math.log(this.options.max + offset);
					var value = Math.exp(min + (max - min) * percentage / 100) - offset;
					if (Math.round(value) === max) {
						return max;
					}
					value = this.options.min + Math.round((value - this.options.min) / this.options.step) * this.options.step;
					/*! Rounding to the nearest step could exceed the min or
      * max, so clip to those values. */
					return SliderScale.linear.getValue(value, this.options);
				},
				toPercentage: function toPercentage(value) {
					if (this.options.max === this.options.min) {
						return 0;
					} else {
						var offset = 1 - this.options.min;
						var max = Math.log(this.options.max + offset);
						var min = Math.log(this.options.min + offset);
						var v = Math.log(value + offset);
						return 100 * (v - min) / (max - min);
					}
				}
			}
		};

		/*!************************************************
  						CONSTRUCTOR
  	**************************************************/
		Slider = function Slider(element, options) {
			createNewSlider.call(this, element, options);
			return this;
		};

		function createNewSlider(element, options) {

			/*!
   	The internal state object is used to store data about the current 'state' of slider.
   	This includes values such as the `value`, `enabled`, etc...
   */
			this._state = {
				value: null,
				enabled: null,
				offset: null,
				size: null,
				percentage: null,
				inDrag: false,
				over: false,
				tickIndex: null
			};

			this.ticksCallbackMap = {};
			this.handleCallbackMap = {};

			if (typeof element === "string") {
				this.element = document.querySelector(element);
			} else if (element instanceof HTMLElement) {
				this.element = element;
			}

			/*!************************************************
   					Process Options
   	**************************************************/
			options = options ? options : {};
			var optionTypes = Object.keys(this.defaultOptions);

			var isMinSet = options.hasOwnProperty('min');
			var isMaxSet = options.hasOwnProperty('max');

			for (var i = 0; i < optionTypes.length; i++) {
				var optName = optionTypes[i];

				var val = options[optName];
				val = typeof val !== 'undefined' ? val : getDataAttrib(this.element, optName);
				val = val !== null ? val : this.defaultOptions[optName];
				if (!this.options) {
					this.options = {};
				}
				this.options[optName] = val;
			}

			this.ticksAreValid = Array.isArray(this.options.ticks) && this.options.ticks.length > 0;

			if (!this.ticksAreValid) {
				this.options.lock_to_ticks = false;
			}

			if (this.options.rtl === 'auto') {
				var computedStyle = window.getComputedStyle(this.element);
				if (computedStyle != null) {
					this.options.rtl = computedStyle.direction === 'rtl';
				} else {
					this.options.rtl = this.element.style.direction === 'rtl';
				}
			}

			/*!
   	Validate `tooltip_position` against 'orientation`
   	- if `tooltip_position` is incompatible with orientation, swith it to a default compatible with specified `orientation`
   		-- default for "vertical" -> "right", "left" if rtl
   		-- default for "horizontal" -> "top"
   */
			if (this.options.orientation === "vertical" && (this.options.tooltip_position === "top" || this.options.tooltip_position === "bottom")) {
				if (this.options.rtl) {
					this.options.tooltip_position = "left";
				} else {
					this.options.tooltip_position = "right";
				}
			} else if (this.options.orientation === "horizontal" && (this.options.tooltip_position === "left" || this.options.tooltip_position === "right")) {

				this.options.tooltip_position = "top";
			}

			function getDataAttrib(element, optName) {
				var dataName = "data-slider-" + optName.replace(/_/g, '-');
				var dataValString = element.getAttribute(dataName);

				try {
					return JSON.parse(dataValString);
				} catch (err) {
					return dataValString;
				}
			}

			/*!************************************************
   					Create Markup
   	**************************************************/

			var origWidth = this.element.style.width;
			var updateSlider = false;
			var parent = this.element.parentNode;
			var sliderTrackSelection;
			var sliderTrackLow, sliderTrackHigh;
			var sliderMinHandle;
			var sliderMaxHandle;

			if (this.sliderElem) {
				updateSlider = true;
			} else {
				
				/*! PSC 2021-06-10 */
				if(this.options.min == this.options.max){
					console.log(this.options.min + " | " + this.options.max);
					$(".categories-price-slider").hide();
				}
				
				/*! Create elements needed for slider */
				this.sliderElem = document.createElement("div");
				this.sliderElem.className = "slider";

				/*! Create slider track elements */
				var sliderTrack = document.createElement("div");
				sliderTrack.className = "slider-track";

				sliderTrackLow = document.createElement("div");
				sliderTrackLow.className = "slider-track-low";

				sliderTrackSelection = document.createElement("div");
				sliderTrackSelection.className = "slider-selection";

				sliderTrackHigh = document.createElement("div");
				sliderTrackHigh.className = "slider-track-high";

				sliderMinHandle = document.createElement("div");
				sliderMinHandle.className = "slider-handle min-slider-handle";
				sliderMinHandle.setAttribute('role', 'slider');
				sliderMinHandle.setAttribute('aria-valuemin', this.options.min);
				sliderMinHandle.setAttribute('aria-valuemax', this.options.max);

				sliderMaxHandle = document.createElement("div");
				sliderMaxHandle.className = "slider-handle max-slider-handle";
				sliderMaxHandle.setAttribute('role', 'slider');
				sliderMaxHandle.setAttribute('aria-valuemin', this.options.min);
				sliderMaxHandle.setAttribute('aria-valuemax', this.options.max);

				sliderTrack.appendChild(sliderTrackLow);
				sliderTrack.appendChild(sliderTrackSelection);
				sliderTrack.appendChild(sliderTrackHigh);

				/*! Create highlight range elements */
				this.rangeHighlightElements = [];
				var rangeHighlightsOpts = this.options.rangeHighlights;
				if (Array.isArray(rangeHighlightsOpts) && rangeHighlightsOpts.length > 0) {
					for (var j = 0; j < rangeHighlightsOpts.length; j++) {
						var rangeHighlightElement = document.createElement("div");
						var customClassString = rangeHighlightsOpts[j].class || "";
						rangeHighlightElement.className = "slider-rangeHighlight slider-selection " + customClassString;
						this.rangeHighlightElements.push(rangeHighlightElement);
						sliderTrack.appendChild(rangeHighlightElement);
					}
				}

				/*! Add aria-labelledby to handle's */
				var isLabelledbyArray = Array.isArray(this.options.labelledby);
				if (isLabelledbyArray && this.options.labelledby[0]) {
					sliderMinHandle.setAttribute('aria-labelledby', this.options.labelledby[0]);
				}
				if (isLabelledbyArray && this.options.labelledby[1]) {
					sliderMaxHandle.setAttribute('aria-labelledby', this.options.labelledby[1]);
				}
				if (!isLabelledbyArray && this.options.labelledby) {
					sliderMinHandle.setAttribute('aria-labelledby', this.options.labelledby);
					sliderMaxHandle.setAttribute('aria-labelledby', this.options.labelledby);
				}

				/*! Create ticks */
				this.ticks = [];
				if (Array.isArray(this.options.ticks) && this.options.ticks.length > 0) {
					this.ticksContainer = document.createElement('div');
					this.ticksContainer.className = 'slider-tick-container';

					for (i = 0; i < this.options.ticks.length; i++) {
						var tick = document.createElement('div');
						tick.className = 'slider-tick';
						if (this.options.ticks_tooltip) {
							var tickListenerReference = this._addTickListener();
							var enterCallback = tickListenerReference.addMouseEnter(this, tick, i);
							var leaveCallback = tickListenerReference.addMouseLeave(this, tick);

							this.ticksCallbackMap[i] = {
								mouseEnter: enterCallback,
								mouseLeave: leaveCallback
							};
						}
						this.ticks.push(tick);
						this.ticksContainer.appendChild(tick);
					}

					sliderTrackSelection.className += " tick-slider-selection";
				}

				this.tickLabels = [];
				if (Array.isArray(this.options.ticks_labels) && this.options.ticks_labels.length > 0) {
					this.tickLabelContainer = document.createElement('div');
					this.tickLabelContainer.className = 'slider-tick-label-container';

					for (i = 0; i < this.options.ticks_labels.length; i++) {
						var label = document.createElement('div');
						var noTickPositionsSpecified = this.options.ticks_positions.length === 0;
						var tickLabelsIndex = this.options.reversed && noTickPositionsSpecified ? this.options.ticks_labels.length - (i + 1) : i;
						label.className = 'slider-tick-label';
						label.innerHTML = this.options.ticks_labels[tickLabelsIndex];

						this.tickLabels.push(label);
						this.tickLabelContainer.appendChild(label);
					}
				}

				var createAndAppendTooltipSubElements = function createAndAppendTooltipSubElements(tooltipElem) {
					var arrow = document.createElement("div");
					arrow.className = "tooltip-arrow";

					var inner = document.createElement("div");
					inner.className = "tooltip-inner";

					tooltipElem.appendChild(arrow);
					tooltipElem.appendChild(inner);
				};

				/*! Create tooltip elements */
				var sliderTooltip = document.createElement("div");
				sliderTooltip.className = "tooltip tooltip-main";
				sliderTooltip.setAttribute('role', 'presentation');
				createAndAppendTooltipSubElements(sliderTooltip);

				var sliderTooltipMin = document.createElement("div");
				sliderTooltipMin.className = "tooltip tooltip-min";
				sliderTooltipMin.setAttribute('role', 'presentation');
				createAndAppendTooltipSubElements(sliderTooltipMin);

				var sliderTooltipMax = document.createElement("div");
				sliderTooltipMax.className = "tooltip tooltip-max";
				sliderTooltipMax.setAttribute('role', 'presentation');
				createAndAppendTooltipSubElements(sliderTooltipMax);

				/*! Append components to sliderElem */
				this.sliderElem.appendChild(sliderTrack);
				this.sliderElem.appendChild(sliderTooltip);
				this.sliderElem.appendChild(sliderTooltipMin);
				this.sliderElem.appendChild(sliderTooltipMax);

				if (this.tickLabelContainer) {
					this.sliderElem.appendChild(this.tickLabelContainer);
				}
				if (this.ticksContainer) {
					this.sliderElem.appendChild(this.ticksContainer);
				}

				this.sliderElem.appendChild(sliderMinHandle);
				this.sliderElem.appendChild(sliderMaxHandle);

				/*! Append slider element to parent container, right before the original <input> element */
				parent.insertBefore(this.sliderElem, this.element);

				/*! Hide original <input> element */
				this.element.style.display = "none";
			}
			/*! If JQuery exists, cache JQ references */
			if ($) {
				this.$element = $(this.element);
				this.$sliderElem = $(this.sliderElem);
			}

			/*!************************************************
   						Setup
   	**************************************************/
			this.eventToCallbackMap = {};
			this.sliderElem.id = this.options.id;

			this.touchCapable = 'ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch;

			this.touchX = 0;
			this.touchY = 0;

			this.tooltip = this.sliderElem.querySelector('.tooltip-main');
			this.tooltipInner = this.tooltip.querySelector('.tooltip-inner');

			this.tooltip_min = this.sliderElem.querySelector('.tooltip-min');
			this.tooltipInner_min = this.tooltip_min.querySelector('.tooltip-inner');

			this.tooltip_max = this.sliderElem.querySelector('.tooltip-max');
			this.tooltipInner_max = this.tooltip_max.querySelector('.tooltip-inner');

			if (SliderScale[this.options.scale]) {
				this.options.scale = SliderScale[this.options.scale];
			}

			if (updateSlider === true) {
				this._removeClass(this.sliderElem, 'slider-horizontal');
				this._removeClass(this.sliderElem, 'slider-vertical');
				this._removeClass(this.sliderElem, 'slider-rtl');
				this._removeClass(this.tooltip, 'hide');
				this._removeClass(this.tooltip_min, 'hide');
				this._removeClass(this.tooltip_max, 'hide');

				["left", "right", "top", "width", "height"].forEach(function (prop) {
					this._removeProperty(this.trackLow, prop);
					this._removeProperty(this.trackSelection, prop);
					this._removeProperty(this.trackHigh, prop);
				}, this);

				[this.handle1, this.handle2].forEach(function (handle) {
					this._removeProperty(handle, 'left');
					this._removeProperty(handle, 'right');
					this._removeProperty(handle, 'top');
				}, this);

				[this.tooltip, this.tooltip_min, this.tooltip_max].forEach(function (tooltip) {
					this._removeProperty(tooltip, 'left');
					this._removeProperty(tooltip, 'right');
					this._removeProperty(tooltip, 'top');

					this._removeClass(tooltip, 'right');
					this._removeClass(tooltip, 'left');
					this._removeClass(tooltip, 'top');
				}, this);
			}

			if (this.options.orientation === 'vertical') {
				this._addClass(this.sliderElem, 'slider-vertical');
				this.stylePos = 'top';
				this.mousePos = 'pageY';
				this.sizePos = 'offsetHeight';
			} else {
				this._addClass(this.sliderElem, 'slider-horizontal');
				this.sliderElem.style.width = origWidth;
				this.options.orientation = 'horizontal';
				if (this.options.rtl) {
					this.stylePos = 'right';
				} else {
					this.stylePos = 'left';
				}
				this.mousePos = 'clientX';
				this.sizePos = 'offsetWidth';
			}
			if (this.options.rtl) {
				this._addClass(this.sliderElem, 'slider-rtl');
			}
			this._setTooltipPosition();
			if (Array.isArray(this.options.ticks) && this.options.ticks.length > 0) {
				if (!isMaxSet) {
					this.options.max = Math.max.apply(Math, this.options.ticks);
				}
				if (!isMinSet) {
					this.options.min = Math.min.apply(Math, this.options.ticks);
				}
			}

			if (Array.isArray(this.options.value)) {
				this.options.range = true;
				this._state.value = this.options.value;
			} else if (this.options.range) {
				this._state.value = [this.options.value, this.options.max];
			} else {
				this._state.value = this.options.value;
			}

			this.trackLow = sliderTrackLow || this.trackLow;
			this.trackSelection = sliderTrackSelection || this.trackSelection;
			this.trackHigh = sliderTrackHigh || this.trackHigh;

			if (this.options.selection === 'none') {
				this._addClass(this.trackLow, 'hide');
				this._addClass(this.trackSelection, 'hide');
				this._addClass(this.trackHigh, 'hide');
			} else if (this.options.selection === 'after' || this.options.selection === 'before') {
				this._removeClass(this.trackLow, 'hide');
				this._removeClass(this.trackSelection, 'hide');
				this._removeClass(this.trackHigh, 'hide');
			}

			this.handle1 = sliderMinHandle || this.handle1;
			this.handle2 = sliderMaxHandle || this.handle2;

			if (updateSlider === true) {
				this._removeClass(this.handle1, 'round triangle');
				this._removeClass(this.handle2, 'round triangle hide');

				for (i = 0; i < this.ticks.length; i++) {
					this._removeClass(this.ticks[i], 'round triangle hide');
				}
			}

			var availableHandleModifiers = ['round', 'triangle', 'custom'];
			var isValidHandleType = availableHandleModifiers.indexOf(this.options.handle) !== -1;
			if (isValidHandleType) {
				this._addClass(this.handle1, this.options.handle);
				this._addClass(this.handle2, this.options.handle);

				for (i = 0; i < this.ticks.length; i++) {
					this._addClass(this.ticks[i], this.options.handle);
				}
			}

			this._state.offset = this._offset(this.sliderElem);
			this._state.size = this.sliderElem[this.sizePos];
			this.setValue(this._state.value);

			/*!*****************************************
   				Bind Event Listeners
   	******************************************/

			this.handle1Keydown = this._keydown.bind(this, 0);
			this.handle1.addEventListener("keydown", this.handle1Keydown, false);

			this.handle2Keydown = this._keydown.bind(this, 1);
			this.handle2.addEventListener("keydown", this.handle2Keydown, false);

			this.mousedown = this._mousedown.bind(this);
			this.touchstart = this._touchstart.bind(this);
			this.touchmove = this._touchmove.bind(this);

			if (this.touchCapable) {
				this.sliderElem.addEventListener("touchstart", this.touchstart, false);
				this.sliderElem.addEventListener("touchmove", this.touchmove, false);
			}

			this.sliderElem.addEventListener("mousedown", this.mousedown, false);

			this.resize = this._resize.bind(this);
			window.addEventListener("resize", this.resize, false);

			if (this.options.tooltip === 'hide') {
				this._addClass(this.tooltip, 'hide');
				this._addClass(this.tooltip_min, 'hide');
				this._addClass(this.tooltip_max, 'hide');
			} else if (this.options.tooltip === 'always') {
				this._showTooltip();
				this._alwaysShowTooltip = true;
			} else {
				this.showTooltip = this._showTooltip.bind(this);
				this.hideTooltip = this._hideTooltip.bind(this);

				if (this.options.ticks_tooltip) {
					var callbackHandle = this._addTickListener();
					var mouseEnter = callbackHandle.addMouseEnter(this, this.handle1);
					var mouseLeave = callbackHandle.addMouseLeave(this, this.handle1);
					this.handleCallbackMap.handle1 = {
						mouseEnter: mouseEnter,
						mouseLeave: mouseLeave
					};
					mouseEnter = callbackHandle.addMouseEnter(this, this.handle2);
					mouseLeave = callbackHandle.addMouseLeave(this, this.handle2);
					this.handleCallbackMap.handle2 = {
						mouseEnter: mouseEnter,
						mouseLeave: mouseLeave
					};
				} else {
					this.sliderElem.addEventListener("mouseenter", this.showTooltip, false);
					this.sliderElem.addEventListener("mouseleave", this.hideTooltip, false);

					if (this.touchCapable) {
						this.sliderElem.addEventListener("touchstart", this.showTooltip, false);
						this.sliderElem.addEventListener("touchmove", this.showTooltip, false);
						this.sliderElem.addEventListener("touchend", this.hideTooltip, false);
					}
				}

				this.handle1.addEventListener("focus", this.showTooltip, false);
				this.handle1.addEventListener("blur", this.hideTooltip, false);

				this.handle2.addEventListener("focus", this.showTooltip, false);
				this.handle2.addEventListener("blur", this.hideTooltip, false);

				if (this.touchCapable) {
					this.handle1.addEventListener("touchstart", this.showTooltip, false);
					this.handle1.addEventListener("touchmove", this.showTooltip, false);
					this.handle1.addEventListener("touchend", this.hideTooltip, false);

					this.handle2.addEventListener("touchstart", this.showTooltip, false);
					this.handle2.addEventListener("touchmove", this.showTooltip, false);
					this.handle2.addEventListener("touchend", this.hideTooltip, false);
				}
			}

			if (this.options.enabled) {
				this.enable();
			} else {
				this.disable();
			}
		}

		/*!************************************************
  				INSTANCE PROPERTIES/METHODS
  	- Any methods bound to the prototype are considered
  part of the plugin's `public` interface
  	**************************************************/
		Slider.prototype = {
			_init: function _init() {}, 

			constructor: Slider,

			defaultOptions: {
				id: "",
				min: 0,
				max: 10,
				step: 1,
				precision: 0,
				orientation: 'horizontal',
				value: 5,
				range: false,
				selection: 'before',
				tooltip: 'show',
				tooltip_split: false,
				lock_to_ticks: false,
				handle: 'round',
				reversed: false,
				rtl: 'auto',
				enabled: true,
				formatter: function formatter(val) {
					if (Array.isArray(val)) {
						return val[0] + " : " + val[1];
					} else {
						return val;
					}
				},
				natural_arrow_keys: false,
				ticks: [],
				ticks_positions: [],
				ticks_labels: [],
				ticks_snap_bounds: 0,
				ticks_tooltip: false,
				scale: 'linear',
				focus: false,
				tooltip_position: null,
				labelledby: null,
				rangeHighlights: []
			},

			getElement: function getElement() {
				return this.sliderElem;
			},

			getValue: function getValue() {
				if (this.options.range) {
					return this._state.value;
				} else {
					return this._state.value[0];
				}
			},

			setValue: function setValue(val, triggerSlideEvent, triggerChangeEvent) {
				if (!val) {
					val = 0;
				}
				var oldValue = this.getValue();
				this._state.value = this._validateInputValue(val);
				var applyPrecision = this._applyPrecision.bind(this);

				if (this.options.range) {
					this._state.value[0] = applyPrecision(this._state.value[0]);
					this._state.value[1] = applyPrecision(this._state.value[1]);

					if (this.ticksAreValid && this.options.lock_to_ticks) {
						this._state.value[0] = this.options.ticks[this._getClosestTickIndex(this._state.value[0])];
						this._state.value[1] = this.options.ticks[this._getClosestTickIndex(this._state.value[1])];
					}

					this._state.value[0] = Math.max(this.options.min, Math.min(this.options.max, this._state.value[0]));
					this._state.value[1] = Math.max(this.options.min, Math.min(this.options.max, this._state.value[1]));
				} else {
					this._state.value = applyPrecision(this._state.value);

					if (this.ticksAreValid && this.options.lock_to_ticks) {
						this._state.value = this.options.ticks[this._getClosestTickIndex(this._state.value)];
					}

					this._state.value = [Math.max(this.options.min, Math.min(this.options.max, this._state.value))];
					this._addClass(this.handle2, 'hide');
					if (this.options.selection === 'after') {
						this._state.value[1] = this.options.max;
					} else {
						this._state.value[1] = this.options.min;
					}
				}

				this._setTickIndex();

				if (this.options.max > this.options.min) {
					this._state.percentage = [this._toPercentage(this._state.value[0]), this._toPercentage(this._state.value[1]), this.options.step * 100 / (this.options.max - this.options.min)];
				} else {
					this._state.percentage = [0, 0, 100];
				}

				this._layout();
				var newValue = this.options.range ? this._state.value : this._state.value[0];

				this._setDataVal(newValue);
				if (triggerSlideEvent === true) {
					this._trigger('slide', newValue);
				}

				var hasChanged = false;
				if (Array.isArray(newValue)) {
					hasChanged = oldValue[0] !== newValue[0] || oldValue[1] !== newValue[1];
				} else {
					hasChanged = oldValue !== newValue;
				}

				if (hasChanged && triggerChangeEvent === true) {
					this._trigger('change', {
						oldValue: oldValue,
						newValue: newValue
					});
				}

				return this;
			},

			destroy: function destroy() {
				this._removeSliderEventHandlers();
				this.sliderElem.parentNode.removeChild(this.sliderElem);
				this.element.style.display = "";
				this._cleanUpEventCallbacksMap();
				this.element.removeAttribute("data");
				if ($) {
					this._unbindJQueryEventHandlers();
					if (autoRegisterNamespace === NAMESPACE_MAIN) {
						this.$element.removeData(autoRegisterNamespace);
					}
					this.$element.removeData(NAMESPACE_ALTERNATE);
				}
			},

			disable: function disable() {
				this._state.enabled = false;
				this.handle1.removeAttribute("tabindex");
				this.handle2.removeAttribute("tabindex");
				this._addClass(this.sliderElem, 'slider-disabled');
				this._trigger('slideDisabled');

				return this;
			},

			enable: function enable() {
				this._state.enabled = true;
				this.handle1.setAttribute("tabindex", 0);
				this.handle2.setAttribute("tabindex", 0);
				this._removeClass(this.sliderElem, 'slider-disabled');
				this._trigger('slideEnabled');

				return this;
			},

			toggle: function toggle() {
				if (this._state.enabled) {
					this.disable();
				} else {
					this.enable();
				}
				return this;
			},

			isEnabled: function isEnabled() {
				return this._state.enabled;
			},

			on: function on(evt, callback) {
				this._bindNonQueryEventHandler(evt, callback);
				return this;
			},

			off: function off(evt, callback) {
				if ($) {
					this.$element.off(evt, callback);
					this.$sliderElem.off(evt, callback);
				} else {
					this._unbindNonQueryEventHandler(evt, callback);
				}
			},

			getAttribute: function getAttribute(attribute) {
				if (attribute) {
					return this.options[attribute];
				} else {
					return this.options;
				}
			},

			setAttribute: function setAttribute(attribute, value) {
				this.options[attribute] = value;
				return this;
			},

			refresh: function refresh(options) {
				var currentValue = this.getValue();
				this._removeSliderEventHandlers();
				createNewSlider.call(this, this.element, this.options);
				if (options && options.useCurrentValue === true) {
					this.setValue(currentValue);
				}
				if ($) {
					if (autoRegisterNamespace === NAMESPACE_MAIN) {
						$.data(this.element, NAMESPACE_MAIN, this);
						$.data(this.element, NAMESPACE_ALTERNATE, this);
					} else {
						$.data(this.element, NAMESPACE_ALTERNATE, this);
					}
				}
				return this;
			},

			relayout: function relayout() {
				this._resize();
				return this;
			},

			/*!*****************************+
   				HELPERS
   	- Any method that is not part of the public interface.
   - Place it underneath this comment block and write its signature like so:
   		_fnName : function() {...}
   	********************************/
			_removeTooltipListener: function _removeTooltipListener(event, handler) {
				this.handle1.removeEventListener(event, handler, false);
				this.handle2.removeEventListener(event, handler, false);
			},
			_removeSliderEventHandlers: function _removeSliderEventHandlers() {
				this.handle1.removeEventListener("keydown", this.handle1Keydown, false);
				this.handle2.removeEventListener("keydown", this.handle2Keydown, false);

				if (this.options.ticks_tooltip) {
					var ticks = this.ticksContainer.getElementsByClassName('slider-tick');
					for (var i = 0; i < ticks.length; i++) {
						ticks[i].removeEventListener('mouseenter', this.ticksCallbackMap[i].mouseEnter, false);
						ticks[i].removeEventListener('mouseleave', this.ticksCallbackMap[i].mouseLeave, false);
					}
					if (this.handleCallbackMap.handle1 && this.handleCallbackMap.handle2) {
						this.handle1.removeEventListener('mouseenter', this.handleCallbackMap.handle1.mouseEnter, false);
						this.handle2.removeEventListener('mouseenter', this.handleCallbackMap.handle2.mouseEnter, false);
						this.handle1.removeEventListener('mouseleave', this.handleCallbackMap.handle1.mouseLeave, false);
						this.handle2.removeEventListener('mouseleave', this.handleCallbackMap.handle2.mouseLeave, false);
					}
				}

				this.handleCallbackMap = null;
				this.ticksCallbackMap = null;

				if (this.showTooltip) {
					this._removeTooltipListener("focus", this.showTooltip);
				}
				if (this.hideTooltip) {
					this._removeTooltipListener("blur", this.hideTooltip);
				}

				if (this.showTooltip) {
					this.sliderElem.removeEventListener("mouseenter", this.showTooltip, false);
				}
				if (this.hideTooltip) {
					this.sliderElem.removeEventListener("mouseleave", this.hideTooltip, false);
				}

				this.sliderElem.removeEventListener("mousedown", this.mousedown, false);

				if (this.touchCapable) {
					if (this.showTooltip) {
						this.handle1.removeEventListener("touchstart", this.showTooltip, false);
						this.handle1.removeEventListener("touchmove", this.showTooltip, false);
						this.handle2.removeEventListener("touchstart", this.showTooltip, false);
						this.handle2.removeEventListener("touchmove", this.showTooltip, false);
					}
					if (this.hideTooltip) {
						this.handle1.removeEventListener("touchend", this.hideTooltip, false);
						this.handle2.removeEventListener("touchend", this.hideTooltip, false);
					}

					if (this.showTooltip) {
						this.sliderElem.removeEventListener("touchstart", this.showTooltip, false);
						this.sliderElem.removeEventListener("touchmove", this.showTooltip, false);
					}
					if (this.hideTooltip) {
						this.sliderElem.removeEventListener("touchend", this.hideTooltip, false);
					}

					this.sliderElem.removeEventListener("touchstart", this.touchstart, false);
					this.sliderElem.removeEventListener("touchmove", this.touchmove, false);
				}

				window.removeEventListener("resize", this.resize, false);
			},
			_bindNonQueryEventHandler: function _bindNonQueryEventHandler(evt, callback) {
				if (this.eventToCallbackMap[evt] === undefined) {
					this.eventToCallbackMap[evt] = [];
				}
				this.eventToCallbackMap[evt].push(callback);
			},
			_unbindNonQueryEventHandler: function _unbindNonQueryEventHandler(evt, callback) {
				var callbacks = this.eventToCallbackMap[evt];
				if (callbacks !== undefined) {
					for (var i = 0; i < callbacks.length; i++) {
						if (callbacks[i] === callback) {
							callbacks.splice(i, 1);
							break;
						}
					}
				}
			},
			_cleanUpEventCallbacksMap: function _cleanUpEventCallbacksMap() {
				var eventNames = Object.keys(this.eventToCallbackMap);
				for (var i = 0; i < eventNames.length; i++) {
					var eventName = eventNames[i];
					delete this.eventToCallbackMap[eventName];
				}
			},
			_showTooltip: function _showTooltip() {
				if (this.options.tooltip_split === false) {
					this._addClass(this.tooltip, 'in');
					this.tooltip_min.style.display = 'none';
					this.tooltip_max.style.display = 'none';
				} else {
					this._addClass(this.tooltip_min, 'in');
					this._addClass(this.tooltip_max, 'in');
					this.tooltip.style.display = 'none';
				}
				this._state.over = true;
			},
			_hideTooltip: function _hideTooltip() {
				if (this._state.inDrag === false && this._alwaysShowTooltip !== true) {
					this._removeClass(this.tooltip, 'in');
					this._removeClass(this.tooltip_min, 'in');
					this._removeClass(this.tooltip_max, 'in');
				}
				this._state.over = false;
			},
			_setToolTipOnMouseOver: function _setToolTipOnMouseOver(tempState) {
				var self = this;
				var formattedTooltipVal = this.options.formatter(!tempState ? this._state.value[0] : tempState.value[0]);
				var positionPercentages = !tempState ? getPositionPercentages(this._state, this.options.reversed) : getPositionPercentages(tempState, this.options.reversed);
				this._setText(this.tooltipInner, formattedTooltipVal);

				this.tooltip.style[this.stylePos] = positionPercentages[0] + "%";

				function getPositionPercentages(state, reversed) {
					if (reversed) {
						return [100 - state.percentage[0], self.options.range ? 100 - state.percentage[1] : state.percentage[1]];
					}
					return [state.percentage[0], state.percentage[1]];
				}
			},
			_copyState: function _copyState() {
				return {
					value: [this._state.value[0], this._state.value[1]],
					enabled: this._state.enabled,
					offset: this._state.offset,
					size: this._state.size,
					percentage: [this._state.percentage[0], this._state.percentage[1], this._state.percentage[2]],
					inDrag: this._state.inDrag,
					over: this._state.over,
					dragged: this._state.dragged,
					keyCtrl: this._state.keyCtrl
				};
			},
			_addTickListener: function _addTickListener() {
				return {
					addMouseEnter: function addMouseEnter(reference, element, index) {
						var enter = function enter() {
							var tempState = reference._copyState();
							var val = element === reference.handle1 ? tempState.value[0] : tempState.value[1];
							var per = void 0;

							if (index !== undefined) {
								val = reference.options.ticks[index];
								per = reference.options.ticks_positions.length > 0 && reference.options.ticks_positions[index] || reference._toPercentage(reference.options.ticks[index]);
							} else {
								per = reference._toPercentage(val);
							}

							tempState.value[0] = val;
							tempState.percentage[0] = per;
							reference._setToolTipOnMouseOver(tempState);
							reference._showTooltip();
						};
						element.addEventListener("mouseenter", enter, false);
						return enter;
					},
					addMouseLeave: function addMouseLeave(reference, element) {
						var leave = function leave() {
							reference._hideTooltip();
						};
						element.addEventListener("mouseleave", leave, false);
						return leave;
					}
				};
			},
			_layout: function _layout() {
				var positionPercentages;
				var formattedValue;

				if (this.options.reversed) {
					positionPercentages = [100 - this._state.percentage[0], this.options.range ? 100 - this._state.percentage[1] : this._state.percentage[1]];
				} else {
					positionPercentages = [this._state.percentage[0], this._state.percentage[1]];
				}

				this.handle1.style[this.stylePos] = positionPercentages[0] + "%";
				this.handle1.setAttribute('aria-valuenow', this._state.value[0]);
				formattedValue = this.options.formatter(this._state.value[0]);
				if (isNaN(formattedValue)) {
					this.handle1.setAttribute('aria-valuetext', formattedValue);
				} else {
					this.handle1.removeAttribute('aria-valuetext');
				}

				this.handle2.style[this.stylePos] = positionPercentages[1] + "%";
				this.handle2.setAttribute('aria-valuenow', this._state.value[1]);
				formattedValue = this.options.formatter(this._state.value[1]);
				if (isNaN(formattedValue)) {
					this.handle2.setAttribute('aria-valuetext', formattedValue);
				} else {
					this.handle2.removeAttribute('aria-valuetext');
				}

				/*! Position highlight range elements */
				if (this.rangeHighlightElements.length > 0 && Array.isArray(this.options.rangeHighlights) && this.options.rangeHighlights.length > 0) {
					for (var _i = 0; _i < this.options.rangeHighlights.length; _i++) {
						var startPercent = this._toPercentage(this.options.rangeHighlights[_i].start);
						var endPercent = this._toPercentage(this.options.rangeHighlights[_i].end);

						if (this.options.reversed) {
							var sp = 100 - endPercent;
							endPercent = 100 - startPercent;
							startPercent = sp;
						}

						var currentRange = this._createHighlightRange(startPercent, endPercent);

						if (currentRange) {
							if (this.options.orientation === 'vertical') {
								this.rangeHighlightElements[_i].style.top = currentRange.start + "%";
								this.rangeHighlightElements[_i].style.height = currentRange.size + "%";
							} else {
								if (this.options.rtl) {
									this.rangeHighlightElements[_i].style.right = currentRange.start + "%";
								} else {
									this.rangeHighlightElements[_i].style.left = currentRange.start + "%";
								}
								this.rangeHighlightElements[_i].style.width = currentRange.size + "%";
							}
						} else {
							this.rangeHighlightElements[_i].style.display = "none";
						}
					}
				}

				/*! Position ticks and labels */
				if (Array.isArray(this.options.ticks) && this.options.ticks.length > 0) {

					var styleSize = this.options.orientation === 'vertical' ? 'height' : 'width';
					var styleMargin;
					if (this.options.orientation === 'vertical') {
						styleMargin = 'marginTop';
					} else {
						if (this.options.rtl) {
							styleMargin = 'marginRight';
						} else {
							styleMargin = 'marginLeft';
						}
					}
					var labelSize = this._state.size / (this.options.ticks.length - 1);

					if (this.tickLabelContainer) {
						var extraMargin = 0;
						if (this.options.ticks_positions.length === 0) {
							if (this.options.orientation !== 'vertical') {
								this.tickLabelContainer.style[styleMargin] = -labelSize / 2 + "px";
							}

							extraMargin = this.tickLabelContainer.offsetHeight;
						} else {
							/*! Chidren are position absolute, calculate height by finding the max offsetHeight of a child */
							for (i = 0; i < this.tickLabelContainer.childNodes.length; i++) {
								if (this.tickLabelContainer.childNodes[i].offsetHeight > extraMargin) {
									extraMargin = this.tickLabelContainer.childNodes[i].offsetHeight;
								}
							}
						}
						if (this.options.orientation === 'horizontal') {
							this.sliderElem.style.marginBottom = extraMargin + "px";
						}
					}
					for (var i = 0; i < this.options.ticks.length; i++) {

						var percentage = this.options.ticks_positions[i] || this._toPercentage(this.options.ticks[i]);

						if (this.options.reversed) {
							percentage = 100 - percentage;
						}

						this.ticks[i].style[this.stylePos] = percentage + "%";

						/*! Set class labels to denote whether ticks are in the selection */
						this._removeClass(this.ticks[i], 'in-selection');
						if (!this.options.range) {
							if (this.options.selection === 'after' && percentage >= positionPercentages[0]) {
								this._addClass(this.ticks[i], 'in-selection');
							} else if (this.options.selection === 'before' && percentage <= positionPercentages[0]) {
								this._addClass(this.ticks[i], 'in-selection');
							}
						} else if (percentage >= positionPercentages[0] && percentage <= positionPercentages[1]) {
							this._addClass(this.ticks[i], 'in-selection');
						}

						if (this.tickLabels[i]) {
							this.tickLabels[i].style[styleSize] = labelSize + "px";

							if (this.options.orientation !== 'vertical' && this.options.ticks_positions[i] !== undefined) {
								this.tickLabels[i].style.position = 'absolute';
								this.tickLabels[i].style[this.stylePos] = percentage + "%";
								this.tickLabels[i].style[styleMargin] = -labelSize / 2 + 'px';
							} else if (this.options.orientation === 'vertical') {
								if (this.options.rtl) {
									this.tickLabels[i].style['marginRight'] = this.sliderElem.offsetWidth + "px";
								} else {
									this.tickLabels[i].style['marginLeft'] = this.sliderElem.offsetWidth + "px";
								}
								this.tickLabelContainer.style[styleMargin] = this.sliderElem.offsetWidth / 2 * -1 + 'px';
							}

							/*! Set class labels to indicate tick labels are in the selection or selected */
							this._removeClass(this.tickLabels[i], 'label-in-selection label-is-selection');
							if (!this.options.range) {
								if (this.options.selection === 'after' && percentage >= positionPercentages[0]) {
									this._addClass(this.tickLabels[i], 'label-in-selection');
								} else if (this.options.selection === 'before' && percentage <= positionPercentages[0]) {
									this._addClass(this.tickLabels[i], 'label-in-selection');
								}
								if (percentage === positionPercentages[0]) {
									this._addClass(this.tickLabels[i], 'label-is-selection');
								}
							} else if (percentage >= positionPercentages[0] && percentage <= positionPercentages[1]) {
								this._addClass(this.tickLabels[i], 'label-in-selection');
								if (percentage === positionPercentages[0] || positionPercentages[1]) {
									this._addClass(this.tickLabels[i], 'label-is-selection');
								}
							}
						}
					}
				}

				var formattedTooltipVal;

				if (this.options.range) {
					formattedTooltipVal = this.options.formatter(this._state.value);
					this._setText(this.tooltipInner, formattedTooltipVal);
					this.tooltip.style[this.stylePos] = (positionPercentages[1] + positionPercentages[0]) / 2 + "%";

					var innerTooltipMinText = this.options.formatter(this._state.value[0]);
					this._setText(this.tooltipInner_min, innerTooltipMinText);

					var innerTooltipMaxText = this.options.formatter(this._state.value[1]);
					this._setText(this.tooltipInner_max, innerTooltipMaxText);

					this.tooltip_min.style[this.stylePos] = positionPercentages[0] + "%";

					this.tooltip_max.style[this.stylePos] = positionPercentages[1] + "%";
				} else {
					formattedTooltipVal = this.options.formatter(this._state.value[0]);
					this._setText(this.tooltipInner, formattedTooltipVal);

					this.tooltip.style[this.stylePos] = positionPercentages[0] + "%";
				}

				if (this.options.orientation === 'vertical') {
					this.trackLow.style.top = '0';
					this.trackLow.style.height = Math.min(positionPercentages[0], positionPercentages[1]) + '%';

					this.trackSelection.style.top = Math.min(positionPercentages[0], positionPercentages[1]) + '%';
					this.trackSelection.style.height = Math.abs(positionPercentages[0] - positionPercentages[1]) + '%';

					this.trackHigh.style.bottom = '0';
					this.trackHigh.style.height = 100 - Math.min(positionPercentages[0], positionPercentages[1]) - Math.abs(positionPercentages[0] - positionPercentages[1]) + '%';
				} else {
					if (this.stylePos === 'right') {
						this.trackLow.style.right = '0';
					} else {
						this.trackLow.style.left = '0';
					}
					this.trackLow.style.width = Math.min(positionPercentages[0], positionPercentages[1]) + '%';

					if (this.stylePos === 'right') {
						this.trackSelection.style.right = Math.min(positionPercentages[0], positionPercentages[1]) + '%';
					} else {
						this.trackSelection.style.left = Math.min(positionPercentages[0], positionPercentages[1]) + '%';
					}
					this.trackSelection.style.width = Math.abs(positionPercentages[0] - positionPercentages[1]) + '%';

					if (this.stylePos === 'right') {
						this.trackHigh.style.left = '0';
					} else {
						this.trackHigh.style.right = '0';
					}
					this.trackHigh.style.width = 100 - Math.min(positionPercentages[0], positionPercentages[1]) - Math.abs(positionPercentages[0] - positionPercentages[1]) + '%';

					var offset_min = this.tooltip_min.getBoundingClientRect();
					var offset_max = this.tooltip_max.getBoundingClientRect();

					if (this.options.tooltip_position === 'bottom') {
						if (offset_min.right > offset_max.left) {
							this._removeClass(this.tooltip_max, 'bottom');
							this._addClass(this.tooltip_max, 'top');
							this.tooltip_max.style.top = '';
							this.tooltip_max.style.bottom = 22 + 'px';
						} else {
							this._removeClass(this.tooltip_max, 'top');
							this._addClass(this.tooltip_max, 'bottom');
							this.tooltip_max.style.top = this.tooltip_min.style.top;
							this.tooltip_max.style.bottom = '';
						}
					} else {
						if (offset_min.right > offset_max.left) {
							this._removeClass(this.tooltip_max, 'top');
							this._addClass(this.tooltip_max, 'bottom');
							this.tooltip_max.style.top = 18 + 'px';
						} else {
							this._removeClass(this.tooltip_max, 'bottom');
							this._addClass(this.tooltip_max, 'top');
							this.tooltip_max.style.top = this.tooltip_min.style.top;
						}
					}
				}
			},
			_createHighlightRange: function _createHighlightRange(start, end) {
				if (this._isHighlightRange(start, end)) {
					if (start > end) {
						return { 'start': end, 'size': start - end };
					}
					return { 'start': start, 'size': end - start };
				}
				return null;
			},
			_isHighlightRange: function _isHighlightRange(start, end) {
				if (0 <= start && start <= 100 && 0 <= end && end <= 100) {
					return true;
				} else {
					return false;
				}
			},
			_resize: function _resize(ev) {
				/*!jshint unused:false*/
				this._state.offset = this._offset(this.sliderElem);
				this._state.size = this.sliderElem[this.sizePos];
				this._layout();
			},
			_removeProperty: function _removeProperty(element, prop) {
				if (element.style.removeProperty) {
					element.style.removeProperty(prop);
				} else {
					element.style.removeAttribute(prop);
				}
			},
			_mousedown: function _mousedown(ev) {
				if (!this._state.enabled) {
					return false;
				}

				if (ev.preventDefault) {
					ev.preventDefault();
				}

				this._state.offset = this._offset(this.sliderElem);
				this._state.size = this.sliderElem[this.sizePos];

				var percentage = this._getPercentage(ev);

				if (this.options.range) {
					var diff1 = Math.abs(this._state.percentage[0] - percentage);
					var diff2 = Math.abs(this._state.percentage[1] - percentage);
					this._state.dragged = diff1 < diff2 ? 0 : 1;
					this._adjustPercentageForRangeSliders(percentage);
				} else {
					this._state.dragged = 0;
				}

				this._state.percentage[this._state.dragged] = percentage;

				if (this.touchCapable) {
					document.removeEventListener("touchmove", this.mousemove, false);
					document.removeEventListener("touchend", this.mouseup, false);
				}

				if (this.mousemove) {
					document.removeEventListener("mousemove", this.mousemove, false);
				}
				if (this.mouseup) {
					document.removeEventListener("mouseup", this.mouseup, false);
				}

				this.mousemove = this._mousemove.bind(this);
				this.mouseup = this._mouseup.bind(this);

				if (this.touchCapable) {
					document.addEventListener("touchmove", this.mousemove, false);
					document.addEventListener("touchend", this.mouseup, false);
				}
				document.addEventListener("mousemove", this.mousemove, false);
				document.addEventListener("mouseup", this.mouseup, false);

				this._state.inDrag = true;
				var newValue = this._calculateValue();

				this._trigger('slideStart', newValue);

				this.setValue(newValue, false, true);

				ev.returnValue = false;

				if (this.options.focus) {
					this._triggerFocusOnHandle(this._state.dragged);
				}

				return true;
			},
			_touchstart: function _touchstart(ev) {
				this._mousedown(ev);
			},
			_triggerFocusOnHandle: function _triggerFocusOnHandle(handleIdx) {
				if (handleIdx === 0) {
					this.handle1.focus();
				}
				if (handleIdx === 1) {
					this.handle2.focus();
				}
			},
			_keydown: function _keydown(handleIdx, ev) {
				if (!this._state.enabled) {
					return false;
				}

				var dir;
				switch (ev.keyCode) {
					case 37:
					case 40:
						dir = -1;
						break;
					case 39: 
					case 38:
						dir = 1;
						break;
				}
				if (!dir) {
					return;
				}

				if (this.options.natural_arrow_keys) {
					var isHorizontal = this.options.orientation === 'horizontal';
					var isVertical = this.options.orientation === 'vertical';
					var isRTL = this.options.rtl;
					var isReversed = this.options.reversed;

					if (isHorizontal) {
						if (isRTL) {
							if (!isReversed) {
								dir = -dir;
							}
						} else {
							if (isReversed) {
								dir = -dir;
							}
						}
					} else if (isVertical) {
						if (!isReversed) {
							dir = -dir;
						}
					}
				}

				var val;
				if (this.ticksAreValid && this.options.lock_to_ticks) {
					var index = void 0;
					index = this.options.ticks.indexOf(this._state.value[handleIdx]);
					if (index === -1) {
						index = 0;
						window.console.warn('(lock_to_ticks) _keydown: index should not be -1');
					}
					index += dir;
					index = Math.max(0, Math.min(this.options.ticks.length - 1, index));
					val = this.options.ticks[index];
				} else {
					val = this._state.value[handleIdx] + dir * this.options.step;
				}
				var percentage = this._toPercentage(val);
				this._state.keyCtrl = handleIdx;
				if (this.options.range) {
					this._adjustPercentageForRangeSliders(percentage);
					var val1 = !this._state.keyCtrl ? val : this._state.value[0];
					var val2 = this._state.keyCtrl ? val : this._state.value[1];
					val = [Math.max(this.options.min, Math.min(this.options.max, val1)), Math.max(this.options.min, Math.min(this.options.max, val2))];
				} else {
					val = Math.max(this.options.min, Math.min(this.options.max, val));
				}

				this._trigger('slideStart', val);

				this.setValue(val, true, true);

				this._trigger('slideStop', val);

				this._pauseEvent(ev);
				delete this._state.keyCtrl;

				return false;
			},
			_pauseEvent: function _pauseEvent(ev) {
				if (ev.stopPropagation) {
					ev.stopPropagation();
				}
				if (ev.preventDefault) {
					ev.preventDefault();
				}
				ev.cancelBubble = true;
				ev.returnValue = false;
			},
			_mousemove: function _mousemove(ev) {
				if (!this._state.enabled) {
					return false;
				}

				var percentage = this._getPercentage(ev);
				this._adjustPercentageForRangeSliders(percentage);
				this._state.percentage[this._state.dragged] = percentage;

				var val = this._calculateValue(true);
				this.setValue(val, true, true);

				return false;
			},
			_touchmove: function _touchmove(ev) {
				if (ev.changedTouches === undefined) {
					return;
				}

				if (ev.preventDefault) {
					ev.preventDefault();
				}
			},
			_adjustPercentageForRangeSliders: function _adjustPercentageForRangeSliders(percentage) {
				if (this.options.range) {
					var precision = this._getNumDigitsAfterDecimalPlace(percentage);
					precision = precision ? precision - 1 : 0;
					var percentageWithAdjustedPrecision = this._applyToFixedAndParseFloat(percentage, precision);
					if (this._state.dragged === 0 && this._applyToFixedAndParseFloat(this._state.percentage[1], precision) < percentageWithAdjustedPrecision) {
						this._state.percentage[0] = this._state.percentage[1];
						this._state.dragged = 1;
					} else if (this._state.dragged === 1 && this._applyToFixedAndParseFloat(this._state.percentage[0], precision) > percentageWithAdjustedPrecision) {
						this._state.percentage[1] = this._state.percentage[0];
						this._state.dragged = 0;
					} else if (this._state.keyCtrl === 0 && this._toPercentage(this._state.value[1]) < percentage) {
						this._state.percentage[0] = this._state.percentage[1];
						this._state.keyCtrl = 1;
						this.handle2.focus();
					} else if (this._state.keyCtrl === 1 && this._toPercentage(this._state.value[0]) > percentage) {
						this._state.percentage[1] = this._state.percentage[0];
						this._state.keyCtrl = 0;
						this.handle1.focus();
					}
				}
			},
			_mouseup: function _mouseup(ev) {
				if (!this._state.enabled) {
					return false;
				}

				var percentage = this._getPercentage(ev);
				this._adjustPercentageForRangeSliders(percentage);
				this._state.percentage[this._state.dragged] = percentage;

				if (this.touchCapable) {
					document.removeEventListener("touchmove", this.mousemove, false);
					document.removeEventListener("touchend", this.mouseup, false);
				}
				document.removeEventListener("mousemove", this.mousemove, false);
				document.removeEventListener("mouseup", this.mouseup, false);

				this._state.inDrag = false;
				if (this._state.over === false) {
					this._hideTooltip();
				}
				var val = this._calculateValue(true);

				this.setValue(val, false, true);
				this._trigger('slideStop', val);

				this._state.dragged = null;

				return false;
			},
			_setValues: function _setValues(index, val) {
				var comp = 0 === index ? 0 : 100;
				if (this._state.percentage[index] !== comp) {
					val.data[index] = this._toValue(this._state.percentage[index]);
					val.data[index] = this._applyPrecision(val.data[index]);
				}
			},
			_calculateValue: function _calculateValue(snapToClosestTick) {
				var val = {};
				if (this.options.range) {
					val.data = [this.options.min, this.options.max];
					this._setValues(0, val);
					this._setValues(1, val);
					if (snapToClosestTick) {
						val.data[0] = this._snapToClosestTick(val.data[0]);
						val.data[1] = this._snapToClosestTick(val.data[1]);
					}
				} else {
					val.data = this._toValue(this._state.percentage[0]);
					val.data = parseFloat(val.data);
					val.data = this._applyPrecision(val.data);
					if (snapToClosestTick) {
						val.data = this._snapToClosestTick(val.data);
					}
				}

				return val.data;
			},
			_snapToClosestTick: function _snapToClosestTick(val) {
				var min = [val, Infinity];
				for (var i = 0; i < this.options.ticks.length; i++) {
					var diff = Math.abs(this.options.ticks[i] - val);
					if (diff <= min[1]) {
						min = [this.options.ticks[i], diff];
					}
				}
				if (min[1] <= this.options.ticks_snap_bounds) {
					return min[0];
				}
				return val;
			},

			_applyPrecision: function _applyPrecision(val) {
				var precision = this.options.precision || this._getNumDigitsAfterDecimalPlace(this.options.step);
				return this._applyToFixedAndParseFloat(val, precision);
			},
			_getNumDigitsAfterDecimalPlace: function _getNumDigitsAfterDecimalPlace(num) {
				var match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
				if (!match) {
					return 0;
				}
				return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
			},
			_applyToFixedAndParseFloat: function _applyToFixedAndParseFloat(num, toFixedInput) {
				var truncatedNum = num.toFixed(toFixedInput);
				return parseFloat(truncatedNum);
			},
			/*!
   	Credits to Mike Samuel for the following method!
   	Source: http://stackoverflow.com/questions/10454518/javascript-how-to-retrieve-the-number-of-decimals-of-a-string-number
   */
			_getPercentage: function _getPercentage(ev) {
				if (this.touchCapable && (ev.type === 'touchstart' || ev.type === 'touchmove' || ev.type === 'touchend')) {
					ev = ev.changedTouches[0];
				}

				var eventPosition = ev[this.mousePos];
				var sliderOffset = this._state.offset[this.stylePos];
				var distanceToSlide = eventPosition - sliderOffset;
				if (this.stylePos === 'right') {
					distanceToSlide = -distanceToSlide;
				}
				var percentage = distanceToSlide / this._state.size * 100;
				percentage = Math.round(percentage / this._state.percentage[2]) * this._state.percentage[2];
				if (this.options.reversed) {
					percentage = 100 - percentage;
				}

				return Math.max(0, Math.min(100, percentage));
			},
			_validateInputValue: function _validateInputValue(val) {
				if (!isNaN(+val)) {
					return +val;
				} else if (Array.isArray(val)) {
					this._validateArray(val);
					return val;
				} else {
					throw new Error(ErrorMsgs.formatInvalidInputErrorMsg(val));
				}
			},
			_validateArray: function _validateArray(val) {
				for (var i = 0; i < val.length; i++) {
					var input = val[i];
					if (typeof input !== 'number') {
						throw new Error(ErrorMsgs.formatInvalidInputErrorMsg(input));
					}
				}
			},
			_setDataVal: function _setDataVal(val) {
				this.element.setAttribute('data-value', val);
				this.element.setAttribute('value', val);
				this.element.value = val;
			},
			_trigger: function _trigger(evt, val) {
				val = val || val === 0 ? val : undefined;

				var callbackFnArray = this.eventToCallbackMap[evt];
				if (callbackFnArray && callbackFnArray.length) {
					for (var i = 0; i < callbackFnArray.length; i++) {
						var callbackFn = callbackFnArray[i];
						callbackFn(val);
					}
				}

				/*! If JQuery exists, trigger JQuery events */
				if ($) {
					this._triggerJQueryEvent(evt, val);
				}
			},
			_triggerJQueryEvent: function _triggerJQueryEvent(evt, val) {
				var eventData = {
					type: evt,
					value: val
				};
				this.$element.trigger(eventData);
				this.$sliderElem.trigger(eventData);
			},
			_unbindJQueryEventHandlers: function _unbindJQueryEventHandlers() {
				this.$element.off();
				this.$sliderElem.off();
			},
			_setText: function _setText(element, text) {
				if (typeof element.textContent !== "undefined") {
					element.textContent = text;
				} else if (typeof element.innerText !== "undefined") {
					element.innerText = text;
				}
			},
			_removeClass: function _removeClass(element, classString) {
				var classes = classString.split(" ");
				var newClasses = element.className;

				for (var i = 0; i < classes.length; i++) {
					var classTag = classes[i];
					var regex = new RegExp("(?:\\s|^)" + classTag + "(?:\\s|$)");
					newClasses = newClasses.replace(regex, " ");
				}

				element.className = newClasses.trim();
			},
			_addClass: function _addClass(element, classString) {
				var classes = classString.split(" ");
				var newClasses = element.className;

				for (var i = 0; i < classes.length; i++) {
					var classTag = classes[i];
					var regex = new RegExp("(?:\\s|^)" + classTag + "(?:\\s|$)");
					var ifClassExists = regex.test(newClasses);

					if (!ifClassExists) {
						newClasses += " " + classTag;
					}
				}

				element.className = newClasses.trim();
			},
			_offsetLeft: function _offsetLeft(obj) {
				return obj.getBoundingClientRect().left;
			},
			_offsetRight: function _offsetRight(obj) {
				return obj.getBoundingClientRect().right;
			},
			_offsetTop: function _offsetTop(obj) {
				var offsetTop = obj.offsetTop;
				while ((obj = obj.offsetParent) && !isNaN(obj.offsetTop)) {
					offsetTop += obj.offsetTop;
					if (obj.tagName !== 'BODY') {
						offsetTop -= obj.scrollTop;
					}
				}
				return offsetTop;
			},
			_offset: function _offset(obj) {
				return {
					left: this._offsetLeft(obj),
					right: this._offsetRight(obj),
					top: this._offsetTop(obj)
				};
			},
			_css: function _css(elementRef, styleName, value) {
				if ($) {
					$.style(elementRef, styleName, value);
				} else {
					var style = styleName.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi, function (all, letter) {
						return letter.toUpperCase();
					});
					elementRef.style[style] = value;
				}
			},
			_toValue: function _toValue(percentage) {
				return this.options.scale.toValue.apply(this, [percentage]);
			},
			_toPercentage: function _toPercentage(value) {
				return this.options.scale.toPercentage.apply(this, [value]);
			},
			_setTooltipPosition: function _setTooltipPosition() {
				var tooltips = [this.tooltip, this.tooltip_min, this.tooltip_max];
				if (this.options.orientation === 'vertical') {
					var tooltipPos;
					if (this.options.tooltip_position) {
						tooltipPos = this.options.tooltip_position;
					} else {
						if (this.options.rtl) {
							tooltipPos = 'left';
						} else {
							tooltipPos = 'right';
						}
					}
					var oppositeSide = tooltipPos === 'left' ? 'right' : 'left';
					tooltips.forEach(function (tooltip) {
						this._addClass(tooltip, tooltipPos);
						tooltip.style[oppositeSide] = '100%';
					}.bind(this));
				} else if (this.options.tooltip_position === 'bottom') {
					tooltips.forEach(function (tooltip) {
						this._addClass(tooltip, 'bottom');
						tooltip.style.top = 22 + 'px';
					}.bind(this));
				} else {
					tooltips.forEach(function (tooltip) {
						this._addClass(tooltip, 'top');
						tooltip.style.top = -this.tooltip.outerHeight - 14 + 'px';
					}.bind(this));
				}
			},
			_getClosestTickIndex: function _getClosestTickIndex(val) {
				var difference = Math.abs(val - this.options.ticks[0]);
				var index = 0;
				for (var i = 0; i < this.options.ticks.length; ++i) {
					var d = Math.abs(val - this.options.ticks[i]);
					if (d < difference) {
						difference = d;
						index = i;
					}
				}
				return index;
			},
			/*!*
    * Attempts to find the index in `ticks[]` the slider values are set at.
    * The indexes can be -1 to indicate the slider value is not set at a value in `ticks[]`.
    */
			_setTickIndex: function _setTickIndex() {
				if (this.ticksAreValid) {
					this._state.tickIndex = [this.options.ticks.indexOf(this._state.value[0]), this.options.ticks.indexOf(this._state.value[1])];
				}
			}
		};

		/*!********************************
  		Attach to global namespace
  	*********************************/
		if ($ && $.fn) {
			if (!$.fn.slider) {
				$.bridget(NAMESPACE_MAIN, Slider);
				autoRegisterNamespace = NAMESPACE_MAIN;
			} else {
				if (windowIsDefined) {
					window.console.warn("bootstrap-slider.js - WARNING: $.fn.slider namespace is already bound. Use the $.fn.bootstrapSlider namespace instead.");
				}
				autoRegisterNamespace = NAMESPACE_ALTERNATE;
			}
			$.bridget(NAMESPACE_ALTERNATE, Slider);

			$(function () {
				$("input[data-provide=slider]")[autoRegisterNamespace]();
			});
		}
	})($);

	return Slider;
});




/*! qucikview */
jQuery(document).ready(function($){
	var sliderFinalWidth = 400,
		maxQuickWidth    = 900;

	$(document).on("click", ".qv-open", function(event){
		
		var pid = $(this).attr("data-id");			
		
		if( $(window).width() < 1024 ){
			
			var this_qty = $("#lufoSSMop_"+pid).val();

			if( this_qty < 1 ) this_qty = 1;
			
            var post = "ext=cart_add_item&pid="+pid+"&products_qty="+this_qty;
			
			$.ajax({
			 type: "POST",
			 dataType: "json",
			 data: post,
			 async: false,
			 url: "/ajax.php",
			 success: function(data){
			  $(".cart .count").html(data['basket_qty']);
			  $(".cart .subtotal").html( data['basket_sum']+" EUR");	
			  $(".cart .lst-subtotal").html( data['basket_sum']+" EUR");	
			  $(".cart .item-list").html("");
			  $(".cart .subtotal").fadeIn();
			  $("#eps").removeClass("univisible");
			  iziToast.show({
				message: data['message'],
				position: 'bottomRight', 
				duration: 2000,
				class: 'iziToast-cartSuccess',
				progressBar: true,
				animateInside: true,
				timeout: 6200,
				transitionIn: 'fadeInLeft',
				transitionOut: 'fadeOut',
				transitionInMobile: 'fadeIn',
				transitionOutMobile: 'fadeOut'
			  });
			  var str = data['basket_prds'];
			  var explode = str.split("%%%"); 
			  $.each(explode, function(key, exp){
			   var xparts = exp.split('|');
			   if(xparts[1]){
				if(xparts[3]){
				 var img = "/images/product_images/thumbnail_images/"+xparts[3];
				}else{
				 var img = "/images/noimage.jpg";
				}/*! if(xparts[3]).... */
				xparts[2] = numberWithCommas(xparts[2]);
				xparts[4] = numberWithCommas(xparts[4]);
				var price = xparts[6];
				var epp = number_format( xparts[2] / xparts[4] , 2, ',', '.' );
				var xar = '<div class="dropdown-product-item" cart-pid-row-id="'+xparts[5]+'">'+
						  ' <span class="dropdown-product-remove"><i psc-act="remove-from-cart" data-id="'+xparts[5]+'" class="icon-cross"></i></span>'+
						  ' <a class="dropdown-product-thumb" href="'+xparts[1]+'"><img src="'+img+'"><div class="cartItemCount">'+xparts[4]+'</div></a>'+
						  '  <div class="dropdown-product-info">'+
						  '   <a class="dropdown-product-title" href="'+xparts[1]+'">'+xparts[0]+'</a>'+
						  '  </div>'+
						  '</div>';

				$(".cart .item-list").append(xar);
			  
			   }/*! if(xparts[0]).... */
			  });/*! each.... */
			 },/*! success: function(data)..... */
			});/*! ajax.... */			
				
			return;
			
		}
		
	    var selectedImage = $(this).parent('.cd-item').children('img'), slectedImageUrl = selectedImage.attr('data-src');
			
	    $('.cd-quick-view .cd-slider').empty();
	    $('.cd-quick-view .cd-slider').append('<li class="selected"><img src="'+slectedImageUrl+'"></li>');
	
		$(".overlay").fadeIn(); 
		$("body").css("overflow", "hidden");
		
		animateQuickView(selectedImage, sliderFinalWidth, maxQuickWidth, 'open');
		
		var qty = 0;
	    
		$('#products_qty_qvv').empty();
		$("#eeg_stock").html("0");
	   
        $.ajax({
	     type: "POST",
         dataType: "json",
         data: "ext=quickview&pid="+pid,
		 async: false,
	     url: "/ajax.php",
 	     success: function(data){
			 
		  $("#products_qty_qvv").prop('selectedIndex',0);
		  
		  
		  $("#eeg_stock").html(data['stock']);
		  if( data['stock'] < 1 ){
				$("#products_qty_qvv").append(new Option(0, 0));
		  }else{
			  for (let i = 1; i <= data['stock']; i++){ 
				$("#products_qty_qvv").append(new Option(i, i));
			  }
		  }
		  
/*!
		  var additionalImagesList = data['moreimages'];
		  $.each( additionalImagesList, function(i, obj) {
		   var moimg = "/images/product_images/info_images/"+obj.image_name;
		  });
*/		  
		  
		  $('.cd-quick-view .cd-item-info .tname').html( data['name'] );
		  $('.cd-quick-view .cd-item-info p').html( data['desc'] );
		  
		  if(data['jtrix_staffel_prices']){
			$('.cd-quick-view .cd-item-info .tStaffel').html( "<br>"+data['jtrix_staffel_prices'] );
		  }			  

	      var attributes_select = "";
		  var trigger_by_name = [];
		  var rsm = 0;
		
	      $.each(data['attributes'], function(index, value){
			  
			trigger_by_name[rsm] = "id["+value['id']+"]"; 
			rsm++;  
			
			attributes_select = '<label><strong>'+value['merkmal']+'</strong></label><br>'+
								'<select data-id="'+pid+'" class="prdoption_qv" id="id['+value['id']+']" name="id['+value['id']+']">';

				var xp_options = "";
								
				$.each(value['options'], function(xp_index, xp_value){
					
					xp_options +='<option value="'+xp_value['options_id']+'">'+xp_value['options_name']+'</option>';
					
				});
			
			attributes_select += xp_options+'</select>';
			
	      });
		  
		  $("#qv_attributes").html(attributes_select);

		  $('#qv-shippingtime span').html( data['shippingtime'] );
		  
		  if(data['model'] == ""){
		   $("#qv-model").hide(); 
		  }else{
		   $("#qv-model").show();
		   $('#qv-model span').html( data['model'] );
		  }	
		  
		  if(data['ean'] == ""){
		   $("#qv-ean").hide(); 
		  }else{
		   $("#qv-ean").show();
		   $('#qv-ean span').html( data['ean'] );
		  }	
		  
		  if($.trim(data['vpe']) == ""){
		   $("#qv-vpevalue").hide(); 
		  }else{
		   $("#qv-vpevalue").show();
		   
		   var xd = 0;
		   
		   if( data['vpe_name'] == "l" ){
			   xd = data['vpe_value_plain'] * 1000 + " Milliliter";
		   }else if( data['vpe_name'] == "kg" ){
			   xd = data['vpe_value_plain'] * 1000 + " Gramm";
		   }
		   
		   $('#qv-vpevalue span').html( xd );
		   
		  }	
		  
		  $("#qv-disponible").addClass("hidden");
		  $("#qv-estimada").addClass("hidden"); 
 	      $("#qv-shippingtime").removeClass("hidden");			  
		  $("#ddsm").removeClass("hidden");	
		  
		  
		  if( data['stock'] < 1 ){
			  
			$("#qv-disponible").removeClass("hidden");
		    $("#qv-shippingtime").addClass("hidden");	
			$("#ddsm").addClass("hidden");	
			  
		  }else{
			  
			  if( data['delivery_day'] == "" ){
				  
				$("#qv-estimada").addClass("hidden"); 
				  
			  }else{
				  
			    $("#qv-estimada").removeClass("hidden"); 
				  
				$("#qv-estimada span.a1").html( data['delivery_day']['sday'] );
				$("#qv-estimada span.a2").html( data['delivery_day']['otime'] );
				  
			  }
			  
		  }
		
		  
		  
		  if(data['manufacturer'] == ""){
		   $("#qv-manufacturer").hide(); 
		  }else{
		   $("#qv-manufacturer").show();
		   $('#qv-manufacturer span').html( data['manufacturer'] );
		  }	
		  
		  
		  
		  $('#qv-lsm').attr("data-id",pid);
		  $('#qv-fav').attr("data-id",pid);
		  $('#qv-ltp').attr("href", data['link']);
		  $('#qv-ltp-1').attr("href", data['link']);
		  
		  var price = "";
		  
		  price = data['price_gros'];
		  
		  if( data['price_old'] ){
		   price = '<div class="ts">'+data['price_old']+'</div><span class="red">'+price+'</span>'; 
		  }
		  
		  
		  if( data['price_old'] != null && data['price_special'] != null ){
		    price=data['price_special']+'&nbsp;<span class="ts">'+data['price_old']+'</span>';
		  }
		  
		  $('.cd-quick-view .cd-item-info .price .price').html( price );
		  
		  
		  if(data['vpe_value']!="" && data['vpe_value']!="0,00"){
		   $('.cd-quick-view .cd-item-info .vpe').html("Grundpreis: "+data['vpe'] );
		  }else{
		   $('.cd-quick-view .cd-item-info .vpe').html("");			  
  	      }			  
		  


		  if( data['pfand'] > 0 ){
			$('.cd-quick-view .cd-item-info .price .tax_shipping').html('<img alt="Flaschen- oder Dosenpfand" style="vertical-align:middle;" src="/images/project/pfand_s.png"> zzgl. '+number_format( data['pfand'] , 2, ',', '.' )+' &euro; <a data-toggle="modal" data-target="#contentModal" rel="nofollow" class="getContentInModal" content-id="400400" title="Pfandsystem" href="#" target="_blank">Pfandkosten</a>');
		  }else{ 	
			$('.cd-quick-view .cd-item-info .price .tax_shipping').html('');
		  }
		  
		  $('.cd-quick-view .cd-item-info .tax_shipping span').html( data['price_tax']);
		  
		  setTimeout( function() {
			$(".cd-slider-wrapper").height( $(".cd-item-info").height()+100 );
			/*! console.log($(".cd-item-info").height()); */
		  }, 1000 );
		  
		  if(trigger_by_name.length){
			setTimeout( function() {
				$.each(trigger_by_name, function(index, item) {
					$('select[name="'+item+'"]').trigger("click");
				});
			}, 2000 );
		  }
			
         },/*! success: function(data)..... */
        });/*! ajax.... */

	});

	
	$('body').on('click', function(event){
		if( $(event.target).is('.cd-close') || $(event.target).is('body.overlay-layer')) {
			closeQuickView( sliderFinalWidth, maxQuickWidth);
		}
	});
	$(document).keyup(function(event){
    	if(event.which=='27'){
			closeQuickView( sliderFinalWidth, maxQuickWidth);
		}
	});

	$('.cd-quick-view').on('click', '.cd-slider-navigation a', function(){
		updateSlider($(this));
	});

	$(window).on('resize', function(){
		if($('.cd-quick-view').hasClass('is-visible')){
			window.requestAnimationFrame(resizeQuickView);
		}
	});

	function updateSlider(navigation) {
		
		var sliderConatiner = navigation.parents('.cd-slider-wrapper').find('.cd-slider'),
			activeSlider = sliderConatiner.children('.selected').removeClass('selected');
			
		if ( navigation.hasClass('cd-next') ) {
			( !activeSlider.is(':last-child') ) ? activeSlider.next().addClass('selected') : sliderConatiner.children('li').eq(0).addClass('selected'); 
		} else {
			( !activeSlider.is(':first-child') ) ? activeSlider.prev().addClass('selected') : sliderConatiner.children('li').last().addClass('selected');
		} 
		
	}

	function updateQuickView(url) {
		$('.cd-quick-view .cd-slider li').removeClass('selected').find('img[src="'+ url +'"]').parent('li').addClass('selected');
	}

	function resizeQuickView() {
		var quickViewLeft = ($(window).width() - $('.cd-quick-view').width())/2,
			quickViewTop = ($(window).height() - $('.cd-quick-view').height())/2;
		$('.cd-quick-view').css({
		    "top": quickViewTop,
		    "left": quickViewLeft,
		});
	} 

	function closeQuickView(finalWidth, maxQuickWidth) {
		var close = $('.cd-close'),
			activeSliderUrl = close.siblings('.cd-slider-wrapper').find('.selected img').attr('src'),
			selectedImage = $('.empty-box').find('img');
		/*! update the image in the gallery */
		if( !$('.cd-quick-view').hasClass('velocity-animating') && $('.cd-quick-view').hasClass('add-content')) {
			selectedImage.attr('src', activeSliderUrl);
			animateQuickView(selectedImage, finalWidth, maxQuickWidth, 'close');
		} else {
			closeNoAnimation(selectedImage, finalWidth, maxQuickWidth);
		}
	}

	function animateQuickView(image, finalWidth, maxQuickWidth, animationType) {
		var parentListItem = image.parent('.cd-item');
		var topSelected = image.offset().top -90 - $(window).scrollTop();
		var	leftSelected = image.offset().left;
		var	widthSelected = image.width();
		var	heightSelected = image.height();
		var	windowWidth = $(window).width();
		var	windowHeight = $(window).height();
		var	finalLeft = (windowWidth - finalWidth)/2;
		var	finalHeight = finalWidth * heightSelected/widthSelected;
		var	finalTop = (windowHeight - 90 - finalHeight)/2;
		var	quickViewWidth = ( windowWidth * .8 < maxQuickWidth ) ? windowWidth * .8 : maxQuickWidth;
		var	quickViewLeft = (windowWidth - quickViewWidth)/2;

		if( animationType == 'open') {
			parentListItem.addClass('empty-box');
			$('.cd-quick-view').css({
			    "top": topSelected,
			    "left": leftSelected,
			    "width": widthSelected,
			}).velocity({
			    'top': finalTop+ 'px',
			    'left': finalLeft+'px',
			    'width': finalWidth+'px',
			}, 1000, [ 400, 20 ], function(){
				$('.cd-quick-view').addClass('animate-width').velocity({
					'left': quickViewLeft+'px',
			    	'width': quickViewWidth+'px',
				}, 300, 'ease' ,function(){
					$('.cd-quick-view').addClass('add-content');
				});
			}).addClass('is-visible');
			
			
		} else {
			
			$('.cd-quick-view').removeClass('add-content').velocity({
			    'top': finalTop+ 'px',
			    'left': finalLeft+'px',
			    'width': finalWidth+'px',
			}, 300, 'ease', function(){
				$('body').removeClass('overlay-layer');
				$(".overlay").fadeOut();	
				$("body").css("overflow", "auto");
				$('.cd-quick-view').removeClass('animate-width').velocity({
					"top": topSelected,
				    "left": leftSelected,
				    "width": widthSelected,
				}, 500, 'ease', function(){
					$('.cd-quick-view').removeClass('is-visible');
					parentListItem.removeClass('empty-box');
				});
			});
		}
		
	};
	
	function closeNoAnimation(image, finalWidth, maxQuickWidth) {
		var parentListItem = image.parent('.cd-item'),
			topSelected = image.offset().top - $(window).scrollTop(),
			leftSelected = image.offset().left,
			widthSelected = image.width();

		$('body').removeClass('overlay-layer');
		$(".overlay").fadeOut();
		$("body").css("overflow", "auto");
		parentListItem.removeClass('empty-box');
		$('.cd-quick-view').velocity("stop").removeClass('add-content animate-width is-visible').css({
			"top": topSelected,
		    "left": leftSelected,
		    "width": widthSelected,
		});
	}
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	$(document).on("click", ".prdoption_qv", function(e){
		
	 var attributes_string = "";
	 
	 $("#qv_attributes select").each(function() {
	  var $selectBox = $(this);
	  var selectedOption = $selectBox.find(":selected").val();
	  attributes_string +="&"+$selectBox.attr('id') +"="+selectedOption;
	 });
	 
	 $('#products_qty_qvv').empty();
	 
     $.ajax({
	  type: "POST",
      dataType: "json",
      data: "products_id="+$(this).attr("data-id")+attributes_string,
      async: false,
	  url: "/prdoption.php",
 	  success: function(data){
	   console.log("s3");
	   if(data['attributes_model'] == ""){
		$("#qv-model").hide(); 
	   }else{
		$("#qv-model").show();
		$('#qv-model span').html( data['attributes_model'] );
	   }	
	   if(data['attributes_ean'] == ""){
	    $("#qv-ean").hide(); 
	   }else{
		$("#qv-ean").show();
		$('#qv-ean span').html( data['attributes_ean'] );
	   }	
	   if(data['vpePriceFormatted'] !="" && typeof(data['vpePriceFormatted']) !== 'undefined' ){
		   $(".cd-quick-view .vpe").html( "Grundpreis: "+data['vpePriceFormatted'] );
	   }	   
	   
	   
	   if(data['attributes_stock'] > 0){
		   for (let i = 1; i <= data['attributes_stock']; i++){ 
			$("#products_qty_qvv").append(new Option(i, i));
		   }
		   $("#products_qty_qvv").prop('disabled', false);
		   $("#qv-lsm").removeClass("buttonDisabled");
		   $(".ariba").fadeIn();
		   $("#fecha_estimada_entrega_container").fadeIn();
	   }else{
		   $("#products_qty_qvv").prop('disabled', true);
		   $("#qv-lsm").addClass("buttonDisabled");
		   $("#products_qty_qvv").append(new Option(0, 0));
		   $(".ariba").fadeOut();
		   $("#fecha_estimada_entrega_container").fadeOut();
	   }
	   
	   
	   if(data['newProductPriceFormatted'] !="") $(".cd-quick-view .price .price").html( data['newProductPriceFormatted'] );
      },/*! success: function(data)..... */
     });/*! ajax.... */
	 
	});/*! $(".prdoption_qv").... */
	
});


/*! custom */


/*! --------------------------------------------------------------------------------- */
/*! --------------------------------------------------------------------------------- */

var body = document.body;
var thetarget;
var thehref;
var osim;

/*! --------------------------------------------------------------------------------- */
/*! --------------------------------------------------------------------------------- */


$(document).ready(function(){
	
	$('html').animate({scrollDown: 1},100);
	
	$(document).on("click", '#manage_cookies', function(e){
		event.preventDefault(e);
		$(".ch2-open-settings-btn").trigger("click");
	});	
	
	/*! "use strict"; */
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	/*!
		$(".has-megamenu a").mouseover(function(){ $("#tsm-wrapper").addClass("blurfilter"); });
		$(".has-megamenu a").mouseleave(function(){$("#tsm-wrapper").removeClass("blurfilter"); });	
	*/
	  
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	if(window.location.search === "?:solutions"){
		
		setTimeout( function() {
			
			$('html, body').animate({ scrollTop: $('#solutions').offset().top-100 }, 660);

		}, 1500 );
		
	}
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	setTimeout(function() {
	 $(".cc-dismiss").prop("href","#");
	}, 2200);	  
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	
	if( $(window).width() < 900 ){
	}
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	$(document).on("click", '[st="solutions"]', function(event){
		
		if( $("#solutions").length){
			
			setTimeout( function() {
				
				$('html, body').animate({ scrollTop: $('#solutions').offset().top-100 }, 660);
				
			}, 500 );
			
		}else{
			
			setTimeout( function() {
				
				window.location.href ="/?:solutions";
				
			}, 500 );
			
		}
		
		event.preventDefault();
		
	});
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	$("select[name='country']").on( "change", function(e){
     $("#dfm_state").empty();
	 $.ajax({
	  type: "POST",
      dataType: "json",
      data: "ext=get_states&country="+$(this).val(),
      url: "/ajax.php",
 	  success: function(data){
	   if (data != '' && data != undefined){
	    var states = "<label>Bundesland:</label>";
	    states = '<select class="form-control input-sm" id="state" name="state">';
	    $.each(data, function(index, value){
	     states = states + '<option value="'+value['id']+'">'+value['name']+'</option>';
	    });
	    var states = states + '</select>';
	    $("#dfm_state").html(states);
		iziToast.show({
			message: '<center><strong>ACHTUNG</strong><br>Bitte beachten Sie, dass für dieses Land Angaben zum Staat bzw. Bundesland erforderlich sind.<br>Wählen Sie bitte in dem Eingabefeld unterhalb des Landes den Staat bzw. das Bundesland aus bevor Sie fortfahren.</center>',
			position: 'bottomCenter', 
			duration: 1500,
			class: 'iziToast-success',
			progressBar: true,
			animateInside: true,
			timeout: 1200,
			transitionIn: 'fadeInLeft',
			transitionOut: 'fadeOut',
			transitionInMobile: 'fadeIn',
			transitionOutMobile: 'fadeOut'
		});/*! toast... */
	   };	
      },
     });
	});
	
	
/*! 
 $('.owl-dot').each(function(){
  $(this).children('span').text($(this).index()+1);
 });
*/	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	setInterval(function(){
	 $('.lazy').lazy();
	},200);
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	setTimeout(function() {
     $('.xs-categories-filterblock-show-icon').animate({
      right: '0px'
     });	 
    }, 1200);	  
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	$(document).on("click", ".xs-categories-filterblock-show-icon", function(event){
	 $('.xs-categories-filterblock').slideToggle();
	});

	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	if( $("#banktransfer_number_ajax_checks").length ){
	 var kpp = $("#banktransfer_number_ajax_checks").val().substring(0,2);
	 if( kpp == "DE" ){
	  $("#banktransfer_bic_ajax_checks").hide();
	  $("#banktransfer_bic_text_ajax_checks").hide();
	  $("#feedback_message_banktransfer_blz").hide();
	 }else{
	  $("#banktransfer_bic_ajax_checks").show();
	  $("#banktransfer_bic_text_ajax_checks").show();
	  $("#feedback_message_banktransfer_blz").show();
	 }
	}
	
	$(document).on( "keyup", "#banktransfer_number_ajax_checks", function(event){
	 var val = $(this).val().substring(0,2);
	 if( val == "DE" ){
	  $("#banktransfer_bic_ajax_checks").fadeOut();
	  $("#banktransfer_bic_text_ajax_checks").fadeOut();
	  $("#feedback_message_banktransfer_blz").fadeOut();
	 }else{
	  $("#banktransfer_bic_ajax_checks").fadeIn();
	  $("#banktransfer_bic_text_ajax_checks").fadeIn();
	  $("#feedback_message_banktransfer_blz").fadeIn();
	 }
	});
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */

	$(".sldDrp").css("height", $(".hero-slider").height()+"px");
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	$(document).on("click", ".scrollCntSfX", function(event){
	 var aid = $(this).attr("data-options");	
	 scrollToAnchor(aid);
	});
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	$(document).on("click", ".greetingCardTextModal_send", function(event){
	 $.ajax({
	  type: "POST",
      dataType: "json",
      data: "ext=greeting_cart_send_text&t="+btoa( $("#gkTextArea").val() ),
      url: "/ajax.php",
 	  success: function(data){
	   $('#greetingCardTMModal').modal('hide');
      },
     });
	});
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	$(document).on("click", "#switch_guest_account_to_registred", function(event){
		
	 var data = $(this).attr("data");	
	 
	 $.ajax({
	  type: "POST",
      dataType: "json",
      data: "ext=switch_guest_account_to_registred&data="+data,
      url: "/ajax.php",
 	  success: function(data){
	   $('.ko_smr').html(data['message']);
      },
     });
	});
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	$(document).on("click", ".greetingCardTextModal", function(event){
	 $.ajax({
	  type: "POST",
      dataType: "json",
      data: "ext=greeting_cart_get_text",
      url: "/ajax.php",
 	  success: function(data){
	   $("#gkTextArea").val(atob(data['text']));
	   
	   setTimeout(function() {
		$("#gkTextArea").removeAttr("disabled");
	    $("#gkTextArea").focus();
	   }, 1200);	  
      },
     });
	});
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
		
	$(document).on("click", '#addGreetingCardToCart', function(e){		
	 $.ajax({
	  type: "POST",
      dataType: "json",
      data: "ext=greeting_cart_add_to_cart",
      url: "/ajax.php",
 	  success: function(data){
	   window.location.href="";
      },
     });
	});

	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	$(document).on("click", '[psc-act="prepare-to-write-rezession"]', function(){
	 var data_str = $(this).attr("data-string");	
	 writeCookie("trigger", "reviews", 1);
     setTimeout( function() {
	  var newURL = data_str;
	  window.location = newURL;
	 }, 1200 );
	});
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	$(".e_js_sh_arrow").on("click", function(e){
     $.ajax({
	  type: "POST",
      dataType: "json",
      data: "ext=flush_tracking_history",
	  async: false,
	  url: "/ajax.php",
 	  success: function(data){
	   $("#historyWidget_container").delay(300).fadeOut();
      },/*! success: function(data)..... */
     });/*! ajax.... */		  
	});/*! $(".e_js_sh_arrow").on.... */
	  
    /*! -------------------------------------------------------------------------------------------------------------------------------------------------- */	  
	
	$("#escobarForm_submit").click(function(){
		
	 var error = false;	
		
	 var user_name  = $("#escobarForm_name").val();
	 var user_mail  = $("#escobarForm_mail").val();
	 var user_phone = $("#escobarForm_phone").val();
	 var user_text  = $("#escobarForm_text").val();
		
	 if(user_name == ""){ $("#escobarForm_name").addClass("escobarFormError"); error = true;	}
	 if(user_text == ""){ $("#escobarForm_text").addClass("escobarFormError"); error = true;	}
	 if(user_mail == ""){ $("#escobarForm_mail").addClass("escobarFormError"); error = true;	}
	 
	 if(error) return false;
	 
	 $.ajax({
      type: "POST",
      dataType: "json",
      data: "ext=send_categories_request&n="+user_name+"&m="+user_mail+"&p="+user_phone+"&r="+user_text,
      url: "/ajax.php",
      success: function(data){
	   $("#escobar_regfrm").hide();
	   $("#escobar_success_alert").fadeIn();
	   setTimeout( function() {
	    $("#escobar_regfrm").fadeIn();
	    $("#escobar_success_alert").hide();
	   }, 10200 );
      },/*! success: function(data)..... */
     });/*! ajax.... */
	});/*! click.... */
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	$('body').css('visibility','visible').show();
	$('.dzsparallaxer.use-loading.loaded .dzsparallaxer--target').css('opacity','1');
	$("html, body").animate({scrollTop: ($(window).scrollTop() +1)});
	$("html, body").animate({scrollTop: ($(window).scrollTop() -1)});
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	if( $("#prdsHistoryLength_evaa82315478").val() > 0 ){ 
	 $("#historyWidget_container").delay(1000).fadeIn();
	 if( $("#prdsHistoryLength_evaa82315478").val() == 1) $("#historyWidget_container").css("width","170");
	 if( $("#prdsHistoryLength_evaa82315478").val() == 2) $("#historyWidget_container").css("width","200");
	 if( $("#prdsHistoryLength_evaa82315478").val() >= 3) $("#historyWidget_container").css("width","260");
	}/*! if,...  */
	
	lazyload();
	
	$("input[type=text], input[type=password], textarea").on({ 'touchstart' : function() { zoomDisable(); }});
	$("input[type=text], input[type=password], textarea").on({ 'touchend' : function() { setTimeout(zoomEnable, 500); }});
	function zoomDisable(){ $('head meta[name=viewport]').remove(); $('head').prepend('<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0" />'); }
	function zoomEnable(){ $('head meta[name=viewport]').remove(); $('head').prepend('<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=1" />'); } 	
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	$("#create_account input").on({ 'blur' : function() { isFormFieldValid( $(this).attr("name"),"create_account", "input" ); }}); 
	$("#addressbook input").on({ 'blur' : function() { isFormFieldValid( $(this).attr("name"),"addressbook", "input" ); }}); 
	$("#account_edit input").on({ 'blur' : function() { isFormFieldValid( $(this).attr("name"),"account_edit", "input" ); }}); 
	$("#create_account select").on({ 'blur' : function() { isFormFieldValid( $(this).attr("name"),"create_account","select" ); }});
	$("#password_double_opt_in input").on({ 'blur' : function() { isFormFieldValid( $(this).attr("name"),"password_double_opt_in", "input" ); }}); 
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	$(".onChangeCartPrd").on( "change", function(e){
	 $("#cart_quantity").submit();
	});
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	$(document).on("click", "#klo_1", function(event){
	 $(".klo_1w").removeClass("klo_1w");
	 $("#klo_1").addClass("hidden");
	});
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	$(document).on("click", "#klo_2", function(event){
	 $(".klo_2w").removeClass("klo_2w");
	 $("#klo_2").addClass("hidden");
	});
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	$(document).on("click", "#klo_3", function(event){
	 $(".klo_3w").removeClass("klo_3w");
	 $("#klo_3").addClass("hidden");
	});
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	$(document).on( "mouseover", '.details-we-offer', function(){ 
		$(".details-we-offer .details-we-offer-div").css("visibility","visible");
	});
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	$(document).on( "click", '.jq_link', function(){  
		url = $(this).attr('href');
		window.location=url;
	});
  
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
  
	$(document).on( "mouseout", '.details-we-offer', function(){ 
		$(".details-we-offer .details-we-offer-div").css("visibility","hidden");
	});
		
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	$(document).on("click", ".getContentInModal", function(event){
      var content_id = $(this).attr("content-id");
	  event.preventDefault();
	  console.log(content_id);
	  $("#contentModal .modal-title").html("");
	  $("#contentModal .modal-body").html("");
      $.ajax({
	   type: "POST",
       dataType: "json",
       data: "ext=get_content_for_modal&content_id="+content_id,
	   async: false,
	   url: "/ajax.php",
 	   success: function(data){
  	    $("#contentModal .modal-title").html( data['headline'] );
	    $("#contentModal .modal-body").html( data['body'] );
       },
      });
	});
	
	$(document).on("click", ".getContentInModal1", function(event){
      var content_id = $(this).attr("content-id");
	  event.preventDefault();
	  console.log(content_id);
	  $("#contentModal1 .modal-title").html("");
	  $("#contentModal1 .modal-body").html("");
      $.ajax({
	   type: "POST",
       dataType: "json",
       data: "ext=get_content_for_modal&content_id="+content_id,
	   async: false,
	   url: "/ajax.php",
 	   success: function(data){
  	    $("#contentModal1 .modal-title").html( data['headline'] );
	    $("#contentModal1 .modal-body").html( data['body'] );
       },
      });
	});
	

	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	$(".prdoption").on( "change", function(e){
     var data = $("#cart_quantity").serialize()+"&g="+$("#spring_price_plain_net").html()+"&o="+$("#spring_old_price_plain").html();
     $.ajax({
	  type: "POST",
      dataType: "json",
      data: data,
      async: false,
	  url: "/prdoption.php",
 	  success: function(data){
		  
		  console.log("s4");
	   if(data['products_model'] !="") $("#ajax_model").html( data['products_model'] );
	   if(data['products_ean'] !="") $("#ajax_ean").html( data['products_ean'] );
	   if(data['products_gpa'] !="") $("#ajax_gpa").html( data['products_gpa'] );
	   if(data['products_weight'] !="") $("#ajax_weight").html( data['products_weight'] );
	   if(data['products_price_gross'] !="") $(".ajax_price").html( data['products_price_gross'] );
	   if(data['old_products_price_gross'] !="") $("#ajax_old_price").html( data['old_products_price_gross'] );
      },/*! success: function(data)..... */
     });/*! ajax.... */
	});/*! $(".prdoption").on( "change", function(e).... */
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	$(".scrollToReviews").on('click', function(e){
	 var pos = $($("#reviews")).offset().top;
	 $("html, body").animate({ scrollTop: parseInt(pos-100) }, 500); 
	});	
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	$(document).on("touchstart", "#create_account_as_registered", function(e){
	 var state = $(this).attr("state");
	 if(state == "registered"){
	  $("#create_account_as_registered").css("background-image","url(/images/checkbox-big-green-unchecked.png)");
	  $(this).attr("state","guest");
	  $("#register-form-password-section").delay(400).fadeOut(500);
	  $("#account_type").val("guest");
	  $("#invitation_code").val("");
	 }else{
	  $('input[name="password"').removeClass("formFieldError");
	  $('input[name="confirmation"').removeClass("formFieldValid");
	  $('input[name="password"').val("");
	  $('input[name="confirmation"').val("");
	  $("#create_account_as_registered").css("background-image","url(/images/checkbox-big-green.png)");
	  $(this).attr("state","registered");
	  $("#register-form-password-section").delay(500).fadeIn(800);
	  $("#account_type").val("registered");
	 }
	 e.stopPropagation();
	 e.preventDefault();
	});
	
	/*! +++++++++++++ */
	
	$(document).on("click", "#create_account_as_registered", function(e){
	 if( $(window).width() < 900 ) return;
	 var state = $(this).attr("state");
	 if(state == "registered"){
	  $("#create_account_as_registered").css("background-image","url(/images/checkbox-big-green-unchecked.png)");
	  $(this).attr("state","guest");
	  $("#register-form-password-section").delay(400).fadeOut(500);
	  $("#account_type").val("guest");
	  $("#invitation_code").val("");
	 }else{
	  $("#create_account_as_registered").css("background-image","url(/images/checkbox-big-green.png)");
	  $(this).attr("state","registered");
	  $("#register-form-password-section").delay(500).fadeIn(800);
	  $("#account_type").val("registered");
	 }/*! if(state == "checked"){.... */
	 e.stopPropagation();
	 e.preventDefault();
	});/*! $(document).on( "click", "#create_account_as_registered", function()... */
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	$(document).on( "click", '[psc-act="move-from-wishlist-to-cart"]', function(){
	 var data_id = $(this).attr("data-id");
     $.ajax({
      type: "POST",
      dataType: "json",
      data: "ext=wishlist_move_to_cart&pid="+data_id,
	  async: false,
	  url: "/ajax.php",
 	  success: function(data){
		var post = "ext=cart_add_item&pid="+data['pidToHide']+"&products_qty=1";
        $.ajax({
	     type: "POST",
         dataType: "json",
         data: post,
		 async: false,
	     url: "/ajax.php",
 	     success: function(data){
		  $(".cart .count").html(data['basket_qty']);	 
		  $(".cart .subtotal").html( data['basket_sum']+" EUR");	
		  $(".cart .lst-subtotal").html( data['basket_sum']+" EUR");	
		  $(".cart .item-list").html("");
		  $(".cart .subtotal").fadeIn();
		  $("#eps").removeClass("univisible");
		  iziToast.show({
			message: data['message'],
			position: 'bottomRight', 
			duration: 2000,
			class: 'iziToast-cartSuccess',
			progressBar: true,
			animateInside: true,
			timeout: 6200,
			transitionIn: 'fadeInLeft',
			transitionOut: 'fadeOut',
			transitionInMobile: 'fadeIn',
			transitionOutMobile: 'fadeOut'
		  });/*! toast... */
    	  var str = data['basket_prds'];
		  var explode = str.split("%%%"); 
		  $.each(explode, function(key, exp){
 	       var xparts = exp.split('|');
		   if(xparts[1]){
			var img = xparts[3];
		    xparts[2] = numberWithCommas(xparts[2]);
		    xparts[4] = numberWithCommas(xparts[4]);
		    var price = xparts[6];
		    var epp = number_format( xparts[2] / xparts[4] , 2, ',', '.' );
		    var xar = '<div class="dropdown-product-item" cart-pid-row-id="'+xparts[5]+'">'+
                      ' <span class="dropdown-product-remove"><i psc-act="remove-from-cart" data-id="'+xparts[5]+'" class="icon-cross"></i></span>'+
                      ' <a class="dropdown-product-thumb" href="'+xparts[1]+'"><img src="'+img+'"><div class="cartItemCount">'+xparts[4]+'</div></a>'+
                      '  <div class="dropdown-product-info">'+
                      '   <a class="dropdown-product-title" href="'+xparts[1]+'">'+xparts[0]+'</a>'+
                      '  </div>'+
                      '</div>';

		    $(".cart .item-list").append(xar);
		  
		   }/*! if(xparts[0]).... */
		  });/*! each.... */
         },/*! success: function(data)..... */
       });/*! ajax.... */
	   $("#wl_item_id"+data['pidToHide']).remove();
	   if(data['countItems'] < 1){
		$("#wl_als").removeClass("hidden");
	    $('html, body').animate({scrollTop: 0},500);	
	   }/*! if(data['countItems'] < 1).... */
      },/*! success: function(data)..... */
     });/*! ajax.... */
	});/*! $(document).on( "click", '.remove-from-wishlist', functi... */
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	$(document).on( "click", '[psc-act="remove-from-wishlist"]', function(){
	 var data_id = $(this).attr("data-id");
	 var data_remove = $(this).attr("remove-item");
     $.ajax({
      type: "POST",
      dataType: "json",
      data: "ext=wishlist_remove_item&pid="+data_id,
	  async: false,
	  url: "/ajax.php",
 	  success: function(data){
		$("#wl_item_id"+data_remove).remove();
	    if(data['countItems'] < 1){
		 $("#wl_als").removeClass("hidden");
	     $('html, body').animate({scrollTop: 0},500);	
	    }
      },/*! success: function(data)..... */
     });/*! ajax.... */
	});/*! $(document).on( "click", '.remove-from-wishlist', functi... */
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	$(document).on( "click", '[psc-act="sort_cb"]', function(){
	 $('[name=filter_sort] option[value="'+$(this).val()+'"]').prop("selected", true);
	 $("#sort").submit();
	});/*! $(document).on( "click", '.sort_cb', functi */
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	$(".toggle-password").click(function() {
	  $(this).toggleClass("fa-eye fa-eye-slash");
	  var input = $($(this).attr("toggle"));
	  if(input.attr("type") == "password"){
	   input.attr("type", "text");
	  }else{
	   input.attr("type", "password");
	  }/*! if... */
	});/*! $(".toggle-password").click(function() ..... */

	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	$(document).on( "click", '#leaveReviewSubmit', function(e){
		e.preventDefault();
        $.ajax({
	     type: "POST",
         dataType: "json",
         data: "ext=review_add&"+$("#leaveReview").serialize(), 
		 async: false,
	     url: "/ajax.php",
 	     success: function(data){
			 
		  if(data['error'] == true){
		   $("#feedback_message_review_text").html( data['message'] );
		   $("#review-message").css("border","1px solid #cc0000");
		   setTimeout( function() {
			$("#feedback_message_review_text").html("");   
			$("#review-message").css("border","1px solid #dbe2e8");
		   }, 5200 );
		  }else{ 
		   iziToast.show({
			message: data['message'],
			position: 'bottomRight', 
			duration: 2000,
			class: 'iziToast-success',
			progressBar: true,
			animateInside: true,
			timeout: 6200,
			transitionIn: 'fadeInLeft',
			transitionOut: 'fadeOut',
			transitionInMobile: 'fadeIn',
			transitionOutMobile: 'fadeOut'
		   });/*! toast... */
		   
		   writeCookie("trigger", "reviews", 1);
		   setTimeout( function() {
		    var newURL = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname + window.location.search; 
		    window.location = newURL;
		   }, 5200 );
		   
  		  }/*! if error....  */

         },/*! success: function(data)..... */
        });/*! ajax.... */
		
	});/*! $(document).on( "click", '#leaveReviewSubmit', function().... */
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */

	var tagging_array = [];
	var xspl = new Array();
	var tags = new Array();
	var t = 0;
	$('.product-listing .tags_elfo').text( (i, text) => tagging_array[i] = text );
	$.each( tagging_array, function( key, val ) {
		xspl = val.split(" ");
		$.each( xspl, function( key, value ) {
			if(value.length > 2){
				tags[t] = value;
				t++;
			}	
		});
	});
	tags = unique(tags);
	$.each( tags, function( key, keyword ) {
		if(keyword.length > 4 && $.trim(keyword) !="") $("#products_tagging_cb_section").append('<div class="custom-control custom-checkbox"><input class="custom-control-input" type="checkbox" value=".filter_'+keyword+'" id="filter_'+keyword+'"><label class="custom-control-label" for="filter_'+keyword+'">'+keyword+'</label></div>');
	});
	if(tags.length <2){
		$(".prdtags").remove();
	}
	
	/*! -------------- */	
	
	var tagging_array = [];
	var xspl = new Array();
	var tags = new Array();
	var t = 0;
	$('.product-listing .gsm_elfo').text( (i, text) => tagging_array[i] = text );
	$.each( tagging_array, function( key, val ) {
		xspl = val.split(" ");
		$.each( xspl, function( key, value ) {
			value = $.trim(value);
			if(value !== " "){
				if(value.length > 0){
					tags[t] = value;
					t++;
				}	
				
			}
		});
	});
	tags = unique(tags);
	$.each( tags, function( key, keyword ) {
		var fkeyword = keyword.replace("/","_");
		if(keyword.length > 0 && $.trim(keyword) !="") $("#products_variants_cb_section").append('<div class="custom-control custom-checkbox inline"><input class="custom-control-input" type="checkbox" value=".filter_'+fkeyword+'" id="filter_'+fkeyword+'"><label class="custom-control-label" for="filter_'+fkeyword+'">'+keyword+'</label></div>');
	});
	if(tags.length <2){
		$(".prdvariants").remove();
	}
	

	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	var shipping_time_array = [];
	$('.product-listing .shpt_elfo').text( (i, text) => shipping_time_array[i] = text.toUpperCase() );
	shipping_time_array = unique( shipping_time_array );
	shipping_time_array.sort();
	var pi = 0;
	$.each( shipping_time_array, function( key, value ) {
     pi++;		
	 $("#shipping_time_cb_section").append('<div class="custom-control custom-checkbox"><input class="custom-control-input" type="checkbox" value=".filter_'+value.replace(/ /g,"_")+'" id="filter_'+value.replace(/ /g,"_")+'"><label class="custom-control-label" for="filter_'+value.replace(/ /g,"_")+'">'+value+'</label></div>');
	});
	
	/*! ----- */
	
	$("#allergenics_cb_section").append('<div class="custom-control custom-checkbox"><input class="custom-control-input" type="checkbox" value=".filter_lactose_1" id="filter_lactose_1"><label class="custom-control-label" for="filter_lactose_1">Ohne Lactose</label></div>');
/*!
	$("#allergenics_cb_section").append('<div class="custom-control custom-checkbox"><input class="custom-control-input" type="checkbox" value=".filter_gluten_1" id="filter_gluten_1"><label class="custom-control-label" for="filter_gluten_1">Ohne Gluten</label></div>');
*/
	/*! ----- */
	
	$( ".noPricesToSee" ).each( function( index, element ){
     $("#priceRange_slider .ovl").show();
	});	
	
	/*! ----- */


	if($('.isotope-grid').length) {
		
     setInterval( function() {
 	  if( $('.product-listing .grid-item').is(':visible') ){
	   $(".noProductsForFilters").invisible();	  
	  }else{
	   $(".noProductsForFilters").visible();  
	  }
	 }, 200 );
	
	 var filter = $('#form-ui .options input');
	 var suche  = $('#categories_isotope_quicksearch');
	 var qsRegex;
	 var buttonFilter;
	 var filters = [];
	 
	 var priceArrayInstead = [];
	 
	 $( ".grid-item" ).each(function( index ) {
	  priceArrayInstead.push( parseInt( $(this).attr('data-price')) );
	 });	 
	 
	 var pmin = Math.min.apply(Math,  priceArrayInstead);
	 var pmax = Math.max.apply(Math,  priceArrayInstead);
	 
	 $(".ex_p1 span").html(pmin);
	 $(".ex_p2 span").html(pmax);

	 var $priceSlider = $('#ex2').slider({ 
		tooltip_split: true, 
		min: pmin,  
		max: pmax, 
		range: true, 
		tooltip: 'always',
		value: [pmin, pmax] 
	 });
  
     $priceSlider.on('slideStop', function(slideEvt){
      var $this =$(this);
      updateRangeSlider($this, slideEvt);
     });
  
     function updateRangeSlider(slider, slideEvt) {
      var sldmin = +slideEvt.value[0],
          sldmax = +slideEvt.value[1],
          filterGroup = slider.attr('data-filter-group'),
          currentSelection = sldmin + ' - ' + sldmax;
		  $(".currentSelection").show();
		  $(".currentSelection span").html(currentSelection);

       pmin = sldmin || 0;
       pmax = sldmax || 100000;

       $grid.isotope();
      }

	  var $grid = $('.isotope-grid').imagesLoaded(function() {
	   $grid.isotope({
	    itemSelector: '.grid-item',
 	    transitionDuration: '0.23s',
	    masonry: {
         columnWidth: '.grid-sizer',
	     gutter: '.gutter-sizer'
        },
		
	    filter: function() {
         var $this = $(this);
         var products_price = $this.attr('data-price');
	     var isInPriceRange = (pmin <= products_price && pmax >= products_price);
	     var searchResult = qsRegex ? $(this).text().match( qsRegex ) : true;
	     var buttonResult = buttonFilter ? $(this).is( buttonFilter ) : true;
	     return searchResult && buttonResult && isInPriceRange;
	    }
	   });
	   

	 var quicksearch = suche.keyup( debounce( function() {
	  qsRegex = new RegExp( quicksearch.val(), 'gi' );
	  $grid.isotope();
	 }, 200 ) );

	 $(document).on( "click", ".categories_isotope_quicksearch_clear_form", function(event){
	  $("#categories_isotope_quicksearch").focus();
	  $("#categories_isotope_quicksearch").select();
	  $("#categories_isotope_quicksearch").val("");
	  qsRegex = new RegExp( quicksearch.val(), 'gi' );
	  $grid.isotope();
	 });
	 
	 function debounce( fn, threshold ) {
	  var timeout;
	  return function debounced() {
	  if ( timeout ) {
		clearTimeout( timeout );
	  }
	  function delayed() {
		fn();
		timeout = null;
	  }
	   timeout = setTimeout( delayed, threshold || 100 );
	  };
	 }

	 filter.change(function(){
	  var filters = [];
	  filter.filter(':checked').each(function(){
	   filters.push( this.value );
	  });
	  filters = filters.join(','); /*! AND= '' +++ OR = ',' */
	  buttonFilter = filters;
	  $grid.isotope();
	  
    setTimeout( function() {
	 var aTag = $(".product-listing");	
	 var ret  = aTag.offset().top;
     $('html, body').animate({scrollTop: ret},222);
    }, 333 );
	  
	 });


	 var $checkboxes = $('#form-ui input .options');

	 $checkboxes.change( function() {
      var inclusives = [];
      $checkboxes.each( function( i, elem ) {
       if ( elem.checked ) {
        inclusives.push( elem.value );
       }
	  });
      $('.output').html( inclusives.join(', ') );
       $grid.isotope({ filter: inclusives.join(', ') });
      });
     });
	 
    }
		
		
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	$(document).on( "click", '[psc-act="remove-voucher-from-cart"]', function(){
		
		var data_id = $(this).attr("data-id");
		
        $.ajax({
	     type: "POST",
         dataType: "json",
         data: "ext=voucher_remove&pid="+data_id,
		 async: false,
	     url: "/ajax.php",
 	     success: function(data){
		  setTimeout( function() {
		   var newURL = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname + window.location.search;
		   window.location = newURL;
		  }, 1200 );
         },/*! success: function(data)..... */
        });/*! ajax.... */
		
		
	});
		
	
	
		
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	$(document).on( "click", '[psc-act="add-to-wishlist"]', function(){
		
		var data_id = $(this).attr("data-id");
		
        $.ajax({
	     type: "POST",
         dataType: "json",
         data: "ext=wishlist_add&pid="+data_id,
		 async: false,
	     url: "/ajax.php",
 	     success: function(data){
		  iziToast.show({
			message: data['message'],
			position: 'bottomRight', 
			duration: 2000,
			class: 'iziToast-cartSuccess',
			progressBar: true,
			animateInside: true,
			timeout: 6200,
			transitionIn: 'fadeInLeft',
			transitionOut: 'fadeOut',
			transitionInMobile: 'fadeIn',
			transitionOutMobile: 'fadeOut'
		  });/*! toast... */
         },/*! success: function(data)..... */
        });/*! ajax.... */
		
	});/*! $(document).on( "click", '[psc-act="add-to-wishlist"]', function().... */
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	$(document).on( "click", '[psc-act="remove-from-cart"]', function(){
		
		var data_id = $(this).attr("data-id");
		$(".cart .subtotal").fadeOut();
		
        $.ajax({
	     type: "POST",
         dataType: "json",
         data: "ext=cart_remove_item&pid="+data_id,
		 async: false,
	     url: "/ajax.php",
 	     success: function(data){
		  $(".cart .count").html(data['basket_qty']);	 
		  $(".cart .subtotal").html( data['basket_sum']+" EUR");	
		  $(".cart .lst-subtotal").html( data['basket_sum']+" EUR");	
		  $('[cart-pid-row-id="'+data_id+'"]').fadeOut();
		  if( data['basket_qty'] < 1 ){
		   $("#eps").addClass("univisible");
		  }/*! if( data['basket_qty'] < 1 )... */
		  $(".cart .subtotal").fadeIn();
         },/*! success: function(data)..... */
        });/*! ajax.... */
				
	});/*! $(document).on( "click", '[psc-act="remove-from-cart"]', function().... */
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	$(document).on( "click", '[psc-act="add-to-cart"]', function(){
		
		/*! close quickview, if open! */
		setTimeout( function() {
		 $(".add-content .cd-close").trigger("click");		 
		}, 500 );
		
		
		var data_id = $(this).attr("data-id");
		var qty     = $(this).attr("products_qty");
		
		if( $("#products_qty_qvv").length > 0 ){
		 var qty = $("#products_qty_qvv").val();
		}
		

		if( $("#products_qty").length ){
			
		 var qty = $("#products_qty").val();
		 var post = "ext=cart_add_item&"+$("#cart_quantity").serialize();
		 
		}else{
			
         var post = "ext=cart_add_item&pid="+data_id+"&products_qty="+qty;
		 
		}			
		
		$(".cart .subtotal").fadeOut();
		
        $.ajax({
	     type: "POST",
         dataType: "json",
         data: post,
		 async: false,
	     url: "/ajax.php",
 	     success: function(data){
		  $(".cart .count").html(data['basket_qty']);	 
		  $(".cart .subtotal").html( data['basket_sum']+" EUR");	
		  $(".cart .lst-subtotal").html( data['basket_sum']+" EUR");	
		  $(".cart .item-list").html("");
		  $(".cart .subtotal").fadeIn();
		  
		  $("#eps").removeClass("univisible");
		  
		  iziToast.show({
			message: data['message'],
			position: 'bottomRight', 
			duration: 2000,
			class: 'iziToast-cartSuccess',
			progressBar: true,
			animateInside: true,
			timeout: 6200,
			transitionIn: 'fadeInLeft',
			transitionOut: 'fadeOut',
			transitionInMobile: 'fadeIn',
			transitionOutMobile: 'fadeOut'
		  });
		  
		  var str = data['basket_prds'];
		  var explode = str.split("%%%"); 
		  $.each(explode, function(key, exp){
 	       var xparts = exp.split('|');
		   if(xparts[1]){
		    var img = xparts[3];
		    xparts[2] = numberWithCommas(xparts[2]);
		    xparts[4] = numberWithCommas(xparts[4]);
		    var price = xparts[6];
		    var epp = number_format( xparts[2] / xparts[4] , 2, ',', '.' );
		    var xar = '<div class="dropdown-product-item" cart-pid-row-id="'+xparts[5]+'">'+
                      ' <span class="dropdown-product-remove"><i psc-act="remove-from-cart" data-id="'+xparts[5]+'" class="icon-cross"></i></span>'+
                      ' <a class="dropdown-product-thumb" href="'+xparts[1]+'"><img src="'+img+'"><div class="cartItemCount">'+xparts[4]+'</div></a>'+
                      '  <div class="dropdown-product-info">'+
                      '   <a class="dropdown-product-title" href="'+xparts[1]+'">'+xparts[0]+'</a>'+

                      '  </div>'+
                      '</div>';

		    $(".cart .item-list").append(xar);
		  
		   }/*! if(xparts[0]).... */
		  });/*! each.... */
         },/*! success: function(data)..... */
        });/*! ajax.... */
		
	})/*! $('div[psc-act="add-to-cart"]').click(function... */
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	
	
	$(document).on( "click", '[psc-act="add-to-cart-qv"]', function(){
		
		/*! close quickview, if open! */
		setTimeout( function() {
		 $(".add-content .cd-close").trigger("click");		 
		}, 500 );
		
		
		var data_id = $(this).attr("data-id");
		var qty     = $(this).attr("products_qty");
		
		if( $("#products_qty_qvv").length > 0 ){
		 var qty = $("#products_qty_qvv").val();
		}
		
		var attributes_string = "";
		
		$("#qv_attributes select").each(function() {
			var $selectBox = $(this);
			var selectedOption = $selectBox.find(":selected").val();
			attributes_string +="&"+$selectBox.attr('id') +"="+selectedOption;
		});
			
        var post = "ext=cart_add_item&pid="+data_id+"&products_qty="+qty+attributes_string;
		
		$(".cart .subtotal").fadeOut();
		
        $.ajax({
	     type: "POST",
         dataType: "json",
         data: post,
		 async: false,
	     url: "/ajax.php",
 	     success: function(data){
		  $(".cart .count").html(data['basket_qty']);	 
		  $(".cart .subtotal").html( data['basket_sum']+" &euro;");	
		  $(".cart .lst-subtotal").html( data['basket_sum']+" &euro;");	
		  $(".cart .item-list").html("");
		  $(".cart .subtotal").fadeIn();
		  
		  $("#eps").removeClass("univisible");
		  
		  iziToast.show({
			message: data['message'],
			position: 'bottomRight', 
			duration: 2000,
			class: 'iziToast-cartSuccess',
			progressBar: true,
			animateInside: true,
			timeout: 6200,
			transitionIn: 'fadeInLeft',
			transitionOut: 'fadeOut',
			transitionInMobile: 'fadeIn',
			transitionOutMobile: 'fadeOut'
		  });
		  
		  var str = data['basket_prds'];
		  var explode = str.split("%%%"); 
		  $.each(explode, function(key, exp){
 	       var xparts = exp.split('|');
		   if(xparts[1]){
	  	    if(xparts[3]){
			 var img = ""+xparts[3];
		    }else{
			 var img = "/images/noimage.jpg";	
		    }/*! if(xparts[3]).... */
		    xparts[2] = numberWithCommas(xparts[2]);
		    xparts[4] = numberWithCommas(xparts[4]);
		    var price = xparts[6];
		    var epp = number_format( xparts[2] / xparts[4] , 2, ',', '.' )+" &euro;";
		    var xar = '<div class="dropdown-product-item" cart-pid-row-id="'+xparts[5]+'">'+
                      ' <span class="dropdown-product-remove"><i psc-act="remove-from-cart" data-id="'+xparts[5]+'" class="icon-cross"></i></span>'+
                      ' <a class="dropdown-product-thumb" href="'+xparts[1]+'"><img src="'+img+'"><div class="cartItemCount">'+xparts[4]+'</div></a>'+
                      '  <div class="dropdown-product-info">'+
                      '   <a class="dropdown-product-title" href="'+xparts[1]+'">'+xparts[0]+'</a>'+

                      '  </div>'+
                      '</div>';

		    $(".cart .item-list").append(xar);
		  
		   }/*! if(xparts[0]).... */
		  });/*! each.... */
         },/*! success: function(data)..... */
        });/*! ajax.... */
		
	})/*! $('div[psc-act="add-to-cart"]').click(function... */
	
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */
	/*! -------------------------------------------------------------------------------------------------------------------------------------------------- */

});/*! $(document).ready(function()..... */


/*! --------------------------------------------------------------------------------- */
/*! --------------------------------------------------------------------------------- */

 function numberWithCommas(x){
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ""); 
 }/*! function numberWithCommas(x) .... */

/*! --------------------------------------------------------------------------------- */
 
 function number_format(number, decimals, decPoint, thousandsSep){

	decimals = decimals || 0;
	number = parseFloat(number);

	if(!decPoint || !thousandsSep){
		decPoint = '.';
		thousandsSep = ',';
	}

	var roundedNumber = Math.round( Math.abs( number ) * ('1e' + decimals) ) + '';
	/*! add zeros to decimalString if number of decimals indicates it */
	roundedNumber = (1 > number && -1 < number && roundedNumber.length <= decimals)
		      ? Array(decimals - roundedNumber.length + 1).join("0") + roundedNumber
		      : roundedNumber;
	var numbersString = decimals ? roundedNumber.slice(0, decimals * -1) : roundedNumber.slice(0);
	var checknull = parseInt(numbersString) || 0;
  
	/*! check if the value is less than one to prepend a 0 */
	numbersString = (checknull == 0) ? "0": numbersString;
	var decimalsString = decimals ? roundedNumber.slice(decimals * -1) : '';
	
	var formattedNumber = "";
	while(numbersString.length > 3){
		formattedNumber = thousandsSep + numbersString.slice(-3) + formattedNumber;
		numbersString = numbersString.slice(0,-3);
	}

	return (number < 0 ? '-' : '') + numbersString + formattedNumber + (decimalsString ? (decPoint + decimalsString) : '');
	
 }/*! function number_format(number, decimals, decPoint, thousandsSep.... */
 
/*! --------------------------------------------------------------------------------- */
 
 function print(string){
	console.log(string);
 }
 
/*! --------------------------------------------------------------------------------- */

 function validateOnlyNumbers(evt){
    var e = evt || window.event;
    var key = e.keyCode || e.which;
    if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
    key >= 48 && key <= 57 ||
    key == 8 || key == 9 || key == 13 ||
    key == 35 || key == 36 ||
    key == 37 || key == 39 ||
    key == 46 || key == 45) {
        /*! input is VALID */
    }
    else {
        /*! input is INVALID */
        e.returnValue = false;
        if (e.preventDefault) e.preventDefault();
    }
 }/*! function validateOnlyNumbers()..... */

/*! --------------------------------------------------------------------------------- */

 function scrollToAnchor(aid){
    setTimeout( function() {
	 var aTag = $("a[name='"+ aid +"']");	
	 var ret  = aTag.offset().top - 160;
     $('html, body').animate({scrollTop: ret},500);
    }, 1500 );
 }/*! function scrollToAnchor(aid)..... */
 
/*! --------------------------------------------------------------------------------- */

function loadQueryString(){ 
  var key = false, res = {}, itm = null;
  
  var qs = location.search.substring(1);
  
  if (arguments.length > 0 && arguments[0].length > 1)
    key = arguments[0];
  
  var pattern = /([^&=]+)=([^&]*)/g;
  
  
  
  while (itm = pattern.exec(qs)) {
    if (key !== false && decodeURIComponent(itm[1]) === key)
      return decodeURIComponent(itm[2]);
    else if (key === false)
      res[decodeURIComponent(itm[1])] = decodeURIComponent(itm[2]);
  }

  return key === false ? res : null;
};

/*! --------------------------------------------------------------------------------- */


var getParams = function (url) {
	var params = {};
	var parser = document.createElement('a');
	parser.href = url;
	var query = parser.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
	}
	return params;
};

/*! --------------------------------------------------------------------------------- */
 
 function isFormFieldValid(field, form, type){
  $.ajax({
   type: "POST",
   dataType: "json",
   data: "ext=isFormFieldValid&field="+field+"&form="+form+"&string="+$(type+"[name="+field+"]").val(),
   async: false,
    url: "/ajax.php",
 	success: function(data){
	 var accs = "";
     if(field == "password" || field == "confirmation"){
	  accs = "icon-left";
	 }
	 if( data['valid'] !="yes" ){
	  $("#"+form+" "+type+"[name="+field+"]").removeClass("formFieldValid");
	  $("#"+form+" "+type+"[name="+field+"]").addClass("formFieldError "+accs);
	  $("#feedback_message_"+field).html( data['message'] );
	 }else{	
	  $("#"+form+" "+type+"[name="+field+"]").removeClass("formFieldError");
	  $("#"+form+" "+type+"[name="+field+"]").addClass("formFieldValid "+accs);
	  $("#feedback_message_"+field).html( "&nbsp;" );
	 }
    },/*! success: function(data)..... */
   });/*! ajax.... */
 };
 
/*! --------------------------------------------------------------------------------- */

 read_cookie = function(key){
    var result;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? (result[1]) : null;
 }

 writeCookie = function(cname, cvalue, days) {
  var dt, expires;
  dt = new Date();
  dt.setTime(dt.getTime()+(days*24*60*60*1000));
  expires = "; expires="+dt.toGMTString();
  document.cookie = cname+"="+cvalue+expires+'; path=/';
 };
 
 /*! --------------------------------------------------------------------------------- */
 
 function unique(array){
  return array.filter(function(el, index, arr) {
   return index === arr.indexOf(el);
  }); 
 };

/*! --------------------------------------------------------------------------------- */

 $(document).on("click", "#pouhz", function(e){
	$(".iziToast-cartSuccess").fadeOut(600);
 });

/*! --------------------------------------------------------------------------------- */

 (function($) {
    $.fn.invisible = function() {
        return this.each(function() {
            $(this).css("visibility", "hidden");
        });
    };
    $.fn.visible = function() {
        return this.each(function() {
            $(this).css("visibility", "visible");
        });
    };
 }(jQuery));

/*! --------------------------------------------------------------------------------- */


jQuery.event.special.touchstart = {
    setup: function( _, ns, handle ) {
        this.addEventListener("touchstart", handle, { passive: !ns.includes("noPreventDefault") });
    }
};
jQuery.event.special.touchmove = {
    setup: function( _, ns, handle ) {
        this.addEventListener("touchmove", handle, { passive: !ns.includes("noPreventDefault") });
    }
};

/*! --------------------------------------------------------------------------------- */

function unique(array) {
    return $.grep(array, function(el, index) {
        return index === $.inArray(el, array);
    });
}

/*! --------------------------------------------------------------------------------- */
