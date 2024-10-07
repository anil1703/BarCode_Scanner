import express from "express";
import { userLoginController } from "../Controller/index.js";

const router = express.Router()

router.post("/login", userLoginController);

export {router as routes}