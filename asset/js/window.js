
document.write('<style type="text/css" tingyun="tingyunWindow">.tingyunWindow { display:none; position:fixed; width:700px; margin:0 auto; overflow:hidden; border-radius:6px; border:1px solid #999; box-shadow:0px 0px 35px #555; background:#fff; z-index:1000}.tingyunWindow .tyw-menu { padding:5px 10px; height:26px; line-height:28px; background:url(tingyun/img/tyw-theme1.gif) repeat-x 0 4px; border-bottom:1px solid #d1d1d1; cursor:move}.tingyunWindow .tyw-menu label { float:left; color:#555; font-weight:bold; cursor:move}.tingyunWindow .tyw-menu button { float:right; width:17px; height:17px; background:url(tingyun/img/tyw-theme1.gif) no-repeat 0px -118px; margin-top:6px; margin-left:10px; cursor:pointer; border:0px none}.tingyunWindow .tyw-menu button:hover { background:url(tingyun/img/tyw-theme1.gif) no-repeat 0px -148px;}.tingyunWindow .tyw-bottom { padding:6px 10px; text-align:right; border-top:1px solid #d1d1d1; overflow:hidden; background:#fbfbfb}.tingyunWindow .tyw-bottom input { height:28px; padding:0 20px; margin-left:10px; color:#555; border:1px solid #ccc; border-radius:4px; background:url(tingyun/img/tyw-theme1.gif) 0px -44px; cursor:pointer; font-weight:bold;transition:none;-webkit-transition:none}.tingyunWindow .tyw-bottom input:hover { background:url(tingyun/img/tyw-theme1.gif) 0px -82px;}.tingyunWindow .tyw-main { overflow:auto}.tingyunWindow .tyw-main iframe { float:left; width:100%; height:100%}.tingyunWindow-bg { display:none; position:fixed; top:0px; left:0px; width:100%; height:100%; background:#000; filter:alpha(opacity=0); opacity:0; z-index:999}</style>');

