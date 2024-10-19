import {deleteAllItemInCartService,getAllCartService, deleteItemFromCartService,userLoginService,barcodeGeneratorService ,getByBarCodeService,fetchingAllProductsService,deleteProductService,addToCartService} from "../Services/index.js"

export async function userLoginController(req,res) {

    const data = req.body

    try{
        const fetching = await userLoginService(data)
        res.status(fetching.status).send(fetching.message)
    }
    catch(error){
        res.status(error.status).send(error.message)
    }
}

export async function  barcodeGeneratorController(req,res) {

    const data = req.body
    try{
        const fetching = await barcodeGeneratorService(data)
        res.status(fetching.status).send(fetching.message)
    
    }
    catch(error){
        res.status(error.status).send(error.message)
    }
    
}

export async function fetchingAllProductsController(req,res) {
    try{
        const fetching = await fetchingAllProductsService()
        res.status(fetching.status).send(fetching)
    }
    catch(error){
        res.status(error.status).send(error.message)
        }
}

export async function deleteProductController(req,res) {
    try{
        const id = req.params.id
        const fetching = await deleteProductService(id)
        res.status(fetching.status).send(fetching.message)
    }
    catch(error){
        res.status(error.status).send(error.message)
    }
}

export async function addToCartController(req, res) {
    console.log("carrr",req.body)
    try {
      // Extract product data from request body
      const data = req.body.data;
  
      // Call the service to add product to cart
      const fetching = await addToCartService(data);
  
      // Send back the response with appropriate status and message
      res.status(fetching.status).send({ message: fetching.message });
    } catch (error) {
      // In case of any errors, send a server error response
      res.status(500).send({ message: "An unexpected error occurred", error: error.message });
    }
  }
  
export async function getByBarCodeController(req,res) {

    try {
        const barCode = req.params.id
        const fetching = await getByBarCodeService(barCode)
        res.status(fetching.status).send(fetching)
    }
 catch (error) {
    // In case of any errors, send a server error response
    res.status(500).send({ message: "An unexpected error occurred", error: error.message });
  }

}

export async function getAllCArtController(req,res) {
    try {
        const fetching = await getAllCartService()
        res.status(fetching.status).send(fetching)
        }
    catch(error){
        res.status(500).send({ message: "An unexpected error occurred", error: error.message });
    }
    
}

export async function deleteItemFromCart(req,res) {
    try {
        const id = req.params.id
        const fetching = await deleteItemFromCartService(id)
        res.status(fetching.status).send(fetching)
        }
        catch(error){
            res.status(500).send({ message: "An unexpected error occurred", error: error.message
                });}

    
}

export async function deleteAllItemInCartController(req,res) {
    try {
        const fetching = await deleteAllItemInCartService()
        res.status(fetching.status).send(fetching)
        }
        catch(error){
            res.status(500).send({ message: "An unexpected error occurred", error: error.message
                });}

    
}