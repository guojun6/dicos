var	REQUEST = {};
//查询
REQUEST.check = function(cb){
	$.ajax({
		type: "get",
		url: "http://dicos.aolinfeng.com/count.php?a=search",
		data: countInit,
		dataType: "json",
		timeout : 10000,
		success: function(data){
			typeof cb =="function" && cb(data);
		},
		error: function(){
		},
	});
}

//添加领卡
REQUEST.addCard = function(cb){
	$.ajax({
		type: "get",
		url: "http://dicos.aolinfeng.com/count.php?a=addcards",
		data: countInit,
		dataType: "json",
		timeout : 10000,
		success: function(data){
			typeof cb =="function" && cb(data);
		},
		error: function(){
		},
	});
}


//添加'约'次
REQUEST.addDate = function(cb){
	$.ajax({
		type: "get",
		url: "http://dicos.aolinfeng.com/count.php?a=adddates",
		data: countInit,
		dataType: "json",
		timeout : 10000,
		success: function(data){
			typeof cb =="function" && cb(data);
		},
		error: function(){
		},
	});
}


//添加'点'次
REQUEST.addClick = function(cb){
	$.ajax({
		type: "get",
		url: "http://dicos.aolinfeng.com/count.php?a=addtimes",
		data: countInit,
		dataType: "json",
		timeout : 10000,
		success: function(data){
			typeof cb =="function" && cb(data);
		},
		error: function(){
		},
	});
}
