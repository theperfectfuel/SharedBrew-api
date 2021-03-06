var mongoose = require('mongoose');

var grainsSchema = mongoose.Schema({
	grains_type: String,
	grains_amount: Number
});

var hopsSchema = mongoose.Schema({
	hops_type: String,
	hops_amount: Number
});

var yeastSchema = mongoose.Schema({
	yeast_type: String,
	yeast_amount: Number
});

var otherSchema = mongoose.Schema({
	other_ingredient: String,
	other_amount: Number
});

var recipeSchema = mongoose.Schema({ 
	beer_name: String,
	beer_style: String,
	beer_abv: {
		type: Number,
		default: 0,
	},
	beer_srm: {
		type: Number,
		default: 0
	},
	beer_ibu: {
		type: Number,
		default: 0
	},
	orig_grav: {
		type: Number,
		default: 0
	},
	final_grav: {
		type: Number,
		default: 0
	},
	grains_list: [grainsSchema],
	hops_list: [hopsSchema],
	yeast_list: [yeastSchema],
	other_list: [otherSchema],
	brew_difficulty: String,
	batch_size: Number,
	brew_instructions: String,
	_brewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	createdDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recipe', recipeSchema);