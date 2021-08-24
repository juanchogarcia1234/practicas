import { format } from "date-fns";

export const formatDateFromDB = date => date.toString().substr(0, 10);
export const formatDateToDB = date => format(new Date(date.toString().substr(0, 28)), "y LL dd");
export const formatHour = hour => hour.substr(11, 5);
