'use strict';

// Configuring the Articles module
angular.module('itineraries').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Itineraries', 'itineraries', 'dropdown', '/itineraries(/create)?');
		Menus.addSubMenuItem('topbar', 'itineraries', 'List Itineraries', 'itineraries');
		Menus.addSubMenuItem('topbar', 'itineraries', 'New Itinerary', 'itineraries/create');
	}
]);