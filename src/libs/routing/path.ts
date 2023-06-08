import { createURLObject } from "./url_object";

const USERS = createURLObject({
  pathname: "/users",
  queryParameters: [],
} as const);

const USER = createURLObject({
  pathname: "/users/:userID",
  queryParameters: [
    {
      key: "userCategory",
      expectedValues: ["admin", "general"],
    },
    {
      key: "userStatus",
      expectedValues: ["active", "inactive"],
    },
    {
      key: "userType",
    },
  ],
} as const);

export const Routing = {
  USER,
  USERS,
};
