import QueryString from "query-string";
import { QueryParameterMap } from "./query_parameter";
import { createRoutingObject } from "./routing_object";

type ParseParameters = Parameters<typeof QueryString.parse>;
export const parse = <
  RoutingObject extends Omit<
    ReturnType<typeof createRoutingObject>,
    "generatePath"
  >
>(
  ...args: ParseParameters
) => {
  type QueryParameters = Partial<
    QueryParameterMap<RoutingObject["__FOR_TYPE__QUERY_PARAMETERS"]>
  >;

  return QueryString.parse(...args) as QueryParameters;
};
