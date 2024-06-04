import {
    InputListCustomerDto,
    OutputListCustomerDto,
} from "./list.customer.dto";
import CustomerRepositoryInterface from "../../../domain/customer/repository/customer-repository-interface";
import Customer from "../../../domain/customer/entity/customer";

export default class ListCustomerUseCase {
    private customerRepository: CustomerRepositoryInterface;
    constructor(CustomerRepository: CustomerRepositoryInterface) {
        this.customerRepository = CustomerRepository;
    }

    async execute(input: InputListCustomerDto): Promise<OutputListCustomerDto> {
        const customers = await this.customerRepository.findAll();
        return OutputMapper.toOutput(customers);
    }
}

// tslint:disable-next-line:max-classes-per-file
class OutputMapper {
    static toOutput(customer: Customer[]): OutputListCustomerDto {
        return {
            customers: customer.map((customer) => ({
                id: customer.id,
                name: customer.name,
                address: {
                    street: customer.Address.street,
                    number: customer.Address.number,
                    zip: customer.Address.zip,
                    city: customer.Address.city,
                },
            })),
        };
    }
}