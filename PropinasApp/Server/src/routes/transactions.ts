import { Router } from 'express';
import {
    crearTransaccion,
    obtenerTransacciones,
    obtenerTransaccionPorId,
    generarRecibo
} from '../controllers/transactionsController';

const router = Router();

//router.post('/', crearTransaccion);
router.get('/', obtenerTransacciones);
//router.get('/:id', obtenerTransaccionPorId);
//router.get('/:id/recibo', generarRecibo);

export const transaccionesRouter = router;