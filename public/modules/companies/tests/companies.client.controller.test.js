'use strict';

(function() {
	// Companies Controller Spec
	describe('Companies Controller Tests', function() {
		// Initialize global variables
		var CompaniesController,
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

			// Initialize the Companies controller.
			CompaniesController = $controller('CompaniesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Company object fetched from XHR', inject(function(Companies) {
			// Create sample Company using the Companies service
			var sampleCompany = new Companies({
				name: 'New Company'
			});

			// Create a sample Companies array that includes the new Company
			var sampleCompanies = [sampleCompany];

			// Set GET response
			$httpBackend.expectGET('companies').respond(sampleCompanies);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.companies).toEqualData(sampleCompanies);
		}));

		it('$scope.findOne() should create an array with one Company object fetched from XHR using a companyId URL parameter', inject(function(Companies) {
			// Define a sample Company object
			var sampleCompany = new Companies({
				name: 'New Company'
			});

			// Set the URL parameter
			$stateParams.companyId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/companies\/([0-9a-fA-F]{24})$/).respond(sampleCompany);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.company).toEqualData(sampleCompany);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Companies) {
			// Create a sample Company object
			var sampleCompanyPostData = new Companies({
				name: 'New Company'
			});

			// Create a sample Company response
			var sampleCompanyResponse = new Companies({
				_id: '525cf20451979dea2c000001',
				name: 'New Company'
			});

			// Fixture mock form input values
			scope.name = 'New Company';

			// Set POST response
			$httpBackend.expectPOST('companies', sampleCompanyPostData).respond(sampleCompanyResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Company was created
			expect($location.path()).toBe('/companies/' + sampleCompanyResponse._id);
		}));

		it('$scope.update() should update a valid Company', inject(function(Companies) {
			// Define a sample Company put data
			var sampleCompanyPutData = new Companies({
				_id: '525cf20451979dea2c000001',
				name: 'New Company'
			});

			// Mock Company in scope
			scope.company = sampleCompanyPutData;

			// Set PUT response
			$httpBackend.expectPUT(/companies\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/companies/' + sampleCompanyPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid companyId and remove the Company from the scope', inject(function(Companies) {
			// Create new Company object
			var sampleCompany = new Companies({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Companies array and include the Company
			scope.companies = [sampleCompany];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/companies\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCompany);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.companies.length).toBe(0);
		}));
	});
}());