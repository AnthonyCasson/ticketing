import { NotAutorizedError, NotFoundError, requireAuth } from '@anttix/common';
import express, { Response, Request } from 'express';
import { Order } from '../models/order';

const router = express.Router();

router.get(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAutorizedError();
    }

    res.send(order);
  }
);

export { router as showOrderRouter };
