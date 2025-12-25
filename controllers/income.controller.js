import xlsx from 'xlsx'
import Income from "../models/Income.model.js"

export const addIncome = async (req, res) => {
    const userId = req.user.id
    try {
        const { icon, source, amount, date } = req.body;

        if (!source || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date)
        });

        await newIncome.save()
        res.status(200).json(newIncome)
    } catch (error) {
        res.status(500).json({ message: "Server Error." })
    }
}
export const getAllIncome = async (req, res) => {
    const userId = req.user.id
    try {
        const income = await Income.find({ userId }).sort({ date: -1 });
        res.json(income)
    } catch (error) {
        res.status(500).json({ message: "Server Error." })
    }
}
export const deleteIncome = async (req, res) => {
    try {
        await Income.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Income deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Server Error." })
    }

}
export const downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id
    try {
        const income = await Income.find({ userId }).sort({ date: -1 });

        // prepare data for excel
        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: new Date(item.date)
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);

        // Adjust column widths for Source, Amount, Date
        ws['!cols'] = [
            { wch: 20 }, // Source
            { wch: 15 }, // Amount
            { wch: 15 }  // Date
        ];
        xlsx.utils.book_append_sheet(wb, ws, 'Income');
        // Generate Excel in-memory buffer
        const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

        // Set headers for download
        res.setHeader('Content-Disposition', 'attachment; filename=income_details.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        // Send buffer
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: "Server Error." })
    }
}