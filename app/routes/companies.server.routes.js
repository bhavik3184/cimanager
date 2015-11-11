'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var companies = require('../../app/controllers/companies.server.controller');

	// Companies Routes
	//app.route('/companies/list')
	//	.get(companies.list);

	app.route('/companies')
		.get(users.requiresLogin,companies.list)
		.post(users.requiresLogin, companies.create);

	app.route('/companies/:companyId')
		.get(companies.read)
		.put(users.requiresLogin, companies.hasAuthorization, companies.update)
		.delete(users.requiresLogin, companies.hasAuthorization, companies.delete);

	// Finish by binding the Company middleware
	app.param('companyId', companies.companyByID);
};
