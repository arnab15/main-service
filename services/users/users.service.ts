import { UserDocument, UserModel } from "../../models/User.model"
import { UserSignUpInput } from "../../validators/user.validator"

export const getUserByEmail = async (email: string) => {
    return UserModel.findOne({ email })
}

export const addUser = async (user: Omit<UserDocument, "createdAt" | "updatedAt">) => {
    const newUser = new UserModel(user)
    return newUser.save()
}

export const getUserById = async (id: string) => {
    return UserModel.findById(id).select("-password");
}

export const updateUser = async (id: string, user: UserSignUpInput["body"]) => {
    return UserModel.findByIdAndUpdate(id, user, { new: true })
}