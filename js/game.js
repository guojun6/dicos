
//GAME
var _URL = 'images/';
var NUM = 0;//卡包数量cards
var dateArr = [];
var girlArr = [2,15,27],
	girlIndex = 0,
	cardLen = 80,
	ballLen = 49,
	CHANCE = 10,//剩余机会times
	OVER = false,
	hasClicked = false,
	playShow = false,
	CLICK = 0,//已约次数dates
	STOP = true;
	
//	获取数据
REQUEST.check(function(msg){
	var code = parseInt(msg.code);
	if(code == 1){
		var cards = parseInt(msg.cards);
		var dates = parseInt(msg.dates);
		var times = parseInt(msg.times);
		NUM = cards <= 3 ? parseInt(cards) :3;
		CHANCE = times < 10 ? 10 -  times : 0;
		CLICK = dates < 5 ? parseInt(dates) : 5;
	}else{
		showMsg("获取失败!");
		NUM = 0;
		CHANCE = 0;
		CLICK = 5;
	}
});
	
var GAME = (function(g,cjs){
	var CVS,
		SW,SH,//宽高
		stage,
		INDEX,
		SECOND,
		loader;
	var TW_sidelight,
		TW_box1,TW_box2,
		TW_indexTxt,
		TW_middle;
	var indexTimer,
		secondTimer;
	var head1,head2,head3,headArr = [];
	var PLAY,WRONG,CARDS,BALLS;
	g.init = function(){
		CVS = document.getElementById('canvas');
		//common settings
		stage = INIT.stage;
		loader = INIT.loader;
		SW = INIT.width;
		SH = INIT.height;
		
		INDEX = new cjs.Container();
		SECOND = new cjs.Container();
		stage.addChild(INDEX);
			
		/*bg1*/
		
		var bg1 = new cjs.Bitmap(loader.getResult("bgIndex"));
		INDEX.addChild(bg1);
		
		/*bg2*/
		
		var bg2 = new cjs.Bitmap(loader.getResult("bgSecond"));
		SECOND.addChild(bg2);
		
		//circle1
//		g.createCircle();
//		g.indexCircle();
		
		//circle1
		g.createCircle2();
//		g.secondCircle();
		
		//set animations
		g.animation();
//		g.animation2();
		
		//head
		g.createHead();
		
		//start
		g.start();
		
		//g
//		g.leaveIndex();
	}
	g.animation = function(){
		//head
		var dHead = {
			images:[loader.getResult('anHead')],
			frames:[[0,0,513,156],[513,0,513,156],[1026,0,513,156]],
			animations:{
				"first":[0,0.1],
				"run":[0,1,'run',0.1]
			}
		},
		sheetHead = new cjs.SpriteSheet(dHead),
		A_head = new cjs.Sprite(sheetHead);
		A_head.x = (SW - 513)/2;
		INDEX.addChild(A_head);
		A_head.gotoAndPlay("run");
		
		//bread
		var dBread = {
			images:[loader.getResult('bread')],
			frames:[[45*3,0,45,70],[45*2,0,45,70],[45,0,45,70],[0,0,45,70]],
			animations:{
				"first":[0,0.2],
				"run":[0,3,'run',0.2]
			}
		},
		sheetBread = new cjs.SpriteSheet(dBread),
		A_bread = new cjs.Sprite(sheetBread);
		A_bread.set({
			x:235,
			y:972
		});
		INDEX.addChild(A_bread);
		A_bread.gotoAndPlay("run");
		
		/*sidelights*/
		var sidelight = new cjs.Bitmap(loader.getResult("sidelight"));
		sidelight.y = 217,
		lightTime = 800;
		INDEX.addChild(sidelight);
		TW_sidelight = cjs.Tween.get(sidelight,{loop:true}).to({alpha:0.01},lightTime).set({alpha:0.01}).to({alpha:1},lightTime);
	
		/*INDEX role*/
		var indexRole = new cjs.Bitmap(loader.getResult("indexRole"));
		indexRole.set({
			x:465,
			y:878
		});
		INDEX.addChild(indexRole);
		
		/*index txt*/
		var indexTxt = new cjs.Bitmap(loader.getResult("indexTxt")),
			txtTime =800,
			txtScale = 0.7;
		indexTxt.set({
			x:592,
			y:838,
			regX:61,
			regY:49,
			scaleX:1,
			scaleY:1
		});
//		INDEX.addChild(indexTxt);
//		TW_indexTxt = cjs.Tween.get(indexTxt,{loop:true}).to({scaleX:txtScale,scaleY:txtScale},txtTime).set({scaleX:txtScale,scaleY:txtScale}).to({scaleX:1,scaleY:1},txtTime);
//		
//		indexTxt.addEventListener("click",function(){
//			$(".btn-start").hide();
//			$(".rule").show();
//		});
	
		/*index boxes*/
		var box1 = new cjs.Bitmap(loader.getResult("indexBox")),
			box2 = box1.clone(),
			boxTime = 500,
			boxDeg1 = -10,boxDeg2 = 10;
		box1.set({
			x:95,
			y:1206,
			regX:34,
			regY:40,
			rotation:boxDeg1
		});
		box2.set({
			x:652,
			y:1206,
			regX:34,
			regY:40,
			rotation:boxDeg2
		});
		INDEX.addChild(box1,box2);
		TW_box1 = cjs.Tween.get(box1,{loop:true}).to({rotation:boxDeg2},boxTime).set({rotation:boxDeg2}).to({rotation:boxDeg1},boxTime);
		TW_box2 = cjs.Tween.get(box2,{loop:true}).to({rotation:boxDeg1},boxTime).set({rotation:boxDeg1}).to({rotation:boxDeg2},boxTime);
	
		/*down lights*/
		var dDown = {
			images:[loader.getResult('indexDown')],
			frames:[[0,0,730,477],[730,0,730,477],[730*2,0,730,477],[730*3,0,730,477]],
			animations:{
				"first":[0,0.15],
				"run":[0,3,'run',0.15]
			}
		},
		sheetDown = new cjs.SpriteSheet(dDown),
		A_down = new cjs.Sprite(sheetDown);
		A_down.set({
			x:0,
			y:SH - 478
		});
		INDEX.addChild(A_down);
		A_down.gotoAndPlay("run");
		
		/*middle lights*/
		var middleLight = new cjs.Bitmap(loader.getResult("indexMiddle")),
			middleTime = 100,
			middleAlpha = 0.4;
		middleLight.set({
			x:214,
			y:363
		});
//		INDEX.addChild(middleLight);
//		TW_middle = cjs.Tween.get(middleLight,{loop:true}).to({alpha:middleAlpha},middleTime).set({alpha:middleAlpha}).to({alpha:1},middleTime);
	
		/*down dots*/
		var dDots = {
			images:[loader.getResult('indexDots')],
			frames:[[0,0,20,11],[0,0,60,11],[0,0,95,11],[0,0,117,11],[117,0,117,11],[117*2,0,117,11],[117*3,0,117,11],[0,0,117,11]],
			animations:{
				"first":[0,3/50],
				"left":[0,3,'left',3/50],
				"right":[4,7,'right',3/50]
			}
		},
		sheetDots = new cjs.SpriteSheet(dDots),
		A_dots1 = new cjs.Sprite(sheetDots),
		A_dots1a = A_dots1.clone(),
		A_dots2 = new cjs.Sprite(sheetDots),
		A_dots2a = A_dots2.clone();
		A_dots1.set({
			x:61,
			y:1133
		});
		A_dots1a.set({
			x:61,
			y:1269
		});
		A_dots2.set({
			x:569,
			y:1133
		});
		A_dots2a.set({
			x:569,
			y:1269
		});
		INDEX.addChild(A_dots1,A_dots2,A_dots1a,A_dots2a);
		A_dots1.gotoAndPlay("left");
		A_dots2.gotoAndPlay("right");
		A_dots1a.gotoAndPlay("left");
		A_dots2a.gotoAndPlay("right");
	
	}
	g.animation2 = function(){
		var btn = new cjs.Bitmap(loader.getResult("btnDate"));
		btn.set({
			x:535,
			y:1104
		})
		btn.addEventListener("click",function(){
			if(NUM < 3){}else{}
		});
		SECOND.addChild(btn);
	}
	//circle1
	var a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,
		aArr = [],
		aPos = [
			{x:350,y:274,rotation:0},{x:442,y:288,rotation:0},{x:514,y:306,rotation:28},{x:578,y:364,rotation:52},{x:622,y:429,rotation:70},
			{x:642,y:508,rotation:83},{x:634,y:604,rotation:115},{x:609,y:684,rotation:126},{x:558,y:734,rotation:137},{x:476,y:786,rotation:160},
			{x:400,y:805,rotation:180},{x:308,y:810,rotation:180},{x:208,y:798,rotation:-170},{x:143,y:756,rotation:-130},{x:126,y:657,rotation:-90},
			{x:123,y:552,rotation:-90},{x:126,y:475,rotation:-90},{x:126,y:398,rotation:-90},{x:192,y:288,rotation:-19},{x:270,y:282,rotation:-5}
		];
	g.createCircle = function(){
		a1 = new cjs.Bitmap(loader.getResult("c1"));
		a2 = new cjs.Bitmap(loader.getResult("c2"));
		a3 = new cjs.Bitmap(loader.getResult("c3"));
		a4 = new cjs.Bitmap(loader.getResult("c4"));
		a6 = new cjs.Bitmap(loader.getResult("c5"));
		a7 = new cjs.Bitmap(loader.getResult("c6"));
		//set
		a1.set({regX:36,regY:88});
		a2.set({regX:21,regY:21});
		a3.set({regX:35,regY:33});
		a4.set({regX:32,regY:29});
		a6.set({regX:35,regY:34});
		a7.set({regX:35,regY:29});
		//clones
		a5 = a2.clone();
		a8 = a2.clone();
		a9 = a3.clone();
		a10 = a6.clone();
		a11 = a7.clone();
		a12 = a4.clone();
		a13 = a3.clone();
		a14 = a2.clone();
		a15 = a6.clone();
		a16 = a7.clone();
		a17 = a2.clone();
		a18 = a3.clone();
		a19 = a4.clone();
		a20 = a2.clone();
		
		//arr
		aArr = [a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20];
		//aPos
		aPos.forEach(function(item,_index){
			aArr[_index].set(item);
			INDEX.addChild(aArr[_index]);
		});
	}
	//index an
	g.indexCircle = function(){
		var _alpha = 1,
			_time = 600;
		indexTimer = setInterval(function(){
			if(_alpha == 1){
				_alpha = 0;
			}else{
				//0
				var pop = aPos.pop();
				aPos.unshift(pop);
				aPos.forEach(function(item,_index){
					aArr[_index].set(item);
				});
				_alpha = 1;
			}
			aArr.forEach(function(item,index){
				cjs.Tween.get(aArr[index]).to({alpha:_alpha},_time);
			});
		},700);
		
	}
	//circle2
	var b1,b2,b3,b4,b5,b6,b7,b8,b9,b10,b11,b12,b13,b14,b15,b16,b17,b18,b19,b20,b21,b22,b23,
		b24,b25,b26,b27,b28,b29,b30,b31,b32,b33,b34,b35,
		bArr = [],
		bPos = [
			{x:456,y:974,rotation:170},{x:380,y:974,rotation:180},{x:281,y:968,rotation:-170},{x:206,y:892,rotation:-90},{x:206,y:818,rotation:-90},
			{x:206,y:739,rotation:-90},{x:206,y:667,rotation:-90},{x:281,y:593,rotation:-15},{x:315,y:495,rotation:180},{x:315,y:422,rotation:180},
			
			{x:315,y:352,rotation:180},{x:251,y:374,rotation:90},{x:176,y:444,rotation:180},{x:100,y:374,rotation:-90},{x:176,y:300,rotation:0},
			{x:317,y:242,rotation:0},{x:330,y:180,rotation:180},{x:90,y:126,rotation:-90},{x:417,y:92,rotation:0},{x:570,y:131,rotation:90},
			
			{x:461,y:240,rotation:0},{x:638,y:243,rotation:0},{x:658,y:332,rotation:90},{x:658,y:388,rotation:90},{x:658,y:445,rotation:90},
			
			{x:559,y:394,rotation:90},{x:454,y:352,rotation:180},{x:454,y:422,rotation:180},{x:454,y:494,rotation:0},{x:384,y:588,rotation:0},
			{x:472,y:607,rotation:40},{x:565,y:675,rotation:70},{x:587,y:784,rotation:90},{x:565,y:867,rotation:130},{x:510,y:933,rotation:150}
		];
	var c1,c2,c3,c4,c5,c6,c7,c8,c9,c10,c11,c12,c13,c14,c15,c16,c17,c18,c19,c20,c21,c22,c23,c24,c25,c26,c27,c28,c29,c30,c31,c32,c33,c34,c35;
	var cArr = [];
	g.createCircle2 = function(){
		b1 = new cjs.Bitmap(loader.getResult("b2")); 
		b2 = new cjs.Bitmap(loader.getResult("b5"));
		b3 = new cjs.Bitmap(loader.getResult("b3"));
		b4 = new cjs.Bitmap(loader.getResult("b6"));
		b6 = new cjs.Bitmap(loader.getResult("b1"));
		b35 = new cjs.Bitmap(loader.getResult("b4"));
		//set
		b1.set({regX:25,regY:26});
		b2.set({regX:25,regY:19});
		b3.set({regX:25,regY:21});
		b4.set({regX:25,regY:21});
		b6.set({regX:26,regY:21});
		b35.set({regX:23,regY:21});
		
		//clones
		b5 = b1.clone();
		b7 = b6.clone();
		b8 = b1.clone();
		b9 = b1.clone();
		b10 =b3.clone();
		b11 = b1.clone();
		b12 = b2.clone();
		b13 = b1.clone();
		
		b14 = b2.clone();
		b15 = b4.clone();
		b16 = b3.clone();
		b17 = b4.clone();
		b18 = b3.clone();
		b19 = b2.clone();
		b20 = b3.clone();
		b21 = b1.clone();
		
		b22 = b3.clone();
		b23 = b35.clone();
		b24 = b4.clone();
		b25 = b2.clone();
		b26 = b6.clone();
		b27 = b3.clone();
		b28 = b1.clone();
		
		b29 = b35.clone();
		b30 = b3.clone();
		b31 = b2.clone();
		b32 = b35.clone();
		b33 = b4.clone();
		b34 = b3.clone();
		
		//c
		c1 = new cjs.Bitmap(loader.getResult('wrong'));
		c2 = c1.clone();c3 = c1.clone();c4 = c1.clone();c5 = c1.clone();c6 = c1.clone();
		c7 = c1.clone();c8 = c1.clone();c9 = c1.clone();c10 = c1.clone();c11 = c1.clone();
		c12 = c1.clone();c13 = c1.clone();c14 = c1.clone();c15 = c1.clone();c16 = c1.clone();
		c17 = c1.clone();c18 = c1.clone();c19 = c1.clone();c20 = c1.clone();c21 = c1.clone();
		c22 = c1.clone();c23 = c1.clone();c24 = c1.clone();c25 = c1.clone();c26 = c1.clone();
		c27 = c1.clone();c28 = c1.clone();c29 = c1.clone();c30 = c1.clone();c31 = c1.clone();
		c32 = c1.clone();c33 = c1.clone();c34 = c1.clone();c35 = c1.clone();
		//arr
		bArr = [b1,b2,b3,b4,b5,b6,b7,b8,b9,b10,b11,b12,b13,b14,b15,b16,b17,b18,b19,b20,b21,b22,b23,b24,b25,b26,b27,b28,b29,b30,b31,b32,b33,b34,b35];
		cArr = [c1,c2,c3,c4,c5,c6,c7,c8,c9,c10,c11,c12,c13,c14,c15,c16,c17,c18,c19,c20,c21,c22,c23,c24,c25,c26,c27,c28,c29,c30,c31,c32,c33,c34,c35];
		
		/*cards*/
		var dCards = {
			images:[],
			frames:{width:472,height:184,count:cardLen},
			animations:{
				"run":[0,cardLen - 1,'run',80/50]
			}
		};
		for(var k = 1; k < cardLen + 1;k++){
			dCards.images.push(loader.getResult("csd" + k));
		}
		var sheetCard = new cjs.SpriteSheet(dCards);
		CARDS = new cjs.Sprite(sheetCard);
		CARDS.set({
			x:124,
			y:54
		});
		SECOND.addChild(CARDS);
		
		/*balls*/
		var dBalls = {
			images:[],
			frames:{width:300,height:311,count:ballLen},
			animations:{
				"run":[0,ballLen - 1,'run',0.5]
			}
		};
		for(var z = 1; z < ballLen*2;z+=2){
			dBalls.images.push(loader.getResult("ball" + z));
		}
		var sheetBalls = new cjs.SpriteSheet(dBalls);
		BALLS = new cjs.Sprite(sheetBalls);
		BALLS.set({
			x:226,
			y:604,
			scaleX:346/300,
			scaleY:360/311
		});
		SECOND.addChild(BALLS);
		
		//bPos
		bPos.forEach(function(item,_index){
			//c
			cArr[_index].set({
				regX:23,
				regY:23
			});
			cArr[_index].set(item);
			//b
			bArr[_index].set(item);
			bArr[_index]._id = _index;
			(function(i){
				bArr[_index].addEventListener("click",function(i){
					g.show(i);
				});
			})(_index);
			
			SECOND.addChild(bArr[_index]);
		});
		
	}
	g.secondCircle = function(){
		playShow = false;
		//remove
		headArr.forEach(function(item,index){
			if(!headArr[index].hasShow){
				headArr[index].parent && headArr[index].parent.removeChild(headArr[index]);
			}
		});
		var _time = 200;
		secondTimer = setInterval(function(){
			STOP = true;
			//0
			bArr.forEach(function(item,index){
				bArr[index].alpha = 0;
			});
			var push = bPos.shift();
			bPos.push(push);
			bPos.forEach(function(item,_index){
				bArr[_index].set(item);
			});
			headArr.forEach(function(item,index){
				if(headArr[index].hasShow){
					var _id = headArr[index]._id,
						_p = bPos[_id];
					headArr[index].set({
						x:_p.x,
						y:_p.y,
						rotation:_p.rotation
					});
				}
			});
			bArr.forEach(function(item,index){
				bArr[index].alpha = 1;
			});
		},1000);
	}
	//leave
	g.leaveIndex = function(){
		TW_sidelight.setPaused(true);
		TW_box1.setPaused(true);
		TW_box2.setPaused(true);
//		TW_indexTxt.setPaused(true);
//		TW_middle.setPaused(true);
		clearInterval(indexTimer);
		
		INDEX.parent && INDEX.parent.removeChild(INDEX);
		$("#canvas1").hide();
		stage.addChild(SECOND);
		
		$(".canvas-girls,.btn-date,.btn-card2,.btn-rule2").show();
		
		g.secondCircle();
		CARDS.gotoAndPlay("run");
		BALLS.gotoAndPlay("run");
	}
	g.backIndex = function(){
		TW_sidelight.setPaused(false);
		TW_box1.setPaused(false);
		TW_box2.setPaused(false);
//		TW_indexTxt.setPaused(false);
//		TW_middle.setPaused(false);
		g.indexCircle();
	}
	g.show = function(obj){
		if(STOP){
			STOP = false;
			clearInterval(secondTimer);
			if(CHANCE <= 0){
				showMsg("您今天的机会已用完！");
				if(!OVER){
					g.secondCircle();
					STOP = true;
				}
				return false;
			}
			CHANCE--;
			//点击次数
			REQUEST.addClick(function(msg){
				
			});
			//判断
			if(girlArr[0] == obj.currentTarget._id || girlArr[1] == obj.currentTarget._id || girlArr[2] == obj.currentTarget._id){
				clearInterval(secondTimer);
				STOP = false;
				if(dateArr.indexOf(obj.currentTarget._id) >= 0){
					showMsg("我们已经约过了哦！");
				}else{
					if(NUM >= 3){
						showMsg("已经约够了哦！");
					}else{
						
						//正确音效
						cjs.Sound.play("soundRight");
						//点中了！ 
						g.showPlay(obj.currentTarget._id,NUM);
						
						//显示文案
						$(".date-txt,.date-txt >li").hide();
						for(var i = 0;i <= NUM; i++){
							$(".canvas-girls >li").eq(i).addClass("active");
						}
						//卡券
						$(".middle-girl > img").hide();
						$(".middle-girl > img").eq(NUM).show();
						$(".coupon-img > img").hide();
						$(".coupon-img > img").eq(NUM).show();
						//增加
						NUM++;
						$(".date-txt,.date-txt-" + NUM).show();
						dateArr.push(obj.currentTarget._id);
						return false;
					}
				}
			}else{
				//错误音效
				cjs.Sound.play("soundWrong");
				
				var words = ["嗨，你听说过胺利吗？","你瞅啥！再瞅一个试试！"];
				var rand = Math.random()*words.length | 0;
//				showMsg(words[rand]);
				$(".date-txt,.date-txt >li").hide();
				$(".date-txt,.date-txt-fail").show();
				
				//c1
				cArr[obj.currentTarget._id].set({
					x:obj.currentTarget.x,
					y:obj.currentTarget.y,
					rotation:obj.currentTarget.rotation
				});
				SECOND.addChild(cArr[obj.currentTarget._id]);
				
				
				//wrong txt
				WRONG.set({
					x:obj.currentTarget.x - 10,
					y:obj.currentTarget.y - 94
				});
				SECOND.addChild(WRONG);
			}
			setTimeout(function(){
				$(".date-txt,.date-txt >li").hide();
				WRONG.parent && WRONG.parent.removeChild(WRONG)
				cArr[obj.currentTarget._id].parent && cArr[obj.currentTarget._id].parent.removeChild(cArr[obj.currentTarget._id]);
				if(!OVER){
					g.secondCircle();
					STOP = true;
				}
			},1000);
		}
		
	}
	g.btnDate = function(){
		if(NUM > 3){
			showMsg("3次机会已经用完了哦！");
		}else{
			showMsg("约！测试中……");
		}
//		NUM++;
	}
	g.createHead = function(){
		var b1 = new cjs.Bitmap(loader.getResult('head1'));
		b1.set({
			regX:23,
			regY:33
		});
		var b2 = new cjs.Bitmap(loader.getResult('head2'));
		b2.set({
			regX:23,
			regY:33
		});
		var b3 = new cjs.Bitmap(loader.getResult('head3'));
		b3.set({
			regX:23,
			regY:33
		});
		
		//head
		head1 = b1;
		head2 = b2;
		head3 = b3;
		head1.hasShow = false;
		head2.hasShow = false;
		head3.hasShow = false;
		head1._id = 0;
		head2._id = 0;
		head3._id = 0;
		headArr = [head1,head2,head3];
		
		if(NUM > 0){
			//显示文案
			$(".date-txt,.date-txt >li").hide();
			$(".middle-girl > img").hide();
			$(".coupon-img > img").hide();
			$(".cards-inner ul li").removeClass("active");
			//根据数量显示
			for (var h = 0;h < NUM;h++) {
				headArr[h].hasShow = true;
				headArr[h].set(bPos[girlArr[h]]);
				headArr[h]._id = girlArr[h];
				dateArr.push(girlArr[h]);
				SECOND.addChild(headArr[h]);
				$(".canvas-girls >li").eq(h).addClass("active");
				$(".cards-inner ul li").eq(h).addClass("active");
			}
			//卡券
			$(".middle-girl > img").eq(NUM - 1).show();
			$(".coupon-img > img").eq(NUM - 1).show();
		}
		//play
		PLAY = new cjs.Bitmap(loader.getResult('play'));
		PLAY.addEventListener('click',function(){
			$(".video").show();
			g.hidePlay();
		});
		WRONG = new cjs.Bitmap(loader.getResult('wrongTxt'));
		
	}
	g.showHead = function(st){
		CLICK++;
		hasClicked = true;
		if(CLICK > 5){
			showMsg("5次机会已经用完啦！");
			hasClicked = false;
			return false;
		}
		
		//添加点约
		REQUEST.addDate(function(msg){
			
		});
		
		var _time = 2000;//余secTimer时间加起来为总等待时间
		STOP = false;
		clearInterval(secondTimer);
		
		//cover
		var find = 0;
		cArr.forEach(function(item,index){
			var _b1 = bArr[girlArr[0]],
				_b2 = bArr[girlArr[1]],
				_b3 = bArr[girlArr[2]];
			if((item.x == _b1.x && item.y == _b1.y) || (item.x == _b2.x && item.y == _b2.y) || (item.x == _b3.x && item.y == _b3.y)){
//				if(!headArr[find].hasShow){
					headArr[find].set({
						x:item.x,
						y:item.y,
						rotation:item.rotation
					});
					SECOND.addChild(headArr[find]);
					find++;
//				}
			}else{
				SECOND.addChild(cArr[index]);
			}
		});
		
		//txt
		$(".date-txt,.date-txt-show").show();
		
		
		//disappear
		if(st && typeof st == "number"){
			_time = st;
		}else{
			return false;
		}
		setTimeout(function(){
			//hide
			$(".date-txt,.date-txt > li").hide();
			
			//remove
			headArr.forEach(function(item,index){
				if(!headArr[index].hasShow){
					headArr[index].parent && headArr[index].parent.removeChild(headArr[index]);
				}
			});
			
			//cover
			cArr.forEach(function(item,index){
				cArr[index].parent && cArr[index].parent.removeChild(cArr[index]);
			});
			g.secondCircle();
			
			//恢复点击
			hasClicked = false;
		},_time);
	}
	g.showPlay = function(_i,num){
		//成功领取
		REQUEST.addCard(function(msg){
			
		});
		playShow = true;
		var pos = bPos[_i];
		PLAY.x = pos.x + 24;
		PLAY.y = pos.y - 100;
		SECOND.addChild(PLAY);
		headArr[num].hasShow = true;
		headArr[num]._id = _i;
		headArr[num].set({
			x:pos.x,
			y:pos.y,
			rotation:pos.rotation
		});
		SECOND.addChild(headArr[num]);
		//重设video
		var n = num > 2 ? 2:num;
		g.setVideo(n);
		//cards img
		$(".cards-inner > ul li").attr("class","");
		for(var m = 0;m <= n;m++){
			$(".cards-inner > ul li").eq(m).addClass("active");
		}
	}
	//隐藏按钮
	g.hidePlay = function(){
		PLAY.parent && PLAY.parent.removeChild(PLAY);
	}
	//打开对应video
	g.setVideo = function(n){
		clearInterval(secondTimer);
		//显示按钮时修改对应链接与头像
		var srcs = ['http://cdn.1.wechat.sh.cn/1212_3.mp4','http://cdn.1.wechat.sh.cn/1210_1.mp4','http://cdn.1.wechat.sh.cn/chongchong.mp4'];
		$("#poster").attr("class","poster" + (n + 1));
		$("#video > source").attr("src",srcs[n]);
		$("#video").get(0).load();
	}
	//重设
	g.reSet = function(){
		
	}
	//开始游戏，绑定事件
	g.start = function(){
		
		cjs.Touch.enable(stage);
		INIT.startTick();
	}
	g.stop = function(){
		clearInterval(secondTimer);
		STOP = false;
	}
	//over
	g.over = function(){
		
		//stop render
		cjs.Touch.disable(stage);
		INIT.stopTick();
	}
	g.onProgress = function(p){
		var per = (p/1*100 | 0);
		var pp = document.getElementById("progress");
		pp.innerHTML = per;
	}
	var hasDoneTimer;
	g.onComplete = function(){
		console.log("加载完毕！");
		var loading = $(".loading");
		loading.remove();
		g.init();//初始化游戏
		if(hasDone){
			handleComplete();
			var loading = $(".loading");
			loading.remove();
			g.init();//初始化游戏
		}else{
			hasDoneTimer = setInterval(function(){
				if(hasDone){
					clearInterval(hasDoneTimer);
					handleComplete();
					var loading = $(".loading");
					loading.remove();
					g.init();//初始化游戏
				}
			},300);
		}
	}
	return g;
})(window.GAME || {},createjs);

