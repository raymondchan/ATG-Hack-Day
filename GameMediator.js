//*class used to interface with the controller and the view
//
function CLASS_Mediator(provider,view) {
	this._gameData=new Array();
	this._fullData=new Object();
	this._provider=provider;
	this._view = view;
	this._title="";
	this.clickAccum=new Array();
	this.MAX_CLICK=2;
	this.CLICK_WAIT_TIME=3000;
	this._gamePointCallback=new Object();
}

//fetches game data from the backend
CLASS_Mediator.prototype.getData = function(category,size,callback) 
{
  var self = this;
	this._provider.getGameData({"category":category,
	                       "size":size,
						   "callback": function (d) {
					       self._fullData=d;
	                self._gameData=self._fullData.data;
	                self._addIDs();
	                callback();
	}}
	);
}

//adds a point increase callback for notifying the controller that
//the player correctly discovered a valid pair
CLASS_Mediator.prototype.registerGameCallbacks=function(pointCallback)
{
	this._gamePointCallback={"pointCallback":pointCallback};
}

//initialize the view
//passes in 2 callbacks: 
	//  - _flippedCallback() for flipped tiles
	//  - _checkIDsCallback which takes two ids and returns a boolean
CLASS_Mediator.prototype.initView = function(title) 
{
	this._view.initView(title,this._gameData,$.proxy(this._flippedCallback, this));
	this._title=title;
}

//refreshes the view
//title does not change and callback should not change
CLASS_Mediator.prototype.renderView = function()
{
	this._view.initView(this._title,this._gameData,null);
}

//shuffles the order of the game Data
CLASS_Mediator.prototype.shuffle = function()
{
	var len=this._gameData.length;
	var unSortedData=new Array();
	for (var i=0; i<len; i++)
	{
		var range = this._gameData.length;
		var rand = Math.floor(Math.random()*range);
		rand=(rand==range)? rand-1:rand; //limit check
		unSortedData.push(this._gameData[rand]);
		this._gameData.splice(rand,1);
	}
	this._gameData=unSortedData;
    this._addIDs();
	console.log(this._gameData);
}


//---------------------HELPERS ---------------------//
//adds ID properties to the gameData
CLASS_Mediator.prototype._addIDs = function()
{
	var len=this._gameData.length;
	for (var i=0; i<len; i++)
	{
		var entry=this._gameData[i];
		entry.id=i;
	}
}

//returns all tiles if wait-period is reached
CLASS_Mediator.prototype.resetClicker = function(waitTime) {	
	var wait=this.CLICK_WAIT_TIME;
	if (waitTime)
	{ wait=waitTime;}
	if (this.clickTimer) { this.clickTimer.clear();}
	this.clickTimer=new Ticker(wait,1,$.proxy(this.flipAllBack,this),null);	
	this.clickTimer.start();
}

//starts a game timer
CLASS_Mediator.prototype.setGameTimer = function(timerInfo) {
	if (timeInfo) {
	 if (this.timer) { this.timer.clear();}
	 this.timer=new Ticker(timerInfo.duration,
	                        timerInfo.interval,
							timerInfo.completeCallback,
							timerInfo.tickCallback);
	 this.timer.start();
	 //this._view.assignTimer(this.timer);
	}
}

//-------------------- HANDLERS ----------------------//

//flipped callback triggered when a view's tile was flipped
CLASS_Mediator.prototype._flippedCallback = function(id)
{
  var self=this;
	this.clickAccum.push(id);	
	if (this.clickAccum.length==this.MAX_CLICK)
	{
		var id1=this.clickAccum[0];
		var id2=this.clickAccum[1];
		result=self._checkIDsCallback(id1,id2);
		self.clickAccum.length=0; //clear array		
		self.resetClicker();
		//flip back
		if (!result) {
			setTimeout(function(){
				self._view.flipTile(id1);
				self._view.flipTile(id2);
			}, 1000);
  	    } else { //correct click
			self._gamePointCallback["pointCallback"](); //notify controller
		}
	} else {
	self.resetClicker();	
	}
}

//flip all clicked items back
CLASS_Mediator.prototype.flipAllBack = function()
{
	for (var i=0; i<this.clickAccum.length;i++)
	{
		var id=this.clickAccum[i];
		this._view.flipTile(id);
	}
	this.clickAccum.length=0; //clear array
}

//checks whether two ids match and returns a boolean
CLASS_Mediator.prototype._checkIDsCallback = function(id1,id2)
{
	var item1=this._gameData[id1];
	var item2=this._gameData[id2];
  console.log(id1,id2,item1, item2);
	var result=this._fullData.comparator(item1,item2);
	return result;
}






