var blondy = new Recipe({ 

	beer_name: 'Blondy', 
	beer_style: 'Pale Ale',
	beer_abv: 5.3,
	grains_list: [
		{grains_type: "Dark", grains_amount: 2},
		{grains_type: "Light", grains_amount: 3}
	],
	hops_list: [
		{hops_type: "Fruity", hops_amount: 2},
		{hops_type: "Citrus", hops_amount: 3}
	],
	yeast_list: [
		{yeast_type: "Bready", yeast_amount: 2},
		{yeast_type: "Doughy", yeast_amount: 3}
	],
	other_list: [
		{other_ingredient: "Grapefruit", other_amount: 2}
	],
	orig_grav: 1.1,
	final_grav: 1.6,
	brew_difficulty: "Easy",
	batch_size: 3,
	brew_instructions: "Boil it, ferment it, bottle it, drink it all up."	

});

blondy.save(function(err, blondy) {
	if (err) return console.log('error saving ', err);
});