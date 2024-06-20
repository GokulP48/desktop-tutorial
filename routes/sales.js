
import express from "express";
import multer from 'multer'
const upload = multer({ dest: 'uploads/' })
import { SalesController } from "../controller/sales_controller.js";


const router = express.Router();


router.post('/upload_csv_file',   upload.single('upload_file'), SalesController.uploadDataFromCSV )

router.get("/revenue-details", SalesController.getRevenueDetails);

router.get("/products", SalesController.salesProducts)

router.get('/customer-analysis', SalesController.customerAnalysis)



export default router;