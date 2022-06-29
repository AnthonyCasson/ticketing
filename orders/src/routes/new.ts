import express, { Response, Request } from 'express';
import {
	BadRequestError,
	NotFoundError,
	OrderStatus,
	requireAuth,
	validateRequest,
} from '@anttix/common';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { body } from 'express-validator';
import mongoose from 'mongoose';

const router = express.Router();

router.post(
	'/api/orders',
	requireAuth,
	[
		body('ticketId')
			.not()
			.isEmpty()
			.custom((input: string) => mongoose.Types.ObjectId.isValid(input))
			.withMessage('TicketId must be provided'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { ticketId } = req.body;

		// Find the ticket the user is trying to order in the database
		const ticket = await Ticket.findById(ticketId);
		if (!ticket) {
			throw new NotFoundError();
		}

		// Make sure that this is not already reserved
		// Run the query and look up all orders. Find the order where the ticket
		// is the ticket we just found *and* the orders status is *not* cancelled.
		// If we find and order from that mean the ticket *is* reserved.
		const existingOrder = await Order.findOne({
			ticket: ticket,
			status: {
				$in: [
					OrderStatus.Created,
					OrderStatus.AwaitingPayment,
					OrderStatus.Complete,
				],
			},
		});

		if (existingOrder) {
			throw new BadRequestError('Ticket is already reserved');
		}

		// Calc an expiration date/time of the order

		// Build the order and save it to the database

		// Publish an event saying that an order was created

		res.send({});
	}
);

export { router as newOrderRouter };
