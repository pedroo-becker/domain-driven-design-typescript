import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import Customer from "../entity/customer";
import CustomerCreatedEvent from "../event/customer-created.event";
import Address from "../valueObjects/address";
import CustomerAddressUpdatedEvent from "../event/customer-address-updated.event";
import EventDispatcherInterface from "../../@shared/event/event-dispatcher.interface";


export default class CustomerService {

    private repository: CustomerRepository;
    private eventDispatcher: EventDispatcherInterface;

    constructor(repository: CustomerRepository,
                eventDispatcher: EventDispatcherInterface) {
        this.repository = repository;
        this.eventDispatcher = eventDispatcher;
    }

    async create(customer: Customer): Promise<void> {
        await this.repository.create(customer);
        this.eventDispatcher.notify(new CustomerCreatedEvent(customer))
    }

    async changeAddress(id: string, newAddress: Address): Promise<void> {
        const customer = await this.repository.find(id);
        customer.changeAddress(newAddress);
        await this.repository.update(customer);
        this.eventDispatcher.notify(new CustomerAddressUpdatedEvent(customer))
    }
}