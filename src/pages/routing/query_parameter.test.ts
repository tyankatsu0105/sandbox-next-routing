import { describe, it, expect } from "vitest";

import * as Feature from "./query_parameter";

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
});
