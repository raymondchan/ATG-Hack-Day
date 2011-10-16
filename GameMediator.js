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
}

//fetches game data from the backend
CLASS_Mediator.prototype.getData = function(category,size,callback) 
{
  var self = this;
	this._provider.getGameData({"category":category,
	                       "size":size,
						   "callback": function (d) {
						     console.log(d);
					self._fullData=d;
	                self._gameData=self._fullData.data;
	                self._addIDs();
	                callback();
	}}
	);
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

//-------------------- HANDLERS ----------------------//

//flipped callback triggered when a view's tile was flipped
CLASS_Mediator.prototype._flippedCallback = function(id)
{
	this.clickAccum.push(id);	
	if (this.clickAccum.length==this.MAX_CLICK)
	{
		var id1=this.clickAccum[0];
		var id2=this.clickAccum[1];
		result=_checkIDsCallback(id1,id2);
		this.clickAccum.length=0; //clear array
		//flip back
		if (!result) {
			this._view.flipTile(id1);
			this._view.flipTile(id2);
		}
	}
	
}

//checks whether two ids match and returns a boolean
CLASS_Mediator.prototype._checkIDsCallback = function(id1,id2)
{
	var item1=this._gameData[id1];
	var item2=this._gameData[id2];
	var result=this._fullData.comparator(item1,item2);
	return result;
}






