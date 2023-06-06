import { createRoutingObject } from "./routing_object";

const USERS = createRoutingObject({
  pathname: "/users",
  queryParameters: [],
} as const);

const USER = createRoutingObject({
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
