'use strict';

//Setting up route
angular.module('itineraries').config(['$stateProvider',
	function($stateProvider) {
		// Itineraries state routing
		$stateProvider.
		state('planned-itineraries', {
			url: '/planned-itineraries',
			templateUrl: 'modules/itineraries/views/planned-itineraries.client.view.html'
		}).
		state('listItineraries', {
			url: '/itineraries',
			templateUrl: 'modules/itineraries/views/list-itineraries.client.view.html'
		}).
		state('createItinerary', {
			url: '/itineraries/create',
			templateUrl: 'modules/itineraries/views/create-itinerary.client.view.html'
		}).
		state('viewItinerary', {
			url: '/itineraries/:itineraryId',
			templateUrl: 'modules/itineraries/views/view-itinerary.client.view.html'
		}).
		state('editItinerary', {
			url: '/itineraries/:itineraryId/edit',
			templateUrl: 'modules/itineraries/views/edit-itinerary.client.view.html'
		});
	}
]);