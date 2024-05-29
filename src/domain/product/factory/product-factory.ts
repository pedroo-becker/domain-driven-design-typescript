import Product from "../entity/product";
import { v4 as uuid } from "uuid";

export default class ProductFactory {
    public static create(
        type: string,
        name: string,
        price: number
    ): Product {
        switch (type) {
            case "a":
                return new Product(uuid(), name, price);
            default:
                throw new Error("Product type not supported");
        }
    }
}