'use strict';

// Itineraries controller
angular.module('itineraries').controller('ItinerariesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Itineraries',
	function($scope, $stateParams, $location, Authentication, Itineraries) {
		$scope.authentication = Authentication;

		// Create new Itinerary
		$scope.create = function() {
			// Create new Itinerary object
			var itinerary = new Itineraries ({
				name: this.name
			});

			// Redirect after save
			itinerary.$save(function(response) {
				$location.path('itineraries/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Itinerary
		$scope.remove = function(itinerary) {
			if ( itinerary ) { 
				itinerary.$remove();

				for (var i in $scope.itineraries) {
					if ($scope.itineraries [i] === itinerary) {
						$scope.itineraries.splice(i, 1);
					}
				}
			} else {
				$scope.itinerary.$remove(function() {
					$location.path('itineraries');
				});
			}
		};

		// Update existing Itinerary
		$scope.update = function() {
			var itinerary = $scope.itinerary;

			itinerary.$update(function() {
				$location.path('itineraries/' + itinerary._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Itineraries
		$scope.find = function() {
			$scope.itineraries = Itineraries.query();
		};

		// Find existing Itinerary
		$scope.findOne = function() {
			$scope.itinerary = Itineraries.get({ 
				itineraryId: $stateParams.itineraryId
			});
		};
	}
]);