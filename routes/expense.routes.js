import express from 'express'
import { addExpense, getAllExpense, deleteExpense, downloadExpenseExcel } from '../controllers/expense.controller.js'
import { protect } from '../middleware/AuthMiddleware.js'

const router = express.Router()

router.post("/add", protect, addExpense)
router.get("/get", protect, getAllExpense)
router.get("/downloadexcel", protect, downloadExpenseExcel)
router.delete("/:id", protect, deleteExpense)

export default router;