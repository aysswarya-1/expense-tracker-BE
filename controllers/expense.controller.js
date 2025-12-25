import xlsx from 'xlsx'
import Expense from "../models/Expense.model.js"

export const addExpense = async (req, res) => {
    const userId = req.user.id
    try {
        const { icon, category, amount, date } = req.body;

        if (!category || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date)
        });

        await newExpense.save()
        res.status(200).json(newExpense)
    } catch (error) {
        res.status(500).json({ message: "Server Error." })
    }
}
export const getAllExpense = async (req, res) => {
    const userId = req.user.id
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        res.json(expense)
    } catch (error) {
        res.status(500).json({ message: "Server Error." })
    }
}
export const deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Expense deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Server Error." })
    }

}
export const downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        // prepare data for excel
        const data = expense.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense");

        // Generate Excel in-memory buffer
        const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

        // Set headers for download
        res.setHeader('Content-Disposition', 'attachment; filename=expense_details.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        // Send buffer
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: "Server Error." })
    }
}