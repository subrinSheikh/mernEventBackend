

require("dotenv").config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const connectDB = require("./db")
const cors = require('cors');
const errorMiddle = require('./middlewares/errorMiddle')


app.use(express.json());
app.use(cors());
// const jwt = require('jsonwebtoken');

// app.use('api/admin')
app.use(errorMiddle);

app.use('/api/auth', require('./routes/auth'))
app.get('/', (req, res) => {
    res.set({
        'Content-type': 'application/json'
    });
    res.send('<h1>WELCOME TO THE EVENT</h1>');
})
//example of content type
// app.get('/about', async (req, res) => {
//     res.set({
//         'Content-type': 'text/html'
//     });
//     res.send('<p>About Subrin sheikh</p>')
// })
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is listening at port ${port}`);
    })
})


