import { createRoutingObject } from "./routing_object";
import { useRouter } from "next/router";
import { QueryParameterMap } from "./query_parameter";
import { PathParams } from "./path_parameter";

export const getTypedQuery = <
  RoutingObject extends Omit<
    ReturnType<typeof createRoutingObject>,
    "generatePath"
  >
>(
  router: ReturnType<typeof useRouter>
) => {
  type QueryParameters = Partial<
    QueryParameterMap<RoutingObject["__FOR_TYPE__QUERY_PARAMETERS"]>
  >;
  type PathParameters = Record<PathParams<RoutingObject["pathname"]>, string>;

  const query = router.query as QueryParameters & PathParameters;

  return { query };
};
