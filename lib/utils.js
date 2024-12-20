import HttpKit from "@/common/HttpKit";
import { format, parse, isMatch } from "date-fns";
import axios from "axios";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AUTH_TOKEN_KEY, ROLE } from "./keyChain";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function deferred() {
  let _deferred = {};
  _deferred.promise = new Promise(function (resolve, reject) {
    _deferred.resolve = resolve;
    _deferred.reject = reject;
  });
  return _deferred;
}

export const setTokenAndRedirect = async (token, redirect = () => {}) => {
  try {
    const client = await HttpKit.setClientToken(token);
    const authToken =
      client.defaults.headers.common["Authorization"].split(" ")[1];
    localStorage.setItem(AUTH_TOKEN_KEY, authToken);
    HttpKit.defer.resolve(client);
    redirect();
  } catch (error) {
    console.error(error);
  }
};

const keyStr =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

const triplet = (e1, e2, e3) =>
  keyStr.charAt(e1 >> 2) +
  keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
  keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
  keyStr.charAt(e3 & 63);

export const rgbDataURL = (r, g, b) =>
  `data:image/gif;base64,R0lGODlhAQABAPAA${
    triplet(0, r, g) + triplet(b, 255, 255)
  }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;

export function dateFormatter(date) {
  // Check if the input date is already in the "yyyy-MM-dd" format
  if (isMatch(date, "yyyy-MM-dd")) {
    return date;
  }

  // Parse the input date string
  const parsedDate = parse(date, "MM-dd-yyyy", new Date());

  // Format the parsed date
  const formattedDate = format(parsedDate, "yyyy-MM-dd");

  return formattedDate;
}

export const handleGoToNextStep = (
  labels = [],
  formik,
  goToNext = () => {},
) => {
  // Make all fields as touched
  labels.forEach((label) => {
    formik.setFieldTouched(label, true);
  });

  let haveErrors = true;

  // Loop through all the labels of a view
  for (const label of labels) {
    // Store if the current element is in the error object
    const temp = label in formik.errors;

    if (temp) {
      haveErrors = temp;
      break;
    }

    haveErrors = temp;
  }

  if (haveErrors) {
    return;
  } else {
    goToNext();
  }
};

export function addRolePrefixToUrlsAndFilter(menuOptions, urlsToModify, role) {
  let prefix;
  if (role === ROLE.CUSTOMER) {
    prefix = "";
  } else if (role === ROLE.DELIVERY_DRIVER || role === ROLE.REMOVAL_DRIVER) {
    prefix = "/driver";
  } else if (role === ROLE.CLEANING_PROVIDER) {
    prefix = "/cleaner";
  }

  const updatedMenuOptions = menuOptions.map((option) => ({
    ...option,
    href: urlsToModify.includes(option.href)
      ? `${prefix}${option.href}`
      : option.href,
  }));

  return updatedMenuOptions.filter((option) => option.role.includes(role));
}

export function sanitizeParams(params) {
  const sanitizedObj = {};

  for (const key in params) {
    if (params[key]) {
      sanitizedObj[key] = params[key];
    }
  }

  return sanitizedObj;
}

export const formatText = (text) => {
  if (text) {
    const textLowerCase = text.split("_").join(" ").toLowerCase();
    const formattedText =
      textLowerCase.charAt(0).toUpperCase() + textLowerCase.slice(1);
    return formattedText;
  } else {
    return "";
  }
};


