import cloudinary from "../config/cloudinary.js";

export const uploadPdfToCloudinary = (pdfBuffer, invoiceNo) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "invoice-pdfs",
        public_id: `${invoiceNo}.pdf`,
        overwrite: true,
        flags: "attachment",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(pdfBuffer);
  });
};