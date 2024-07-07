import mongoose from "mongoose";
import { UserModel } from "./models/User.model";
import connectDb from "./utils/connectDb";
import { ProductModel } from "./models/Product.model";
import { hashPassword } from "./utils/password.utils";

const seedDb = async () => {
    await connectDb();
    const usersToAdd = [
        {
            name: "admin",
            email: "arnabsahoo10@gmail.com",
            password: await hashPassword("admin123"),
            role: "admin"
        },
        {
            name: "user",
            email: "arnabsahoo11@gmail.com",
            password: await hashPassword("user123"),
            role: "user"
        }
    ]
    const productsToAdd = [
        {
            name: "Product 1",
            description: "Product 1 description",
            price: 1000,
            category: "sports"
        },
        {
            name: "Product 2",
            description: "Product 2 description",
            price: 2000,
            category: "sports and entertainment"
        },
        {
            name: "Product 3",
            description: "Product 3 description",
            price: 3000,
            category: "entertainment"
        },
        {
            name: "Product 4",
            description: "Product 4 description",
            price: 4000,
            category: "wellness"
        }

    ]

    const products = await ProductModel.insertMany(productsToAdd);
    const users = await UserModel.insertMany(usersToAdd);
    console.log(users);
    console.log(products);
    await mongoose.disconnect();
    await mongoose.connection.close();
    console.log("Seeded successfully");

}
(async () => await seedDb())()