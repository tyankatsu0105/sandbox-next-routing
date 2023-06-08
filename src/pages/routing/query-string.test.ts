import * as Feature from "./query-string";
import QueryString from "query-string";
import { createURLObject } from "./url_object";
import { expectTypeOf } from "expect-type";

describe("query_string", () => {
  describe("parse", () => {
    it("query-stringのparseと同じ結果を返す", () => {
      const args = "?userCategory=admin&userStatus=active";

      const result = Feature.parse(args);
      const resultQueryString = QueryString.parse(args);

      expect(result).toStrictEqual(resultQueryString);
    });

    it("genericsにcreateRoutingで生成したurlObjectの型を指定すると、optionalのquery parameterを型付けする", () => {
      const urlObject = createURLObject({
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
      const args = "?userCategory=admin&userStatus=active";

      const result = Feature.parse<typeof urlObject>(args);
      type Result = typeof result;

      expect(result).toEqual({
        userCategory: "admin",
        userStatus: "active",
      });
      expectTypeOf<Result>().toMatchTypeOf<{
        userCategory?: "admin" | "general" | (string & {});
        userStatus?: "active" | "inactive" | (string & {});
      }>();
    });
  });
});
