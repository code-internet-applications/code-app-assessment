import fs from "fs/promises";
import path from "path";
import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";
import { v4 as uuidv4 } from "uuid";

import { getTranslations } from "../translations";
import type { Langugage } from "../types";

export type ShippingLabelParams = {
  name: string;
  order: string;
  return_address: {
    company: string;
    address: string;
    zip_code: string;
    city: string;
    country: string;
  };
  language: Langugage;
};

export class ShippingLabelService {
  private pdfDoc: PDFDocument;
  private font: PDFFont;
  private fontBold: PDFFont;
  private assetDir: string = path.resolve(__dirname, "../../../assets");
  private outputDir: string = path.resolve(__dirname, "../../../files");

  constructor(pdfDoc: PDFDocument, font: PDFFont, fontBold: PDFFont) {
    this.pdfDoc = pdfDoc;
    this.font = font;
    this.fontBold = fontBold;
  }

  /**
   *  Use this method to initialize the service for creating a new PDFDocument from blank as per your design.
   **/
  static async builder() {
    const pdfDoc = await PDFDocument.create();

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const helveticaFontBold = await pdfDoc.embedFont(
      StandardFonts.HelveticaBold
    );

    return new ShippingLabelService(pdfDoc, helveticaFont, helveticaFontBold);
  }

  private drawText(
    page: PDFPage,
    text: string,
    positions: { x: number; y: number },
    bold: boolean = false
  ) {
    const { x, y } = positions;

    page.drawText(text, {
      x,
      y,
      size: 14,
      font: bold ? this.fontBold : this.font,
      color: rgb(0, 0, 0),
    });
  }

  private drawPostageBox(page: PDFPage, text: string) {
    const { width, height } = page.getSize();

    const [prefix] = text.split(" ");
    const copy = text.replace(" ", "\n");

    const textWidth = this.font.widthOfTextAtSize(prefix, 12);

    let fontSize = 12;
    if (textWidth > 90) {
      fontSize = 8;
    }

    page.moveTo(width - 150, height - 150);

    page.drawRectangle({
      width: 90,
      height: 110,
      borderWidth: 1,
      borderColor: rgb(0, 0, 0),
      color: rgb(1, 1, 1),
      opacity: 0.5,
      borderOpacity: 0.75,
    });

    page.moveRight(15);
    page.moveUp(65);

    page.drawText(copy, {
      size: fontSize,
      font: this.font,
      color: rgb(0, 0, 0),
      lineHeight: 12,
    });
  }

  private drawSeparator(page: PDFPage, textAbove: string, textBelow: string) {
    const { width, height } = page.getSize();

    page.drawLine({
      start: { x: 80, y: height / 2 },
      end: { x: width - 80, y: height / 2 },
      thickness: 1,
      color: rgb(0, 0, 0),
      dashArray: [2, 4],
    });

    page.drawText(textAbove, {
      x: 80 + 80,
      y: height / 2 + 30,
      color: rgb(0.75, 0, 0),
      size: 11,
    });

    page.drawText(textBelow, {
      x: 80 + 80,
      y: height / 2 - 30,
      color: rgb(0.75, 0, 0),
      size: 11,
      lineHeight: 10,
    });
  }

  /**
   * Make sure `ShippingLabel.builder()` has been called before calling this method.
   * @param params
   */
  public async generatePDF(params: ShippingLabelParams) {
    const { name, order, return_address } = params;

    const translations = getTranslations(params.language);

    // Add a blank page to the document
    const page = this.pdfDoc.addPage();

    const { height } = page.getSize();

    const { company, address, zip_code, city, country } = return_address;

    const logoImageBuffer = await fs.readFile(
      path.resolve(this.assetDir, "./code-logo.png")
    );

    // Embed the image bytes
    const logoImage = await this.pdfDoc.embedPng(logoImageBuffer);

    const logoDimensions = logoImage.scale(0.25);

    page.drawImage(logoImage, {
      x: 50,
      y: height - 100,
      width: logoDimensions.width,
      height: logoDimensions.height,
    });

    this.drawPostageBox(page, translations.postageRequired);

    this.drawSeparator(page, translations.textAbove, translations.textBelow);

    const addressNotePositions = { x: 50, y: height - 120 };

    const addressNotes = [company, address, `${zip_code} ${city}`, country];

    const LINE_HEIGHT = 20;

    for (let index = 0; index < addressNotes.length; index++) {
      const text = addressNotes[index];

      this.drawText(
        page,
        text,
        {
          ...addressNotePositions,
          y: addressNotePositions.y - LINE_HEIGHT * (index + 1),
        },
        true
      );
    }

    const orderLabelPositions = { x: 80, y: 290 };
    const orderNumberPositions = { x: 210, y: 290 };

    this.drawText(page, translations.orderNumber, orderLabelPositions);
    this.drawText(page, order, orderNumberPositions, true);

    const nameLabelPositions = { x: 80, y: 215 };
    const namePositions = { x: 140, y: 215 };

    this.drawText(page, translations.name, nameLabelPositions);
    this.drawText(page, name, namePositions, true);

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await this.pdfDoc.save();

    const filename = uuidv4() + "-" + "shipping-label.pdf";

    const filePath = path.resolve(this.outputDir, filename);

    // Save the PDF document to local disk
    await fs.writeFile(filePath, pdfBytes, {
      encoding: "utf-8",
    });

    console.log(`PDF file generated: ${filename}`);

    return filePath;
  }
}
