//--------------------------------------------------------------------------//

(function() {
	'use strict';

	var TryscreenView = Ember.View.extend({
		templateName: 'tryscreen',
		didInsertElement: function(){
			App.TryscreenController.renderUI();
         App.placeFooter();
		},
		willDestroyElement: function(){
			App.TryscreenController.cleanUI();
		}
	});
	
	App.TryscreenView = TryscreenView;

})( App);