
(function() {
	'use strict';

	var FontsController = Ember.ObjectController.extend({});

	//==================================================================//

	FontsController.renderUI = function()
	{
      App.refreshSizes();
	}

	FontsController.cleanUI = function()
	{
		
	}

	//==================================================================//
	// Controls

	App.FontsController = FontsController;

	//==================================================================//
	// Routing

	App.FontsRouting = Ember.Route.extend({
		route: '/fonts',
	
		connectOutlets: function(router){
			App.Router.openPage(router, "fonts");
		}
	});

	//==================================================================//

})();