////////////////////////////////////////////////////////////////////////////////
////																		////
////////////////////////////////////////////////////////////////////////////////
"use strict";

(function(root, factory) {

	if(typeof define === "function" && define.amd) {
		define(factory);
	}
	else if(typeof exports === "object") {
		module.exports = factory();
	}
	else {
		root.creator = factory();
	}

} (this, function () {

	if("undefined" === typeof window.NDev) {
		NDev = window.NDev = {};	//Newriber Development script

		NDev.Action = {};
		NDev.setting = {};
	}

	var Action = NDev.Action = {
		set: function (option) {
			NDev.setting = option;

			NDev.Action.init();
		},

		init: function () {
			if (NDev.Util.isNull(NDev.setting)) {
				return;
			}

			if (!NDev.Util.isNull(NDev.setting.formAction)) {
				NDev.Action.initForm(NDev.setting.formAction);
			}

			if (!NDev.Util.isNull(NDev.setting.popupAction)) {
				NDev.Action.initPopup(NDev.setting.popupAction);
            }

            $('#pagination a').each(function () {
                var _this = $(this);

                _this.off('click').on('click', function () {
                	if (!NDev.Util.isNull(_this.data('page'))) {
                		$('input[name="currentPage"]').val(_this.data('page'));
                		$('#fAction').attr('action', NDev.setting.listAction);
                		$('#fAction').submit();
                	}
                });
            });
          },


		applyEditor: function () {
			if ($(".editor").length > 0) {
				$(".editor").each(function () {
					$(this.id).text(CKEDITOR.instances[this.id].getData());
				});
			}
		},

        initForm: function (fAction) {
            var _length = fAction.length;

            for (var i = 0; i < _length; i++) {
                var obj = fAction[i];

                NDev.Action.bindForm(obj.url, obj.target, obj.msg, obj.ask, obj.valid);
            }
        },

        initPopup: function (popupAction) {
            var _length = popupAction.length;

            for (var i = 0; i < _length; i++) {
                var obj = popupAction[i];

                NDev.Action.bindPopup(obj.url, obj.target, obj.msg, obj.ask, obj.name, obj.option, obj.valid);
            }
        },

		bindForm: function (url, target, msg, ask, valid) {
			if ('' == NDev.Util.nvlString(url)) {
				return;
			}

			if ('' == NDev.Util.nvlString(target)) {
				return;
            }

			$(target).off('click').on('click', function (event) {
                var _flag = true;

				if (!NDev.Util.isNull(valid) && typeof valid === 'function') {
					_flag = valid(event);
                }

                if (!_flag) {
                    return _flag;
                }

				if ('' !=  NDev.Util.nvlString(msg)) {
					alert(msg);
				}

				if ('' !=  NDev.Util.nvlString(ask)) {
					if (confirm(ask)) {
						$('#fAction').attr('target', '_self');
						$('#fAction').attr('action', url);
						$('#fAction').submit();
					}
				}
				else {
					$('#fAction').attr('target', '_self');
					$('#fAction').attr('action', url);
					$('#fAction').submit();
				}
			});
		},

		bindPopup: function (url, target, msg, ask, name, option, valid) {
			if ('' == NDev.Util.nvlString(url)) {
				return;
			}

			if ('' == NDev.Util.nvlString(target)) {
				return;
			}

			$(target).off('click').on('click', function (event) {
                var _flag = true;

				if (!NDev.Util.isNull(valid) && typeof valid === 'function') {
					_flag = valid(event);
				}

                if (!_flag) {
                    return _flag;
                }

				if ('' !=  NDev.Util.nvlString(msg)) {
					alert(msg);
				}

				if ('' !=  NDev.Util.nvlString(ask)) {
					if (confirm(ask)) {
                        window.open('', name, option);
                        $('#fAction').attr('target', name);
						$('#fAction').attr('action', url);
						$('#fAction').submit();
						
						$('#fAction').attr('target', '_self');
					}
				}
				else {
                    window.open('', name, option);
					$('#fAction').attr('target', name);
					$('#fAction').attr('action', url);
					$('#fAction').submit();
					
					$('#fAction').attr('target', '_self');
				}
			});
		},
		
		bindImage: function (target) {			
			$(target).each(function () {
				NDev.ImageUtil.init(this);
            });
		},
		
		loadingLayer: function(){
			$("#loader-wrapper").css("display", "block");
			
			var per = 1;
		    var LOADING_INTERVAL = setInterval(function() {
		    	
		    	if($.cookie("fileDownloadToken") != null)		    	
			    	NDev.Util.get('/common/progress', 'json').done(function(now) {
			    		
						if(now>=100){
							$(".c100").addClass("p100");
							$(".c100 span").html("100%");	
							
							$.removeCookie('fileDownloadToken', { path: '/' });
							clearInterval(LOADING_INTERVAL);						
							setTimeout(function(){
								$("#loader-wrapper").css("display", "none");
							}, 100)						
						}
						else{
							$(".c100").removeClass("p"+per);
							
							$(".c100 span").html(now + "%");
							$(".c100").addClass("p"+now);
							
							per = now;
						}
					}).fail(function() { 
						$(".c100").addClass("p100");
						$(".c100 span").html("100%");	
						
						$.removeCookie('fileDownloadToken', { path: '/' });
						clearInterval(LOADING_INTERVAL);						
						setTimeout(function(){
							$("#loader-wrapper").css("display", "none");
						}, 100)	
					});
		    	
		    }, 100);
		}
	};

}));

