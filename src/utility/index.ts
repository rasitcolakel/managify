export * from "./supabaseClient";
import dayjs from "dayjs";

export const getFirstLettersOfWord = (word: string) => {
  return word
    .split(" ")
    .map((word) => word[0])
    .join("");
};

export const generateRandomColorWithName = (name: string) => {
  const muiColors = [
    "primary.main",
    "secondary.main",
    "error.main",
    "warning.main",
  ];

  const letterRow = name
    .split("")
    .map((letter) => {
      const letterCode = letter.charCodeAt(0);
      if (letterCode >= 65 && letterCode <= 90) {
        return letterCode - 65;
      } else if (letterCode >= 97 && letterCode <= 122) {
        return letterCode - 97;
      } else {
        return 0;
      }
    })
    .reduce((acc, curr) => acc + curr, 0);

  return muiColors[letterRow % muiColors.length];
};

export const readableDate = (date: string) => {
  const dateObj = dayjs(date);
  if (dateObj.isSame(dayjs(), "day")) {
    return dateObj.format("h:mm A");
  } else if (dateObj.isSame(dayjs(), "year")) {
    return dateObj.format("MMM D");
  } else {
    return dateObj.format("MMM D, YYYY");
  }
};

export function important<T>(value: T): T {
  return (value + " !important") as any;
}
