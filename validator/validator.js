const { z } = require('zod');
 const signupValidSchema = z.object({
    username: z.string({ required_error: "Username is required" }).trim().min(8, { message: "Username must be alteast of 8 characters." }).max(255, { message: "Username must not have more 255 characters." }),
    email: z.string({ required_error: "Email is required" }).trim().min(8, { message: "Email must be alteast of 8 characters." }).max(255, { message: "Email must not have more 255 characters." }),
    password: z.string({ required_error: "password is required" }).trim().min(8, { message: "password must be alteast of 8 characters,1 number and $ or @ in it." }).max(255, { message: "password must not have more 255 characters." })
})
module.exports = signupValidSchema;