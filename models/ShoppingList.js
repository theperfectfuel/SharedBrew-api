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

var shoppingListSchema = mongoose.Schema({
	beer_name: String,
	grains_list: [grainsSchema],
	hops_list: [hopsSchema],
	yeast_list: [yeastSchema],
	other_list: [otherSchema],
	batch_size: Number,
	_brewer: { type: Schema.Types.ObjectId, ref: 'User' },
	createdDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ShoppingList', shoppingListSchema);