import {
    IsIn,
    IsNotEmpty,
    IsString,
    ValidateNested,
    ValidationError,
    validate
} from "class-validator";
import { ShippingLabelParams } from "./service";

export class ReturnAddress {
  @IsNotEmpty()
  @IsString()
  company: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  zip_code: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  country: string;
}

export class ShippingLabelInput {
  @IsNotEmpty()
  @IsString()
  order: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsIn(["en", "nl"])
  language: string;

  @ValidateNested()
  return_address: ReturnAddress;
}

/**
 * Validate the input for the shipping label and return the errors if any.
 * 
 * @param body `ShippingLabelParams`
 * @returns errors `ValidationError[]` in case of invalid input
 */
export const validateShippingLabelInput = async (body: ShippingLabelParams) => {
  const shippingLabel = new ShippingLabelInput();

  shippingLabel.order = body.order;
  shippingLabel.name = body.name;
  shippingLabel.language = body.language;

  shippingLabel.return_address = new ReturnAddress();

  shippingLabel.return_address.company = body.return_address.company;
  shippingLabel.return_address.address = body.return_address.address;
  shippingLabel.return_address.zip_code = body.return_address.zip_code;
  shippingLabel.return_address.city = body.return_address.city;
  shippingLabel.return_address.country = body.return_address.country;

  return validate(shippingLabel);
};

export const formatError = (error: ValidationError) => {
    const message = error.constraints ? Object.values(error.constraints) : "";
    return {
        field: error.property,
        errors: message
    }
}
