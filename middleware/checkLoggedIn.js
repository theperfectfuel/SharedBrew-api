const checkLoggedIn = (req, res, next) => {
	console.log('checking user right now: ', req.user.id)
	if(req.user) {
		return next();
	}
	//res.redirect('http://localhost:3000/login');
	res.send('we cannot find the user');
}

module.exports = checkLoggedIn;