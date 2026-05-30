import { enUS } from "date-fns/locale/en-US";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getValueByKey = (language: any) => {
  switch (language) {
    case "en":
      return enUS;
    default:
      return enUS;
  }
};
