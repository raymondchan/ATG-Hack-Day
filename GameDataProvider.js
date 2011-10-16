/**
* Author: Ibrahim Okuyucu, John Gentilin
* MemoryWall Project hackday
* 10/15/2011
**/
var MemoryWall = MemoryWall || {};
MemoryWall.GameDataProvider = function(){
	var Me = {};//this pointer
	Me.facebookFriendsData = new Array();
	Me.CONSTANT = {
			CATEGORY_PICTURE:"picture",
			CATEGORY_FRIENDS:"friends",
			CATEGORY_EDUCATION:"education",
			MAX_FRIEND_COUNT:500,
			};
	Me.gameData = {};
	
	//query facebook graph for friend data
	function getGenericUserData(params, matchcol)
	{
		fql = 'SELECT uid, name, ' + matchcol + ' FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me())';
		FB.api({ method: 'fql.query', query: fql }, function(result) {
			Me.facebookFriendsData = new Array();
			 var max = Math.min(Me.CONSTANT.MAX_FRIEND_COUNT, result.length);
		      for (var i=0; i<max; i++) 
		      {
		    	  var t = {"uid":result[i].uid, "name":result[i].name};
		    	  t[matchcol] = result[i][matchcol];
		    	  Me.facebookFriendsData.push(t);
		      }
		      prepData(params);
		      console.log(JSON.stringify(Me.gameData));
		      params.callback(Me.gameData);			  
		});
		
	}
	
	//assumes FB friend raw data is ready in Me.facebookFriendsData, goes through raw data and selects size elements based on category
	function prepData(params)
	{
	  console.log("called prepData");
		Me.gameData = {"version":"1.0"};

		if (params.category == Me.CONSTANT.CATEGORY_PICTURE) {
			//select random size/2 friends
			pickSize = params.size/2;
			
			if (Me.facebookFriendsData.length < pickSize) {
				throw "You have very few number of friends. You don't deserve to play this game!";
			}
			
			var picked = [];
			var i = 0;
			var target = new Array(Me.facebookFriendsData.length);
			for (i=0;i<target.length;i++) target[i]=i;
			for(i=0;i<pickSize;i++){
				j = Math.floor(Math.random()*target.length);
				picked.push(target[j]);
				target.splice(j,1);
			}
			Me.gameData.comparator = function(o1,o2){ return (o1.matchData==o2.matchData); };
			Me.gameData.data = new Array(picked.length*2);
			for(i=0;i<picked.length;i++){
				friend = Me.facebookFriendsData[picked[i]];
				Me.gameData.data[i] = {"url":"http://graph.facebook.com/"+friend.uid+"/picture","matchData":friend.uid};
				Me.gameData.data[i+pickSize] = {"url":"http://graph.facebook.com/"+friend.uid+"/picture","matchData":friend.uid};
			}	
		}else if (params.category == Me.CONSTANT.CATEGORY_FRIENDS) {
			//select size/2 pairs of friends who are friends with each other
			pickSize = params.size/2;
			/*
			if (Me.facebookFriendsData.length < params.size) {
				throw "You have very few number of friends. You don't deserve to play this game!";
			}
			
			var picked = [];
			var i = 0;
			var target = new Array(Me.facebookFriendsData.length);
			for (i=0;i<target.length;i++) target[i]=i;
			for(i=0;i<pickSize;i++){
				j = Math.floor(Math.random()*target.length);
				picked.push(target[j]);
				target.splice(j,1);
			}
			Me.gameData.comparator = function(o1,o2){ return (o1.matchData==o2.matchData); };
			Me.gameData.data = new Array(picked.length*2);
			for(i=0;i<picked.length;i++){
				friend = Me.facebookFriendsData[picked[i]];
				Me.gameData.data[i] = {"url":"http://graph.facebook.com/"+friend.uid+"/picture","matchData":friend.uid};
				Me.gameData.data[i+pickSize] = {"url":"http://graph.facebook.com/"+friend.uid+"/picture","matchData":friend.uid};
			}	
			*/			
		}
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
//var gdp = MemoryWall.GameDataProvider(); 
//var c = gdp.getCategories();
//var d = gdp.getGameData({"category":c[0].name});
//console.log(d);
