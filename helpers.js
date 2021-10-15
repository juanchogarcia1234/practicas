import { format, nextMonday, nextTuesday, nextWednesday, nextThursday, nextFriday, nextSaturday, nextSunday } from "date-fns";

export const formatDateFromDB = date => date.toString().substr(0, 10);
export const formatDateToDB = date => format(new Date(date.toString().substr(0, 28)), "y LL dd");
export const formatHour = hour => hour.substr(11, 5);
export const isLastElement = (myArray, el) => {
  return myArray[myArray.length - 1] === el ? true : false;
};
export const daysMapping = {
  L: nextMonday,
  M: nextTuesday,
  X: nextWednesday,
  J: nextThursday,
  V: nextFriday,
  S: nextSaturday,
  D: nextSunday
};
