// const jwt = require('jsonwebtoken');
// const jwt_secret_key = 'ALLAHUAKBAR';

// const userMiddle = async (req, res, next) => {

//     const token = req.header('Authorization');
//     if (!token) {
//         res.status(401).json({ message: "invalid unauthorised" })
//     }
//     const jwtToken = token.replace('Bearer', "").trim();
//     console.log("token jii", jwtToken);
//     jwt.verify(jwtToken, jwt_secret_key,(err,valid)=>{
//           if(err){
//             return res.send(401).json({ message: "pls provide valid token" })

//           }else{
//             next();
//           }
//         //   console.log(isVerified);

//         });
//         // next();



// }
// module.exports = userMiddle;



const jwt = require('jsonwebtoken');
//const jwt_secret_key = 'ALLAHUAKBAR';
// const JWT_SECRETE_KEY=process.env.JWT_SECRETE_KEY;
const signupDetails = require("../models/eventinfos")

const userMiddle = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: "Invalid unauthorized" });
    }
    const jwtToken = token.replace('Bearer', "").trim();
    console.log("token jii", jwtToken);
    const isverify = jwt.verify(jwtToken, process.env.JWT_SECRETE_KEY);
    console.log(isverify, "verified jiiiii");

    // 
    try {
        const userdata = await signupDetails.findOne({ email: isverify.userExist.email }).select({ password: 0 })
        console.log(userdata, "delhlo jii");
        req.user = userdata;
        req.token = token;
        next();
    } catch (error) {
        res.status(400).json({ message: 'unauthorized' })
    }
};

module.exports = userMiddle;
