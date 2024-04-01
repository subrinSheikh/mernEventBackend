

const { z } = require('zod');
 const logicValidSchema = z.object({
    email: z.string({ required_error: "Email is required" }).trim().min(8, { message: "Email must be alteast of 8 characters." }).max(255, { message: "Email must not have more 255 characters." }),
    password: z.string({ required_error: "password is required" }).trim().min(8, { message: "password must be alteast of 8 characters,1 number and $ or @ in it." }).max(255, { message: "password must not have more 255 characters." })
})
module.exports = logicValidSchema;