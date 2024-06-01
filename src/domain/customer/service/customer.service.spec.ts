import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerService from "../service/customer.service";
import Customer from "../entity/customer";
import Address from "../valueObjects/address";
import EventHandlerInterface from "../../@shared/event/event.handler.interface";
import CustomerCreatedHandler1 from "../event/handler/customer-created.handler1";
import CustomerCreatedHandler2 from "../event/handler/customer-created.handler2";
import CustomerAddressUpdatedHandler from "../event/handler/customer-address-updated.handler";
import EventDispatcherInterface from "../../@shared/event/event-dispatcher.interface";

jest.mock("../../../infrastructure/customer/repository/sequelize/customer.repository");

describe("CustomerService unit tests", () => {
    let customerRepository: CustomerRepository;
    let eventDispatcher: EventDispatcherInterface;
    let customerService: CustomerService;
    let addressEvent: EventHandlerInterface;
    let createdEvent1: EventHandlerInterface;
    let createdEvent2: EventHandlerInterface;

    beforeEach(() => {
        customerRepository = new CustomerRepository();
        eventDispatcher = new EventDispatcher();
        createdEvent1 = new CustomerCreatedHandler1()
        createdEvent2 = new CustomerCreatedHandler2()
        addressEvent = new CustomerAddressUpdatedHandler();
        eventDispatcher.register("CustomerCreatedEvent", createdEvent2)
        eventDispatcher.register("CustomerCreatedEvent", createdEvent1)
        eventDispatcher.register("CustomerAddressUpdatedEvent", addressEvent)
        customerService = new CustomerService(customerRepository, eventDispatcher);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should create a customer and notify CustomerCreatedEvent", async () => {
        const spy = jest.spyOn(createdEvent1, 'handle')
        const spy2 = jest.spyOn(createdEvent2, 'handle')
        const customer = new Customer("1", "John Doe");

        customerRepository.create = jest.fn();

        await customerService.create(customer);

        expect(customerRepository.create).toHaveBeenCalledWith(customer);
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it("should change customer address and notify CustomerAddressUpdatedEvent", async () => {
        const spy = jest.spyOn(addressEvent, 'handle')
        const customer = new Customer("1", "John Doe");
        const newAddress = new Address("Street", 123, "12345-678", "City");

        customerRepository.find = jest.fn().mockResolvedValue(customer);
        customerRepository.update = jest.fn();

        await customerService.changeAddress("1", newAddress);

        expect(customerRepository.find).toHaveBeenCalledWith("1");
        expect(customerRepository.update).toHaveBeenCalledWith(expect.any(Customer));
        expect(spy).toHaveBeenCalled();
    });
});