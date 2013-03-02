// -------------------------------------------//
//	 	Maperial Login Lib
// -------------------------------------------//

this.MaperialAuth = {};

// -------------------------------------------//

MaperialAuth.authorize = function() 
{
	var authorizeURL = "http://map.x-ray.fr/user/auth"
		+ "?redirect=" + App.Globals.APP_URL + "/maperialAuthToken";

	Utils.popup(authorizeURL, 'signin', 400, 150);
}

MaperialAuth.badtoken = function () 
{
	console.log("badtoken !!!");
}

MaperialAuth.tokenGranted = function (token, email) 
{
	App.user.set("email", email);
	App.user.set("maperialToken", token);
	App.user.set("loggedIn", true);
	
	UserManager.getAccount();
	
	MaperialAuth.checkPresence();
}

//-------------------------------------------//

MaperialAuth.checkIfIsLoggedIn = function()
{
	setTimeout(function(){
		$.ajax({
			type: "POST",  
			url: "http://map.x-ray.fr/user/islogin",
			data: {token : App.user.maperialToken},
			success: function (data, textStatus, jqXHR)
			{
				if(data.login)
				{
					MaperialAuth.checkIfIsLoggedIn();
				}
				else{
					alert("logged out !");
					App.user.set("loggedIn", false);
				}
			}
		});
		
	}, 20*1000);
}

// -------------------------------------------//

MaperialAuth.dummy = function()
{
	App.user.set("name", "Bob Le Bobby");
	App.user.set("email", "dummy@maperial.fr");
	App.user.set("loggedIn", true);
	
	UserManager.getAccount();
}