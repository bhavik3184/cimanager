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