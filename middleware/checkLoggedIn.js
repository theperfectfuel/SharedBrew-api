const checkLoggedIn = (req, res, next) => {
	if(req.user) {
		return next();
	}
	res.redirect('http://localhost:3000/login');
}

module.exports = checkLoggedIn;