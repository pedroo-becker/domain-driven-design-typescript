import EventInterface from "../../@shared/event/event.interface";
import Customer from "../entity/customer";

export default class CustomerAddressUpdatedEvent implements EventInterface {
    dataTimeOccurred: Date;
    eventData: Customer;

    constructor(eventData: Customer) {
        this.dataTimeOccurred = new Date();
        this.eventData = eventData;
    }
}