window.tingyunWindow = function(config){
	var $this = this;
	this.config = $.extend({
		'title' : '信息框',
		'type' : 'html',	//html(输出html 直接传入HTML字符串) , url(iframe 打开链接) , copyTag(复制对象 追加), copyHtml(复制对象html 追加), moveTag(移动对象 追加)
		'display' : '',
		'padding' : '10px',
		'width' : 700,
		'height' : 0,
		'show-bottom' : true,
		'theme' : '',
		'style' : '',
		'themelink' : ''
	},config);
	this.style = {};
	
	//载入
	this.load = function(){
		this.loadWindowTag();
		this.reloadMainContent();
		
		this.reloadWindowSize();
		this.reloadSystemWindowSize();
		this.reloadWindowCenter();
		this.bindEvent();
	};
	
	//加载窗口标签
	this.loadWindowTag = function(){
		this.window = $('<div class="tingyunWindow"></div>')
			.css('width', this.config.width+"px");
		
		//标题菜单区域
		this.windowTitle = $('<label>'+this.config.title+'</label>');
		this.windowButtonClose = $('<button class="tyw-close"></button>');
		this.windowMenu  = $('<div class="tyw-menu"></div>')
			.append(this.windowTitle)
			.append(this.windowButtonClose.bind("click", function(){
				$this.hide();
			}));
		
		//内容区域
		this.windowMain = $('<div class="tyw-main"></div>');
		this.windowMain
			.css('padding', this.config.padding)
			.css('height', this.config.height==0?'auto':this.config.height+"px");
		
		//显示底部操作
		if(this.config['show-bottom']){
			//按钮组
			this.windowButtonTag = $('<div class="tyw-bottom"></div>');
			this.windowButtonOk  = $('<input type="button" value="'+(this.config.okLable?this.config.okLable:'确认')+'" class="tyw-btn-ok"/>');
			this.windowButtonCl  = $('<input type="button" value="取消" class="tyw-btn-cl"/>');
			this.windowButtonTag
				.append(this.windowButtonOk.bind("click", function(e){
					$this.config.ok($this);
				}))
				.append(this.windowButtonCl.bind("click", function(e){
					if($this.config.cancle) $this.config.cancle($this);
					$this.hide();
				}));
		}
		
		//底部背景
		this.windowBg = $('<div class="tingyunWindow-bg"></div>');
		
		this.window
			.append(this.windowMenu)
			.append(this.windowMain)
			.append(this.windowButtonTag);
		
		$(document.body)
			.append(this.window)
			.append(this.windowBg
				.bind("click", function(){
					$this.hide();
				})
			);
		
		//存在自定义样式
		if(this.config['theme']){
			this.window.addClass(this.config['theme']);
			if(this.config['style']){
				$('style[tingyun="tingyunWindow"]').append(this.config['style']);
			}
			if(this.config['themelink']){
				$('<link rel="stylesheet" type="text/css" href="'+this.config['themelink']+'">').appendTo('head');
				
			}
		}
	};
	
	//重新载入窗口
	this.reloadWindow = function(){
		this.windowTitle.html(this.config.title);
	};
	
	//重新载入窗口显示内容
	this.reloadMainContent = function(){
		switch(this.config.type){
			//HTML - 直接输出HTML
			case 'html' : 
				this.windowMain.html(this.config.display);
			; break;
			
			//iframe 打开链接
			case 'url' : 
				this.windowIframe = $('<iframe src="'+this.config.display+'" name="windowframe" scrolling="auto" frameborder="0"></iframe>');
				this.windowMain.html(this.windowIframe);
			; break;
			
			//复制对象 追加
			case 'copyTag' : 
				this.windowMain.html(this.config.display.clone());
			; break;
			
			//复制对象html 追加
			case 'copyHtml' : 
				this.windowMain.html(this.config.display.html());
			; break;
			
			//移动对象 到显示
			case 'moveTag' : 
				this.windowMain.html(this.config.display);
			; break;
		}
	};
	
	//绑定事件
	this.bindEvent = function(){
		this.windowMenu.bind("mousedown", function(e){
			$this.ismove = true;
			$this.pageX = e.pageX;
			$this.pageY = e.pageY;
			$this.tmp = $this.window.offset();
			$this.windowLeft = $this.tmp.left;
			$this.windowTop  = $this.tmp.top - $(window).scrollTop();
		});
		this.window.bind("mouseup", function(){
			$this.ismove = false;
		});
		$(document).bind("mousemove", function(event){
			if($this.ismove){
				if (event.preventDefault) {
					event.preventDefault();
				} else {
					event.returnValue = false;
				}
				var left = $this.windowLeft + (event.pageX-$this.pageX);
				var top  = $this.windowTop  + (event.pageY-$this.pageY);
				/*
				if(left + $this.style.width > $this.windowWidth){
					left = $this.windowWidth - $this.style.width;
				}
				if(top + $this.style.height > $this.windowHeight){
					top = $this.windowHeight - $this.style.height;
				}
				if(left<=0) left=0;
				if(top <=0) top=0;
				*/
				$this.window.css({"left":left+"px", "top":top+"px"});
			}
		});
		$(window).resize(function(){
			$this.reloadSystemWindowSize();
			$this.reloadWindowSize();
	//		$this.reloadWindowView();
		});
	};
	
	//显示窗口
	this.show = function(){
		if(this.config.reload) {
			this.config = $.extend(this.config, this.reloadConfig);
			this.reloadWindow();
			this.reloadMainContent();
			this.window.css('width', this.config.width+"px");
			this.windowMain
				.css('padding', this.config.padding)
				.css('height', this.config.height==0?'auto':this.config.height+"px");
			this.reloadWindowSize();
			this.reloadWindowCenter();
		}
		this.windowBg.animate({opacity:0.3}).show();
		this.window.fadeIn(200);
	};
	
	//隐藏窗口
	this.hide = function(){
		this.windowBg.animate({opacity:0},200,'swing',function(){$(this).hide()});
		this.window.hide();
	};
	
	//重新载入窗体大小
	this.reloadWindowSize = function(){
		this.style.width  = this.window.width()+2;
		this.style.height = this.window.height()+2;
	};
	
	//重新载入window大小
	this.reloadSystemWindowSize = function(){
		this.windowWidth  = $(window).width();
		this.windowHeight = $(window).height();
	};
	
	//窗体居中显示
	this.reloadWindowCenter = function(){
		var left = (this.windowWidth - this.style.width)/2,
			top  = (this.windowHeight - this.style.height)/2;
		if(left<0) left=0;
		if(top<0) top=0;
		this.window.css({"left":left+"px", "top":top+"px"});
	};
	
	//重新载入窗体位置
	this.reloadWindowView = function(){
		this.tmp = this.window.offset();
		this.windowLeft = this.tmp.left;
		this.windowTop  = this.tmp.top;
		if(this.windowLeft + this.style.width > this.windowWidth){
			var left = this.windowWidth-this.style.width;
			this.window.css("left",(left<=0?0:left)+"px");
		}
		if(this.windowTop + this.style.height > this.windowHeight){
			var top = this.windowHeight-this.style.height;
			this.window.css("top", (top<=0?0:top)+"px");
		}
	};
	
	this.load();
}
window.tingyunWindows = {
	get : function(key, config){
		if(!window.__tingyunWindows) window.__tingyunWindows = {};
		if(window.__tingyunWindows[key]) {
			var win = window.__tingyunWindows[key];
			if(config && config.reload) {
				win.reloadConfig = config;
			}
			return win;
		}
		return window.__tingyunWindows[key] = new tingyunWindow(config);
	}
};
