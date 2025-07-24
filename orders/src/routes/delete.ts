import { NotFoundError } from "@js-ticketing-ms/common/errors";
import { Request, Response, Router } from "express";
import { Order, OrderStatus } from "../models/order";
import { requireAuth } from "@js-ticketing-ms/common/middlewares";

const router = Router()

router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
    const { orderId } = req.params
    const order = await Order.findOne({
        _id: orderId,
        userId: req.currentUser!.id
    })
    if (!order) {
        throw new NotFoundError()
    }
    order.status = OrderStatus.Cancelled
    await order.save()
    res.status(204).send(order)
})

export { router as deleteOrderRouter }