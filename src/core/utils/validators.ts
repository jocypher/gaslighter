import { getAddress } from "ethers";

export const addressValidator = (value: any, helpers: any) => {
  try {
    if (getAddress(value)) {
      return value;
    }
  } catch (err) {
    return helpers.error("any.invalid", err);
  }
};
