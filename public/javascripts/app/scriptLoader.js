// ----------------------------//
//	 ScriptLoader
// ----------------------------//

var scriptCache = new Object();

// ----------------------------//

var scriptsRemaining;
var callbackFunction;

// ----------------------------//

function getScripts(scripts, callback) 
{
	callbackFunction = callback;
	
	if(scripts.length > 0)
	{
		var script = scripts.shift();
		scriptsRemaining = scripts;
		loadScript(script);
	}
	else
	{
		callback();
	}
}

function loadScript(src) 
{
	if(scriptCache[src])
	{
		getScripts(scriptsRemaining, callbackFunction);
		return;
	}

	p("loading " + src);
	
	$.getScript(src, function() {
		scriptCache[src] = "ok";
		getScripts(scriptsRemaining, callbackFunction);
	});
	   
}

// ----------------------------//