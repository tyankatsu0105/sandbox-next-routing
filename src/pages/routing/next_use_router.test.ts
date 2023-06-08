import * as Feature from "./next_use_router";
import { useRouter } from "next/router";
import { renderHook } from "@testing-library/react";
import { createURLObject } from "./url_object";
import { expectTypeOf } from "expect-type";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const typedUseRouter = useRouter as jest.MockedFn<typeof useRouter>;

describe("next_use_router", () => {
  describe("getTypedQuery", () => {
    it("返却値のqueryは、useRouterのqueryと同じである", () => {
      const queryObj = {
        userCategory: "admin",
        userStatus: "active",
        userID: "123",
      };
      typedUseRouter.mockImplementation(() => ({
        ...jest.requireActual("next/router"),
        query: queryObj,
      }));

      const { result } = renderHook(() => {
        return Feature.getTypedQuery(useRouter());
      });

      expect(result.current.query).toStrictEqual(queryObj);
    });

    it("genericsにcreateRoutingで生成したurlObjectの型を指定すると、optionalのquery parameterとrequiredのpath parameterがqueryプロパティに型付けされる", () => {
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
      typedUseRouter.mockImplementation(() => ({
        ...jest.requireActual("next/router"),
      }));

      const { result } = renderHook(() => {
        return Feature.getTypedQuery<typeof urlObject>(useRouter());
      });
      type Result = typeof result.current.query;

      expectTypeOf<Result>().toMatchTypeOf<{
        userCategory?: "admin" | "general" | (string & {});
        userStatus?: "active" | "inactive" | (string & {});
        userID: string;
      }>();
    });
  });
});
