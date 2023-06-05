import * as Feature from "./query_parameter";
import { createRoutingObject } from "./routing_object";
import { expectTypeOf } from "expect-type";

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

  describe("QueryParameterMap", () => {
    it("createRoutingObjectの__FOR_TYPE__QUERY_PARAMETERSの型を渡すと、 queryParametersの要素のkeyをkey、expectedValuesの文字列のunionとstringをvalueとしたオブジェクトの型を返す", () => {
      const routingObject = createRoutingObject({
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
        ],
      } as const);

      type Result = Feature.QueryParameterMap<
        (typeof routingObject)["__FOR_TYPE__QUERY_PARAMETERS"]
      >;

      expectTypeOf<Result>().toEqualTypeOf<{
        userCategory: "admin" | "general" | (string & {});
        userStatus: "active" | "inactive" | (string & {});
      }>();
    });
  });
});
