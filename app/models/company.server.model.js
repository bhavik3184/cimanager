'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var PrimarySchema = new Schema({
	companyId: {
		type: Schema.ObjectId,
		ref: 'Company'
	},
	addr: {
		type: String,
		default: '',
		required: 'Please provide company address',
		trim: true
	},
	city: {
		type: String,
		default: '',
		required: 'Please provide city',
		trim: true
	},
	state: {
		type: String,
		default: '',
		required: 'Please provide state',
		trim: true
	},
	pincode: {
		type: Number,
		required: 'Please provide pin code',
		trim: true
	},
	workPhone: {
		type: String,
		default: '',
		required: 'Please provide work phone',
		trim: true
	},
	workFax: {
		type: String,
		default: '',
		trim: true
	},
	email: {
		type: String,
		default: '',
		required: 'Please provide email',
		trim: true
	},
	website: {
		type: String,
		default: '',
		required: 'Please provide website',
		trim: true
	},
	industryType: {
		type: String,
		enum: ['GearBox', 'Motor Mfg.', 'Power Trans', 'Automobile Ind.', 'Agri Equip.', 'Industrial Distributer',
			'Automobile Distributer', 'MHE Mfg.', 'Steel plant Machinery', 'Mining/ Mineral Processing M/c',
			'Domestic Appliances', 'Pump Manufacturers', 'FAN manufacturer', 'PSU / Govt / Semi Govt']
	},
	annualReq: {
		type: Number,
		required: 'Please provide annual requirement in lacs'
	},
	bearingType: {
		type: String,
		enum: ['Deep Grove ball bearings', 'Self aligning ball bearings', 'Angular contact ball bearings',
			'Thrust ball bearings', 'Four point contact ball bearings', 'Spherical roller bearings', 'Spherical roller thrust bearings',
			'Taper roller bearings MM', 'Taper roller bearings INCH', 'Full Compliment Cylindrical roller bearings',
			'Cylindrical roller bearings', 'Needle roller bearings', 'Pillow Block bearings']
	},
	brandsUsed: {
		type: String,
		enum: ['ARB', 'ABC', 'AEC', 'NBC', 'GALAXY', 'ORBIT', 'TURBO', 'SKF', 'FAG', 'NTN', 'DYZV', 'HCH', 'ZKL', 'URB',
			'ZWZ', 'Chinese']
	}
});

var SecondarySchema = new Schema({
	currentShare: {
		type: Number,
		min: 0,
		max: 100,
		default: 0,
		required: 'Please provide the current share of ZNL'
	},
	bearingAccessories: {
		type: String,
		trim: true
	},
	proposedShare: {
		type: Number,
		min: 0,
		max: 100,
		default: 100,
		required: 'Please provide the proposed share of ZNL'
	}
});

var ContactSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please provide contact person name'
	},
	cellNo: {
		type: String,
		default: ''
	},
	email: {
		type: String,
		default: ''
	},
	designation: {
		type: String,
		enum: ['Director', 'Purchase Head', 'Purchaser', 'Accountant Manager', 'Accoutant', 'Store Manager',
			'Production Manager', 'Design Manager']
	}
});

var ApplicationSchema = new Schema({
	productionName: {
		type: String,
		default: '',
		required: 'Please provide application name'
	},
	bearingNo: {
		type: String,
		default: '',
		required: 'Please provide bearing Number'
	},
	usedIn: {
		type: String,
		enum: ['Automobile', 'MachineTools', 'TextileMachine', 'OthersLightVehicle', 'HeavyVehicle', 'Gearbox',
			'Motormanufacturer', 'Others']
	},
	usedAt: {
		type: String,
		default: ''
	},
	staticLoad: {
		type: Number
	},
	dynamicLoad: {
		type: Number
	},
	loadType: {
		type: String,
		enum: ['Radial', 'Thrust', 'Both']
	},
	loadNature: {
		tyoe: String,
		enum: ['Constant', 'Variable', 'Impact']
	},
	rpm: {
		type: String,
		enum: ['Below 100', '100 to 1000', '1000 to 2000', '2000 to 3000', '3000 to 4000', '4000 to 5000',
			'5000 to 10000', 'Above 10000']
	},
	maxWorkTimePerHour: {
		type: String
	},
	bearingWorkElement: {
		type: String,
		enum: ['Outer Race rotating', 'Inner Race rotating']
	},
	workTemp: {
		type: String,
		enum: ['Below 35', '35 to 100', '100 to 150', '150 to 200']
	},
	surroundingCondition: {
		type: String,
		enum: ['Clean', 'Dusty', 'Humid', 'Dry', 'Acid Fumes']
	},
	lubrication: {
		type: String,
		enum: ['Grease', 'Oil', 'Others']
	},
	fitmentParameter: {
		type: String,
		enum: ['Press fit', 'Precision Slide fit', 'Clearance fit']
	},
	permissibleNoiseLevel: {
		type: Number
	},
	outerMaterialSpec: {type: String},
	innerMaterialSpec: {type: String},
	rollingMaterialSpec: {type: String},
	cageMaterialSpec: {type: String},
	sealMaterialSpec: {type: String},
	drawingGiven: {
		type: Boolean,
		default: false
	},
	sampleGiven: {
		type: Boolean,
		default: false
	}
});


/**
 * Company Schema
 */
var CompanySchema = new Schema({
	name: {
		type: String,
		required: 'Please fill Company name',
		trim: true
	},
	primaryInfoComplete: {
		type: Boolean,
		default: false
	},
	secondaryInfoComplete: {
		type: Boolean,
		default: false
	},
	contactInfoComplete: {
		type: Boolean,
		default: false
	},
	applicationInfoComplete: {
		type: Boolean,
		default: false
	},
	created: {
		type: Date,
		default: Date.now
	},
	modified: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	primary: [PrimarySchema],
	secondary: [SecondarySchema],
	//contact: [ContactSchema],
	application: [ApplicationSchema]
});

mongoose.model('Company', CompanySchema);
