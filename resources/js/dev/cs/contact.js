////////////////////////////////////////////////////////////////////////////////
////																		////
////////////////////////////////////////////////////////////////////////////////
'use strict';

(function (root, factory) {

	if (typeof define === 'function' && define.amd) {
		define(factory);
	}
	else if (typeof exports === 'object') {
		module.exports = factory();
	}
	else {
		root.creator = factory();
	}

}(this, function() {
	
	var actionConfig = {
		formAction: [
			{
				url: 'contactProc',
				target: '.btnSave',
				ask: '문의 하시겠습니까?',
				valid: function (event) {
					
					var email = $("#email").val();
					var emailTest = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
					var sms = $("#sms").val();
					var smsTest = /^\d{3}\d{3,4}\d{4}$/;
					
					if (NDev.Valid.checkEssential('subject')) {
						$('#subject').focus();
						return false;
					}
					
					if (NDev.Valid.checkEssential('name')) {
						$('#name').focus();
						return false;
					}
					if (NDev.Valid.checkEssential('sms')) {
						$('#sms').focus();
						return false;
					}
					
					if(smsTest.test(sms) == false){
			            alert("휴대폰 번호가 올바르지 않습니다.");
			        	$('#sms').focus();
			            return false;
				    }
					
					
					if (NDev.Valid.checkEssential('email')) {
						$('#email').focus();
						return false;
					}
					
					if(emailTest.test(email) == false){
			            alert("이메일 형식이 올바르지 않습니다.");
			        	$('#email').focus();
			            return false;
				    }
					
					if($(".contents").val().trim() == '' || $(".contents").val().trim() == null){
						alert("내용을 입력 해주세요.");
						$('.contents').focus();
						return false;
					}
					
					if ($("input:checkbox[class='chk-qna']").is(":checked") == false) {
						alert('개인정보 수집 및 이용 동의를 체크해 주세요.');
						return false;
					}	
					return true;
				}
			
			},	
			
		],
		
		popupAction: [			
		]
	};

	
	if('undefined' === typeof window.NDev) {
		NDev = window.NDev = {};	//Newriber Development script
		NDev.Data = {};
	}

	var Data = NDev.Data = {
		init: function () {
			NDev.Action.set(actionConfig);
			Data.dataType();
			Data.ui();
			Data.korCheck();
			Data.numCheck();
			NDev.VaildationUtil.onlyNumber();
			
		},
		numCheck: function(){	
			$("#sms").keyup(function(){
				var text   = $(this).val();
				var ChkText= /^[0-9]*$/;
				
					if(ChkText.test(text)==false){
		                $(this).val('');
		                return;
		          }
			})
			
		},
		korCheck: function(){	
			$("#email").keyup(function(){
				var text   = $(this).val();
				var ChkText=/^([a-zA-Z0-9@.]{1,50})$/;
				
					if(ChkText.test(text)==false){
		              $(this).val($(this).val().replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' )
		            )
		            return;
		          }
			})
			
		},

		dataType : function(){
			$(".qna_type1").off('click').on('click', function(event){
				
				var qna_type1 = $(this).data('val');
				$("#qna_type1").val(qna_type1);
				
				NDev.Util.post('/cs/contact_list', $("#fAction").serialize(), 'html').done(function(html) {
					$(".tbl-write").html(html);					
				}).fail(function() { alert(arguments[1]); });
				
			});
		},
		
		ui : function(){
			ui.tabAction('.inquiry-type ul', '.write-cont');
		}
	};
}));