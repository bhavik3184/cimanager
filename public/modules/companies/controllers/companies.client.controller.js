'use strict';

// Companies controller
angular.module('companies').controller('CompaniesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Companies',
    function ($scope, $stateParams, $location, Authentication, Companies) {
        $scope.agendamaster = ['Payment', 'Lead Generation', 'Offer Follow Up', 'Business Review meeting', 'Negotiation or Order Finalaization',
            'Others'];

        $scope.newItinerary ={companyID:'',agenda:'',userID:''};
        $scope.minDate = new Date();
        $scope.minDate.setDate($scope.minDate.getDate() - 7);
        $scope.maxDate = new Date();
        $scope.maxDate.setDate($scope.maxDate.getDate() + 60);

        $scope.authentication = Authentication;

        //Datepicker - start

        $scope.today = function () {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function (date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.open = function ($event) {
            $scope.status.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        $scope.status = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 2);
        $scope.events =
            [
                {
                    date: tomorrow,
                    status: 'full'
                },
                {
                    date: afterTomorrow,
                    status: 'partially'
                }
            ];
        //Datepicker - End

        $scope.setitineraryCompany = function ($item, $model) {
            $scope.newItinerary.companyID= $item._id;
            $scope.itineraryItem = $item;
            $scope.itineraryModel = $model;
        };

        $scope.setitineraryAgenda = function ($item, $model) {
            $scope.newItinerary.agendaID = $item._id;
            $scope.itineraryItem = $item;
            $scope.itineraryModel = $model;
        };

        // Create new Company
        $scope.create = function () {
            // Create new Company object
            var company = new Companies({
                name: this.name
            });

            // Redirect after save
            company.$save(function (response) {
                //$location.path('companies/' + response._id);
                $scope.companies = Companies.query();

                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.companyerror = errorResponse.data.message;
            });
        };

        // Remove existing Company
        $scope.remove = function (company) {
            if (company) {
                company.$remove();

                for (var i in $scope.companies) {
                    if ($scope.companies [i] === company) {
                        $scope.companies.splice(i, 1);
                    }
                }
            } else {
                $scope.company.$remove(function () {
                    $location.path('companies');
                });
            }
        };

        // Update existing Company
        $scope.update = function () {
            var company = $scope.company;

            company.$update(function () {
                $location.path('companies/' + company._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Companies
        $scope.find = function () {
            $scope.companies = Companies.query();
        };

        // Find existing Company
        $scope.findOne = function () {
            $scope.company = Companies.get({
                companyId: $stateParams.companyId
            });
        };
    }
]);
