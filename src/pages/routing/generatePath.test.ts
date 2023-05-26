import * as Feature from "./generatePath";

import { describe, it, expect, expectTypeOf } from "vitest";

describe("generatePath", () => {
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

  describe("generatePath", () => {
    it("url内のpath parametersがpathオブジェクトの値に置換され、query parametersが結合した文字列を返す", () => {
      const url: Parameters<typeof Feature.generatePath>[0] = {
        pathname: "/users/:userID",
        queryParameterKeys: ["userCategory", "userStatus"],
      };
      const parameters: Parameters<typeof Feature.generatePath>[1] = {
        path: {
          userID: "123",
        },
        query: {
          userCategory: "admin",
          userStatus: "active",
        },
      };

      const result = Feature.generatePath(url, parameters);

      expect(result).toBe("/users/123?userCategory=admin&userStatus=active");
    });
  });
});
