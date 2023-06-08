import QueryString from "query-string";
import { QueryParameterMap } from "./query_parameter";
import { createURLObject } from "./url_object";

type ParseParameters = Parameters<typeof QueryString.parse>;
export const parse = <
  URLObject extends Omit<ReturnType<typeof createURLObject>, "generatePath">
>(
  ...args: ParseParameters
) => {
  type QueryParameters = Partial<
    QueryParameterMap<URLObject["__FOR_TYPE__QUERY_PARAMETERS"]>
  >;

  return QueryString.parse(...args) as QueryParameters;
};
