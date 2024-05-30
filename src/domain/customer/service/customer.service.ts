import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import EventDispatcher from "../../@shared/event/event-dispatcher";
import Customer from "../entity/customer";
import CustomerCreatedEvent from "../event/customer-created.event";
import Address from "../valueObjects/address";
import CustomerAddressUpdatedEvent from "../event/customer-address-updated.event";


export default class CustomerService {

    private repository: CustomerRepository;
    private eventDispatcher: EventDispatcher;

    constructor(repository: CustomerRepository,
                eventDispatcher: EventDispatcher) {
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