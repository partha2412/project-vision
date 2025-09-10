import express from 'express';
import dotenv from 'dotenv';
import auth from './routes/auth.js';
import connectToDB from './config/db.js';
import product from './routes/product.js';

dotenv.config();

connectToDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/auth', auth);
app.use('api/product', product)

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
 