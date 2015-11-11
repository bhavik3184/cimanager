'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Itinerary = mongoose.model('Itinerary'),
    Company = mongoose.model('Company'),
    _ = require('lodash');

/**
 * Create a Itinerary
 */
exports.create = function (req, res) {
    var itinerary = new Itinerary(req.body);
    itinerary.user = req.user;
    //itinerary.company = req.company;
    //itinerary.isCompleted = (req.description == "" ? false : true);
    //itinerary.date = req.date;
    //itinerary.agenda = req.agenda;

    itinerary.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(itinerary);
        }
    });
};

/**
 * Show the current Itinerary
 */
exports.read = function (req, res) {
    res.jsonp(req.itinerary);
};

/**
 * Update a Itinerary
 */
exports.update = function (req, res) {
    var itinerary = req.itinerary;
    //itinerary.isCompleted = (req.description.toString().isEmpty() ? false : true);

    itinerary = _.extend(itinerary, req.body);

    itinerary.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(itinerary);
        }
    });
};

/**
 * Delete an Itinerary
 */
exports.delete = function (req, res) {
    var itinerary = req.itinerary;

    itinerary.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(itinerary);
        }
    });
};

/**
 * List of Itineraries
 */
exports.list = function (req, res) {
    Itinerary.find().sort('-created').populate('user', 'displayName').populate('company','name').exec(function (err, itineraries) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(itineraries);
        }
    });
};

/**
 * Itinerary middleware
 */
exports.itineraryByID = function (req, res, next, id) {
    Itinerary.findById(id).populate('user', 'displayName').exec(function (err, itinerary) {
        if (err) return next(err);
        if (!itinerary) return next(new Error('Failed to load Itinerary ' + id));
        req.itinerary = itinerary;
        next();
    });
};

/**
 * Itinerary authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.itinerary.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
