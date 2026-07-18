// import puppeteer from "puppeteer";
// import ejs from "ejs";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export const generatePDF = async (invoice) => {

//     // Render invoice.ejs into HTML
//     //reads invoice.ejs and puts invoice data into it.
//     const html = await ejs.renderFile(
//         path.join(__dirname, "../../views/invoice.ejs"),
//         { invoice }
//     );

//     // opens hidden Chrome.
//     const browser = await puppeteer.launch({
//       headless: true,
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });  // PROBLEM

//     //prints that HTML as PDF.
//     const page = await browser.newPage();

//     // Load HTML into browser
//     await page.setContent(html, {
//       waitUntil: "domcontentloaded",
//       timeout: 60000,
//     });

//     await page.addStyleTag({
//         path: path.join(__dirname, "../../public/invoice.css"),
//     });

//     // Convert HTML → PDF
//     const pdf = await page.pdf({
//         format: "A4",
//         printBackground: true,
//         margin: {
//             top: "15mm",
//             bottom: "15mm",
//             left: "12mm",
//             right: "12mm",
//         },
//     });

//     await browser.close();

//     return pdf;
// };



import puppeteer from "puppeteer";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let browserInstance = null;

const getBrowser = async () => {
  if (browserInstance && browserInstance.isConnected()) {
    return browserInstance;
  }
  browserInstance = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage", // critical on Render — limited /dev/shm causes Chrome to crash/hang
      "--disable-gpu",
      "--single-process",        // helps on low-memory Render instances
      "--no-zygote",
    ],
  });

  // if Chrome crashes, drop the reference so next call relaunches
  browserInstance.on("disconnected", () => {
    browserInstance = null;
  });

  return browserInstance;
};

export const generatePDF = async (invoice) => {
  const html = await ejs.renderFile(
    path.join(__dirname, "../../views/invoice.ejs"),
    { invoice }
  );

  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.setContent(html, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    await page.addStyleTag({
      path: path.join(__dirname, "../../public/invoice.css"),
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "15mm", bottom: "15mm", left: "12mm", right: "12mm" },
    });

    return pdf;
  } finally {
    await page.close(); // close the page, NOT the browser
  }
};