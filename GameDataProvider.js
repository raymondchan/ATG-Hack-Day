/**
* Author: Ibrahim Okuyucu, John Gentilin
* MemoryWall Project hackday
* 10/15/2011
**/
var MemoryWall = MemoryWall || {};
MemoryWall.GameDataProvider = function(){
	var Me = {};//this pointer
	Me.facebookFriendsData = new Array();
	
	//query facebook graph for friend data
	function getGenericUserData(params, matchcol)
	{
		fql = 'SELECT uid, name, ' + matchcol + ' FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me())';
		FB.api({ method: 'fql.query', query: fql }, function(result) {
			Me.facebookFriendsData = new Array();
		      for (var i=0; i<300; i++) 
		      {
		    	  Me.facebookFriendsData.push({"uid":result[i].uid, "name":result[i].name, matchcol:result[i][matchcol]});
		      }
		      prepData(params);
		});
		
		params.callback(Me.gameData);
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
		if (params.category == "picture") {
			getGenericUserData(params, 'pic_square');
		}
	};
	
	return Me;
};

//call functions
var gdp = MemoryWall.GameDataProvider(); 
var c = gdp.getCategories();
var d = gdp.getGameData({"category":c[0].name});
