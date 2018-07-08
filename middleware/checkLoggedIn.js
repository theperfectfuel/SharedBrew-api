export default function checkLoggedIn(req, res, next) {
	if(req.user) {
		return next();
	}
	res.redirect('/login');
}