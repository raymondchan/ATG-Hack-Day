/**
 * Ticker class
 * NOTE: this requires JQuery
 *
 * @author Raymond Chan, 2011
 */

// NOTE: all times in msec
function Ticker(duration, interval, completedCallback, tickCallback) {
    this._startTime = null;
    this._duration = duration;
    this._interval = interval;
    this._completedCallback = completedCallback;
    this._tickCallback = tickCallback;
}

Ticker.prototype.start = function()
{
    var currDate = new Date();
    this._startTime = currDate.getTime();
    
    setTimeout($.proxy(this._handleTick, this), this._interval);
}

Ticker.prototype.getRemainingTime = function()
{
    var currDate = new Date();
    return this._startTime + this._duration - currDate.getTime();
}

Ticker.prototype.clear = function()
{
    this._startTime = null;
    this._duration = null;
    this._interval = null;
    this._completedCallback = null;
    this._tickCallback = null;
}

Ticker.prototype._handleTick = function()
{
    if (!this._startTime) // timer was stopped
	return;
    
    var currDate = new Date();
    
    // check that we haven't gone over time
    if (currDate.getTime() > this._startTime + this._duration) {
	// timer complete, clean up and trigger callback
	if (typeof this._completedCallback == "function")
	    this._completedCallback();

	this.clear();
    }
    else {
	if (typeof this._tickCallback == "function")
	    this._tickCallback();
	
	// TODO: should set the time to be the actual diff between next sec and curr time; don't assume we're on schedule!
	setTimeout($.proxy(this._handleTick, this), this._interval);
    }
}

