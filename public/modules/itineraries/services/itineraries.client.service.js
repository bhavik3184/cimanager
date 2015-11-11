'use strict';

//Itineraries service used to communicate Itineraries REST endpoints
angular.module('itineraries').factory('Itineraries', ['$resource', function ($resource) {
    return $resource('itineraries/:itineraryId', {itineraryId: '@_id'},
        {
            update: {method: 'PUT'}
        });
}
]);
