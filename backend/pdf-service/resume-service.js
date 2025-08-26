// resume-service.js
import express from "express";
import puppeteer from "puppeteer";

const app = express();
app.use(express.json());

// Simple health check
app.get("/", (req, res) => {
  res.send("Resume PDF Service Running ✅");
});

app.post("/generate-pdf", async (req, res) => {
  const { html } = req.body;

  if (!html) {
    return res.status(400).json({ error: "HTML content is required" });
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new", // ensures headless works cleanly
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");
    res.setHeader("Content-Length", pdfBuffer.length);

    return res.end(pdfBuffer);
  } catch (error) {
    console.error("PDF generation failed:", error);
    res.status(500).json({ error: "Failed to generate PDF" });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Resume Service listening on port ${PORT}`);
});
