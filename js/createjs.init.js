/*
 *	initial createjs
 * 	2016.10
 *	Ray
 * 	296773006@qq.com
 */
var initCjs = (function(w,cjs){
	var def = {
		"scaleMode":"exactFit",//适配模式:exactFit | fixedWidth | noScale | showAll
		"frameRate":60,
		"autoRender":true,
		"autoLoad":true,
		"useLoad":true,
		"loadType":0,//0代表div显示加载，1代表使用canvas绘制loading
		"useSound":true,//是否使用soundjs
		"width":640,//设计图宽高
		"height":1014,
		"url":"images/",
		'localUrl':"images/",//本地路径
		"debug":false,
		"id":'',
		"xhr":true,//图片是否跨域
		"preload":[],
		"bgColor":"#fff",
		"callback":false,
		'onProgress':false,
		'onComplete':false
	}
	var stage,
		canvas,
		W = window,
		D = document,
		SCREEN_W = W.innerWidth,
		SCREEN_H = W.innerHeight,
		DPR = W.devicePixelRatio || 1,
		CANS_W = SCREEN_W*DPR,
		CANS_H = SCREEN_H*DPR,
		SCALE_X = 1,
		SCALE_Y = 1;
	function init(opts){
		//重设参数
		if(typeof opts == 'object'){
			for(var key in opts){
				def[key] = opts[key];
			}
		}
		//拼接完整资源路径
		def.preload.map(function(item,index){
			var _reg = /\.mp3$/;
			if(typeof item == 'object'){
				var _path = _reg.test(def.preload[index].src) ? def.localUrl : def.url;
				def.preload[index].src = _path + item.src;
			}else{
				var _path = _reg.test(def.preload[index]) ? def.localUrl : def.url;
				def.preload[index] = _path + item;
			}
		});
		//创建舞台和设定样式
		if(!def.id){
			var div = D.createElement("div"),
				body = D.getElementsByTagName("body")[0],
				head = D.getElementsByTagName("head")[0],
				style = D.createElement("style");
			style.innerHTML = "html,body{height:100%}.canvas-wrap{position:relative;width:100%;height:100%;left:0;top:0;}.canvas-wrap canvas{width:100%;height:100%;}";
			div.className = "canvas-wrap";
			canvas = D.createElement("canvas");
			canvas.id = "canvas";
			head.appendChild(style);
			div.appendChild(canvas);
			body.appendChild(div);
		}else{
			if(!D.getElementById(def.id)){
				console.warn("id指定错误,请确认id值是否正确。");
				return false;
			}else{
				canvas = D.getElementById(def.id);
				canvas.setAttribute("style","width: 100%;height: 100%;");
			}
		}
		//适配模式
//		var canvas1 = document.getElementById("canvas1");
		canvas.width = CANS_W;
		canvas.height = CANS_H;
//		canvas1.width = CANS_W;
//		canvas1.height = CANS_H;
		stage = new cjs.Stage(canvas);
		this.stage = stage;
		this.width = def.width;
		this.height = def.height;
		SCALE_X = CANS_W/def.width;
		SCALE_Y = CANS_H/def.height;
		this.scaleX = SCALE_X;
		this.scaleY = SCALE_Y;
		var _scaleX = SCALE_X,
			_scaleY = SCALE_Y;
		switch (def.scaleMode){
			case 'fixedWidth':
				_scaleY = SCALE_X;
				break;
			case 'showAll':
				if(def.width/def.height > SCREEN_W/SCREEN_H){
					_scaleX = SCALE_Y;
				}else{
					_scaleY = SCALE_X;
				}
				break;
			case 'exactFit':
			default:
				break;
		}
		stage.scaleX = _scaleX;
		stage.scaleY = _scaleY;
		//渲染帧率
		function _autoRun(){
			stage.update();
		}
		cjs.Ticker.timingMode = cjs.Ticker.RAF_SYNCHED;
		cjs.Ticker.framerate = def.frameRate;
		this.startTick = function(){
			cjs.Ticker.addEventListener('tick',_autoRun);
		}
		this.stopTick = function(){
			cjs.Ticker.removeEventListener('tick',_autoRun);
		}
		//是否自动渲染
		if(def.autoRender){
			this.startTick();
		}
		//加载队列
		if(def.useLoad){
			var queue = new cjs.LoadQueue(!def.xhr);
			this.loader = queue;
			//是否加载soundjs
			if(def.useSound){
				queue.installPlugin(cjs.Sound);
			}
		}
		//资源加载
		this.loading = function(){
			if(def.useLoad){
				queue.on("progress", function(){
					(def.onProgress && typeof def.onProgress == 'function') && def.onProgress(queue.progress);
				},this);
				queue.on("complete", function(){
					(def.onComplete && typeof def.onComplete == 'function') && def.onComplete(queue.progress);
					return true;
				},this);
				queue.loadManifest(def.preload);
			}
		}
		//是否自动加载
		if(def.autoLoad){
			this.loading();
		}
	}
	return init;
})(window,createjs);


/*common function*/
//此函数用于弹出提示。str参数为要提示的文本，可修改
function showMsg(str){
	window.msgTimer && clearTimeout(msgTimer);
	var txt = $(".alert-txt");
	txt.hide();
	txt.text(str);
	txt.css({
		display:"block",
		opacity:1
	});
	window.msgTimer = setTimeout(function(){
		txt.fadeOut();
	},1300);
}