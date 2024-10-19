import express from "express";
import {deleteAllItemInCartController, userLoginController,deleteItemFromCart ,getAllCArtController,getByBarCodeController,barcodeGeneratorController,fetchingAllProductsController,deleteProductController,addToCartController} from "../Controller/index.js";

const router = express.Router()

router.post("/login", userLoginController);
router.post("/barcodeGenerator", barcodeGeneratorController)
router.get("/allProducts", fetchingAllProductsController)
router.delete("/deleteProduct/:id",deleteProductController)
router.post("/addToCart",addToCartController)
router.get("/getByBArCode/:id",getByBarCodeController)
router.get("/cart",getAllCArtController)
router.delete("/deleteItemFromCart/:id",deleteItemFromCart)
router.delete("/deleteAllItemsInCart",deleteAllItemInCartController)

export {router as routes}