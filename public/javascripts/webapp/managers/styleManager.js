// -------------------------------------------//
//	 			StyleManager
// -------------------------------------------//

this.StyleManager = {};

// -------------------------------------------//

StyleManager.uploadNewStyle = function(style)
{
	$.ajax({
	    type: "POST",
	    url: Globals.mapServer + "/api/style?_method=DATA",
	    data: JSON.stringify(style.content),  
	    dataType: "json",
	    success: function (data, textStatus, jqXHR)
		{
	    	var result = data.files[0];
	    	var styleUID = result.styleUID;
	    	
	    	var newStyle = App.stylesData.selectedStyle;
	    	newStyle.uid = styleUID;
	    	newStyle.content = null; // useless to keep user.style[i].content (full style.json) all around (+ doesnt work with a huge json..?)
	    	
			App.user.styles.pushObject(newStyle);
			App.get('router').transitionTo('styles');
			
			StyleManager.addStyleInDB(newStyle);
		}
	});
}


StyleManager.saveStyle = function(style)
{
	App.user.set("waiting", true);

	$.ajax({
		type: "POST",
		url: Globals.mapServer + "/api/style?_method=DATA&uid=" + style.uid,
		data: JSON.stringify(style.content), 
		dataType: "text",
		success: function (data, textStatus, jqXHR)
		{
			style.content = null; // useless to keep user.style.content (full style.json) all around (+ doesnt work with a huge json..?)
			StyleManager.editStyleInDB(style);
		}
	});
}

// -------------------------------------------//

StyleManager.addStyleInDB = function(style)
{
	var params = new Object();
	params["user"] = App.user;
	params["style"] = style;
	
	$.ajax({  
	    type: "POST",  
	    url: "/addStyle",
	    data: JSON.stringify(params),  
	    contentType: "application/json; charset=utf-8",
	    dataType: "text",
	    success: function (data, textStatus, jqXHR)
		{
	    	
		}
	});
}

// -------------------------------------------//

StyleManager.editStyleInDB = function(style)
{
	var params = new Object();
	params["style"] = style;
	
	$.ajax({  
		type: "POST",  
		url: "/editStyle",
		data: JSON.stringify(params),  
		contentType: "application/json; charset=utf-8",
		dataType: "text",
		success: function (data, textStatus, jqXHR)
		{
			App.user.set("waiting", false);
		}
	});
}

// -------------------------------------------//

StyleManager.getStyle = function(styleUID, next)
{
	console.log("getStyle : " + styleUID);

	$.ajax({  
	    type: "GET",  
	    url: Globals.mapServer + "/api/style/" + styleUID,
	    dataType: "json",
	    success: function (data, textStatus, jqXHR)
		{
    		App.stylesData.selectedStyle.content = data;
    		next();
		}
	});
}

// -------------------------------------------//

StyleManager.deleteStyle = function(style)
{
	$.ajax({  
	    type: "DELETE",  
	    url: Globals.mapServer + "/api/style?key=" + style.uid,
	    dataType: "text",
	    success: function (data, textStatus, jqXHR)
		{
	    	// remove from the user list
    		App.user.styles.removeObject(style);
    		
    		// remove from the db
    		var params = new Object();
    		params["style"] = style;
    		
    		$.ajax({  
    		    type: "POST",  
    		    url: "/removeStyle",
    		    data: JSON.stringify(params),  
    		    contentType: "application/json; charset=utf-8"
    		});
		}
	});
}

// -------------------------------------------//