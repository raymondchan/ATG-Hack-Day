var MemoryWall = MemoryWall || {};
(function(){
  var GameController = MemoryWall.GameController = function(){
    this.gameDataProvider = MemoryWall.GameDataProvider(); 
  };

  GameController.prototype.init = function(){
    var self = this;
    $('.gamestates').hide();
    $('.gamestates.welcome').html('<button id="initgame">Start Game</button>').show();
    $('#initgame').click(function(){
      FB.login(function(r){
        if (r.status == 'connected') {
          self.nextLevel();
        } else {
          alert('Please connect with Facebook first');
        }
      });
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
    $('.gamestates').hide();
    $('.gamestates.canvas').fadeIn();
    $('.gamestates.canvas').html("Game Starting: " + JSON.stringify(category));
  };

  GameController.prototype.getCategories = function(){
    if (!this._categories) {
      this._categories = this.gameDataProvider.getCategories();
    }
    return this._categories;
  };

  MemoryWall.gameController = new MemoryWall.GameController();
})();