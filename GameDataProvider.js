/**
* Author: Ibrahim Okuyucu, John Gentilin
* MemoryWall Project hackday
* 10/15/2011
**/
var MemoryWall = MemoryWall || {};
MemoryWall.GameDataProvider = function(){
	var Me = {};//this pointer
	Me.facebookFriendsData = {};
	
	//query facebook graph for friend data
	function getFriendData(fql, callback)
	{
		FB.api({method: 'fql.query', query: fql},callback);	
	}
	
	function prepData(category)
	{
		
	}
	
	Me.getCategories = function () {
		var r = [{"name":"picture","question":"Match faces"},
		 	{"name":"friends","question":"Match friends who know each other"},
		 	{"name":"education","question":"Match friends who went to same school"}
	 	];
        return r;
	};
	
	Me.getGameData = function(params) {
		if (params.category != "picture") return;
		if (params.category == "picture") {
			fql = 'SELECT uid, name,pic_square FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me())';
		}else if (params.category == "friends"){
			fql = 'SELECT uid, name,pic_square FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me())';
		}else if (params.category == "education") {
			fql = 'SELECT uid, name,pic_square FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me())';		
		}
		this.getFriendData(fql, function(){this.prepData(params.category)});
		return {
			"version":"1.0",
			"comparator":function(o1,o2){ return (o1.matchData==o2.matchData) },
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
