import { errorNotification } from "./Notification";

export const errorResponse = (err, placement) => {
  console.log(err.response);
  err.response.json().then((res) => {
    console.log(res);
    errorNotification(
      "There was an issue",
      `${res.message} [${res.status}] [${res.error}]`,
      placement
    );
  });
};
