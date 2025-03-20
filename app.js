import express from 'express';
import router from './routers/auth_router.js';

const app = express();

app.use(express.json());
app.use('/api/v1/auth', router);

export default app;




