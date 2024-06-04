import Address from "../valueObjects/address";
import Entity from "../../@shared/entity/entity";
import NotificationError from "../../@shared/notification/notification.error";

export default class Customer extends Entity {

    // private _id: string;
    private _name: string;
    private _address!: Address;
    private _active: boolean = true;
    private _rewardPoints: number = 0;

    constructor(id: string, name: string) {
        super();
        this._id = id;
        this._name = name;
        this.validate();
        if (this.notification.hasErrors()) {
            throw new NotificationError(this.notification.getErrors());
        }
    }

    validate() {
        if (this._id.length === 0) {
            this.notification.addError({
                context: 'customer',
                message: 'Id is required'
            })
        }
        if (this._name.length === 0) {
            this.notification.addError({
                context: 'customer',
                message: 'Name is required'
            })
        }
    }

    changeName(name: string) {
        this._name = name;
        this.validate();
    }

    changeAddress(address: Address) {
        this._address = address;
    }

    activate() {
        if (this._address === undefined) {
            throw new Error("Address is mandatory to activate a customer")
        }
        this._active = true;
    }

    deactivate() {
        this._active = false;
    }

    set address(address: Address) {
        this._address = address;
    }

    isActive(): boolean {
        return this._active;
    }

    get Address(): Address {
        return this._address;
    }

    addRewardPoints(points: number) {
        this._rewardPoints += points;
    }

    get rewardPoints(): number {
        return this._rewardPoints;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

}