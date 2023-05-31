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

  describe("getReplacedPath", () => {
    describe("path parameterにあたる文字列と対応するキーを持つオブジェクトがpathに存在しているとき、", () => {
      it("pathnameの値がそのキーの値に置換された文字列を返す", () => {
        const params: Parameters<typeof Feature.getReplacedPath>[0] = {
          pathname: "/users/:userID",
          path: {
            userID: "123",
          },
        };

        const result = Feature.getReplacedPath(params);

        expect(result).toBe("/users/123");
      });

      it("path parameterが2以上あっても、置換された文字列を返す", () => {
        const params: Parameters<typeof Feature.getReplacedPath>[0] = {
          pathname: "/users/:userID/:postID",
          path: {
            userID: "123",
            postID: "abc",
          },
        };

        const result = Feature.getReplacedPath(params);

        expect(result).toBe("/users/123/abc");
      });
    });

    it("path parameterにあたる文字列と対応するキーを持つオブジェクトがpathに存在していないとき、置換されていない文字列を返す", () => {
      const params: Parameters<typeof Feature.getReplacedPath>[0] = {
        pathname: "/users",
        path: {},
      };

      const result = Feature.getReplacedPath(params);

      expect(result).toBe("/users");
    });
  });

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
        } as const;

        const result = Feature.createGeneratePath(routingObject);
        type Result = Parameters<typeof result.generatePath>[0]["query"];

        expectTypeOf<Result>().toEqualTypeOf<{
          userCategory?: "admin" | "general" | (string & {}) | undefined;
          userStatus?: "active" | "inactive" | (string & {}) | undefined;
          userType?: unknown;
        }>();
      });
    });
  });

  describe("PathParams", () => {
    describe("genericsに「:」のついたpath parametersにあたる文字列を含む文字列を渡すと、", () => {
      it("path parametersの文字列のstring literalを返す", () => {
        type Path = "/users/:userID";
        expectTypeOf<Feature.PathParams<Path>>().toEqualTypeOf<"userID">();
      });

      it("path parametersの文字列のstring literal unionを返す", () => {
        type Path = "/users/:userID/:postID";

        expectTypeOf<Feature.PathParams<Path>>().toEqualTypeOf<
          "userID" | "postID"
        >();
      });
    });
  });
});