//init canvas

//加载资源
var manifest = [
	{id:'bgIndex',src:'bg_index1.jpg'},
	{id:'bgSecond',src:'bg_second2.jpg'},
	{id:'anHead',src:'an_head.png'},
	{id:'sidelight',src:'sidelights.png'},
	{id:'bread',src:'an_bread.png'},
	{id:'indexRole',src:'index_role.png'},
	{id:'indexTxt',src:'index_txt.png'},
	{id:'indexBox',src:'index_box.png'},
	{id:'indexDown',src:'an_downlight.png'},
	{id:'indexMiddle',src:'an_midlight.png'},
	{id:'indexDots',src:'an_dots.png'},
	{id:'c1',src:'cs/c1.png'},
	{id:'c2',src:'cs/c2.png'},
	{id:'c3',src:'cs/c3.png'},
	{id:'c4',src:'cs/c4.png'},
	{id:'c5',src:'cs/c5.png'},
	{id:'c6',src:'cs/c6.png'},
	{id:'btnDate',src:'btn_date.png'},
	{id:'b1',src:'bs/b1.png'},
	{id:'b2',src:'bs/b2.png'},
	{id:'b3',src:'bs/b3.png'},
	{id:'b4',src:'bs/b4.png'},
	{id:'b5',src:'bs/b5.png'},
	{id:'b6',src:'bs/b6.png'},
	{id:'head1',src:'head1.png'},
	{id:'head2',src:'head2.png'},
	{id:'head3',src:'head3.png'},
	{id:'play',src:'btn_play.png'},
	{id:'wrong',src:'wrong.png'},
	{id:'wrongTxt',src:'wrong_txt.png'},
	{id:'cardsInner',src:'cards_inner.png'},
	{id:'soundRight',src:'right.mp3'},
	{id:'soundWrong',src:'wrong.mp3'}
];

