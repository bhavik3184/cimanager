'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Itinerary = mongoose.model('Itinerary'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, itinerary;

/**
 * Itinerary routes tests
 */
describe('Itinerary CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Itinerary
		user.save(function() {
			itinerary = {
				name: 'Itinerary Name'
			};

			done();
		});
	});

	it('should be able to save Itinerary instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Itinerary
				agent.post('/itineraries')
					.send(itinerary)
					.expect(200)
					.end(function(itinerarySaveErr, itinerarySaveRes) {
						// Handle Itinerary save error
						if (itinerarySaveErr) done(itinerarySaveErr);

						// Get a list of Itineraries
						agent.get('/itineraries')
							.end(function(itinerariesGetErr, itinerariesGetRes) {
								// Handle Itinerary save error
								if (itinerariesGetErr) done(itinerariesGetErr);

								// Get Itineraries list
								var itineraries = itinerariesGetRes.body;

								// Set assertions
								(itineraries[0].user._id).should.equal(userId);
								(itineraries[0].name).should.match('Itinerary Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Itinerary instance if not logged in', function(done) {
		agent.post('/itineraries')
			.send(itinerary)
			.expect(401)
			.end(function(itinerarySaveErr, itinerarySaveRes) {
				// Call the assertion callback
				done(itinerarySaveErr);
			});
	});

	it('should not be able to save Itinerary instance if no name is provided', function(done) {
		// Invalidate name field
		itinerary.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Itinerary
				agent.post('/itineraries')
					.send(itinerary)
					.expect(400)
					.end(function(itinerarySaveErr, itinerarySaveRes) {
						// Set message assertion
						(itinerarySaveRes.body.message).should.match('Please fill Itinerary name');
						
						// Handle Itinerary save error
						done(itinerarySaveErr);
					});
			});
	});

	it('should be able to update Itinerary instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Itinerary
				agent.post('/itineraries')
					.send(itinerary)
					.expect(200)
					.end(function(itinerarySaveErr, itinerarySaveRes) {
						// Handle Itinerary save error
						if (itinerarySaveErr) done(itinerarySaveErr);

						// Update Itinerary name
						itinerary.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Itinerary
						agent.put('/itineraries/' + itinerarySaveRes.body._id)
							.send(itinerary)
							.expect(200)
							.end(function(itineraryUpdateErr, itineraryUpdateRes) {
								// Handle Itinerary update error
								if (itineraryUpdateErr) done(itineraryUpdateErr);

								// Set assertions
								(itineraryUpdateRes.body._id).should.equal(itinerarySaveRes.body._id);
								(itineraryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Itineraries if not signed in', function(done) {
		// Create new Itinerary model instance
		var itineraryObj = new Itinerary(itinerary);

		// Save the Itinerary
		itineraryObj.save(function() {
			// Request Itineraries
			request(app).get('/itineraries')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Itinerary if not signed in', function(done) {
		// Create new Itinerary model instance
		var itineraryObj = new Itinerary(itinerary);

		// Save the Itinerary
		itineraryObj.save(function() {
			request(app).get('/itineraries/' + itineraryObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', itinerary.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Itinerary instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Itinerary
				agent.post('/itineraries')
					.send(itinerary)
					.expect(200)
					.end(function(itinerarySaveErr, itinerarySaveRes) {
						// Handle Itinerary save error
						if (itinerarySaveErr) done(itinerarySaveErr);

						// Delete existing Itinerary
						agent.delete('/itineraries/' + itinerarySaveRes.body._id)
							.send(itinerary)
							.expect(200)
							.end(function(itineraryDeleteErr, itineraryDeleteRes) {
								// Handle Itinerary error error
								if (itineraryDeleteErr) done(itineraryDeleteErr);

								// Set assertions
								(itineraryDeleteRes.body._id).should.equal(itinerarySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Itinerary instance if not signed in', function(done) {
		// Set Itinerary user 
		itinerary.user = user;

		// Create new Itinerary model instance
		var itineraryObj = new Itinerary(itinerary);

		// Save the Itinerary
		itineraryObj.save(function() {
			// Try deleting Itinerary
			request(app).delete('/itineraries/' + itineraryObj._id)
			.expect(401)
			.end(function(itineraryDeleteErr, itineraryDeleteRes) {
				// Set message assertion
				(itineraryDeleteRes.body.message).should.match('User is not logged in');

				// Handle Itinerary error error
				done(itineraryDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Itinerary.remove().exec();
		done();
	});
});