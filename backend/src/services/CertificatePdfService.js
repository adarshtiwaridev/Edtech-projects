const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");

/**
 * Generates a high-resolution, institutional-grade PDF certificate.
 * @param {Object} cert - Certificate metadata object
 * @param {Object} res - Express response stream
 */
async function streamCertificatePdf(cert, res) {
  return new Promise(async (resolve, reject) => {
    try {
      // Create landscape A4 document (841.89 x 595.28 pt)
      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margin: 0,
      });

      // Set headers for PDF download/inline viewing
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename="Certificate-${cert.verificationId}.pdf"`
      );

      doc.pipe(res);

      const width = doc.page.width;
      const height = doc.page.height;

      // 1. Background Fill
      doc.rect(0, 0, width, height).fill("#0B0F19");

      // 2. Decorative Outer Border
      doc
        .rect(20, 20, width - 40, height - 40)
        .lineWidth(3)
        .stroke("#D97706"); // Amber border

      // Decorative Inner Border
      doc
        .rect(26, 26, width - 52, height - 52)
        .lineWidth(1)
        .stroke("#4F46E5"); // Indigo border

      // 3. Top Banner & Logo
      doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .fillColor("#6366F1")
        .text("KODEMATES ACADEMIC & INSTITUTIONAL CREDENTIALS", 0, 55, {
          align: "center",
        });

      doc
        .font("Helvetica-Bold")
        .fontSize(30)
        .fillColor("#F59E0B")
        .text("CERTIFICATE OF ACHIEVEMENT", 0, 85, {
          align: "center",
        });

      doc
        .font("Helvetica")
        .fontSize(12)
        .fillColor("#9CA3AF")
        .text("THIS IS PROUDLY PRESENTED TO", 0, 135, {
          align: "center",
        });

      // 4. Student Name
      doc
        .font("Helvetica-Bold")
        .fontSize(32)
        .fillColor("#FFFFFF")
        .text(cert.studentName || "Learner", 0, 160, {
          align: "center",
        });

      // Divider Line
      doc
        .moveTo(width / 2 - 150, 205)
        .lineTo(width / 2 + 150, 205)
        .lineWidth(1.5)
        .stroke("#D97706");

      // 5. Completion Description
      doc
        .font("Helvetica")
        .fontSize(13)
        .fillColor("#D1D5DB")
        .text(
          "for successfully completing all curriculum requirements, practical assignments, and final evaluations for",
          60,
          220,
          {
            align: "center",
            width: width - 120,
          }
        );

      // Course Name
      doc
        .font("Helvetica-Bold")
        .fontSize(22)
        .fillColor("#818CF8")
        .text(cert.courseName || "Advanced Mastery Course", 60, 255, {
          align: "center",
          width: width - 120,
        });

      // Grade & Honors
      doc
        .font("Helvetica")
        .fontSize(11)
        .fillColor("#10B981")
        .text(`Grade / Honor: ${cert.grade || "Excellence & Distinction"}`, 0, 295, {
          align: "center",
        });

      // 6. Verification Details Section
      const verifyUrl = `${process.env.CLIENT_URL || "https://kodemates-frontend.vercel.app"}/verify-certificate/${cert.verificationId}`;

      // Generate QR Code Buffer
      const qrDataUrl = await QRCode.toBuffer(verifyUrl, {
        margin: 1,
        width: 100,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      // Embed QR code at bottom right
      doc.image(qrDataUrl, width - 150, height - 150, { width: 90, height: 90 });

      // Verification Text (bottom left)
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor("#9CA3AF")
        .text(`Verification ID: ${cert.verificationId}`, 60, height - 140);

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#6B7280")
        .text(`Issued Date: ${new Date(cert.issueDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, 60, height - 122)
        .text(`Instructor: ${cert.instructorName || "Kodemates Faculty"}`, 60, height - 108)
        .text(`Verify Online: ${verifyUrl}`, 60, height - 94, { width: 350 });

      // 7. Signature Line (Center Bottom)
      doc
        .moveTo(width / 2 - 80, height - 85)
        .lineTo(width / 2 + 80, height - 85)
        .lineWidth(1)
        .stroke("#4B5563");

      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor("#E5E7EB")
        .text("Academic Director", width / 2 - 80, height - 78, {
          width: 160,
          align: "center",
        });

      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor("#9CA3AF")
        .text("Kodemates Credentials Authority", width / 2 - 80, height - 64, {
          width: 160,
          align: "center",
        });

      // End document stream
      doc.end();

      doc.on("end", () => resolve());
      doc.on("error", (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  streamCertificatePdf,
};
