<?php
error_reporting(E_ALL & E_NOTICE);
ini_set('default_charset', "utf-8");
//常量赋值
define('LOG_DIR', './logs/');
$action_name = 'index';
$cookie_name_openid = md5('openid_12');

//包含文件
include_once('./common.php');
$openid = cookie($cookie_name_openid);
if (empty($openid)) {
	$openid = $_GET["FromOpenid"];
	if (empty($openid)) {
		Header("Location: http://dicoswxapi.jie-xian.com/wxapi/oa/wx_oauth.php?redirect_uri=http%3A%2F%2F$_SERVER[HTTP_HOST]%2Findex.php&scope=1");
		die;
	}
	cookie($cookie_name_openid,$openid);
}
if (date("H")>=17&&date("H")<18) {
	$todayflag = 'true';
}else{
	$todayflag = 'false';
}
//----------签名串--------
$timeStamp = time();
$signStr = "$action_name$openid$timeStamp";
$count_tags = array(
		'action_name' => $action_name, // 页面
		'openid' => $openid, // 用户ID
		'timeStamp' => $timeStamp, // 调用接口时的时间戳
		'sign' => sha1($signStr), // 签名sign
);
$count_tags = json_encode($count_tags);
//-------------分享配置-----------
require_once "./jssdk.class.php";
$jssdk = new JSSDK();
$signPackage = $jssdk->getSignPackage();
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no" />
		<!-- UC强制全屏 -->
		<meta name="full-screen" content="yes">
		<!-- QQ强制全屏 -->
		<meta name="x5-fullscreen" content="true">
		<!-- IOS全屏 -->
		<meta name="apple-touch-fullscreen" content="yes">
		<!-- 设置苹果工具栏颜色 -->
		<meta name="apple-mobile-web-app-status-bar-style" content="black" />
		<!-- 忽略页面中的数字识别为电话，忽略email识别 -->
		<meta name="format-detection" content="telephone=no, email=no" />
		<!-- uc强制竖屏 -->
		<meta name="screen-orientation" content="portrait">
		<!-- QQ强制竖屏 -->
		<meta name="x5-orientation" content="portrait">
		<title>馋我就来约，网红陪你过圣诞</title>
		<link rel="stylesheet" type="text/css" href="css/main.css?v=1.2"/>
		<script>
			var countInit = <?php echo $count_tags; ?>;
			var todayFlag = <?php echo $todayflag; ?>;
			var today = <?php echo date("d"); ?>;
			var canvas1, stage1, exportRoot,hasDone = false;
			
			function init() {
				createjs.MotionGuidePlugin.install();
			
				canvas1 = document.getElementById("canvas1");
				images = images||{};
			
				var loader = new createjs.LoadQueue(false);
				loader.addEventListener("fileload", handleFileLoad);
				loader.addEventListener("complete", function(){
					hasDone = true;
				});
				loader.loadManifest(lib.properties.manifest);
			}
			
			function handleFileLoad(evt) {
				if (evt.item.type == "image") { images[evt.item.id] = evt.result; }
			}
			
			function handleComplete(evt) {
				exportRoot = new lib.index();
			
				stage1 = new createjs.Stage(canvas1);
				stage1.addChild(exportRoot);
				stage1.update();
			
				createjs.Ticker.setFPS(lib.properties.fps);
				createjs.Ticker.addEventListener("tick", stage1);
			}
		</script>
	</head>
	<body>
		<!--loading-->
		<div class="loading">
			<div class="loader">
				<div class="loader-inner pacman">
					<div></div><div></div>
					<div></div><div></div><div></div>
				</div>
			</div>
			<p class="progress"><span id="progress">0</span><span>%</span></p>
		</div>
		
		<!--canvas-->
		<div class="canvas-wrap">
			<canvas id="canvas"></canvas>
			<canvas id="canvas1" width="750" height="1334"></canvas>
			<!--1-->
			<div class="btn-start"></div>
			<div class="show-rule animated pulse infinite">
				<img src="images/index_txt.png" alt="" />
			</div>
			<!--2-->
			<ul class="canvas-girls hide canvas2-items">
				<li>
					<img src="images/girl1_small.png"/>
					<div class="btn_video_add"></div>
				</li>
				<li>
					<img src="images/girl2_small.png"/>
					<div class="btn_video_add"></div>
				</li>
				<li>
					<img src="images/girl3_small.png"/>
					<div class="btn_video_add"></div>
				</li>
			</ul>
			<div class="btn-date hide  canvas2-items">
				<img src="images/btn_date.png"/>
			</div>
			<ul class="date-txt hide  canvas2-items">
				<li class="date-txt-1 hide"><img src="images/txt_get1.png" alt="" /></li>
				<li class="date-txt-2 hide"><img src="images/txt_get2.png" alt="" /></li>
				<li class="date-txt-3 hide"><img src="images/txt_get3.png" alt="" /></li>
				<li class="date-txt-fail hide"><img src="images/txt_fail.png" alt="" /></li>
				<li class="date-txt-show hide"><img src="images/txt_show.png" alt="" /></li>
			</ul>
			<div class="time-wrap hide">倒计时<span id="count-time">3</span>S</div>
			<div class="btn-card2 canvas2-items hide">
				<img src="images/btn_card.png"/>
			</div>
			<div class="btn-rule2 canvas2-items hide">
				<img src="images/btn_rule2.png"/>
			</div>
		</div>
		
		<!--rule-->
		<div class="rule hide wrap">
			<div class="rule-inner">
				<ul>
					<li><img src="images/rule1.jpg"/></li>
					<li class="hide"><img src="images/rule2.jpg" alt="" /></li>
					<li class="hide last-rule"><img src="images/rule3.jpg" alt="" /></li>
				</ul>
				<img class="hide rule-img" src="images/rule.png"/>
				<div class="btn-rule hide"></div>
			</div>
		</div>
		
		<!--rule2-->
		<div class="rule2 hide wrap">
			<div class="rule-inner">
				<img src="images/rule.png"/>
				<div class="btn-rule-hide"></div>
			</div>
		</div>
		
		<!--coupon-->
		<div class="coupon hide wrap">
			<div class="coupon-inner">
				<div class="coupon-head">
					<img src="images/coupon_head.png"/>
				</div>
				<div class="coupon-middle">
					<img src="images/coupon_middle.png"/>
					<div class="middle-girl">
						<img class="hide" src="images/girl1.png"/>
						<img class="hide" src="images/girl2.png"/>
						<img class="hide" src="images/girl3.png"/>
					</div>
				</div>
				<div class="coupon-img">
					<img class="hide" src="images/9off.png"/>
					<img class="hide" src="images/8.5off.png"/>
					<img class="hide" src="images/8off.png"/>
				</div>
				<div class="coupon-txt">
					<img src="images/coupon_txt.png"/>
				</div>
				<div class="coupon-btns">
					<div class="btn-cards"></div>
					<div class="btn-share"></div>
				</div>
			</div>
		</div>
		
		<!--cards-->
		<div class="cards hide wrap">
			<div class="cards-inner">
				<ul>
					<li class="">
						<img src="images/9off.png"/>
					</li>
					<li class="">
						<img src="images/8.5off.png"/>
					</li>
					<li class="">
						<img src="images/8off.png"/>
					</li>
				</ul>
				<div class="btn-back"></div>
			</div>
		</div>
		
		<!--video-->
		<div class="video wrap hide">
			<div class="video-inner">
				<div class="video-box">
					<div class="video-box-inner">
						<!--<iframe src="http://www.meipai.com/media/618116102" width="250" height="280"></iframe>-->
						<video id="video" width="280" height="320" webkit-playsinline preload="auto">
							<source src="http://cdn.1.wechat.sh.cn/1210_1.mp4" type="video/mp4"></source>
						</video>
						<div id="poster" class="poster1">
							<img src="images/video_play.png"/>
						</div>
					</div>
				</div>
				<div class="video-btns">
					<div class="btn-get"></div>
					<div class="btn-back"></div>
				</div>
			</div>
		</div>
		
		<!--online-->
		<div class="online wrap hide">
			<div class="online-box">
				<!--<iframe src="http://m.yizhibo.com/l/Fm6zNL4CNT9iW-s2.html?memberid=XQOo_aaxREfZdKyp&from=singlemessage&isappinstalled=1" width="100%" height="100%"></iframe>-->
			</div>
			<div class="btn-back-video">
				<img src="images/btn_back.png"/>
			</div>
		</div>
		<!--alert words-->
		<div class="alert-txt hide">弹出提示信息！</div>
		
		<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
		<script src="js/zepto.min.js"></script>
		<script src="js/easeljs-0.8.1.min.js" ></script>
		<script src="js/tweenjs-0.6.1.min.js"></script>
		<script src="js/movieclip-0.8.1.min.js"></script>
		<script src="js/preloadjs-0.6.1.min.js"></script>
		<script src="js/soundjs-0.6.1.min.js"></script>
		<script src="js/createjs.init.js"></script>
		<script src="js/music-2.0.js"></script>
		<script src="js/request.js"></script>
		<script src="js/index.js?v=1.1"></script>
		<script src="js/game.js?v=1.1"></script>
		<script src="js/main.js?v=1.2"></script>
	</body>
