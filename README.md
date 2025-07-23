# exauth
Simple authorization with JWT using Express and Mongo + Mongoose.

## Usage
```js
const exauth = require('exauth');

// server - your express app
server.use('your-route', exauth.authRouter);
server.use(exauth.errorMiddleware);
```

You also need to configure some environment variables:  
```
JWT_ACCESS_EXPIRATION=60m      // for example
JWT_REFRESH_EXPIRATION=30d     // for example
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

## Full Example
```js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const exauth = require('exauth');

const server = express();
const PORT = process.env.PORT; // Your port

server.use(express.json());
server.use(cors());
server.use(cookieParser());
server.use('/example', exauth.authRouter);
server.use(exauth.errorMiddleware);


const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL) // Your connection to db
        server.listen(PORT, () => console.log(`Server is running on ${PORT}`));
    } catch (error) {
        console.error(error);
    }
}
start();
```

## LICENSE
MIT
