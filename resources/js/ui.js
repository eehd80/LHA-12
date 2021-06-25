var $flag = false;

(function($){
	'use strict';

	if(typeof window.ui === 'undefined'){
		var ui = window.ui = {}
	}

	$.fn.imagesLoaded = function(){
		var $imgs = this.find('img[src!=""]'), dfds = [];

		if (!$imgs.length){
			return $.Deferred().resolve().promise();
		}

		$imgs.each(function(){
			var dfd = $.Deferred(), img = new Image();
			dfds.push(dfd);
			img.onload = function(){dfd.resolve();}
			img.onerror = function(){dfd.resolve();}
			img.src = this.src;
		});

		return $.when.apply($, dfds);
	}

	ui.init = (function(_){

		(function setViewport(viewport){
			if(_.isDesktop){
				/* set desktop viewport */
				viewport.attr({'content':'width=1100, user-scalable=yes'});
			}
			if(_.isTablet){
				/* set tablet viewport */
				viewport.attr({'content':'width=1100, user-scalable=yes'});
			}
			if(_.isMobile){
				/* set mobile viewport */
				viewport.attr({'content':'width=960, user-scalable=yes'});
			}
		})($('meta[name=viewport]'));

		var getElements = function(){
			_.$html			=	$('html');
			_.$body			=	$('body');
			_.$wrap			=	$('#wrap');
			_.$header		=	$('#header');
			_.$gnb			=	$('#gnb');
			_.$container	=	$('#container');
			_.$main			=	$('#main');
			_.$contents		=	$('#contents');
			_.$footer		=	$('#footer');
			_.$motion		=	$('.n-motion');
		}

		var getWindowSize = function(){
			_.winsizeW = $(window).outerWidth();
			_.winsizeH = $(window).outerHeight();
		}

		var getWindowScrl = function(){
			_.winscrlT = $(window).scrollTop();
			_.winscrlL = $(window).scrollLeft();
		}

		return {
			onLoad : function(){
				getElements();
				getWindowSize();
				getWindowScrl();

				_.loadmotion.init();
				ui.visualHeight();
				ui.customSelect();
				ui.imgChange();
				ui.subMenu();
			},
			onResize : function(){
				getWindowSize();
				ui.visualHeight();
				ui.customSelect();
				ui.imgChange();
			},
			onScroll : function(){
				getWindowScrl();
			}
		}
	})(ui);

	ui.setCookie = function(name, value, expiredays) {
		var todayDate = new Date();

		todayDate.setDate( todayDate.getDate() + expiredays );
		document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";"
	}

	ui.hasOwnProperty = function(org, src){
		for(var prop in src){
			if(!hasOwnProperty.call(src, prop)){
				continue;
			}
			if('object' === $.type(org[prop])){
				org[prop] = ($.isArray(org[prop]) ? src[prop].slice(0) : ui.hasOwnProperty(org[prop], src[prop]));
			}else{
				org[prop] = src[prop];
			}
		}

		return org;
	}

	ui.layerpopup = (function(_){
		var def = {
			defaults : {
				background : true,
				top : false,
				left : false,
				centerMode : true,
				onlyScroll : false,
				openCallback : function(data){},
				closeCallback : function(){}
			},
			idx : 0,
			setInit : function(popup, settings){
				popup.opt = $.extend({}, def.defaults, settings);
				popup.$wrap = _.$body.append('<div class="layer-wrap">').children('.layer-wrap:last-child');
				popup.$back = popup.opt.background ? popup.$wrap.append('<div class="layer-back" layer="close">').children('.layer-back') : false;

				popup.$outer = popup.$wrap.append('<div class="layer-outer"></div>').children('.layer-outer');
				popup.$inner = popup.$outer.append('<div class="layer-inner"></div>').children('.layer-inner');
				popup.resizeEvent = 'resize.layerpopup'+def.idx++;

				popup.windowWidth = $(window).width();
				popup.windowHeight = $(window).height();
				popup.windowScrollY = $(window).scrollTop();
				popup.windowScrollX = $(window).scrollLeft();
			},
			setPosition : function(popup){

				if (popup.opt.centerMode) {
					popup.popupWidth = popup.$outer.width();
					popup.popupHeight = popup.$outer.height();
					if (_.popupWidth > _.windowWidth * 0.8) {
						popup.$outer.css({'left': popup.windowScrollX + popup.windowWidth * 0.1});
					} else {
						popup.$outer.css({'left': popup.windowScrollX + ((popup.windowWidth - popup.popupWidth) / 2)});
					}
					if (popup.popupHeight > popup.windowHeight * 0.8) {
						popup.$outer.css({'top': popup.windowScrollY + popup.windowHeight * 0.1});
					} else {
						popup.$outer.css({'top': popup.windowScrollY + ((popup.windowHeight - popup.popupHeight) / 2)});
					}
				} else {
					popup.$outer.css({
						'top': popup.opt.top,
						'left': popup.opt.left
					});
				}

				if (popup.opt.onlyScroll) {
					var _popupBody = popup.$inner.find('.only-scroll-body');
					_popupBody.on('DOMMouseScroll mousewheel', function(e) {
						var $this 		 = 	$(this);
						var	scrollTop 	 = 	this.scrollTop;
						var	scrollHeight =	this.scrollHeight;
						var	height 		 =	$this.innerHeight();
						var	delta		 =	e.originalEvent.wheelDelta;
						var	up 			 =  delta > 0;

						var prevent = function() {
							e.stopPropagation();
							e.preventDefault();
							e.returnValue = false;
							return false;
						}

						if (!up && -delta > scrollHeight - height - scrollTop) {
							$this.scrollTop(scrollHeight);
							return prevent();
						} else if (up && delta > scrollTop) {
							$this.scrollTop(0);
							return prevent();
						}
					});
				}

				return popup.$wrap;
			},
			setClose : function(popup){
				popup.$close = popup.$wrap.find('[layer="close"]');
				popup.$close.on('click', function(){
					popup.opt.closeCallback();
					popup.close();
				});
			},
			popupClose : function(popup){
				popup.$wrap.remove();
				$(window).off(popup.resizeEvent);
			}
		}

		return {
			open : function(url, settings){
				var init = function(){
					var popup = this;

					def.setInit(popup, settings);

					$.ajax({
						url : url,
						timeout : 10000,
						dataType : 'html',
						success : function(data){
							popup.$inner.append(data).imagesLoaded().then(function(){
								popup.opt.openCallback(popup.$wrap);
								def.setPosition(popup).addClass('open');
								def.setClose(popup);
								$(window).on(popup.resizeEvent, function(){
									def.setPosition(popup);
								});
							});
						},
						error : function(xhr){
							alert('['+xhr.status+'] 서버전송오류가 발생했습니다.');
						}
					});

					return popup;
				}

				init.prototype.close = function(){
					var popup = this;

					def.popupClose(popup);
				}

				init.prototype.reinit = function(){
					var popup = this;

					def.setPosition(popup);
				}

				return new init();
			}
		}
	})(ui);

	ui.companyPopup = function (url) {
		var win = window.open(url,"_blank");

		try {
			win.focus();
		}
		catch(e){
			alert( "팝업차단 설정을 풀어주세요." );
		}
	}

	ui.visualHeight = function(){
		var windowH = $(window).outerHeight();
        var ww = $(window).width();
        if(ww > 960){
            $('#main .visual .slick-wrap div').css({'height' : windowH});
        }
		
	}

	ui.slider = (function(){
		return {
			mainVisual : function(){
				var main_slide = $('#main .section.visual .slick-wrap.pc');

				main_slide.slick({
					fade : false,
					speed : 1000,
					arrows : true,
					dots : true,
					infinite : true,
					slidesToShow : 1,
					slidesToScroll : 1,
					accessibility : true,
					pauseOnHover: false,
					pauseOnFocus: false,
					autoplay: false,
					autoplaySpeed: 10000,
					draggable: false,
					adaptiveHeight: true,
					appendDots: '#main .section.visual .inner.pc .slick-navi',
					prevArrow: '#main_slider_prev',
					nextArrow: '#main_slider_next',
					customPaging: function(slider, i) {
						return $('<button type="button" data-role="none" role="button" tabindex="0" />').text(slider.$list.prevObject.get(0).children[i+1].title);
					}
                    
				});

			},
            
            mmainVisual : function(){
				var $mainVisual = $('#main .section.visual .slick-wrap.mobile');

				

				$mainVisual.slick({
					fade : false,
					speed : 1000,
					arrows : true,
					dots : false,
					infinite : true,
					slidesToShow : 1,
					slidesToScroll : 1,
					accessibility : true,
					pauseOnHover: false,
					pauseOnFocus: false,
					autoplay: true,
					autoplaySpeed: 10000,
					draggable: false,
					adaptiveHeight: true,
					prevArrow: '.main-slider__prev',
					nextArrow: '.main-slider__next',
					customPaging: function(slider, i) {
						return $('<button type="button" data-role="none" role="button" tabindex="0" />').text(slider.$list.prevObject.get(0).children[i].title);
					}
                    
				});

			},
		}
	})(ui);

	ui.inputfile = function(target){
		var $target = $(target), value = $target.val();

		$target.next().val(value);
	}

    ui.textCounter = function() {
        $('#write-box').on('input', function (e){
            var content = $(this).val();
            $(this).next('.text-cnt').html(content.length + '/600');
            if(content.length > 600) {
                alert('600자 이하로 작성하여 주세요.');
            }
        });
    }

	ui.mainheaderActive = function(){
		var $header = $('#header');
		var $navi = $('#navigation');
		var $naviInner = $('#navigation .inner');
		var $depth1 = $('#gnb > li');
		var $flag = false;

		ui.matchmedia({
			matchDesktop : function () {
				var $navi 		 = $('#navigation'),
					$depthParent = $navi.find('#gnb > li'),
					$depth1		 = $depthParent.children('a'),
					$siteMapTrg	 = $('.site-map-trg'),
					$siteMap	 = $('.site-map-area'),
					gnbSpd = 300;

				$depth1.on('mouseover focusin', function(){
					$(this).parent().addClass("over");
					$("#header").addClass("nav-hover");
					$(".nav-contents").addClass("nav-contents-block");
					$(".nav-image").addClass("nav-image-block");
				});

				$depth1.on('mouseleave focusout', function(){
					$(this).parent().removeClass("over");
					$("#header").removeClass("nav-hover");
					$(".nav-contents").removeClass("nav-contents-block");
					$(".nav-image").removeClass("nav-image-block");
				});

				$depth1.on('click', function(){
					var link = $(this).data('href');
					window.location.pathname = link;
				});

				$('#gnb').on('mouseover focusin', function(){
					$(this).parent().addClass("over");
					$("#header").addClass("nav-hover");
					$(".nav-contents").addClass("nav-contents-block");
					$(".nav-image").addClass("nav-image-block");
				});

				$('#header').on('mouseleave focusout', function(){
					$(this).parent().removeClass("over");
					$("#header").removeClass("nav-hover");
					$(".nav-contents").removeClass("nav-contents-block");
					$(".nav-image").removeClass("nav-image-block");
				});
                
                $('.menu').on('mouseover focusin', function(){
					$(this).parent().addClass("over");
					$("#header").addClass("nav-hover");
					$(".nav-contents").addClass("nav-contents-block");
					$(".nav-image").addClass("nav-image-block");
				});

				

				function siteMapAction(e) {
					var _this = $(e.target);

					if (!_this.hasClass('close')) {
						//_this.parent('.site-map').addClass('open');
						$siteMap.stop(true).slideDown(gnbSpd).addClass('open');
					} else {
						//_this.parent('.site-map').removeClass('open');
						$siteMap.stop(true).slideUp(gnbSpd).removeClass('open');
					}
				}

				$siteMapTrg.on(' click', function (target) {
					siteMapAction(target);
				});

				$('body').on('load scroll mousewheel', function(){
					$header.css('left', -$('body').scrollLeft());
				});

			},
			matchMobile : function () {
				$depth1.on('click', function(){
					$(this).toggleClass('on').siblings().removeClass('on');
				});

				$('body').on('load scroll mousewheel', function(){
					$header.css('left', -$('body').scrollLeft());
				});
			}
		});
        
        
        $('.menu-close').on('click', function () {
            if ($flag) {
				$("#navi-trg").removeClass('open');
				$navi.css('left', '100%');
				$naviInner.css('left', 0);
				$('html').removeClass('navi-open');

				// if ($('#main').length) {
				// 	$('#main').fullpage.setMouseWheelScrolling(true);
				// 	$('#main').fullpage.setAllowScrolling(true);
				// }
                //$('#mask').hide();
                $('#nav-mobile-wap').hide();
				$flag = false;
			} else {
                //wrapWindowByMask();
                $('#nav-mobile-wap').show();
				$(this).addClass('open');
				$('html').addClass('navi-open');
				$navi.css('left', '18.51851851851852%')
				$naviInner.css('left',  -$('body').scrollLeft());

				$flag = true;
			
			}
        });
		$('#navi-trg').on('click', function () {
			if ($flag) {
				$("#navi-trg").removeClass('open');
				$navi.css('left', '100%');
				$naviInner.css('left', 0);
				$('html').removeClass('navi-open');

				// if ($('#main').length) {
				// 	$('#main').fullpage.setMouseWheelScrolling(true);
				// 	$('#main').fullpage.setAllowScrolling(true);
				// }
                $('#nav-mobile-wap').hide();
				$flag = false;
			} else {
                //wrapWindowByMask();
                $('#nav-mobile-wap').show();
				$(this).addClass('open');
				$('html').addClass('navi-open');
				$navi.css('left', '18.51851851851852%')
				$naviInner.css('left',  -$('body').scrollLeft());

				$flag = true;
			}
		});
	}

	ui.subheaderActive = function(){
		var $header = $('#header');
		var $navi = $('#navigation');
		var $naviInner = $('#navigation .inner');
		var $depth1 = $('#gnb > li');
		

		ui.matchmedia({
			matchDesktop : function () {
				var $navi 		 = $('#navigation'),
					$depthParent = $navi.find('#gnb > li'),
					$depth1		 = $depthParent.children('a'),
					$siteMapTrg	 = $('.site-map-trg'),
					$siteMap	 = $('.site-map-area'),
					gnbSpd = 300;

				$depth1.on('mouseover focusin', function(){
					$(this).parent().addClass("over");
					$("#header").addClass("nav-hover");
					$(".nav-contents").addClass("nav-contents-block");
					$(".nav-image").addClass("nav-image-block");
					//$(this).next(".depth2").stop(false, true).slideDown(gnbSpd)
				});

				$depth1.on('mouseleave focusout', function(){
					$(this).parent().removeClass("over");
					$("#header").removeClass("nav-hover");
					$(".nav-image").removeClass("nav-image-block");
					//$(this).next(".depth2").stop(false, true).slideUp(gnbSpd)
				});

				$depth1.on('click', function(){
					var link = $(this).data('href');
					window.location.pathname = link;
				});

				$('#gnb .nav-contents').on('mouseover focusin', function(){
					$(this).parent("li").addClass("over");
					$("#header").addClass("nav-hover");
					$(".nav-contents").addClass("nav-contents-block");
					$(".nav-image").addClass("nav-image-block");
					$(this).stop().slideDown(gnbSpd)
				});

				$('#gnb .nav-contents').on('mouseleave focusout', function(){
					$(this).parent("li").removeClass("over");
					$("#header").removeClass("nav-hover");
					$(".nav-image").removeClass("nav-image-block");
					$(this).stop().slideUp(gnbSpd)
				});

				$("#header").on('mouseover focusin', function(){
					$("#header").addClass("nav-hover");
					$(".nav-contents").addClass("nav-contents-block");
					$(".nav-image").addClass("nav-image-block");
				});
				$("#header").on('mouseleave focusout', function(){
					$("#header").removeClass("nav-hover")
					$(".nav-image").removeClass("nav-image-block");
				});

				function siteMapAction(e) {
					var _this = $(e.target);

					if (!_this.hasClass('close')) {
						//_this.parent('.site-map').addClass('open');
						$siteMap.stop(true).slideDown(gnbSpd).addClass('open');
					} else {
						//_this.parent('.site-map').removeClass('open');
						$siteMap.stop(true).slideUp(gnbSpd).removeClass('open');
					}
				}

				$siteMapTrg.on(' click', function (target) {
					siteMapAction(target);
				});

				$(window).on('load scroll mousewheel', function(){
					$header.css('left', -$(window).scrollLeft());
				});
			},
			matchMobile : function () {
				$depth1.on('click', function(){
					$(this).toggleClass('on').siblings().removeClass('on');
				});

				$(window).on('load scroll mousewheel', function(){
					$header.css('left', -$(window).scrollLeft());
				});
			}
		});

		$('#navi-trg').on('click', function () {
			if ($flag) {
				$(this).removeClass('open');
				$navi.css('left', '100%');
				$naviInner.css('left', 0);
				$('html').removeClass('navi-open');

				$flag = false;
			} else {
				$(this).addClass('open');
				$('html').addClass('navi-open');
				$navi.css('left', 0)
				$naviInner.css('left',  -$('body').scrollLeft());

				$flag = true;
			}
		});
	}

	ui.subMenu = function () {
		if ($('#main').length) return false;
		ui.matchmedia({
			matchDesktop : function () {
				return false;
			},
			matchMobile : function () {
				var $subMenu 	  = $('#page-location');

				if ($subMenu.length > 0) {
					var $subMenuInner = $('#page-location .page-location-inner');
					var $menuLi		  = $('#page-location .page-location-inner .page-list li');
					var $current 	  = $('#page-location .page-location-inner .page-list li.on');

					var menuWidth     = $subMenuInner.outerWidth();
					var viewportWidth = $subMenuInner.width();
					var viewportLeft  = $subMenuInner.scrollLeft();
					var viewportRight = viewportLeft + viewportWidth;

					var currentLeft  = $current.position().left + viewportLeft;
					var currentRight = currentLeft + $current.width();

					var totalWidth	  = 0;

					$menuLi.each(function (idx, obj) {
						totalWidth = totalWidth + $(obj).width();
					});

					if (menuWidth > totalWidth) {
						$subMenu.addClass('center');
					}



					if (!$('#page-location .page-location-inner').hasClass('center')) {
						if (currentLeft - 50 < viewportLeft) {
							$subMenuInner.animate({ 'scrollLeft': currentLeft - 100 }, 0);
						}

						if (currentRight + 50 > viewportRight) {
							$subMenuInner.animate({ 'scrollLeft': currentRight - viewportWidth + 100 }, 0);
						}
					}
				}
			}
		});
	}

	ui.enterCheck = function(){
		if(event.keyCode === 13){
			$('#gnb > li:first-child > a').focus();
			return;
		}
	}

	ui.fullPage = function(){
		ui.matchmedia({
			matchDesktop : function () {
				$('#main').fullpage({
					scrollingSpeed: 400,
					scrollOverflow: true,
					verticalCentered: true,
					anchors: ['INTRO', 'BIO', 'CHEMICAL', 'LOCATIONS', 'SERVICE'],
					menu: '#main-menu',
					afterLoad: function (index, nextIndex, direction) {
						if ($('.fp-section.active')) {
							$(this).find('.inner').addClass('motion');
                            $(".page_inner").addClass('motion');
                            
						}
						if(nextIndex == 1){
							$('#main-menu').css('right', '0px');
						} else {
							$('#main-menu').css('right', '0');
						}
					},
					onLeave: function(index, nextIndex, direction){
						if ($('.fp-section.active')) {
							$(this).find('.inner').removeClass('motion');
                            $(".page_inner").removeClass('motion');
						}
						if(nextIndex == 1){
							$('#main-menu').css('right', '0px');
						} else {
							$('#main-menu').css('right', '0');
						}
					}
				});

				$('#main').addClass('pc-mode');
			},
			matchMobile : function () {
				if($('#main').hasClass('pc-mode')) {
					$('#main').removeClass('pc-mode').fullpage.destroy('all');
				}

				var $winHeight  = $(window).height();
				var $mainSec    = $('#main > .section');

				$mainSec.each(function (idx, obj) {
					obj.t = $(obj).offset().top;
					obj.p = obj.t + $winHeight / 10;
					obj.child = $(obj).children('.inner');

					$(window).on('load scroll', function () {
						var $winScrollT = $(window).scrollTop();

						if ($winScrollT + $winHeight > obj.p) {
							$(obj.child).addClass('motion');
						} else if ($winScrollT + $winHeight < obj.p) {
							$(obj.child).removeClass('motion');

							if ($winScrollT == 0) {
								$(obj.child).removeClass('motion');
							}
						}
					})
				});
			}
		});
	}

	ui.loadmotion = (function(_){
		return {
			init : function(){
				var f = this;
				_.$motion.each(function(idx, obj){
					obj.t = $(obj).offset().top;
					obj.h = $(obj).outerHeight() / 10;
					obj.p = obj.t + obj.h;
					obj.e = 'load.lmotion'+idx+' scroll.lmotion'+idx;

					$(window).on(obj.e, function(){
						f.scroll(obj);
					});

                    if(_.winscrlT + _.winsizeH > obj.p){ // 로드 됬을때 바로 적용
                        $(obj).addClass('n-active');
                        $(window).off(obj.e);
                    }
				});
			},
			scroll : function(obj){
				if(_.winscrlT + _.winsizeH > obj.p){
					$(obj).addClass('n-active');
					$(window).off(obj.e);
				}
			}
		}
	})(ui);

	ui.matchmedia = function (settings) {
        var defaults = {
            matchDesktop : function () {},
            matchMobile : function () {}
        };
        var opt = $.extend({}, defaults, settings);
        var media = window.matchMedia('(max-width: 750px)');

        function matchesAction (paramse) {
            if (!paramse.matches) {
                opt.matchDesktop();
            } else {
                opt.matchMobile();
            }
        }

        if (matchMedia) {
            matchesAction(media);
            media.addListener(function (parameter) {
                matchesAction(parameter);
            });
        }
	}

	ui.hoverAction = function(navi, cont){
		var _ = ui;

		function action(tab, idx){
			tab.def.$navi.eq(idx).addClass('on').siblings().removeClass('on');
			tab.def.$cont.eq(idx).addClass('on').siblings().removeClass('on');

			tab.def.idx = idx;
		}

		var hoverAction = (function(){
			return {
				def : {
					idx : 0,
					$navi : $(navi).children(),
					$cont : $(cont).children()
				},
				init : function(){
					var _this = this;

					_this.def.$navi.on('mouseenter focusin', function(){
						action(_this, $(this).index());
					});

					return _this;
				}
			};
		})();

		return hoverAction.init();
	}

	ui.tabAction = function(navi, cont){
		var _ = ui;

		function action(tab, idx){
			tab.def.$navi.eq(idx).addClass('on').siblings().removeClass('on');
			tab.def.$cont.eq(idx).addClass('on').siblings().removeClass('on');
			tab.def.offsetTop = tab.def.$navi.offset().top;

			tab.def.idx = idx;
		}

		var tabAction = (function(){
			return {
				def : {
					idx : 0,
					$navi : $(navi).children(),
					$cont : $(cont).children()
				},
				init : function(){
					var _this = this;

					_this.def.$navi.on('click', function(){
						action(_this, $(this).index());
					});

					return _this;
				}
			};
		})();

		return tabAction.init();
	}

	ui.tabActionByTarget = function(target, onTarget, disTarget){
		var seq = (target != '' && target.length > 0) ? target.split('-')[1]*1-1 : 0;

		$(onTarget).removeClass('on');
		$(onTarget).eq(seq).addClass('on');
		$(disTarget).hide();
		$(disTarget).eq(seq).show();

		/*
		$('.language-utils.language-li a').eq(0).attr('href', location.pathname+target);
		$('.language-utils.language-li a').eq(1).attr('href', '/eng'+location.pathname+target);
		$('.m-language-utils.language-li a').eq(0).attr('href', location.pathname+target);
		$('.m-language-utils.language-li a').eq(1).attr('href', '/eng'+location.pathname+target);
		*/
	}

	ui.foldAction = function(navi, cont){
		var _ = ui;

		function action(tab, idx){
			tab.def.$navi.eq(idx).addClass('on').siblings().removeClass('on');
			tab.def.$cont.eq(idx).addClass('on').siblings().removeClass('on');

			tab.def.idx = idx;
		}

		var foldAction = (function(){
			return {
				def : {
					idx : 0,
					$navi : $(navi).children(),
					$cont : $(cont).children()
				},
				init : function(){
					var _this = this;

					ui.matchmedia({
						matchDesktop : function () {
							_this.def.$navi.off('mouseenter focusin').on('mouseenter focusin', function(){
								action(_this, $(this).index());
							});
						},
						matchMobile : function () {
							_this.def.$navi.off('click').on('click', function(){
								action(_this, $(this).index());
							});
						}
					});

					return _this;
				}
			};
		})();

		return foldAction.init();
	}

	ui.onlyScroll = function(target) {
		$(target).on('DOMMouseScroll mousewheel', function(e) {
			var $this 		 = 	$(this);
			var	scrollTop 	 = 	this.scrollTop;
			var	scrollHeight =	this.scrollHeight;
			var	height 		 =	$this.innerHeight();
			var	delta		 =	e.originalEvent.wheelDelta;
			var	up 			 =  delta > 0;
			var prevent = function() {
				e.stopPropagation();
				e.preventDefault();
				e.returnValue = false;
				return false;
			}

			if (!up && -delta > scrollHeight - height - scrollTop) {
				scrollHeight++;
				$this.scrollTop(scrollHeight);
				return prevent();
			} else if (up && delta > scrollTop) {
				$this.scrollTop(0);
				return prevent();
			}
            
                console.log($(window).scrollTop());
		});
	}

    ui.folderList = function(target){
        // ui.folderList('.oooo');
        var _trg = $(target).find('.tbox');

        _trg.on('click', function () {
            $(this).parent('li').toggleClass('on');
            $(this).parent('li').siblings('li').removeClass('on');
        });
	}

    ui.customSelect = function(){
		$('.custom-select').each(function(i){
			var self		      = this;
				self.$outer		  = $(self).find('.custom-scroll-outer');
				self.$input		  = $(self).find('.custom-input');
				self.$viewer	  = $(self).closest('.cols').find('.custom-viewer');
				self.$option	  = $(self).find('.custom-scroll ul li button');

				self.$inputH	  = $(self).find('.custom-input').outerHeight();
				self.$listH		  = $(self).find('.custom-scroll ul').outerHeight();

				self.activeHeight = self.$listH;

				self.$outer.css('top', self.$inputH);

			var dim	= $('<div class="dim"></div>');

			function open(){
				closeAll();

				//console.log(self.activeHeight + "!!");

				self.$outer.stop().animate({
					'height' : self.activeHeight,
					'opacity' : 1,
				}, 200);

				$(self).addClass('on');

				$(self).append(dim);

				$('.dim, #header').on('click', function () {
					close();
				})
			}

			function close(){
				self.$outer.stop().animate({
					'height' : 0,
					'opacity' : 0
				}, 200);

				$(self).removeClass('on');
				$(dim).remove();
			}

			self.$input.off('click').on('click', function () {
				$(self).hasClass('on') ?  close() : open();
			});


			function closeAll(){
				$('.custom-select').removeClass('on');
				$('.custom-select .custom-scroll-outer').stop().animate({
					'height' : 0,
					'opacity' : 0
				}, 200);
			}

			self.$option.off('click').on('click', function(e){
				if ($(this).text() === '직접입력') {
					self.$input.text($(this).text());
					self.$viewer.attr("readonly", false);
					self.$viewer.val('').focus();
				} else {
					self.$input.text($(this).text());
					if (self.$viewer.length) {
						e.stopPropagation();
						self.$viewer.attr("readonly", true);
						self.$viewer.val($(this).text());
					}

					$('.custom-data.depth'+$(this).data('depth')).val($(this).data('val'));
				}

				close();
			});
		});
	}

	ui.familySite = (function(_) {
		return {
			init : function(){
				this.actions();
			},
			actions : function(){
				var defaults = {
					familyS		: $('.pc-family-menu'),
					familyList	: $('.pc-family-menu > ul'),
					familyBtn	: $('.pc-family-menu > a')
				}
				defaults.familyS.bind({
					"mouseenter , focusin" : function(){
						defaults.familyS.addClass("on");
						defaults.familyList.show();
					},
					"mouseleave" : function(){
						defaults.familyS.removeClass("on");
						defaults.familyList.hide();
					}
				});

				defaults.familyBtn.on({
					click : function(e){
						e.preventDefault();
					}
				});
			}
		}
	})(ui);

	ui.imgChange = function () {
	 	var $imgs  = $('img');

	 	ui.matchmedia({
	 		matchDesktop : function () {
	 			$imgs.each(function () {
	 				var $this 		= $(this);
	 				var pcSrc 		= $(this).data("pc");
					var mobileSrc	= $(this).data("mobile");

	 				if(typeof pcSrc !== "undefined") $this.attr('src', pcSrc);
	 			});
			 },

	 		matchMobile : function () {
	 			$imgs.each(function () {
	 				var $this 		= $(this);
	 				var pcSrc 		= $(this).data("pc");
	 				var mobileSrc	= $(this).data("mobile");

	 				if(typeof mobileSrc !== "undefined") $this.attr('src', mobileSrc);
	 			});
			 }

	 	});
	 }

	$(window).on({
		'load' : function(){
			ui.init.onLoad();
		},
		'resize' : function(){
			ui.init.onResize();
		},
		'scroll' : function(){
			ui.init.onScroll();
		}
	});
})(jQuery);
