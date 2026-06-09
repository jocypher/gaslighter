import express from 'express';
import router from './v1/routes';

const appRouter = express.Router();

appRouter.use('/api/v1', router);

export default appRouter;
