'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Itinerary Schema
 */
var ItinerarySchema = new Schema({
    date: {
        type: Date,
        required: 'Please fill Itinerary date'
    },
    company: {
        type: Schema.ObjectId,
        ref: 'Company'
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    agenda: {
        type: String,
        required: 'Please select agenda',
        trim: true,
        enum: ['Payment', 'Lead Generation', 'Offer Follow Up', 'Business Review meeting', 'Negotiation or Order Finalaization',
            'Others']
    },
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Itinerary', ItinerarySchema);
