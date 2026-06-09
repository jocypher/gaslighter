import express from 'express';
import authRouter from './auth/index';
import alertRouter from './alert/index';
import profileRouter from './profile';
import alertHistoryRouter from './alertHistory/index';
import queueHealthRouter from './health/';
const router = express.Router();

router.use('/auth', authRouter);

router.use('/profile', profileRouter);

router.use('/alerts', alertRouter);

router.use('/alert-history', alertHistoryRouter);

router.use('/health', queueHealthRouter);

export default router;
