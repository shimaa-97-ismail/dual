import { enrollmentModel } from "../models/payment.js"; 
import { studentModel } from "../models/student.js";


const arabicMonths = {
  يناير: 1,
  فبراير: 2,
  مارس: 3,
  أبريل: 4,
  مايو: 5,
  يونيو: 6,
  يوليو: 7,
  أغسطس: 8,
  سبتمبر: 9,
  أكتوبر: 10,
  نوفمبر: 11,
  ديسمبر: 12,
};

export const getPaymentsSumByPeriod = async (req, res) => {
  try {
    const { monthStart, startYear, monthEnd, endYear } =  req.query;

    // Validate input
    if (!monthStart || !startYear || !monthEnd || !endYear) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const startMonthNum = arabicMonths[monthStart];
    const endMonthNum = arabicMonths[monthEnd];

    if (!startMonthNum || !endMonthNum) {
      return res.status(400).json({ error: "Invalid month name. Use Arabic month names like 'يناير'" });
    }

    const startYearNum = parseInt(startYear, 10);
    const endYearNum = parseInt(endYear, 10);

    if (isNaN(startYearNum) || isNaN(endYearNum)) {
      return res.status(400).json({ error: "Year must be a valid number" });
    }

    // Aggregation pipeline
    const result = await enrollmentModel.aggregate([
      // Unwind payments array to handle each payment separately
      { $unwind: "$payments" },

      // Convert payment month (Arabic string) to month number
      {
        $addFields: {
          paymentMonthNum: {
            $switch: {
              branches: Object.entries(arabicMonths).map(([name, num]) => ({
                case: { $eq: ["$payments.month", name] },
                then: num,
              })),
              default: null,
            },
          },
          paymentYear: "$payments.year",
        },
      },

      // Filter payments within the range (including cross‑year intervals)
      {
        $match: {
          $expr: {
            $and: [
              { $ne: ["$paymentMonthNum", null] },
              {
                $or: [
                  // Same year range
                  {
                    $and: [
                      { $eq: ["$paymentYear", startYearNum] },
                      { $eq: ["$paymentYear", endYearNum] },
                      { $gte: ["$paymentMonthNum", startMonthNum] },
                      { $lte: ["$paymentMonthNum", endMonthNum] },
                    ],
                  },
                  // Different years: start year after startMonth, end year before endMonth
                  {
                    $and: [
                      { $gt: ["$paymentYear", startYearNum] },
                      { $lt: ["$paymentYear", endYearNum] },
                    ],
                  },
                  // Start year edge: payment year = startYear, month >= startMonth
                  {
                    $and: [
                      { $eq: ["$paymentYear", startYearNum] },
                      { $gte: ["$paymentMonthNum", startMonthNum] },
                    ],
                  },
                  // End year edge: payment year = endYear, month <= endMonth
                  {
                    $and: [
                      { $eq: ["$paymentYear", endYearNum] },
                      { $lte: ["$paymentMonthNum", endMonthNum] },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },

      // Group to sum both receipt amounts
      {
        $group: {
          _id: null,
          totalAmountDueReceipt1: { $sum: "$payments.amountDueReceipt1" },
          totalAmountDueReceipt2: { $sum: "$payments.amountDueReceipt2" },
        },
      },
    ]);

    const summary = result[0] || { totalAmountDueReceipt1: 0, totalAmountDueReceipt2: 0 };

    res.status(200).json({
      period: {
        from: `${monthStart} ${startYear}`,
        to: `${monthEnd} ${endYear}`,
      },
      totalAmountDueReceipt1: summary.totalAmountDueReceipt1,
      totalAmountDueReceipt2: summary.totalAmountDueReceipt2,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const getPaymentsByIntake = async (req, res) => {
  try {
    const { intake } = req.query; 
    if (!intake) {
      return res.status(400).json({ error: "Intake parameter is required" });
    }

    // 1. Find all students with the given intake
    const students = await studentModel.find({ intake }).select("_id");
    const studentIds = students.map(s => s._id);

    if (studentIds.length === 0) {
      return res.status(200).json({
        intake,
        totalAmountDueReceipt1: 0,
        totalAmountDueReceipt2: 0,
        message: "No students found for this intake"
      });
    }

    // 2. Aggregate payments from enrollments of those students
    const result = await enrollmentModel.aggregate([
      { $match: { studentId: { $in: studentIds } } },
      { $unwind: "$payments" },
      {
        $group: {
          _id: null,
          totalAmountDueReceipt1: { $sum: "$payments.amountDueReceipt1" },
          totalAmountDueReceipt2: { $sum: "$payments.amountDueReceipt2" },
        }
      }
    ]);
    const totals = result[0] || { totalAmountDueReceipt1: 0, totalAmountDueReceipt2: 0 };

    res.status(200).json({
      intake,
      totalAmountDueReceipt1: totals.totalAmountDueReceipt1,
      totalAmountDueReceipt2: totals.totalAmountDueReceipt2,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};