'use strict';

angular.module('dashboards').controller('DashboardsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Dashboards', 'Companies', 'Itineraries', 'uiGridGroupingConstants',
    function ($scope, $stateParams, $location, Authentication, Dashboards, Companies, Itineraries, uiGridGroupingConstants) {

        // <editor-fold desc="Variables">
        $scope.authentication = Authentication;
        $scope.agendamaster = ['Payment', 'Lead Generation', 'Offer Follow Up', 'Business Review meeting', 'Negotiation or Order Finalaization',
            'Others'];
        $scope.newItinerary = new Itineraries();

        $scope.minDate = new Date();
        $scope.minDate.setDate($scope.minDate.getDate() - 7);
        $scope.maxDate = new Date();
        $scope.maxDate.setDate($scope.maxDate.getDate() + 60);
        $scope.itineraryData = {
            enableSorting: true,
            enableCellEdit: false,
            enableFiltering: true,
            treeRowHeaderAlwaysVisible: false,

            enableGridMenu: true,
            enableSelectAll: true,
            exporterCsvFilename: 'ItineraryReport.csv',
            exporterPdfDefaultStyle: {fontSize: 9},
            exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
            exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
            exporterPdfHeader: {text:  'Itinerary report', style: 'headerStyle'},
            exporterPdfFooter: function (currentPage, pageCount) {
                return {text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle'};
            },
            exporterPdfCustomFormatter: function (docDefinition) {
                docDefinition.styles.headerStyle = {fontSize: 22, bold: true};
                docDefinition.styles.footerStyle = {fontSize: 10, bold: true};
                return docDefinition;
            },
            exporterPdfOrientation: 'portrait',
            exporterPdfPageSize: 'LETTER',
            exporterPdfMaxGridWidth: 500,
            exporterCsvLinkElement: angular.element(document.querySelectorAll('.custom-csv-link-location')),

            columnDefs: [
                {
                    name: 'Company',
                    field: 'company.name',
                    grouping: {groupPriority: 1},
                    sort: {priority: 1, direction: 'asc'},
                    width: '30%'
                },
                {
                    name: 'Date',
                    field: 'date',
                    cellFilter: 'date:"dd MMMM,yyyy"',
                    sort: {priority: 2, direction: 'asc'},
                    width: '18%'
                },
                {name: 'Agenda', field: 'agenda'},
                {name: 'MOM', field: 'description'}
            ]
        };
        $scope.allItineraryData = new Itineraries();
        $scope.piCount = 3;
        // </editor-fold>

        // <editor-fold desc="Company">
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

        // Find a list of Companies
        $scope.listCompanies = function () {
            $scope.companies = Companies.query();
        };
        // </editor-fold>

        // <editor-fold desc="Itinerary">
        $scope.setitineraryCompany = function (item, $model) {
            $scope.newItinerary.company = item._id;
        };

        $scope.setitineraryAgenda = function (item, $model) {
            $scope.newItinerary.agenda = item;
        };


        // Create new Itinerary
        $scope.updateShowingofPlannedItineraries = function ($item, $model) {
            $scope.piCount = $item;
        };

        var fncGetPendingItinerary = function () {
            function formatDate(date) {
                var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();

                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;

                return [year, month, day].join('-');
            }

            Itineraries.query().$promise.then(function (data) {
                $scope.totalPendingItinary = query('date').lt(formatDate(new Date()))
                    .and('isCompleted').equals(false)
                    .sort('date')
                    .on(data);

                if ($scope.totalPendingItinary.length > 0) {
                    $scope.pendingItinary = query('date').lt(formatDate(new Date()))
                        .and('isCompleted').equals(false)
                        .sort('date')
                        .limit(1)
                        .on(data);
                }
            });

        };

        var fncGetPlannedItineraries = function () {
            Itineraries.query().$promise.then(function (data) {
                $scope.allItineraryData = data;
                function formatDate(date) {
                    var d = new Date(date),
                        month = '' + (d.getMonth() + 1),
                        day = '' + d.getDate(),
                        year = d.getFullYear();

                    if (month.length < 2) month = '0' + month;
                    if (day.length < 2) day = '0' + day;

                    return [year, month, day].join('-');
                }

                $scope.allItineraryData = query('date').gt(formatDate(new Date()))
                    .and('isCompleted').equals(false)
                    .sort('date')
                    .on(data);
            });
        };

        var fncGetItinerariesReport = function () {
            $scope.itineraryData.data = Itineraries.query();
        };

        fncGetPendingItinerary();
        $scope.plannedItineraries = fncGetPlannedItineraries();
        $scope.ItinerariesReport = fncGetItinerariesReport();

        $scope.createItinerary = function () {
            $scope.newItinerary.$save(function (response) {
                $scope.newItinerary = new Itineraries();
                //Reset the create itinerary fields
                $scope.today();
                $scope.companies.selected = '';
                $scope.agendamaster.selected = '';

                fncGetPlannedItineraries();
                fncGetPendingItinerary();
                fncGetItinerariesReport();

                // Clear form fields
            }, function (errorResponse) {
                $scope.itineraryError = errorResponse.data.message;
            });
        };

        $scope.updateItinerary = function (updateItineray) {
            var toUpdate = new Itineraries({
                _id: updateItineray._id,
                description: updateItineray.description
            });
            if (toUpdate.description.length > 15) {
                toUpdate.isCompleted = true;
                toUpdate.$update(function () {
                    toUpdate = new Itineraries();
                    $scope.updateItineraryError = '';
                    fncGetPendingItinerary();
                    fncGetItinerariesReport();
                }, function (errorResponse) {
                    $scope.updateItineraryError = errorResponse.data.message;
                });
            }
            else {
                $scope.updateItineraryError = 'Minutes of meeting needs to be at least 15 characters.';
            }
        };
        // </editor-fold>

        // <editor-fold desc="Datepicker">
        $scope.today = function () {
            $scope.newItinerary.date = new Date();
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
        // </editor-fold>
    }
]);
