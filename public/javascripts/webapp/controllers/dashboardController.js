
(function() {
	'use strict';

	var DashboardController = Ember.ObjectController.extend({});

	//==================================================================//
	
	DashboardController.renderUI = function()
	{ 
	   
	}

	DashboardController.cleanUI = function()
	{
		
	}

	//==================================================================//
	
	DashboardController.refreshExportSlider = function()
	{
	   DashboardController.selectedExportZoom = App.user.selectedMap.config.map.defaultZoom ? App.user.selectedMap.config.map.defaultZoom : 12;
      
      $("#zoomSelector").slider({
         range: "min",
         min: 1,
         max: 18,
         value: DashboardController.selectedExportZoom,
         slide: function( event, ui ) {
            $("#zoomSelector a").html(ui.value);
         },
         change: function( event, ui ) {
            DashboardController.selectedExportZoom = parseInt(ui.value);
         }
       });
      
      $("#zoomSelector a").html(DashboardController.selectedExportZoom);
      Utils.buildSliderStyle("zoomSelector");	   
	}

	//==================================================================//
	// Controls
	
	DashboardController.createMap = function()
	{
	   App.mapManager.createNewMap();
      App.get('router').transitionTo('mapCreation');
	}
	
	DashboardController.viewMap = function(map)
	{
	   App.user.set("selectedMap", map);
	   App.get('router').transitionTo('viewMap');
	}

	DashboardController.editMap = function(map)
	{
	   App.user.set("selectedMap", map);
	   App.get('router').transitionTo('mapCreation');
	}

	DashboardController.deleteMap = function(map)
	{
	   App.mapManager.deleteMap(map);
	}

	//----------------------//

	DashboardController.openExportWindow = function(map){

      App.user.set("selectedMap", map);
      App.user.set("isExportingAMap", true);
      DashboardController.refreshExportSlider();
      
      if(!map.config.map.latMin)
         $("#exportArea").addClass("hide")
      else
         $("#exportArea").removeClass("hide")
         
      $("#exportMapWindow").modal();
      $("#exportMapWindow").off("hidden");
      $("#exportMapWindow").on("hidden", function(){
         App.user.set("selectedMap", null);
         App.user.set("isExportingAMap", false);
      });
	}
	
	DashboardController.exportMap = function()
	{
	   App.mapManager.exportMap(DashboardController.selectedExportZoom);
	}
	
	//----------------------//
	
	App.DashboardController = DashboardController;

	//==================================================================//
	// Routing

	App.DashboardRouting = Ember.Route.extend({
		route: '/dashboard',
		
		connectOutlets: function(router){
		   var customContext = new Object();
		   customContext["datasetsData"] = App.datasetsData;
			App.Router.openPage(router, "dashboard", customContext);
		},
		
		//------------------------------------------//
		// actions

		createMap: function(){
		   DashboardController.createMap();
      },
      
      viewMap: function(router, event){
         var map = event.context;
         DashboardController.viewMap(map);
      },

      editMap: function(router, event){
         var map = event.context;
         DashboardController.editMap(map);
      },
      
      exportMap: function(){
         DashboardController.exportMap();
      },
      
      openExportWindow: function(router, event){
         var map = event.context;
         DashboardController.openExportWindow(map);
      },
      
      deleteMap: function(router, event){
         var map = event.context;
         DashboardController.deleteMap(map);
      },
      
		styles: Ember.Route.transitionTo('styles'),
		colorbars: Ember.Route.transitionTo('colorbars'),
		datasets: Ember.Route.transitionTo('datasets'),
		icons: Ember.Route.transitionTo('icons'),
		fonts: Ember.Route.transitionTo('fonts')
	});

	//==================================================================//

})();