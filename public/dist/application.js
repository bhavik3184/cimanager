'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'cimanager';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies', 'ngAnimate', 'ngTouch', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'ui.utils','ui.select','ui.bootstrap.datepicker','ui.grid','ui.grid.grouping','ui.grid.selection', 'ui.grid.exporter'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('companies');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('dashboards');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('itineraries');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Configuring the Articles module
angular.module('companies').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Companies', 'companies', 'dropdown', '/companies(/create)?');
		Menus.addSubMenuItem('topbar', 'companies', 'List Companies', 'companies');
		Menus.addSubMenuItem('topbar', 'companies', 'New Company', 'companies/create');
	}
]);
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

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
			state('home', {
				url: '/',
				templateUrl: 'modules/core/views/home.client.view.html'
				//templateUrl: 'modules/users/views/authentication/signin.client.view.html'
			});
	}
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Configuring the Articles module
angular.module('dashboards').run(['Menus',
    function (Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Dashboards', 'dashboards', 'dropdown', '/dashboards(/create)?');
        Menus.addSubMenuItem('topbar', 'dashboards', 'List Dashboards', 'dashboards');
        Menus.addSubMenuItem('topbar', 'dashboards', 'New Dashboard', 'dashboards/create');
    }
]);

'use strict';

//Setting up route
angular.module('dashboards').config(['$stateProvider',
	function($stateProvider) {
		// Dashboards state routing
		$stateProvider.
		state('listDashboards', {
			url: '/dashboards',
			templateUrl: 'modules/dashboards/views/list-dashboards.client.view.html'
		}).
		state('createDashboard', {
			url: '/dashboards/create',
			templateUrl: 'modules/dashboards/views/create-dashboard.client.view.html'
		}).
		state('viewDashboard', {
			url: '/dashboards/:dashboardId',
			templateUrl: 'modules/dashboards/views/view-dashboard.client.view.html'
		}).
		state('editDashboard', {
			url: '/dashboards/:dashboardId/edit',
			templateUrl: 'modules/dashboards/views/edit-dashboard.client.view.html'
		});
	}
]);
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

'use strict';

//Dashboards service used to communicate Dashboards REST endpoints
angular.module('dashboards').factory('Dashboards', ['$resource',
    function ($resource) {
        return $resource('dashboards/:dashboardId', {
            dashboardId: '@_id'
        }, {
            update: {method: 'PUT'}
        });
    }
]);

'use strict';

// Configuring the Articles module
angular.module('itineraries').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Itineraries', 'itineraries', 'dropdown', '/itineraries(/create)?');
		Menus.addSubMenuItem('topbar', 'itineraries', 'List Itineraries', 'itineraries');
		Menus.addSubMenuItem('topbar', 'itineraries', 'New Itinerary', 'itineraries/create');
	}
]);
'use strict';

//Setting up route
angular.module('itineraries').config(['$stateProvider',
	function($stateProvider) {
		// Itineraries state routing
		$stateProvider.
		state('planned-itineraries', {
			url: '/planned-itineraries',
			templateUrl: 'modules/itineraries/views/planned-itineraries.client.view.html'
		}).
		state('listItineraries', {
			url: '/itineraries',
			templateUrl: 'modules/itineraries/views/list-itineraries.client.view.html'
		}).
		state('createItinerary', {
			url: '/itineraries/create',
			templateUrl: 'modules/itineraries/views/create-itinerary.client.view.html'
		}).
		state('viewItinerary', {
			url: '/itineraries/:itineraryId',
			templateUrl: 'modules/itineraries/views/view-itinerary.client.view.html'
		}).
		state('editItinerary', {
			url: '/itineraries/:itineraryId/edit',
			templateUrl: 'modules/itineraries/views/edit-itinerary.client.view.html'
		});
	}
]);
'use strict';

// Itineraries controller
angular.module('itineraries').controller('ItinerariesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Itineraries',
	function($scope, $stateParams, $location, Authentication, Itineraries) {
		$scope.authentication = Authentication;

		// Create new Itinerary
		$scope.create = function() {
			// Create new Itinerary object
			var itinerary = new Itineraries ({
				name: this.name
			});

			// Redirect after save
			itinerary.$save(function(response) {
				$location.path('itineraries/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Itinerary
		$scope.remove = function(itinerary) {
			if ( itinerary ) { 
				itinerary.$remove();

				for (var i in $scope.itineraries) {
					if ($scope.itineraries [i] === itinerary) {
						$scope.itineraries.splice(i, 1);
					}
				}
			} else {
				$scope.itinerary.$remove(function() {
					$location.path('itineraries');
				});
			}
		};

		// Update existing Itinerary
		$scope.update = function() {
			var itinerary = $scope.itinerary;

			itinerary.$update(function() {
				$location.path('itineraries/' + itinerary._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Itineraries
		$scope.find = function() {
			$scope.itineraries = Itineraries.query();
		};

		// Find existing Itinerary
		$scope.findOne = function() {
			$scope.itinerary = Itineraries.get({ 
				itineraryId: $stateParams.itineraryId
			});
		};
	}
]);
'use strict';

//Itineraries service used to communicate Itineraries REST endpoints
angular.module('itineraries').factory('Itineraries', ['$resource', function ($resource) {
    return $resource('itineraries/:itineraryId', {itineraryId: '@_id'},
        {
            update: {method: 'PUT'}
        });
}
]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;
				// And redirect to the index page
				$location.path('/dashboards');
			}).error(function(response) {
				$scope.signinerror = response.message;
			});
		};
	}
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);