</html>

<script>
	//微信config 参数
	var $wx_appId = "<?php echo $signPackage['appId'];?>";
	var $timestamp = "<?php echo $signPackage['timestamp'];?>";
	var $nonceStr = "<?php echo $signPackage['nonceStr'];?>";
	var $signature = "<?php echo $signPackage['signature'];?>";
	//微信分享参数
	var $wx_app_title = '约馋网红 陪你过圣诞'; // 好友title
	var $wx_app_desc = '今天圣诞不一样，网红陪你一起过'; // 好友内容
	var $wx_time_title = '今天圣诞不一样，网红陪你一起过';
	var $wx_qq_title = '约馋网红 陪你过圣诞'; // QQ title
	var $wx_qq_desc = '今天圣诞不一样，网红陪你一起过'; // QQ

	var $link = '<?php echo "http://$_SERVER[HTTP_HOST]/index.php";?>';
	var $imgUrl = '<?php echo "http://$_SERVER[HTTP_HOST]/images/share.jpg";?>';

	wx.config({
			appId: $wx_appId,
			timestamp: $timestamp,
			nonceStr: $nonceStr,
			signature: $signature,
			jsApiList: [
				// 所有要调用的 API 都要加到这个列表中
				'checkJsApi',
				'onMenuShareTimeline',
				'onMenuShareAppMessage',
				'onMenuShareQQ',
				'onMenuShareWeibo',
				'hideMenuItems',
				'showMenuItems',
				'hideAllNonBaseMenuItem',
				'showAllNonBaseMenuItem',
				'translateVoice',
				'startRecord',
				'stopRecord',
				'onRecordEnd',
				'playVoice',
				'pauseVoice',
				'stopVoice',
				'uploadVoice',
				'downloadVoice',
				'chooseImage',
				'previewImage',
				'uploadImage',
				'downloadImage',
				'getNetworkType',
				'openLocation',
				'getLocation',
				'hideOptionMenu',
				'showOptionMenu',
				'closeWindow',
				'scanQRCode',
				'chooseWXPay',
				'openProductSpecificView',
				'addCard',
				'chooseCard',
				'openCard'
			]
		});

		wx.ready(function() {
			wx.onMenuShareAppMessage({
					title: $wx_app_title,
					desc: $wx_app_desc,
					link: $link,
					imgUrl: $imgUrl,
					trigger: function (res) {
						
					},
					success: function (res) {

					},
					cancel: function (res) {

					},
					fail: function (res) {

					}
			 });
			
			 wx.onMenuShareTimeline({
					title: $wx_time_title, 
					link: $link, 
					imgUrl: $imgUrl, 
					trigger: function (res) {

					},
					success: function (res) {

					},
					cancel: function (res) {

					},
					fail: function (res) {

					}
				});
			 
	
			 wx.onMenuShareQQ({
					title: $wx_qq_title,
					desc: $wx_qq_desc,
					link: $link,
					imgUrl: $imgUrl,
					trigger: function (res) {
						
					},
					success: function (res) {

					},
					cancel: function (res) {

					},
					fail: function (res) {

					}
			});
	});
</script>
<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?79425f0b65726ad22c336580cb480ca0";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();
</script>