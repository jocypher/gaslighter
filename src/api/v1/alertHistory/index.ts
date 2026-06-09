import { Router } from 'express';
import ListAlertHistoryController from './listAlertHistories/controllers/listAlertHistoryController';
import GetAlertHistoryByIdController from './getAlertHistoryById/controllers/getAlertHistoryByIdController';
import { authenticate } from '../../../core/middlewares/authMiddlewares';

const router = Router();

router.get('/', authenticate, ListAlertHistoryController);

router.get('/:id', authenticate, GetAlertHistoryByIdController);

export default router;
