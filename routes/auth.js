//logic from fornt end and backend pasrt


const express = require('express');
const app = express();
const router = express.Router();
const signupDetails = require('../models/eventinfos');
const Contact = require('../models/contact');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const signupValidSchema = require('../validator/validator');
const logicValidSchema = require('../validator/validatorLogin');
const validate = require('../middlewares/validateMiddle')
const userMiddle = require('../middlewares/userMiddle')
const adminMiddleware = require('../middlewares/adminMiddle')
const Event = require('../models/commonSchemas')


router.post('/register', validate(signupValidSchema), async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the email already exists
        const existingUser = await signupDetails.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists', existingEmail: email });
        }

        // Hash the password
        const hashpassword = await bcrypt.hash(password, 10);
        const isAdmin = req.body.isAdmin || false; // Default to false if not provided in the request
        // Create a new user
        const newUser = await signupDetails.create({
            username,
            email,
            password: hashpassword,

        });
        const newUser1 = await signupDetails.create({
            username,
            email,
            isAdmin,
            // password: hashpassword
        });

        // Generate JWT token
      //  const token = jwt.sign({ userId: newUser1._id, isAdmin: newUser1.isAdmin }, jwt_secret_key, { expiresIn: '30d' });
      const token = jwt.sign({ userId: newUser1._id, isAdmin: newUser1.isAdmin }, process.env.JWT_SECRETE_KEY, { expiresIn: '30d' });

        // Send response with token
        res.status(201).json({ email: newUser1.email, auth: token, userID: newUser1._id.toString(), isAdmin: newUser1.isAdmin, username: newUser1.username });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error });
    }
});



// router.post('/login', validate(logicValidSchema), async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const userExist = await signupDetails.findOne({ email })
//         console.log(userExist, "existed///logic bosss");
//         if (!userExist) {
//             return res.status(400).json({ message: 'Invalid Credential' });
//         }
//         else {
//             jwt.sign({ userExist: userExist }, jwt_secret_key, { expiresIn: '30d' }, (e, token) => {
//                 if (e) {
//                     res.status(500).json("something went wrong");
//                 }
//                 res.status(201).json({ email: userExist.email, auth: token, userID: userExist._id.toString() });
//                 console.log(token, bhaiiiii);
//             })
//         }
//         const userPassword = await bcrypt.compare(password, userExist.password);
//         if (userPassword) {
//             res.status(200).json({
//                 msg: "Login Sucessful"
//             });
//         } else {
//             res.status(401).json({ message: 'Invalid email or password' });
//         }

//     } catch (error) {
//         res.status(500).json("internal srver error");
//         console.error(error);

//     }

// })
router.post('/login', validate(logicValidSchema), async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExist = await signupDetails.findOne({ email });
        console.log(userExist, "existed///logic bosss");
        if (!userExist) {
            return res.status(400).json({ message: 'Invalid Credential' });
        }

        const userPassword = await bcrypt.compare(password, userExist.password);
        if (!userPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        jwt.sign({ userExist: userExist }, process.env.JWT_SECRETE_KEY, { expiresIn: '30d' }, (e, token) => {
            if (e) {
                res.status(500).json("something went wrong");
            }
            res.status(200).json({ email: userExist.email, auth: token, userID: userExist._id.toString(), username: userExist.username, msg: "Login Sucessful" });
            console.log(token, "bhaiiiii");
        });

    } catch (error) {
        res.status(500).json("internal server error");
        console.error(error);

    }
})

router.get('/user', userMiddle, async (req, res) => {
    try {
        const userData = req.user;
        console.log(userData);
        // const userName = userData;
        // const userData = await signupDetails.find()
        res.status(200).json({ userData });
        // res.status(200).json({ msg: 'hi user' })
    } catch (error) {
        console.log(error, "from user route");
        res.status(500).json({ message: "Internal Server Error" });

    }
})
router.get('/users', async (req, res) => {
    try {
        const users = await signupDetails.find({}, { password: 0 });
        if (!users || users.length === 0) {
            res.status(404).json({ message: `Users not found` });

        }
        const filteredUserData = users.filter(user => !user.isLoggedIn);

        // Send the filtered user data as response
        res.status(200).json(filteredUserData);
        //   res.status(200).json(users );

    } catch (error) {
        next(error);
    }
})
router.post('/contact', async (req, res) => {
    try {
        const { username, email, message } = req.body;
        const newcontact = await Contact.create({
            username,
            email,
            message

        });

        res.status(200).json({ message: newcontact });

    } catch (error) {
        next(error);
    }
})
router.get('/admin', userMiddle, adminMiddleware, async (req, res) => {
    try {
        const admins = await signupDetails.find({}, { password: 0 });
        console.log(admins);
        if (!admins) {
            res.status(404).json({ message: "no users found" })
        }
        res.status(200).json(admins);
    } catch (error) {
        next(error);
    }
})
router.get('/admin_contact', async (req, res) => {
    try {
        const adcontacts = await Contact.find();
        console.log(adcontacts);
        if (!adcontacts) {
            res.status(404).json({ message: "no contact found" })
        }
        res.status(200).json(adcontacts);
    } catch (error) {
        next(error);
    }
})
router.post('/event', async (req, res) => {
    try {
        const { title, description, date, time, capacity, location, category, requirements, deadlines } = req.body;
        const newEvent = await Event.create({
            title, description, date, time, capacity, location, category, requirements, deadlines
        });
        res.status(200).json({ message: newEvent });

    } catch (error) {
        next(error);
    }
})
router.get('/getevent', async (req, res) => {
    try {
        const { title, description, date, time, capacity, location, category, requirements, deadlines } = req.body;
        const newevent = await Event.find({}, {
            title: 0, description: 0, requirements: 0
        });
        res.status(200).json({ newevent });

    } catch (error) {
        next(error);
    }
})
router.get('/admin/:id', userMiddle, adminMiddleware, async (req, res) => {
    try {
        const id = req.params.id;
        const single = await signupDetails.findOne({ _id: id }, { password: 0 });
        res.status(200).json(single);

    } catch (error) {
        next(error)
    }


})
router.patch('/adminupdate/:id', userMiddle, adminMiddleware, async (req, res) => {
    try {
        const id = req.params.id;
        const updated = req.body;
        const updateData = await signupDetails.updateOne({ _id: id }, { $set: updated });
        res.status(200).json(updateData);

    } catch (error) {
        next(error)
    }


})
router.delete('/userdelete/:id', userMiddle, adminMiddleware, async (req, res) => {
    try {
        const id = req.params.id;
        await signupDetails.deleteOne({ _id: id });
        res.status(200).json({ message: "user deleted successfully" });
    } catch (error) {
        next(error);

    }
})
router.get('/getevent/:id', userMiddle, adminMiddleware, async (req, res) => {
    try {
        const id = req.params.id;
        const single = await Event.findOne({ _id: id });
        res.status(200).json(single);

    } catch (error) {
        next(error)
    }


})
router.patch('/eventupdate/:id', userMiddle, adminMiddleware, async (req, res) => {
    try {
        const id = req.params.id;
        const updated = req.body;
        const updateData = await Event.updateOne({ _id: id }, { $set: updated });
        res.status(200).json(updateData);

    } catch (error) {
        next(error)
    }


})
router.delete('/eventdelete/:id', userMiddle, adminMiddleware, async (req, res) => {
    try {
        const id = req.params.id;
        await Event.deleteOne({ _id: id });
        res.status(200).json({ message: "event deleted successfully" });
    } catch (error) {
        next(error);

    }
})







module.exports = router;