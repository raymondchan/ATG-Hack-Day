function TileData(id, photo)
{
    this._id = id;
    this._photo = photo;

    this._flipped = false;
}

TileData.prototype.getId = function()
{
    return this._id;
}
TileData.prototype.getPhoto = function()
{
    return this._photo;
}
TileData.prototype.isFlipped = function()
{
    return this._flipped;
}
TileData.prototype.setFlipped = function(newVal)
{
    this._flipped = newVal;
}


function MemoryGameView()
{
    this._tileFlippedCallback = null;

    this._tileData = {};  // associative array of id => TileData objects
    this._running = false;

    this._initHeaderView();
}

MemoryGameView.prototype.initView = function(gameTitle, data, tileFlippedCallback)
{
    this._setHeader(gameTitle);
    if (typeof tileFlippedCallback == "function")
	this._tileFlippedCallback = tileFlippedCallback;

    // clear out existing tiles and reload
    $("#tiles").empty();
    this._tileData = {};
    for (var i = 0; i < data.length; i++)
    {
	// TODO: should check for duplicate ids
	this._addTile(data[i]);
    }
    // add spacer div to ensure proper layout below the grid
    $("#tiles").append("<div class='spacer'></div>");
}


MemoryGameView.prototype.startGame = function()
{
    this._running = true;
}


MemoryGameView.prototype.endGame = function()
{
    this._running = false;
}

MemoryGameView.prototype.flipTile = function(id)
{
    if (!this._tileData[id])
	return;

    var domId = "tile_" + id;
    if (this._tileData[id].isFlipped()) {
	// hide tile
	$("#"+domId).addClass("hidden");
	$("#"+domId).css("background-image", "");
	this._tileData[id].setFlipped(false);
    }
    else {
	// show tile
	$("#"+domId).removeClass("hidden");
	$("#"+domId).css("background-image", "url('"+this._tileData[id].getPhoto()+"')");
	this._tileData[id].setFlipped(true);
    }
}

MemoryGameView.prototype.setTimerDisplay = function(msg)
{
    $("#timer").html(msg);
}

MemoryGameView.prototype._initHeaderView = function()
{
    $("#header").html('<div id="header_text"></div><div id="timer"></div><div class="spacer"></div>');
}

MemoryGameView.prototype._handleTileClicked = function(event)
{
    //if (!this._running) // ignore clicks when game isn't running
	//return;

    var clickedDomId = event.target.id;
    var clickedId = clickedDomId.substring(5);

    if (!this._tileData[clickedId].isFlipped()) {
	// flip tile, trigger callback (unless tile is already flipped, in
	// which case user is a moron
	this.flipTile(clickedId);

	if (typeof this._tileFlippedCallback == "function") {
	    this._tileFlippedCallback(clickedId);
	}
    }
}


MemoryGameView.prototype._addTile = function(tileData)
{
    // NOTE: all tiles start off in "hidden" state
    var tileDomId = "tile_" + tileData.id;
    var w = Math.floor($(window).width() / 4)-8;
    $("#tiles").append("<div id='"+tileDomId+"' class='tile hidden' style='width:"+w+"px;height:"+w+"px'>?</div>");
    $("#" + tileDomId).click($.proxy(this._handleTileClicked, this));

    var preloadImg = new Image();
    preloadImg.src = tileData.url;

    this._tileData[tileData.id] = new TileData(tileData.id, tileData.url);
}

MemoryGameView.prototype._setHeader = function(msg)
{
    $("#header_text").empty();
    $("#header_text").html(msg);
}
