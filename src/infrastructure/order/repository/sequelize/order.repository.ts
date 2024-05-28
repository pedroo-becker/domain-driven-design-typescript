import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import Order from "../../../../domain/checkout/entity/order";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository-interface";
import OrderItem from "../../../../domain/checkout/entity/order_item";

export default class OrderRepository implements OrderRepositoryInterface {
    async create(entity: Order): Promise<void> {
        await OrderModel.create(
            {
                id: entity.id,
                customer_id: entity.customerId,
                total: entity.total(),
                items: entity.items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    product_id: item.productId,
                    quantity: item.quantity,
                })),
            },
            {
                include: [{model: OrderItemModel}],
            }
        );
    }

    async find(id: string): Promise<Order> {
        const orderModel = await OrderModel.findOne({
            where: {id: id},
            include: ["items"],
        });

        const orderItems = orderModel.items
            .map((item) => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity));

        return new Order(orderModel.id, orderModel.customer_id, orderItems)
    }

    async findAll(): Promise<Order[]> {
        const orderModel = await OrderModel.findAll({include: ["items"]});

        return orderModel
            .map(order => new Order(order.id, order.customer_id, order.items.map(item =>
                new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity))));
    }

    async update(entity: Order): Promise<void> {
        await OrderModel.update(
            {
                customer_id: entity.customerId,
                total: entity.total(),
            }, {
                where: {id: entity.id}
            }
        );

        const orderModel = await OrderModel.findOne({
            where: {id: entity.id},
            include: ["items"],
        });

        const items = orderModel.items

        await Promise.all(items.map(item => item.destroy()));
        const news = entity.items.map(data => ({
            id: data.id,
            name: data.name,
            price: data.price,
            product_id: data.productId,
            quantity: data.quantity,
            order_id: entity.id,
        }))
        await OrderItemModel.bulkCreate(news);
    }
}