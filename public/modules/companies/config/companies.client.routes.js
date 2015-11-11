'use strict';

//Setting up route
angular.module('companies').config(['$stateProvider',
	function($stateProvider) {
		// Companies state routing
		$stateProvider.
		state('listCompanies', {
			url: '/companies',
			templateUrl: 'modules/companies/views/list-companies.client.view.html'
		}).
		state('createCompany', {
			url: '/companies/create',
			templateUrl: 'modules/companies/views/create-company.client.view.html'
		}).
		state('viewCompany', {
			url: '/companies/:companyId',
			templateUrl: 'modules/companies/views/view-company.client.view.html'
		}).
		state('editCompany', {
			url: '/companies/:companyId/edit',
			templateUrl: 'modules/companies/views/edit-company.client.view.html'
		});
	}
]);