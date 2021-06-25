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

		NDev.Util = {};				//공통 유틸 메서드
		NDev.JsonUtil = {};			//json 관련 메서드
		NDev.FormUtil = {};			//양식 관련 유틸. 분석후 수정 필요
		NDev.EditorUtil = {};		//에디터 관련 유틸. 네이버 스마트 에디터 기준. 에디터 변경시 수정 필요.
		NDev.VaildationUtil = {};	//데이터 체크 유틸. 현재 양식 관련 유틸에도 데이터 체크 메서드가 산재되어 있음. 같이 확인 필요.
		NDev.Valid = {};
		NDev.Zipcode = {};
	}

	/**
	 * 기본적인 기능 정리
	 */
	var Util = NDev.Util = {
			
		/**
		 * #PURE
		 * null 체크
		 * @param  {Object}	value
		 * @return {Boolean}
		 */
		isNull			: function(value) {
			return (value != null && value != undefined && value != "" && value != "null") ? false : true;
		},

		/**
		 * #PURE
		 * 문자열 null 체크
		 * @return {String}
		 */
		nvlString		: function() {
			var parameters = arguments;

			switch(parameters.length) {

				case 1	:

					var value = parameters[parameters.length - 1];

					return (!Util.isNull(value)) ? value : "";

					break;

				case 2	:

					var value		= parameters[parameters.length - 2],
						repairValue	= parameters[parameters.length - 1];

					return (!Util.isNull(value)) ? value : repairValue;

					break;

				default	:
					console.log("NOT FOUNDev ARGUMENTS");

			}
		},

		/**
		 * #PURE
		 * 숫자 null 체크
		 * @return {Number}
		 */
		nvlNumber		: function() {
			var parameters = arguments;

			switch(parameters.length) {

				case 1	:

					var value = parameters[parameters.length - 1];

					return (!Util.isNull(value)) ? value : 0;

					break;

				case 2	:

					var value		= parameters[parameters.length - 2],
						repairValue	= parameters[parameters.length - 1];

					return (!Util.isNull(value)) ? value : repairValue;

					break;

				default	:
					console.log("NOT FOUNDev ARGUMENTS");

			}
		},

		href			: function(path) {
			location.href = path;
		},

		hrefPost		: function(path, names, values) {
			var form	= $("<form></form>", { "method" : "post", "action" : path });

			for(var i = 0; i < names.length; i++) {
				form.append($("<input>", { "type" : "hidden", "name" : names[i], "value" : values[i] }));
			}

			form.appendTo("body");

			form.submit();
		},

		ajaxBefore		: function() {
			$("#page_loader_wrap").removeClass("load");
		},

		ajaxAfter		: function() {
			$("#page_loader_wrap").addClass("load");
		},

		/**
		 * #PURE
		 * 넘어온 value 에 세 자리마다 콤마를 찍어서 반환
		 * @param  {?}	  value
		 * @return {String}
		 */
		comma			: function(value) {
			var source		= value.toString().replace(/,/g,''),
				length		= source.length,
				returnValue	= source.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			
			return returnValue;
		},
		
		commaInit		: function(obj) {
			
			$(obj).on("click", function(){
				var value = $(this).val();
				$(this).val(value.toString().replace(/,/g,''));
			});
				
			$(obj).on("blur", function(){
				var value 		= $(this).val();
				var source		= value.toString().replace(/,/g,'');
				var returnValue	= source.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				$(this).val(returnValue);
			});
		},

		checkByte		: function(value) {
			var byte = 0;

			for (var i = 0; i < value.length; i++) {

				var char = escape(value.charAt(i));

				if(char.length == 1) {
					byte ++;
				}
				else if (char.indexOf("%u") != -1) {
					byte += 2;
				}
				else if (char.indexOf("%") != -1) {
					byte ++;
				}
			}

			return byte;
		},

		/**
		 * #JQUERY
		 * 비동기 통신 post
		 * @param {String} uri
		 * @param {json}   data
		 * @param {String} dataType
		 */
		post			: function(uri, data, dataType) {
			var promise	= $.Deferred();

			$.post(uri, data, function(result) { promise.resolve(result); }, dataType);

			return promise;
		},

		/**
		 * #JQUERY
		 * 비동기 통신 get
		 * @param {String} uri
		 * @param {json}   data
		 * @param {String} dataType
		 */
		get				: function(uri, data, dataType) {
			var promise	= $.Deferred();

			$.get(uri, data, function(result) { promise.resolve(result); }, dataType);

			return promise;
		},
		
		download: function(rnm, snm){
			location.href='/download?rnm=' + encodeURIComponent(rnm) + '&snm=' + encodeURIComponent(snm);
		},
		
		downloadByType: function(rnm, snm, typ){
			location.href='/download?rnm=' + encodeURIComponent(rnm) + '&snm=' + encodeURIComponent(snm) + '&typ='+typ;
		},
		
		imgview: function(id){			
			
			var img = new Image(); 
			img.src = $(id).attr('src');
			
			var w = img.width; 
			var h = img.height;			
			var o = "width="+w+",height="+h+",scrollbars=yes";
			var imgWin = window.open("","",o); 
			
			imgWin.document.write("<html><head><title>:*:*:*: 이미지상세보기 :*:*:*:*:*:*:</title></head>");
			imgWin.document.write("<body topmargin=0 leftmargin=0>");
			imgWin.document.write("<img src="+img.src+" onclick='self.close()' style='cursor:pointer;' title ='클릭하시면 창이 닫힙니다.'>");
			imgWin.document.close();
		},
		
		randomstr: function(string_length) {
			var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";			
			var randomstring = '';
			for (var i=0; i<string_length; i++) {
				var rnum = Math.floor(Math.random() * chars.length);
				randomstring += chars.substring(rnum,rnum+1);
			}
			return randomstring;
		},
		
		checkPassword: function(password, id){
		    
		    if(!/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/.test(password)){            
		        alert('숫자+영문자+특수문자 조합으로 8자리 이상 사용해야 합니다.');
		        $('#pwd').val('').focus();
		        return false;
		    }    
		    var checkNumber = password.search(/[0-9]/g);
		    var checkEnglish = password.search(/[a-z]/ig);
		    if(checkNumber <0 || checkEnglish <0){
		        alert("숫자와 영문자를 혼용하여야 합니다.");
		        $('#pwd').val('').focus();
		        return false;
		    }
		    if(/(\w)\1\1\1/.test(password)){
		        alert('같은 문자를 4번 이상 사용하실 수 없습니다.');
		        $('#pwd').val('').focus();
		        return false;
		    }
		        
		    if(password.search(id) > -1){
		        alert("비밀번호에 아이디가 포함되었습니다.");
		        $('#pwd').val('').focus();
		        return false;
		    }
		    
		    return true;
		},
		
		syscodeListByUpcode: function(upcode){
			var promise	= $.Deferred();
			
			Util.post('/system/upcodeAjax', {'upcode' : upcode }, 'json').done(function(data) {				
				promise.resolve(data);				
			}).fail(function() { alert(arguments[1]); });
			
			return promise;
		}			
	};

	/**
	 * Json 관련 기능 정리
	 */
	var JsonUtil = NDev.JsonUtil = {

		/**
		 * Json 트리 구조로 변환
		 * @param  {Array}	arrayList
		 * @param  {String}	inheritValue
		 * @param  {String}	uniqueName
		 * @param  {String}	inheritName
		 * @return {Array}
		 */
		jsonTree	: function(arrayList, inheritValue, uniqueName, inheritName) {
			var result		= [],
				transfer	= function(nodes, item, index) {
					if(nodes instanceof Array) {
						return nodes.some(function(node) {

							if(eval("node." + uniqueName) === eval("item." + inheritName)) {

								node.children	= node.children || [];

								return node.children.push(arrayList.splice(index, 1)[0]);

							}

							return transfer(node.children, item, index);

						});
					}
				};

			while(arrayList.length > 0) {
				arrayList.some(function(item, index) {
					return (eval("item." + inheritName) == inheritValue) ? result.push(arrayList.splice(index, 1)[0]) : transfer(result, item, index);
				});
			}

			return result;
		},

		/**
		 * Json 트리구조 노드 검색
		 * @param  {Array}	data
		 * @param  {String}	searchValue
		 * @param  {String}	uniqueName
		 * @return {Json}
		 */
		getNode		: function(data, searchValue, uniqueName) {
			var result;

			for(var i = 0, node; node = data[i]; i++) {

				if(eval("data[i]." + uniqueName) == searchValue) {
					return node;
				}
				else if(node.children) {
					result	= JsonUtil.getNode(node.children, searchValue, uniqueName) || result;
				}

			}

			return result;
		}

	};

	/**
	 * 폼 데이터에 관련된 기능 정의
	 * naver smart editor 사용코드.
	 * editor 변경시 수정 필요
	 * 클래스 명, 요소 등 확인 또는 수정 필요
	 */
	var FormUtil = NDev.FormUtil = {
		valid: function() {
			var chk = true;

			$('.err').hide();

			$('input, select, textarea').each(function() {
				var req = $(this).attr("req");
				var tit = $(this).attr("title")
				var typ = $(this).attr("type");
				var msg = $(this).attr("msg");
				var val = $.trim($(this).val());
				var nod = $(this).prop('nodeName');
				var ckd = $(this).attr("checked");
				var enm	= $(this).attr("name");

				msg = (msg == "" || msg == null || msg == undefined) ? "" : msg;

				if (req != null && nod != "" && val === "" && nod != "TEXTAREA") {
					var th = $(this);

					if(nod === "INPUT" && (typ === "text" || typ === "password")) {
						msg = (msg != "" && msg != null && msg != undefined) ? msg : "["+tit+"] 항목을 입력해주세요.";
					} else if(nod === "SELECT") {
						msg = (msg != "" && msg != null && msg != undefined) ? msg : "["+tit+"] 항목을 선택해주세요.";
					}

					alert(msg);
					th.focus();

					if('' != enm) {
						$('.err_' + enm).show();
					}

					chk = false;
					return false;

				}
				else if (req != null && nod === "INPUT" && typ === "radio") {
					var rdchk = false;

					$(".chkrdo").each(function () {
						if($(this).attr("checked") != null) {
							rdchk = true;
							return false;
						}
					});

					if (!rdchk) {
						msg = (msg != "" && msg != null && msg != undefined) ? msg : "["+tit+"] 항목을 선택해주세요.";
						alert(msg);
						$(this).focus();
						chk = false;
						return false;
					}

				}
				else if (typ === "number") {
					var step = $(this).attr("step") == undefined ? 0 : $(this).attr("step");

					if(step > 0 && $(this).val() % step > 0) {
						var value	= $(this).val(),
							rest	= value % step,
							result	= value - rest;

						$(this).val(result);
					}

				}
				else if (req != null && nod === "TEXTAREA") {
					if (val == "") {
						msg = (msg != "" && msg != null && msg != undefined) ? msg : "["+tit+"] 항목을 입력해주세요.";

						alert(msg);
						$(this).focus();
						chk = false;
						return false;
					}
				}
			});

			return chk;
		},

		/**
		 * 폼 데이터 전송
		 * @param  {String} form
		 * @param  {String} url
		 * @return
		 */
		submit			: function(form, url) {
			var frm	= $("#" + form);

			if(url != "") {
				frm.attr("action", url);
			}

			frm.submit();
		}
	};

	/**
	 * editor 추가 기능 정의
	 * 다른 editor 를 사용하거나
	 * 해당 부분이 제거되면 FormUtil 수정 필요.
	 */
	var EditorUtil = NDev.EditorUtil = {
		applyContent	: function(contentId) {
			$("#" + contentId).text(CKEDITOR.instances[contentId].getData());
		},

		inputContent	: function(contentId, html) {
			CKEDITOR.instances[contentId].insertHtml(html);
		}
	};
	
	var FileUtil = NDev.FileUtil = {
			
			init	: function(obj, extArray){
				var $file_obj 	= $(obj);
				
				$file_obj.on('change', function () {
					if($(this).val()!=''){
						var ext 		= $(this).val().split('.').pop().toLowerCase();
						var limit		= $(this).data('max');				
						var maxSize		= 1024 * 1024 * Number(limit);
						var fileSize	= $(this).get(0).files[0].size;
						
						if($.inArray(ext, extArray) == -1) {
							var t = extArray.toString();
							alert(t + " 파일만 업로드 해주세요.")
							$(this).val('');
							return;
						}
						
						if(fileSize > maxSize){
							alert("파일용량 "+limit+"MB를 초과했습니다.");
							$(this).val('');
							return;
						}
					}
				});			
			}
		};
	
	var ImageUtil = NDev.ImageUtil = {
			
		init	: function(obj){
			var $obj 		= $(obj);			
			var limit		= $obj.data('cnt');
			
			var $filename	= $obj.parent().siblings('.file-name');
			var $imgbox		= $obj.parent().siblings('.file-imgbox');			
			var $file_obj	= $obj.children('input:file');			
			
			var imgViewFlag = NDev.ImageUtil.checkImgView();
			
			if (imgViewFlag) {
				$filename.css('display', 'none');
				$file_obj.on('change', function () {
					var _this = $(this);
					var _file = _this.get(0).files[0];
					var	_reader = new FileReader();

					if (_this.val() != '') {
						var extend = _this.val().split('.').pop().toLowerCase();

						if ($.inArray(extend ,['gif', 'jpg', 'jpeg', 'png']) == -1) {
							alert('gif, jpg, jpeg, png 파일만 업로드 해주세요.');
							_this.val('');
							return;
						}

						_reader.onload = function (event) {
							var img = new Image();
							img.src = event.target.result;
							
							if ($imgbox.children('div').length < Number(limit)) {
								$imgbox.append('<div class="imgs"><img src="' + img.src + '" alt=""><a href="javascript:;" class="del-trg" onClick="NDev.ImageUtil.delImg(this);">삭제</a></div>');
							} else {
								alert("이미지업로드는 총 " + limit + "개까지 가능합니다.");
							}
						};
						_reader.readAsDataURL(_file);

						return false;
					}
				});				
			} else {
				$filename.css('display', 'block');
				$file_obj.on('change', function () {
					if ($filename.children('div').length < Number(limit)) {
						$filename.append('<div class="names"><span>' + $(this).val() + '</span><a href="javascript:;" class="del-trg" onClick="NDev.ImageUtil.delImg(this);">삭제</a></div>');
					} else {
						alert("이미지업로드는 총 " + limit + "개까지 가능합니다.");
					}
				});
			}
		},
		
		checkImgView	: function(){
			var word;
			var version = "N/A";
			var agent = navigator.userAgent.toLowerCase();
			var name = navigator.appName;
			if (name == "Microsoft Internet Explorer") word = "msie ";
			var reg = new RegExp( word + "([0-9]{1,})(\\.{0,}[0-9]{0,1})" );
			
			if (reg.exec( agent ) != null) {				
				version = RegExp.$1 + RegExp.$2;
				if (version < 10) {
					return false; 
				}
				else {
					return true;
				}
			}
			
			return true;
		},
		
		delImg : function (_trg) {
			if ($(_trg).parent('.imgs').length == 1) $(_trg).parent('.imgs').remove();
			if ($(_trg).parent('.names').length == 1) $(_trg).parent('.names').remove();
		}
	}

	/**
	 * FormUtil 안에 있는 양식 체크에 적용되지 않는
	 * 데이터 체크 메서드 기능 정의
	 */
	var VaildationUtil = NDev.VaildationUtil = {

		checkList		: function() {
			$(".chk-m").unbind("click").bind("click", function() {
				
				var $chk = $(this).parents("table.list_tb").find(".chk-c");
				
				$chk.prop("checked", $(this).prop("checked"));

				if($(this).attr("checked") != "checked") {
					$(this).attr("checked", "checked");
					$chk.attr("checked", "checked");
				} else {
					$(this).removeAttr("checked");
					$chk.removeAttr("checked");
				}
			});

			$(".chk-c").unbind("click").bind("click", function() {
				
				var $chk    = $(this).parents("table.list_tb").find(".chk-m");
				var total	= $(this).parents("table.list_tb").find(".chk-c").length;
				var checked	= $(this).parents("table.list_tb").find(".chk-c:checked").length;

				if($(this).attr("checked") != "checked") {
					$(this).attr("checked", "checked");
				} else {
					$(this).removeAttr("checked");
				}

				$chk.prop("checked", (total == checked));
			});
		},

		limitChecked	: function(limit) {
			var checkLength    = $(this).parents("table.list_tb").find(".chk-l:checked").length;
			$(".chk-l").bind("change", function() {
				if(checkLength > limit) {
					alert("최대 " + limit + "개까지 선택할 수 있습니다.");
					$(this).prop("checked", false);
				}
			});
		},

		isChecked		: function(flag) {
			var total	= flag ? $(".chk-c").length : $(".chk-c[data-required=true]").length;
			var checked	= flag ? $(".chk-c:checked").length : $(".chk-c[data-required=true]:checked").length;

			return (total == checked);
		},

		stringChecked	: function(type) {
			var result	= "";

			$(".chk-" + type + ":checked").each(function() {
				result	+= (result == "") ? $(this).val() : "," + $(this).val();
			});

			return result;
		},

		emailDomain		: function(selectorInput, selectorSelect) {
			$(selectorSelect).bind("change", function() {
				if($(this).val() != "") {
					$(selectorInput).prop("readonly", true);
					$(selectorInput).val($(this).val());
				}
				else {
					$(selectorInput).prop("readonly", false);
					$(selectorInput).val($(this).val());
				}
			});
		},

		checkRegular	: function(value, regular) {
			return regular.test(value);
		},

		onlyNumber		: function() {
			$("input[onlynumber = 'true']").each(function() {
				$(this).unbind("keyup").bind("keyup", function(event) {
					var value = NDev.Util.nvlNumber($(this).val().replace(/[^0-9]/gi, ""));

					value = parseInt(value);

					if(value == 0) {
						value = '';
					}

					$(this).val(value);
				});
			});
		},

		strValid : function() {
			//$(".korCheck").on("mouseover focusin focusout keyup keydown", function() {
			/*
			 * kor 국문
			 * eng 영문
			 * num 숫자
			 * spe 특수문자
			 * */

			$(".strValid").on("focusout keyup keydown", function(e) {
				var chk = false;
				var rule = $(this).data("rule");

				if(rule.indexOf("kor") > -1) $(this).val($(this).val().replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, ''));

				if(rule.indexOf("eng") > -1) $(this).val($(this).val().replace(/[a-zA-Z]/g, ''));

				if(rule.indexOf("num") > -1) $(this).val($(this).val().replace(/[0-9]/g, ''));

				if(rule.indexOf("spe") > -1) $(this).val($(this).val().replace(/[\W]/gi, ''));

				//참고로 한글 이외의 키보드에 있는 영문, 숫자, 특수문자, space는 쓰고 싶다면,
				///[^A-Za-z0-9_\`\~\!\@\#\$\%\^\&\*\(\)\-\=\+\\\{\}\[\]\'\"\;\:\<\,\>\.\?\/\s]/gm;
			});
		},
		
		

	};

	var Valid = NDev.Valid = {
		checkEssential: function (id) {
			var str = $('#' + id).val();
			var alt = $('#' + id).attr('alt');

			if ($.trim(str) == '') {
				alert(alt + '을(를) 입력 해주세요.');
				return true;
			}
		},

		checkBlank: function (id) {
			var str = $('#' + id).val();
			var alt = $('#' + id).attr('alt');

			if ($.trim(str).length != str.length) {
				alert(alt + '에 빈칸이 포함되어 있습니다.');
				return true;
			}
		},

		checkLength: function (id1, id2, min, max) {
			var str1 = $('#'+id1+'').val();
			var alt1 = $('#'+id1+'').attr('alt');
			var alt2 = $('#'+id2+'').attr('alt');
			var str2 = '';
			var alt = '';

			if ('' != id2) {
				str2 = $('#' + id2).val();
				alt = alt1 + '와(과) ' + alt2;
			}
			else {
				alt = alt1;
			}

			if ('' != min && min > str1.length + str2.length) {
				alert(alt+'은(는) 최소 '+min+'자를 입력하셔야 합니다.');				
				return true;
			}

			if ('' != max && max < str1.length + str2.length) {				
				alert(alt + '의 입력길이를 초과하였습니다.\n최대 ' + max + '자 입니다.');
				return true;
			}
		},
		
		onlyNumber: function (id) {
			var str = $('#'+id+'').val();
			var alt = $('#'+id+'').attr('alt');
			var pattern=/^[0-9]+$/;
			
			if(''!=str&&!pattern.test(str)){
				alert(alt+'에 숫자만 입력해주세요.');
				return true;
			}
		},

		onlyNumberEng: function (id) {
			var str = $('#' + id).val();
			var alt = $('#' + id).attr('alt');
			var pattern = /^[a-zA-Z0-9]+$/;

			if ('' != str && !pattern.test(str)) {
				alert(alt + '에 숫자와 영문자만 입력하세요.');
				return true;
			}
		},

		checkKorean: function (id) {
			var str = $('#' + id).val();
			var alt = $('#' + id).attr('alt');

			for (var i = 0; i < str.length; i++) {
				if (128 < str.charCodeAt(i)) {
					alert(alt + '에 한글을 입력하였습니다.');
					return true;
				}
			}
		},

		chgPrice: function (obj) {
			var price = obj.value.replace(',', '');

			while (price.indexOf(',') > 0) {
				price = price.replace(',', '');
			}

			var pattern = /^[0-9]+$/;

			if (pattern.test(price)) {
				obj.value = price;
			}
			else {
				obj.value = 0;
			}
		},

		number_format: function (f) {
			var len;
			var str = '' + f;
			var str1 = '';

			str = str.replace(/,/g, '');
			len = str.length;

			if (len > 3) {
				for (var i = 0; len - i - 3 > 0; i += 3) {
					str1 = "," + str.substring(len - 3 - i, len - i) + str1;
				}

				str1 = str.substring(0, len - i) + str1;
				f = str1;
			}

			return f;
		},

		checkNumber: function (obj) {
			NDev.Valid.chgPrice(obj);
			obj.select();
		},

		checkNumber2: function (obj) {
			var pattern = /^[0-9]+$/;

			if (pattern.test(obj.value)) {
				obj.value =	NDev.Valid.number_format(parseInt(obj.value));
			}
			else {
				alert('숫자만 입력해주세요.');
				obj.value = 0;
				obj.focus();
			}
		},

		parseNumber: function (num) {
			num = new String(num);
			num = NDev.Valid.remove(num, ',');

			if (num.length==0 || isNaN(num)) {
				return 0;
			}

			return Number(num);
		},

		remove: function (str, gubun) {
			return str.split(gubun).join('');
		},

		_ID: function (obj) {
			return document.getElementById(obj);
		},

		allChk: function (all, name) {
			var checks = document.getElementsByName(name);
			var val = true;

			if (all.checked == false) {
				val = false;
			}

			for (var i = 0; i < checks.length ; i++) {
				checks[i].checked = val;
			}
		},

		goPage: function (no) {
			document.frmSearch.currentPage.value = no;
			document.frmSearch.submit();
		},

		goSubPage: function (no){
			document.frmSearch.currentSubPage.value = no;
			document.frmSearch.submit();
		},

		copySEQ: function (seq) {
			window.clipboardData.setData('text', seq);
			alert('번호를 클립보드에 복사했습니다.');
		},

		/**
		 * chkForm(form)
		 *
		 * 입력박스의 null 유무 체크와 패턴 체크
		 *
		 * @Usage	<form onSubmit="return chkForm(this)">
		 */

		chkForm: function (form) {

			var reschk = 0;

			for (i = 0; i < form.elements.length; i++) {
				currEl = form.elements[i];

				if (currEl.disabled) {
					continue;
				}

				if (currEl.getAttribute('required') != null) {
					if (currEl.type=='checkbox' || currEl.type=='radio') {
						if (!NDev.Valid.chkSelect(form, currEl, currEl.getAttribute('msgR'))) {
							return false;
						}
					}
					else {
						if (!NDev.Valid.chkText(currEl,currEl.value,currEl.getAttribute('msgR'))) {
							return false;
						}
					}
				}

				if (currEl.getAttribute('label')=='주민등록번호'  && currEl.getAttribute('name') == 'resno[]' && currEl.value.length > 0) {
					reschk = 1;
				}

				if (currEl.getAttribute('option')!=null && currEl.value.length>0){
					if (!chkPatten(currEl,currEl.getAttribute('option'),currEl.getAttribute('msgO'))) {
						return false;
					}
				}

				if (currEl.getAttribute('minlength')!=null){
					if (!chkLength(currEl,currEl.getAttribute('minlength'))) {
						return false;
					}
				}
			}

			if (form.password2) {
				if (form.password.value!=form.password2.value) {
					alert('비밀번호가 일치하지 않습니다.');
					form.password.value = '';
					form.password2.value = '';
					return false;
				}
			}

			if (reschk && !NDev.Valid.chkResno(form)) {
				return false;
			}

			if ((form.nickname) && (form.nickname != "undefined")) {
				if (form.nickname.value.length > 1 && form.chk_nickname.value.length == 0) {
					alert("닉네임 중복을 체크 하셔야 합니다");
					return false ;
				}
			}

			if (form.chkSpamKey) {
				form.chkSpamKey.value = 1;
			}

			if (document.getElementById('avoidDbl')) {
				document.getElementById('avoidDbl').innerHTML = '--- 데이타 입력중입니다 ---';
			}

			return true;
		},

		chkLength: function (field, len) {
			text = field.value;

			if ($.trim(text.length) < len) {
				alert(len + '자 이상 입력하셔야 합니다');
				field.focus();
				return false;
			}

			return true;
		},

		chkText: function (field, text, msg) {
			text = $.trim(text);

			if (text == '') {
				var caption = field.parentNode.parentNode.firstChild.innerText;

				if (!field.getAttribute('label')) {
					field.setAttribute('label', (caption) ? caption : field.name);
				}

				if (!msg) {
					msg = '[' + field.getAttribute('label') + '] 필수입력사항';
				}

				alert(msg);

				if (field.tagName != 'SELECT') {
					field.value = '';
				}

				if (field.type!='hidden' && field.style.display!='none') {
					field.focus();
				}

				return false;
			}
			return true;
		},

		chkSelect: function (form, field, msg) {
			var ret = false;

			fieldname = eval('form.elements["' + field.name + '"]');

			if (fieldname.length) {
				for (j = 0; j < fieldname.length; j++) {
					if (fieldname[j].checked) {
						ret = true;
					}
				}
			}
			else {
				if (fieldname.checked) {
					ret = true;
				}
			}

			if (!ret) {
				if (!field.getAttribute('label')) {
					field.setAttribute(filed.name);
				}

				var msg2 = '[' + field.getAttribute('label') + '] 필수선택사항';

				if (msg) {
					msg2 += "\n\n" + msg;
				}

				alert(msg2);
				field.focus();

				return false;
			}

			return true;
		},

		chkPatten: function (field, patten, msg) {
			var regNum = /^[0-9]+$/;
			var regEmail = /^[^"'@]+@[._a-zA-Z0-9-]+\.[a-zA-Z]+$/;
			var regUrl = /^(http\:\/\/)*[.a-zA-Z0-9-]+\.[a-zA-Z]+$/;
			var regAlpha = /^[a-zA-Z]+$/;
			var regHangul = /[가-힣]/;
			var regHangulEng = /[가-힣a-zA-Z]/;
			var regHangulOnly = /^[가-힣]*$/;
			var regId = /^[a-zA-Z0-9]{1}[^"']{3,9}$/;
			var regPass = /^[a-zA-Z0-9_-]{4,12}$/;

			patten = eval(patten);

			if (!patten.test(field.value)) {
				var caption = field.parentNode.parentNode.firstChild.innerText;

				if (!field.getAttribute('label')) {
					field.setAttribute('label', (caption) ? caption : field.name);
				}

				var msg2 = '[' + field.getAttribute('label') + '] 입력형식오류';

				if (msg) {
					msg2 += '\n\n' + msg;
				}

				alert(msg2);
				field.focus();

				return false;
			}
			return true;
		},

		chkRadioSelect: function (form, field, val, msg) {
			var ret = false;

			fieldname = eval('form.elements["' + field + '"]');

			if (fieldname.length) {
				for (j=0;j<fieldname.length;j++) {
					if (fieldname[j].checked) {
						ret = fieldname[j].value;
					}
				}
			}
			else {
				if (fieldname.checked) {
					ret = true;
				}
			}

			if (val != ret) {
				alert(msg);
				return false;
			}

			return true;
		},

		formOnly: function (form) {
			var i,idx = 0;
			var rForm = document.getElementsByTagName('form');

			for (i = 0; i < rForm.length; i++) {
				if (rForm[i].name==form.name) {
					idx++;
				}
			}

			return (idx == 1) ? form : form[0];
		},

		chkResno: function (form) {
			var resno = form['resno[]'][0].value + form['resno[]'][1].value;

			fmt = /^\d{6}[1234]\d{6}$/;

			if (!fmt.test(resno)) {
				alert('잘못된 주민등록번호입니다.');
				return false;
			}

			birthYear = (resno.charAt(6) <= '2') ? '19' : '20';
			birthYear += resno.substr(0, 2);
			birthMonth = resno.substr(2, 2) - 1;
			birthDate = resno.substr(4, 2);
			birth = new Date(birthYear, birthMonth, birthDate);

			if (birth.getYear() % 100 != resno.substr(0, 2) || birth.getMonth() != birthMonth || birth.getDate() != birthDate) {
				alert('잘못된 주민등록번호입니다.');
				return false;
			}

			buf = new Array(13);

			for (i = 0; i < 13; i++) {
				buf[i] = parseInt(resno.charAt(i));
			}

			multipliers = [2,3,4,5,6,7,8,9,2,3,4,5];

			for (i = 0, sum = 0; i < 12; i++) {
				sum += (buf[i] *= multipliers[i]);
			}

			if ((11 - (sum % 11)) % 10 != buf[12]) {
				alert('잘못된 주민등록번호입니다.');
				return false;
			}
			return true;
		},

		formatDate: function (date) {
			var mymonth = date.getMonth() + 1;
			var myweekday = date.getDate();
			return (date.getFullYear() + "-" + ((mymonth < 10) ? "0" : "") + mymonth + "-" + ((myweekday < 10) ? "0" : "") + myweekday);
		},


		setInputDate: function (month, sdateObj, edateObj){

			if(month>0){
				var settingDate = new Date();
				$("#"+edateObj).val(NDev.Valid.formatDate(settingDate));
				settingDate.setMonth(settingDate.getMonth()-month);
				$("#"+sdateObj).val(NDev.Valid.formatDate(settingDate));
			}
			else{
				$("#"+sdateObj).val("");
				$("#"+edateObj).val("");
			}
		}
	};

	var Zipcode = NDev.Zipcode = {
		/**
		 * DAUM ZIPCODE
		 * <script src="http://dmaps.daum.net/map_js_init/postcode.v2.js"></script>
		 * <script src="https://ssl.daumcdn.net/dmaps/map_js_init/postcode.v2.js"></script>
		 */
		openDaum: function (_type) {
			new daum.Postcode({
				oncomplete: function (data) {
					console.log(data)
					if (_type == 1) {
						document.getElementById('zipcode').value = data.zonecode;
						
						$("#postcode1").val(data.postcode1);
						$("#postcode2").val(data.postcode2);
						
						if (data.userSelectedType == 'R') {
							document.getElementById('return_addr1_1').value = data.address;
						}
						else {
							document.getElementById('return_addr1_1').value = data.jibunAddress;
						}

						document.getElementById('return_addr2_1').focus();
					}
					else {
						
						$("#postcode1_3").val(data.postcode1);
						$("#postcode2_3").val(data.postcode2);
						
						document.getElementById('biz_zipcode').value = data.zonecode;

						if (data.userSelectedType == 'R') {
							document.getElementById('return_addr1_3').value = data.address;
						}
						else {
							document.getElementById('return_addr1_3').value = data.jibunAddress;
						}

						document.getElementById('return_addr2_3').focus();
					}
					/*else if(_type == 2) {
						document.getElementById('zipcode1_2').value = data.postcode1;
						document.getElementById('zipcode2_2').value = data.postcode2;
	
						if (data.userSelectedType == 'R') {
							document.getElementById('return_addr1_2').value = data.address;
						}
						else {
							document.getElementById('return_addr1_2').value = data.jibunAddress;
						}
	
						document.getElementById('return_addr2_2').focus();
					}*/
				}
			}).open();
		}
	};

}));

