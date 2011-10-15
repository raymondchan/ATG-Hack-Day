/**
* Author: Ibrahim Okuyucu, John Gentilin
* MemoryWall Project hackday
* 10/15/2011
**/
var MemoryWall = MemoryWall || {};
MemoryWall.GameDataProvider = function(){
	var Me = {};//this pointer
	
	Me.getCategories = function () {
		var r = [{"name":"picture","question":"Match faces"},
		 	{"name":"friends","question":"Match friends who know each other"},
		 	{"name":"education","question":"Match friends who went to same school"}
	 	];
        return r;
	};
	
	Me.getGameData = function(params) {
                console.log(params);
		if (params.category != "picture") return;
		return {
			"version":"1.0",
			"data":[
			{"url":"http://graph.facebook.com/200024/picture","matchData":"200024"},
			{"url":"http://graph.facebook.com/200253/picture","matchData":"200024"},
			{"url":"http://graph.facebook.com/204996/picture","matchData":"200024"},
			{"url":"http://graph.facebook.com/205205/picture","matchData":"200024"},
			{"url":"http://graph.facebook.com/205772/picture","matchData":"200024"},
			{"url":"http://graph.facebook.com/206517/picture","matchData":"200024"},
			{"url":"http://graph.facebook.com/208305/picture","matchData":"200024"},
			{"url":"http://graph.facebook.com/224713/picture","matchData":"200024"},
			
			{"url":"http://graph.facebook.com/200024/picture","matchData":"200024"},
			{"url":"http://graph.facebook.com/200253/picture","matchData":"200024"},
			{"url":"http://graph.facebook.com/204996/picture","matchData":"200024"},
			{"url":"http://graph.facebook.com/205205/picture","matchData":"200024"},
			{"url":"http://graph.facebook.com/205772/picture","matchData":"200024"},
			{"url":"http://graph.facebook.com/206517/picture","matchData":"200024"},
			{"url":"http://graph.facebook.com/208305/picture","matchData":"200024"},
			{"url":"http://graph.facebook.com/224713/picture","matchData":"200024"}
			]
		};
	};
	
	return Me;
};

//call functions
var gdp = MemoryWall.GameDataProvider(); 
var c = gdp.getCategories();
var d = gdp.getGameData({"category":c[0].name});
