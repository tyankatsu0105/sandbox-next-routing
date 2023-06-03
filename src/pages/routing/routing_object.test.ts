import { describe, it, expectTypeOf, expect } from "vitest";

import * as Feature from "./routing_object";

describe("routing_object", () => {
  describe("createRoutingObject", () => {
    describe("pathname", () => {
      it("引数に渡したpathnameの文字列を返す", () => {
        const routingObject = Feature.createRoutingObject({
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

        const result = routingObject.pathname;

        expect(result).toBe(routingObject.pathname);
      });
    });

    describe("queryParameterKeys", () => {
      it("引数に渡したqueryParametersのkeyの文字列を格納した配列を返す", () => {
        const routingObject = Feature.createRoutingObject({
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

        const result = routingObject.queryParameterKeys;

        expect(result).toStrictEqual(["userCategory", "userStatus"]);
        expectTypeOf<typeof result>().toEqualTypeOf<
          ("userCategory" | "userStatus")[]
        >();
      });
    });

    describe("generatePath", () => {
      it("createRoutingObjectのgeneratePathは、createGeneratePathから生成されたものである", () => {
        const routingObject = {
          pathname: "/users/:userID",
          queryParameters: [
            {
              key: "userCategory",
              expectedValues: ["admin", "general"],
            },
          ],
        } as const;

        const createdRoutingObject = Feature.createRoutingObject(routingObject);

        expectTypeOf<
          ReturnType<
            typeof Feature.createGeneratePath<typeof routingObject>
          >["generatePath"]
        >().toEqualTypeOf<(typeof createdRoutingObject)["generatePath"]>();
      });
    });
  });

  describe("createGeneratePath", () => {
    it("generatePathメソッドを返す", () => {
      const routingObject = {
        pathname: "/users/:userID",
        queryParameters: [],
      } as const;

      const result = Feature.createGeneratePath(routingObject);

      expect(result).toHaveProperty("generatePath");
    });

    describe("generatePath", () => {
      it("引数に渡した値を元に、routingObject内のpathnameの値を変換した文字列を返す", () => {
        const routingObject = {
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
        } as const;
        const parameters: Parameters<
          ReturnType<
            typeof Feature.createGeneratePath<typeof routingObject>
          >["generatePath"]
        >[0] = {
          path: {
            userID: "123",
          },
          query: {
            userCategory: "admin",
            userStatus: "active",
          },
        };

        const result =
          Feature.createGeneratePath(routingObject).generatePath(parameters);

        expect(result).toBe("/users/123?userCategory=admin&userStatus=active");
      });

      it("routingObjectのpathnameにpath parameter文字列を含んでいれば、pathを構築する際にキーがpath parameterのstring literalを型推論できる", () => {
        const routingObject = {
          pathname: "/users/:userID/:postID",
          queryParameters: [],
        } as const;

        const result = Feature.createGeneratePath(routingObject);
        type Result = Parameters<typeof result.generatePath>[0]["path"];

        expectTypeOf<Result>().toEqualTypeOf<{
          userID: string;
          postID: string;
        }>();
      });

      it("routingObjectのqueryParametersにexpectedValuesが存在していれば、queryを構築する際にexpectedValuesに記入したstring literalを型推論できる", () => {
        const routingObject = {
          pathname: "/users/:userID",
          queryParameters: [
            {
              key: "userCategory",
              expectedValues: ["admin"],
            },
            {
              key: "userStatus",
              expectedValues: ["active", "inactive"],
            },
            {
              key: "userType",
            },
          ],
        } as const;

        const result = Feature.createGeneratePath(routingObject);
        type Result = Parameters<typeof result.generatePath>[0]["query"];

        expectTypeOf<Result>().toEqualTypeOf<{
          userCategory?: "admin" | (string & {}) | undefined;
          userStatus?: "active" | "inactive" | (string & {}) | undefined;
          userType?: unknown;
        }>();
      });
    });
  });
});
