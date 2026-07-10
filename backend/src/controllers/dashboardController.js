import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import Customer from "../models/customer.js";
import Product from "../models/product.js";
import Company from "../models/company.js";
import Counter from "../models/counter.js";
import Invoice from "../models/invoice.js";

export const getDashboardSummary = asyncHandler(async (req, res, next) => {

    // Get company of logged in admin
    const companyId = req.admin.companyId;

    // If admin has not created a company yet
    if (!companyId) {
        return next(
            new ErrorHandler("Please setup your company first", 400)
        );
    }

    // Read period from query
    // Example:
    // /dashboard/getDashboardSummary?period=today
    // /dashboard/getDashboardSummary?period=week
    // /dashboard/getDashboardSummary?period=month
    // If nothing is sent, default is today.
    const period = req.query.period || "today";

    // Current date and time
    const now = new Date();

    // We need 4 dates.
    // currentStartDate  -> beginning of selected period
    // previousStartDate -> beginning of previous period
    // previousEndDate   -> ending of previous period

    let currentStartDate;
    let previousStartDate;
    let previousEndDate;

    // ================= TODAY =================

    if (period === "today") {

        // Today starts at 12:00 AM
        // Example:
        // Current time = 21 July 2026 3:45 PM
        //
        // currentStartDate =
        // 21 July 2026 00:00:00

        currentStartDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );

        // Yesterday starts at 12:00 AM

        previousStartDate = new Date(currentStartDate);

        previousStartDate.setDate(
            previousStartDate.getDate() - 1
        );

        // End of yesterday
        //
        // currentStartDate =
        // 21 July 00:00
        //
        // previousEndDate =
        // 20 July 23:59:59.999

        previousEndDate = new Date(currentStartDate);

        previousEndDate.setMilliseconds(-1);
    }

    // ================= LAST 7 DAYS =================

    else if (period === "week") {

        // Make today's time 12 AM first

        currentStartDate = new Date(now);

        currentStartDate.setHours(0, 0, 0, 0);

        // Move 6 days back
        //
        // Today = 21 July
        //
        // Start = 15 July
        //
        // Range becomes:
        //
        // 15 → 21 July

        currentStartDate.setDate(
            now.getDate() - 6
        );

        // Previous period ends
        // one millisecond before
        // current period starts

        previousEndDate = new Date(currentStartDate);

        previousEndDate.setMilliseconds(-1);

        // Previous period starts
        // 7 days before previousEndDate
        //
        // Previous range:
        //
        // 8 → 14 July

        previousStartDate = new Date(currentStartDate);

        previousStartDate.setDate(
            previousStartDate.getDate() - 7
        );
    }

    // ================= MONTH =================

    else if (period === "month") {

        // Beginning of current month
        //
        // Example:
        //
        // 21 July
        //
        // currentStartDate =
        // 1 July

        currentStartDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        // Beginning of previous month
        //
        // 1 June

        previousStartDate = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            1
        );

        // Last day of previous month
        //
        // 30 June 23:59:59

        previousEndDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            0,
            23,
            59,
            59,
            999
        );
    }

    // Invalid period

    else {
        return next(
            new ErrorHandler(
                "Invalid period. Use today, week or month",
                400
            )
        );
    }

    // ================= FETCH CURRENT PERIOD INVOICES =================

    const currentInvoices = await Invoice.find({

        companyId,

        createdAt: {
            $gte: currentStartDate,
            $lte: now,
        },

    });

    // ================= FETCH PREVIOUS PERIOD INVOICES =================

    const previousInvoices = await Invoice.find({

        companyId,

        createdAt: {
            $gte: previousStartDate,
            $lte: previousEndDate,
        },

    });

    // ================= COMMON FUNCTION =================
    //
    // We need the same calculations
    // for current invoices
    // and previous invoices.
    //
    // So instead of writing the code twice,
    // we create one reusable function.

    const calculateSummary = (invoices) => {

        // Revenue =
        // sum of totalAmount

        const revenue = invoices.reduce((sum, invoice) => {
            return sum + (invoice.totalAmount || 0);
        }, 0);

        // Profit =
        // sum of profit

        const profit = invoices.reduce((sum, invoice) => {
            return sum + (invoice.profit || 0);
        }, 0);

        // Find unique customers.
        //
        // Set automatically removes duplicates.
        //
        // If same customer purchased
        // 5 times today,
        // customer count should still be 1.

        const uniqueCustomers = new Set(

            invoices

                // Ignore walk-in customers
                // without customerId

                .filter(invoice => invoice.customerId)

                // Convert ObjectId to String
                // because Set compares strings easily

                .map(invoice =>
                    invoice.customerId.toString()
                )

        );

        return {

            revenue,

            profit,

            invoiceCount: invoices.length,

            customersServed:
                uniqueCustomers.size,

        };
    };

    // Calculate current period values

    const currentSummary =
        calculateSummary(currentInvoices);

    // Calculate previous period values

    const previousSummary =
        calculateSummary(previousInvoices);

    // ================= PERCENTAGE FUNCTION =================

    const calculatePercentageChange = (
        current,
        previous
    ) => {

        // Avoid divide by zero

        if (previous === 0) {

            if (current === 0)
                return 0;

            return 100;
        }

        return Number(

            (
                (
                    (current - previous)
                    / previous
                ) * 100

            ).toFixed(1)

        );
    };

    // ================= RESPONSE =================

    res.status(200).json({

        success: true,

        message:
            "Dashboard summary fetched successfully",

        period,

        summary: {

            revenue: {

                current:
                    currentSummary.revenue,

                previous:
                    previousSummary.revenue,

                change:

                    calculatePercentageChange(

                        currentSummary.revenue,

                        previousSummary.revenue

                    ),

            },

            profit: {

                current:
                    currentSummary.profit,

                previous:
                    previousSummary.profit,

                change:

                    calculatePercentageChange(

                        currentSummary.profit,

                        previousSummary.profit

                    ),

            },

            invoices: {

                current:
                    currentSummary.invoiceCount,

                previous:
                    previousSummary.invoiceCount,

                // Example:
                //
                // Today = 20 invoices
                // Yesterday = 15 invoices
                //
                // Difference = +5

                difference:

                    currentSummary.invoiceCount -

                    previousSummary.invoiceCount,

            },

            customers: {

                current:
                    currentSummary.customersServed,

                previous:
                    previousSummary.customersServed,

                difference:

                    currentSummary.customersServed -

                    previousSummary.customersServed,

            },

        },

    });

});

