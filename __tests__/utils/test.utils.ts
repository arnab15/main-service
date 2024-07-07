import { adminUser } from "./testData";
import * as userService from "../../services/users/users.service";
import { hashPassword } from "../../utils/password.utils";
export const getUser = async (role: "admin" | "user") => {
    let user = await userService.getUserByEmail(adminUser.email)
    if (user && !user?.role.includes(role)) {
        // @ts-ignore
        user = await userService.updateUser(user._id, { role })
    }
    if (!user) {
        // @ts-ignore
        user = await userService.addUser({
            ...adminUser,
            role: [role],
            password: await hashPassword(adminUser.password)
        })
    }
    return user
}