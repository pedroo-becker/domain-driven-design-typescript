import EventHandlerInterface from "../../../@shared/event/event.handler.interface";
import CustomerCreatedEvent from "../customer-created.event";
import CustomerAddressUpdatedEvent from "../customer-address-updated.event";

export default class CustomerAddressUpdatedHandler
    implements EventHandlerInterface<CustomerAddressUpdatedEvent>
{
    handle(event: CustomerAddressUpdatedEvent): void {
        // tslint:disable-next-line:no-console
        console
            .log(`Endereço do cliente: ${event.eventData.id}, ${event.eventData.name} alterado para: ${event.eventData.Address}`, );
    }
}