export const getSalesTrend=asyncHandler(async(req,res,next)=>{
    const companyId = req.admin.companyId;

    if (!companyId) {
        return next(
            new ErrorHandler("Please setup your company first", 400)
        );
    }

    const now=new Date();
    const endDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );
    endDate.setHours(23, 59, 59, 999);

     const startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    startDate.setDate(startDate.getDate() - 9);

    const invoices = await Invoice.find({
        companyId,
        createdAt: {
            $gte: startDate,
            $lte: endDate,
        },
    });

    let salesTrend=[]
    

    for(let i=0;i<10;i++){
        const dayStart = new Date(startDate);
        dayStart.setDate(startDate.getDate() + i);
        dayStart.setHours(0, 0, 0, 0);

        const dayEnd = new Date(dayStart);
        dayEnd.setHours(23, 59, 59, 999);

        const dailyRevenue = invoices
            .filter((invoice) => {
                const invoiceDate = new Date(invoice.createdAt);

                return (
                    invoiceDate >= dayStart &&
                    invoiceDate <= dayEnd
                );
            })
            .reduce((sum, invoice) => {
                return sum + (invoice.totalAmount || 0);
            }, 0);

            salesTrend.push({
            label: dayStart.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
            }),
            revenue: dailyRevenue,
        });




    }

     res.status(200).json({
        success: true,
        message: "Sales trend fetched successfully",
        salesTrend,
    });

})