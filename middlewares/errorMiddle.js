const errorMiddle = (err, req, res, next) => {




    const status = err.status || 500;
    const message = err.message || "BACKEND ERROR";
    const extra = err.extra || "error from backend";
    return res.status(status).json({ message, extra });

}
module.exports = errorMiddle;