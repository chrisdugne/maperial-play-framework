(function( app ) {
	'use strict';

	var User = Ember.Object.extend({
		userUID: "",
		email: "",
		name: "",
		maps: [],
		styles: [],
		datasets: Ember.Array,
		colorbars: [],
		fonts: [],
		icons: [],
		loggedIn: false
	});
	
	app.user = User.create();
	
})( window.Webapp);