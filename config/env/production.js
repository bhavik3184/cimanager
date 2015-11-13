'use strict';

module.exports = {
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://cimanager:pbplcimanager@ds047504.mongolab.com:47504/cimanager',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.min.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
				'public/lib/angular-ui-select/dist/select.css',
				'public/lib/angular-ui-grid/ui-grid.min.css'
			],
			js: [
				//'public/lib/angular/angular.min.js',
				//'public/lib/angular-resource/angular-resource.js',
				//'public/lib/angular-cookies/angular-cookies.js',
				//'public/lib/angular-animate/angular-animate.js',
				//'public/lib/angular-touch/angular-touch.js',
				//'public/lib/angular-sanitize/angular-sanitize.js',
				//'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				//'public/lib/angular-ui-utils/ui-utils.min.js',
				//'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js'

				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/angular/angular.min.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-cookies/angular-cookies.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-touch/angular-touch.js',
				'public/lib/angular-sanitize/angular-sanitize.js',
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/angular-ui-utils/ui-utils.min.js',
				'public/lib/angular-bootstrap/ui-bootstrap.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
				'public/lib/angular-ui-select/dist/select.min.js',
				'public/lib/angular-ui-grid/ui-grid.min.js',
				'public/lib/pdfmake/build/csv.js',
				'public/lib/pdfmake/build/pdfmake.min.js',
				'public/lib/pdfmake/build/vfs_fonts.js',
				'public/lib/array-query/lib/query.js'
			]
		},
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};
