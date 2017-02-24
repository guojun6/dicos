/*ready*/
$(function(){
	//阻止默认滑动
	$(".rule").on("touchmove",function(e){
		e.preventDefault();
	});
	
	//lesson
	$(".rule-inner >ul li").on("click",function(){
		$(this).hide();
		var index = $(this).index();
		if(index < 2){
			$(".rule-inner >ul li").eq(index + 1).show();
		}else{
			$(this).closest("ul").hide();
			$(".rule-img,.btn-rule").show();
		}
	})
	
	/*rule*/
	$(".btn-rule").on("click",function(){
		$(".rule").hide();
		$(".show-rule").hide();
		GAME.leaveIndex();
	});
	
	/*START*/
	$(".btn-start").on('click',function(){
		$(this).hide();
		$(".show-rule").hide();
		GAME.leaveIndex();
	})
	
	$(".show-rule").on("click",function(){
		$(".btn-start").hide();
		$(".rule").show();
	});
	
	/*cards*/
	$(".btn-back").on("click",function(){
		var _wrap = $(this).closest(".wrap");
		_wrap.hide();
		if(_wrap.hasClass("video")){
			if(!video.paused){
				video.pause();
			}
			GAME.secondCircle();
		}
		if(_wrap.hasClass("cards")){
			$(".coupon").hide();
			$(".video").hide();
			$(".video-box-inner > iframe").remove();
			GAME.secondCircle();
		}
	});
	
	
	//cards
	$(".btn-cards").on("click",function(){
		$(".cards").fadeIn();
	});
	var couponList = ["http://mp.weixin.qq.com/s?__biz=MjM5ODgwMDM2MA==&mid=509398673&idx=1&sn=8e7dfe82a2231d69a3497fe738353758&chksm=3d6d50160a1ad90058f069b464b670f1a89e55314861fa093cb6847ea2266ea819e2834e526f&mpshare=1&scene=1&srcid=1212mz1tMUyvkfQPAh7BO57z#rd","http://mp.weixin.qq.com/s?__biz=MjM5ODgwMDM2MA==&mid=509398675&idx=1&sn=e0f4a1f31a573319bd49c3583f8f147f&chksm=3d6d50140a1ad90271bba3e7e61c44278d9e85d3e1088007a87b28fc5ca44517b12013f7a924&mpshare=1&scene=1&srcid=1212zb38xnzBE1HCKNRWNzGM#rd","http://mp.weixin.qq.com/s?__biz=MjM5ODgwMDM2MA==&mid=509398677&idx=1&sn=9e642ec33d4d936d920fdf33a9048096&chksm=3d6d50120a1ad9042fc1f8ec10c193f78bcd824b5d6e2ede4815552298bf9498c77ccb40326a&mpshare=1&scene=1&srcid=1212kb84TqLOXUDf0SatfUei#rd"];
	$(".cards-inner > ul li").on("click",function(){
		if($(this).hasClass("active")){
			var _index = $(this).index();
			window.location.href = couponList[_index];
//			$(".middle-girl >img").hide().eq(_index).show();
//			$(".coupon-img >img").hide().eq(_index).show();
//			$(this).closest(".wrap").hide();
//			$(".coupon").fadeIn();
		}
	});
	
	//date
	$(".btn-date").on("click",function(){
		if(!hasClicked && !playShow){
			GAME.showHead(2000);
		}else{
			console.log("点击太频繁啦！");
		}
	});
	
	//video online
	var onlineArr =['http://cdn.1.wechat.sh.cn/1210_1.mp4','http://cdn.1.wechat.sh.cn/chongchong.mp4','http://m.yizhibo.com/l/zm71CTU1vEEibTj5.html?from=groupmessage&isappinstalled=0'];
	var onlineIndex = 0;
	if(todayFlag){
		switch (parseInt(today)){
			case 13:
				onlineIndex = 0;
				break;
			case 14:
				onlineIndex = 1;
				break;
			case 15:
				onlineIndex = 2;
				break;
			default:
				todayFlag = false;
			break;
		}
	}

	var onlineStr = '<iframe  src="' + onlineArr[onlineIndex] + '" width="100%" height="100%"></iframe>';
//	$(".online-box").append(onlineStr);
	$(".btn-back-video").on("click",function(){
		$(this).closest(".wrap").hide();
		$(".online iframe").remove();
//		$(".online-box").append(onlineStr);
	});
	
	//canvas btns
	$(".btn-card2").on("click",function(){
		$(".cards").show();
		GAME.stop();
	});
	$(".btn-rule2").on("click",function(){
		$(".rule2").show();
		GAME.stop();
	});
	$(".btn-rule-hide").on("click",function(){
		$(this).closest(".wrap").hide();
		GAME.secondCircle();
	});
	
	$(".canvas-girls >li").on("click",function(){
		if($(this).hasClass("active")){
			var index = $(this).index();
			//重设视频
			GAME.setVideo(index);
			$(".video").show();
			GAME.hidePlay();
		}
	})
	
	
	//get
	$(".btn-get").on("click",function(){
		if(!video.paused){
			video.pause();
		}
		$(".video").hide();
		$(".coupon").fadeIn();
	});
	
	
	//reset iframe
	var vBox = $(".video-box"),
		vIframe = $(".video-box-inner > video"),
		wh = $(window).height()*0.50674,
		ww = $(window).width()*0.66666,
		iw = vBox.css("width"),
		ih = vBox.css("height");

	//	alert(wh)
//	setTimeout(function(){
		vIframe.attr("width",parseInt(iw)*0.87);
		vIframe.attr("height",parseInt(wh)); 
//	},2000);

	var video = document.getElementById("video");
	$(".video-box-inner").on("click",function(){
		if(todayFlag){
			$(".online").show();
			$(".online-box").append(onlineStr);
			return false;
		}
		if(video.paused){
			video.play();
			$("#poster").hide();
		}else{
			video.pause();
			$("#poster").show();
		}
	});
	setInterval(function(){
		if(video.paused){
			$("#poster").show();
		}
	},200);
});


/*bgm*/
//wx.ready(function(){
	
	//初始化Music实例
	var music = new Music(),
		baseURL = "images/";
	
	//统一设置所有音频路径
	music.URL = baseURL;
	
	/*
	 *	创建背景音乐及按钮
	 */
	
	
	//方法二：
	music.bgMusic({
		top:"1rem",//String,绝对定位left值，默认2rem	
		right:"1rem"//String,绝对定位left值，默认2rem	
	});
//});