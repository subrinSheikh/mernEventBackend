const adminMiddleware = async (req, res, next) => {
    try {
        // console.log(req.user);
        const adminRole = req.user.isAdmin;
        if (!adminRole) {
            res.status(403).json({ message: 'Access denied. User is not an admin' })
        }
        next();
        // res.status(200).json({ message: req.user.isAdmin })
    } catch (error) {
        next(error);


    }
}
module.exports = adminMiddleware;