//cards src
for(var p = 1;p < cardLen + 1;p++){
	manifest.push({
		id:'csd' + p,
		src:'cards/csd00' + (p < 10 ? '0' :'') + p + '.png'
	});
}

//balls src
for(var q = 1;q < ballLen*2; q+=2){
	manifest.push({
		id:'ball' + q,
		src:'balls/game100' + (q < 10 ? '0' :'') + q + '.png'
	});
}

//初始化
window.INIT = new initCjs({
	'id':'canvas',//canvas的id
	'url':_URL,//资源路径
	'width':750,
	'height':1334,
	'frameRate':50,//刷新帧率
	'useSound':true,//是否使用音频sound.js
	'scaleMode':'exactFit',//适配模式:exactFit | fixedWidth | noScale | showAll
	'preload':manifest,//加载资源组:Array | String | Object
	'autoLoad':true,//是否自动加载
	'autoRender':false,
	'onProgress':GAME.onProgress,//加载中回调
	'onComplete':GAME.onComplete,//加载完成回调
	'onError':function(msg){
		console.log(msg);
	}
});

//初始化首页canvas2
init();

///*解决安卓加载未知bug*/
//var u = navigator.userAgent;
//var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
////if(isAndroid){
//	var hasReload = false,
//		reloadTimer = setTimeout(function(){
//		if(parseInt(document.getElementById("progress").innerHTML) == 0 && !hasReload){
//			history.go(0);
//			hasReload = true;
//			clearTimeout(reloadTimer);
//		}
//	},7000);
////}

