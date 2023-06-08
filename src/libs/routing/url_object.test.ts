import { expectTypeOf } from "expect-type";
import * as Feature from "./url_object";

describe("url_object", () => {
  describe("createURLObject", () => {
    describe("pathname", () => {
      it("引数に渡したpathnameの文字列を返す", () => {
        const urlObject = Feature.createURLObject({
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

        const result = urlObject.pathname;

        expect(result).toBe(urlObject.pathname);
      });
    });

    describe("generatePath", () => {
      it("createURLObjectのgeneratePathは、generatePathCreatorから生成されたものである", () => {
        const urlObject = {
          pathname: "/users/:userID",
          queryParameters: [
            {
              key: "userCategory",
              expectedValues: ["admin", "general"],
            },
          ],
        } as const;

        const createdURLObject = Feature.createURLObject(urlObject);

        expectTypeOf<
          ReturnType<
            typeof Feature.generatePathCreator<typeof urlObject>
          >["generatePath"]
        >().toEqualTypeOf<(typeof createdURLObject)["generatePath"]>();
      });
    });
  });

  describe("generatePathCreator", () => {
    describe("generatePath", () => {
      it("引数に渡した値を元に、urlObject内のpathnameの値を変換した文字列を返す", () => {
        const urlObject = {
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
            typeof Feature.generatePathCreator<typeof urlObject>
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
          Feature.generatePathCreator(urlObject).generatePath(parameters);

        expect(result).toBe("/users/123?userCategory=admin&userStatus=active");
      });

      it("urlObjectのpathnameにpath parameter文字列を含んでいれば、pathを構築する際にキーがpath parameterのstring literalを型推論できる", () => {
        const urlObject = {
          pathname: "/users/:userID/:postID",
          queryParameters: [],
        } as const;

        const result = Feature.generatePathCreator(urlObject);
        type Result = Parameters<typeof result.generatePath>[0]["path"];

        expectTypeOf<Result>().toEqualTypeOf<{
          userID: string;
          postID: string;
        }>();
      });

      it("urlObjectのqueryParametersにexpectedValuesが存在していれば、queryを構築する際にexpectedValuesに記入したstring literalを型推論できる", () => {
        const urlObject = {
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

        const result = Feature.generatePathCreator(urlObject);
        type Result = Parameters<typeof result.generatePath>[0]["query"];

        expectTypeOf<Result>().toEqualTypeOf<{
          userCategory?: "admin" | (string & {}) | undefined;
          userStatus?: "active" | "inactive" | (string & {}) | undefined;
          userType?: string;
        }>();
      });
    });
  });
});
