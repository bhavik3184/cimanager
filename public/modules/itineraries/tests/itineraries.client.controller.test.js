'use strict';

(function() {
	// Itineraries Controller Spec
	describe('Itineraries Controller Tests', function() {
		// Initialize global variables
		var ItinerariesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Itineraries controller.
			ItinerariesController = $controller('ItinerariesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Itinerary object fetched from XHR', inject(function(Itineraries) {
			// Create sample Itinerary using the Itineraries service
			var sampleItinerary = new Itineraries({
				name: 'New Itinerary'
			});

			// Create a sample Itineraries array that includes the new Itinerary
			var sampleItineraries = [sampleItinerary];

			// Set GET response
			$httpBackend.expectGET('itineraries').respond(sampleItineraries);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.itineraries).toEqualData(sampleItineraries);
		}));

		it('$scope.findOne() should create an array with one Itinerary object fetched from XHR using a itineraryId URL parameter', inject(function(Itineraries) {
			// Define a sample Itinerary object
			var sampleItinerary = new Itineraries({
				name: 'New Itinerary'
			});

			// Set the URL parameter
			$stateParams.itineraryId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/itineraries\/([0-9a-fA-F]{24})$/).respond(sampleItinerary);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.itinerary).toEqualData(sampleItinerary);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Itineraries) {
			// Create a sample Itinerary object
			var sampleItineraryPostData = new Itineraries({
				name: 'New Itinerary'
			});

			// Create a sample Itinerary response
			var sampleItineraryResponse = new Itineraries({
				_id: '525cf20451979dea2c000001',
				name: 'New Itinerary'
			});

			// Fixture mock form input values
			scope.name = 'New Itinerary';

			// Set POST response
			$httpBackend.expectPOST('itineraries', sampleItineraryPostData).respond(sampleItineraryResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Itinerary was created
			expect($location.path()).toBe('/itineraries/' + sampleItineraryResponse._id);
		}));

		it('$scope.update() should update a valid Itinerary', inject(function(Itineraries) {
			// Define a sample Itinerary put data
			var sampleItineraryPutData = new Itineraries({
				_id: '525cf20451979dea2c000001',
				name: 'New Itinerary'
			});

			// Mock Itinerary in scope
			scope.itinerary = sampleItineraryPutData;

			// Set PUT response
			$httpBackend.expectPUT(/itineraries\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/itineraries/' + sampleItineraryPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid itineraryId and remove the Itinerary from the scope', inject(function(Itineraries) {
			// Create new Itinerary object
			var sampleItinerary = new Itineraries({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Itineraries array and include the Itinerary
			scope.itineraries = [sampleItinerary];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/itineraries\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleItinerary);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.itineraries.length).toBe(0);
		}));
	});
}());