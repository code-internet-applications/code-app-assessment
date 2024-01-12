import express from "express";
import { shippingLabel } from "../shipping-label";
import { ShippingLabelService } from "../shipping-label/service";
import {
  formatError,
  validateShippingLabelInput,
} from "../shipping-label/validation";

jest.mock("../shipping-label/service");
jest.mock("../shipping-label/validation");

const mockedValidateShippingLabelInput =
  validateShippingLabelInput as jest.Mock;

const mockedFormatError = formatError as jest.MockedFunction<
  typeof formatError
>;

const mockedShippingLabelServiceBuilder =
  ShippingLabelService.builder as jest.Mock;

describe("shippingLabel", () => {
  let mockRequest: express.Request;
  let mockResponse: express.Response;

  beforeEach(() => {
    mockRequest = {
      body: {},
    } as express.Request;
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      sendFile: jest.fn(),
    } as unknown as express.Response;
  });

  it("should return 400 if body is empty", async () => {
    // Act
    await shippingLabel(mockRequest, mockResponse);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith(
      "Request body cannot be empty."
    );
  });

  it("should return 400 if validation errors exist", async () => {
    // Arrange
    const mockErrors = ["Should not be empty"];

    mockedFormatError.mockReturnValue({
      field: "order",
      errors: "Should not be empty",
    });

    mockedValidateShippingLabelInput.mockResolvedValue(mockErrors);

    mockRequest.body = { order: "" };

    // Act
    await shippingLabel(mockRequest, mockResponse);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledTimes(1);
    expect(mockResponse.send).toHaveBeenCalledWith([
      {
        field: "order",
        errors: "Should not be empty",
      },
    ]);
  });

  it("should send file if no errors", async () => {
    // Arrange
    mockedValidateShippingLabelInput.mockResolvedValue([]);

    const mockFilePath = "path/to/file";

    mockedShippingLabelServiceBuilder.mockResolvedValueOnce({
      generatePDF: jest.fn().mockResolvedValueOnce(mockFilePath),
    });

    mockRequest.body = {
      order: "123",
      name: "John Doe",
      language: "en",
      return_address: {
        company: "Test",
        address: "Test",
        zip_code: "Test",
        city: "Test",
        country: "Test",
      },
    };

    // Act
    await shippingLabel(mockRequest, mockResponse);

    // Assert
    expect(mockResponse.sendFile).toHaveBeenCalledWith(mockFilePath);
  });
});
