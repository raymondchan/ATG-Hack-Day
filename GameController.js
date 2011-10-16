var MemoryWall = MemoryWall || {};
(function(){
  var GameController = MemoryWall.GameController = function(){
    this.gameDataProvider = MemoryWall.GameDataProvider();
  };

  GameController.prototype.init = function(){
    var self = this;
    $('.gamestates').hide();
    $('.gamestates.welcome').show();
    
    // welcome screen
    $('#initgame').click(function(){
      FB.login(function(r){
        if (r.status == 'connected') {
          FB.api('/me', function(response) {
            $('#playerName').text(response.name);
            self.updateScore(0); // update the screen
            self.nextLevel();
          });
        } else {
          alert('Please connect with Facebook first');
        }
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
      var theCategory = categories[Math.floor(Math.random() * categories.length)];
      self.startGame(theCategory);
    }, 3000);
  };

  GameController.prototype.startGame = function(category){
    var self = this;
    $('.gamestates').hide();
    $('.gamestates.canvas').fadeIn();
    $('.gamestates.canvas').html("Game Starting: " + JSON.stringify(category));
    // TODO: instantiate game object
    setTimeout(function(){
      self.onGameFinished(Math.floor(Math.random() * 50) + 1);
    }, 3000);
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
    
 // this.gameDataProvider.getGameData({"category":this._categories[0].name, "size":16, "callback": function(d) {console.log(d);}});
  

    return this._categories;
  };
  
  GameController.prototype.updateScore = function(delta){
    if (!this.score) this.score = 0;
    this.score += delta;
    $('#playerScore').text(this.score);
  };

  MemoryWall.gameController = new MemoryWall.GameController();
})();