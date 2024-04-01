// // const jwt = require('jsonwebtoken');
// // const jwt_secret_key = 'ALLAHUAKBAR';

// // const userMiddle = async (req, res, next) => {

// //     const token = req.header('Authorization');
// //     if (!token) {
// //         res.status(401).json({ message: "invalid unauthorised" })
// //     }
// //     const jwtToken = token.replace('Bearer', "").trim();
// //     console.log("token jii", jwtToken);
// //     jwt.verify(jwtToken, jwt_secret_key,(err,valid)=>{
// //           if(err){
// //             return res.send(401).json({ message: "pls provide valid token" })

// //           }else{
// //             next();
// //           }
// //         //   console.log(isVerified);

// //         });
// //         // next();



// // }
// // module.exports = userMiddle;



// const jwt = require('jsonwebtoken');
// //const jwt_secret_key = 'ALLAHUAKBAR';
// // const JWT_SECRETE_KEY=process.env.JWT_SECRETE_KEY;
// const signupDetails = require("../models/eventinfos")

// const userMiddle = async (req, res, next) => {
//     const token = req.header('Authorization');
//     if (!token) {
//         return res.status(401).json({ message: "Invalid unauthorized" });
//     }
//     const jwtToken = token.replace('Bearer', "").trim();
//     console.log("token jii", jwtToken);
//     const isverify = jwt.verify(jwtToken, process.env.JWT_SECRETE_KEY);
//     console.log(isverify, "verified jiiiii");

//     // 
//     try {
//         const userdata = await signupDetails.findOne({ email: isverify.userExist.email }).select({ password: 0 })
//         console.log(userdata, "delhlo jii");
//         req.user = userdata;
//         req.token = token;
//         next();
//     } catch (error) {
//         res.status(400).json({ message: 'unauthorized' })
//     }
// };

// module.exports = userMiddle;



const jwt = require('jsonwebtoken');
const signupDetails = require("../models/eventinfos");

const userMiddle = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const jwtToken = token.replace('Bearer', "").trim(); // Remove 'Bearer' and trim spaces
    console.log("Token:", jwtToken);

    try {
        const decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRETE_KEY); // Verify JWT
        console.log("Decoded Token:", decodedToken);

        // Check if user exists based on the decoded token
        const userdata = await signupDetails.findOne({ email: decodedToken.userExist.email }).select({ password: 0 });
        console.log("User Data:", userdata);

        if (!userdata) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = userdata;
        req.token = token;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(400).json({ message: 'Unauthorized' });
    }
};

module.exports = userMiddle;
