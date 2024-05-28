import { Sequelize } from "sequelize-typescript";
import OrderRepository from "./order.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/valueObjects/address";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Product from "../../../../domain/product/entity/product";
import OrderModel from "./order.model";
import OrderItemModel from "./order-item.model";
import Order from "../../../../domain/checkout/entity/order";

describe("Order repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([
            CustomerModel,
            OrderModel,
            OrderItemModel,
            ProductModel,
        ]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });
    it("should find a order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order("123", "123", [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        });

        const found = await orderRepository.find("123");

        expect(orderModel.toJSON()).toStrictEqual({
            id: found.id,
            customer_id: found.customerId,
            total: found.total(),
            items: [
                {
                    id: found.items[0].id,
                    name: found.items[0].name,
                    price: found.items[0].price,
                    quantity: found.items[0].quantity,
                    order_id: found.id,
                    product_id: found.items[0].productId,
                },
            ],
        });
    });

    it("should find all order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order("123", "123", [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        });

        const foundOrders = await orderRepository.findAll();
        const found = foundOrders[0]

        expect(orderModel.toJSON()).toStrictEqual({
            id: found.id,
            customer_id: found.customerId,
            total: found.total(),
            items: [
                {
                    id: found.items[0].id,
                    name: found.items[0].name,
                    price: found.items[0].price,
                    quantity: found.items[0].quantity,
                    order_id: found.id,
                    product_id: found.items[0].productId,
                },
            ],
        });
    });

    it("should update order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const orderItem2 = new OrderItem(
            "2",
            product.name,
            product.price,
            product.id,
            4
        );

        const order = new Order("123", "123", [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        let orderToUpdate = await orderRepository.find(order.id);

        orderToUpdate.add(orderItem2);

        await orderRepository.update(orderToUpdate);


        const found = await orderRepository.find(orderToUpdate.id);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: found.id,
            customer_id: found.customerId,
            total: found.total(),
            items: [
                {
                    id: found.items[0].id,
                    name: found.items[0].name,
                    price: found.items[0].price,
                    quantity: found.items[0].quantity,
                    order_id: found.id,
                    product_id: found.items[0].productId,
                },
                {
                    id: found.items[1].id,
                    name: found.items[1].name,
                    price: found.items[1].price,
                    quantity: found.items[1].quantity,
                    order_id: found.id,
                    product_id: found.items[1].productId,
                }
            ],
        });
    });


    it("should create a new order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order("123", "123", [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: "123",
                    product_id: "123",
                },
            ],
        });
    });
});