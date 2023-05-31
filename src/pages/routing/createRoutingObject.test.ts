import { describe, it, expectTypeOf, expect } from "vitest";

import * as Feature from "./createRoutingObject";

describe("createRoutingObject", () => {
  describe("createRoutingObject", () => {
    describe("generatePath", () => {
      it("routingObject内のpath parametersがpathオブジェクトの値に置換され、query parametersが結合した文字列を返す", () => {
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
        const parameters: Parameters<typeof routingObject.generatePath>[0] = {
          path: {
            userID: "123",
          },
          query: {
            userCategory: "admin",
            userStatus: "active",
          },
        };

        const result = routingObject.generatePath(parameters);

        expect(result).toBe("/users/123?userCategory=admin&userStatus=active");
      });

      it("createRoutingObjectのpathnameにpath parameter文字列を含んでいれば、pathを構築する際にキーがpath parameterのstring literalを型推論できる", () => {
        const routingObject = Feature.createRoutingObject({
          pathname: "/users/:userID/:postID",
          queryParameters: [],
        });

        type Result = Parameters<typeof routingObject.generatePath>[0]["path"];

        expectTypeOf<Result>().toEqualTypeOf<{
          userID: string;
          postID: string;
        }>();
      });

      it("createRoutingObjectのqueryParametersにexpectedValuesが存在していれば、queryを構築する際にexpectedValuesに記入したstring literalを型推論できる", () => {
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
            {
              key: "userType",
            },
          ],
        } as const);

        type Result = Parameters<typeof routingObject.generatePath>[0]["query"];

        expectTypeOf<Result>().toEqualTypeOf<{
          userCategory?: "admin" | "general" | (string & {}) | undefined;
          userStatus?: "active" | "inactive" | (string & {}) | undefined;
          userType?: unknown;
        }>();
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

    describe("queryオブジェクトに値が存在していないとき、空文字を返す", () => {
      it("先頭に「?」がつき、「key=value」となった文字列を返す", () => {
        const params: Parameters<typeof Feature.getQueryString>[0] = {
          query: {},
        };

        const result = Feature.getQueryString(params);

        expect(result).toBe("");
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
