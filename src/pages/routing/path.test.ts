import * as Feature from "./path";

import { describe, it, expect, expectTypeOf } from "vitest";

describe("path", () => {
  describe("createRoutingObject", () => {
    it("返却されたオブジェクトは、RoutingObjectと同等である", () => {
      const routingObject = Feature.createRoutingObject({
        pathname: "/users/:userID",
        queryParameters: [
          {
            key: "userCategory",
            expectedValues: ["admin", "general"],
          },
        ],
      } as const);

      expectTypeOf<
        typeof routingObject
      >().toMatchTypeOf<Feature.RoutingObject>();
    });
  });
});
