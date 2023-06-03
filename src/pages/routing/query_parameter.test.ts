import { describe, it, expect, expectTypeOf } from "vitest";

import * as Feature from "./query_parameter";
import { createRoutingObject } from "./routing_object";

describe("query_parameter", () => {
  describe("getQueryString", () => {
    describe("queryオブジェクトに値が存在しているとき、", () => {
      it("先頭に「?」がつき、「key=value」となった文字列を返す", () => {
        const params: Parameters<typeof Feature.getQueryString>[0] = {
          query: {
            userCategory: "admin",
          },
        };

        const result = Feature.getQueryString(params);

        expect(result).toBe("?userCategory=admin");
      });

      it("オブジェクトが2つ以上あれば、「&」で結合された文字列を返す", () => {
        const params: Parameters<typeof Feature.getQueryString>[0] = {
          query: {
            userCategory: "admin",
            userStatus: "active",
          },
        };

        const result = Feature.getQueryString(params);

        expect(result).toBe("?userCategory=admin&userStatus=active");
      });
    });

    it("queryオブジェクトに値が存在していないとき、空文字を返す", () => {
      const params: Parameters<typeof Feature.getQueryString>[0] = {
        query: {},
      };

      const result = Feature.getQueryString(params);

      expect(result).toBe("");
    });
  });

  describe("QueryParameterKeys", () => {
    it("routing objectのquery parametersから、keyのstring literal unionを返す", () => {
      const routingObject = createRoutingObject({
        pathname: "",
        queryParameters: [
          {
            key: "userCategory",
          },
          {
            key: "userStatus",
          },
        ],
      } as const);

      type Result = Feature.QueryParameterKeys<typeof routingObject>;

      expectTypeOf<Result>().toEqualTypeOf<"userCategory" | "userStatus">();
    });
  });
});
