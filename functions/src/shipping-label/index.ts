import express from "express";
import { ShippingLabelService } from "./service";
import { formatError, validateShippingLabelInput } from "./validation";

/**
 * Route: get the shipping label
 *
 * @param req Express request
 * @param res Express response
 */
export const shippingLabel = async (
  req: express.Request,
  res: express.Response
) => {
  const body = req.body;

  if (!body || Object.keys(body).length === 0) {
    return res.status(400).send("Request body cannot be empty.");
  }

  const errors = await validateShippingLabelInput(body);

  if (errors.length > 0) {
    return res.status(400).send(errors.map(formatError));
  }

  const shippingLabelService = await ShippingLabelService.builder();

  const filePath = await shippingLabelService.generatePDF(body);

  return res.sendFile(filePath);
};
