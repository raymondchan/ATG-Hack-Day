var MemoryWall = MemoryWall || {};
(function(){
  var GameController = MemoryWall.GameController = function(){
    var self = this;
    this.gameDataProvider = MemoryWall.GameDataProvider();
    this.gameView = new MemoryGameView();
  };
  
  GameController.prototype.fbLogin = function(callback){
		if (localStorage && localStorage.getItem('FB_SESSION')){
			this.FB_SESSION = JSON.parse(localStorage.getItem('FB_SESSION'));
			if (callback) {
				callback();
			}	
			return;
		}	
		var self = this;
		FB.getLoginStatus(function(response) {
			if (response.status == "connected") {			
				// logged in and connected user, someone you know				
				self.FB_SESSION = response.authResponse;
				if (localStorage){
					localStorage.setItem('FB_SESSION', JSON.stringify(response.authResponse));
				}
				if (callback) {
					callback();
				}	
			}
			else{
				// no user session available, someone you dont know			
				FB.login(function(response) {
				   if (response.status == "connected") {
				   		self.FB_SESSION = response.authResponse;
  						if (localStorage){
  							localStorage.setItem('FB_SESSION', JSON.stringify(response.authResponse));
  						}				   	 
					     if (callback) {
					     	callback();
					     }	
				   } else {
					     //console.log('User cancelled login or did not fully authorize.');
               alert('Please connect with Facebook first');
				   }
				 }, {scope: 'friends_education_history,friends_birthday,friends_checkins,friends_hometown,friends_interests,friends_likes,friends_relationships,friends_religion_politics,friends_work_history'});			
			}//else
		});	
  };

  GameController.prototype.init = function(){
    var self = this;
    $('.gamestates').hide();
    $('.gamestates.welcome').show();
    
    // welcome screen
    $('#initgame').click(function(){
      self.fbLogin(function(){
        FB.api('/me', function(response) {
          self.userData = {
            name: response.name,
            id: response.id
          };
          $('.playerName').text(response.name);
          self.updateScore(0); // update the screen
          self.nextLevel();
        });        
      });
    });
    
    // game finished screen
    $('#nextLevel').click(function(){
      self.nextLevel();
    });
  };

  GameController.prototype.nextLevel = function(){
    var self = this;
    $('.gamestates').hide();
    $('.gamestates.interstitial').fadeIn();
    setTimeout(function(){
      var categories = self.getCategories();
      var theCategory = categories[0];
      self.startGame(theCategory);
    }, 1);
  };

  GameController.prototype.startGame = function(category){
    var self = this;
    $('.gamestates').hide();
    var mediator = new CLASS_Mediator(this.gameDataProvider, this.gameView);
    mediator.getData(category.name, 16, function(){
      mediator.initView(category.question);
      mediator.shuffle();
      mediator.renderView();      
    });
    $('.gamestates.canvas').fadeIn();
/*
    // TODO: instantiate game object
    this.gameView.initView({"name":"education","question":"Match friends who went to same school"}, [
  	    {"id":"1","url":"http://graph.facebook.com/200024/picture","matchData":"200024"},
  	    {"id":"2","url":"http://graph.facebook.com/200253/picture","matchData":"200024"},
  	    {"id":"3","url":"http://graph.facebook.com/204996/picture","matchData":"200024"},
  	    {"id":"4","url":"http://graph.facebook.com/205205/picture","matchData":"200024"},
  	    {"id":"5","url":"http://graph.facebook.com/205772/picture","matchData":"200024"},
  	    {"id":"6","url":"http://graph.facebook.com/206517/picture","matchData":"200024"},
  	    {"id":"7","url":"http://graph.facebook.com/208305/picture","matchData":"200024"},
  	    {"id":"8","url":"http://graph.facebook.com/224713/picture","matchData":"200024"},

  	    {"id":"9","url":"http://graph.facebook.com/200024/picture","matchData":"200024"},
  	    {"id":"10","url":"http://graph.facebook.com/200253/picture","matchData":"200024"},
  	    {"id":"11","url":"http://graph.facebook.com/204996/picture","matchData":"200024"},
  	    {"id":"12","url":"http://graph.facebook.com/205205/picture","matchData":"200024"},
  	    {"id":"13","url":"http://graph.facebook.com/205772/picture","matchData":"200024"},
  	    {"id":"14","url":"http://graph.facebook.com/206517/picture","matchData":"200024"},
  	    {"id":"15","url":"http://graph.facebook.com/208305/picture","matchData":"200024"},
  	    {"id":"16","url":"http://graph.facebook.com/224713/picture","matchData":"200024"}
  	]);
  	this.gameView.startGame();



    $('.gamestates.canvas').fadeIn();
    setTimeout(function(){
      self.onGameFinished(Math.floor(Math.random() * 50) + 1);
    }, 30000);
*/    
  };
  
  GameController.prototype.onGameFinished = function(score){
    $('.gamestates').hide();
    $('.gamestates.finish .message').html('You finished this game with score of ' + score);
    $('.gamestates.finish').fadeIn();
    this.updateScore(score);
  };

  GameController.prototype.getCategories = function(){
    if (!this._categories) {
      this._categories = this.gameDataProvider.getCategories();
    }
    
  //this.gameDataProvider.getGameData({"category":this._categories[2].name, "size":16, "callback": function(d) {console.log(d);}});
  

    return this._categories;
  };
  
  GameController.prototype.updateScore = function(delta){
    var scores = localStorage.scores || '{}';
    scores = JSON.parse(scores);
    if (!scores[this.userData.id]) scores[this.userData.id] = 0;
    scores[this.userData.id] += delta;
    localStorage.scores = JSON.stringify(scores);
    $('.playerScore').text(scores[this.userData.id]);
  };

  MemoryWall.gameController = new MemoryWall.GameController();
})();