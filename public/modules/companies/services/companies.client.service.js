'use strict';

//Companies service used to communicate Companies REST endpoints
angular.module('companies').factory('Companies', ['$resource',
    function ($resource) {
        return $resource('companies/:companyId', {
            companyId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
])
    //.factory('Companies', ['$resource', function ($resource) {
    //    return $resource('companies/list', '', {get: {method: 'GET'}});
    //}])
;
