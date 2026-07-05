import puppeteer from "puppeteer";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generatePDF = async (invoice) => {

    // Render invoice.ejs into HTML
    //reads invoice.ejs and puts invoice data into it.
    const html = await ejs.renderFile(
        path.join(__dirname, "../../views/invoice.ejs"),
        { invoice }
    );

    // opens hidden Chrome.
    const browser = await puppeteer.launch({
        headless: true,
    });

    //prints that HTML as PDF.
    const page = await browser.newPage();

    // Load HTML into browser
    await page.setContent(html, {
        waitUntil: "networkidle0",
    });
    await page.addStyleTag({
        path: path.join(__dirname, "../../public/invoice.css"),
    });

    // Convert HTML → PDF
    const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
            top: "15mm",
            bottom: "15mm",
            left: "12mm",
            right: "12mm",
        },
    });

    await browser.close();

    return pdf;
};