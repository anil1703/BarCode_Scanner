import  {userDb}  from "../Modal/userModal.js";
import { barCodeGenDb } from "../Modal/barCodeGeneratorModal.js";
import { cartDb } from "../Modal/cartModal.js";
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


export async function barcodeGeneratorService(data) {
    const {name,imageUrl,product_id,price} = data
   try{
    const response = await barCodeGenDb.insertMany({
        name,imageUrl,product_id,price
    })

    return {
        status: 200,
        message: "Product Saved",
    };
   }
   catch(error){
    return {
        status: 500,
        message: "An error occurred during login",
        error: error.message
    }
   }

}

export async function fetchingAllProductsService() {
    const response = await barCodeGenDb.find({})
    try {
        return {
            status: 200,
            message: "Products fetched successfully",
            data: response
        }
        } catch (error) {
            return {
                status: 500,
                message: "An error while fetching the products",
                error: error.message
            }
    }
}

export async function deleteProductService(id) {
    const response = await barCodeGenDb.deleteOne({
        product_id:id
    })
    try {
        return {
            status: 200,
            message: "Product Deleted successfully",
            data: response
        }

    }
    catch(error){
        return {
            status: 500,
            message: "An error while Deleting the product",
            error: error.message
        }
    }

}

export async function addToCartService(data) {
    console.log("jaffa",data)
    try {
      // Insert product into the cart database
      await cartDb.insertMany({ product_id: data });
  
      // Return success response
      return {
        status: 200,
        message: "Added to cart",
      };
    } catch (error) {
      // Catch any errors and return a failure response
      return {
        status: 400,
        message: "An error occurred while adding product to cart",
        error: error.message,
      };
    }
  }
  
  export async function getByBarCodeService(id) {
    console.log(id)
    try {
        // Find product by bar code in the database
        const product = await barCodeGenDb.findOne({ product_id: id });
        if (product) {
            return {
                status: 200,
                message: "Product Found",
                data: product
              };
            }
        else{
            return {
                status: 404,
                message: "Product Not Found",
                };
        }
    }
    catch(error){
        return {
            status: 500,
            message: "An error while Finding the product",
            error: error.message
            }
    }


    
  }
  export async function getAllCartService() {
    try {
        const response = await cartDb.find({})
        return {
            status: 200,
            message: "All Cart Items",
            data: response
            }
    }
    catch(error){
        return {
            status: 500,
            message: "An error occurred while fetching cart items",
            error: error.message
            }
    }
    
  }

  export async function deleteItemFromCartService(id) {
    try {
        const response = await cartDb.deleteOne({ _id: id });
        return {
            status: 200,
            message: "Item deleted from cart",
            data: response
            }
            }
            catch(error){
                return {
                    status: 500,
                    message: "An error occurred while deleting item from cart",
                    error: error.message
                    }
                    }
                    }

    
  export async function deleteAllItemInCartService() {
    try{
        const response = await cartDb.deleteMany({})
        return {
            status: 200,
            message: "All items deleted from cart",
            data: response
            }

    }
    catch(error){
        return {
            status: 500,
            message: "An error occurred while deleting all items from cart",
            error: error.message
            }
    }
    
  }