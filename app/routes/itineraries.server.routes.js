'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var itineraries = require('../../app/controllers/itineraries.server.controller');

	// Itineraries Routes
	app.route('/itineraries')
		.get(users.requiresLogin,itineraries.list)
		.post(users.requiresLogin, itineraries.create);

	app.route('/itineraries/:itineraryId')
		.get(itineraries.read)
		.put(users.requiresLogin, itineraries.hasAuthorization, itineraries.update)
		.delete(users.requiresLogin, itineraries.hasAuthorization, itineraries.delete);

	// Finish by binding the Itinerary middleware
	app.param('itineraryId', itineraries.itineraryByID);
};
