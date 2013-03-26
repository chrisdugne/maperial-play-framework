(function() {
	'use strict';

	var ColorbarEditorView = Ember.View.extend({
		templateName: 'colorbarEditor',
		didInsertElement: function(){
			App.ColorbarEditorController.renderUI();
         App.placeFooter();
		},
		willDestroyElement: function(){
			App.ColorbarEditorController.cleanUI();
		}
	});
	
	App.ColorbarEditorView = ColorbarEditorView;

})( App);
