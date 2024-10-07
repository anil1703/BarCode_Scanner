import  {userDb}  from "../Modal/userModal.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config();

export async function userLoginService(data) {
    console.log(data)
    const { username, password, user } = data;
    console.log(username)

    try {
        // Ensure username and password are provided
        if (!username || !password) {
            return {
                status: 400,
                message: "Username and password are required"
            };
        }

        // Find user in the database
        const response = await userDb.findOne({ username, user });
        console.log(response)
        if (response) {
            // Compare the password
            const isValidPassword = await bcrypt.compare(password, response.password);

            if (isValidPassword) {
                // Create JWT payload
                const setPayload = {
                    username: username,
                    user: user,
                };

                // Generate JWT token
                const token = jwt.sign(setPayload, process.env.SECRET_KEY, { expiresIn: '24h' });

                return {
                    status: 200,
                    message: {
                      message:  "Logged in successfully",
                    jwt_token: token
                    }
                };
            } else {
                return {
                    status: 400,
                    message: "Incorrect password"
                };
            }
        } else {
            return {
                status: 400,
                message: "User doesn't exist"
            };
        }
    } catch (error) {
        // Error handling
        return {
            status: 500,
            message: "An error occurred during login",
            error: error.message
        };
    }
}
