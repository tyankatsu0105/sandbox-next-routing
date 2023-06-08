import { expectTypeOf } from "expect-type";
import * as Feature from "./path_parameter";

describe("path_parameter", () => {
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
});
