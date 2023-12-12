module.exports.checkAuth = function(req, res, next)
{
    //Get useridd from session
    const userid = req.session.userid

    if(!userid)
    {
        res.redirect('/login');
    }

    next()
}