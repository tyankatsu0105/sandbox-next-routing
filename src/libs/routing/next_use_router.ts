import { createURLObject } from "./url_object";
import { useRouter } from "next/router";
import { QueryParameterMap } from "./query_parameter";
import { PathParams } from "./path_parameter";

export const getTypedQuery = <
  URLObject extends Omit<ReturnType<typeof createURLObject>, "generatePath">
>(
  router: ReturnType<typeof useRouter>
) => {
  type QueryParameters = Partial<
    QueryParameterMap<URLObject["__FOR_TYPE__QUERY_PARAMETERS"]>
  >;
  type PathParameters = Record<PathParams<URLObject["pathname"]>, string>;

  const query = router.query as QueryParameters & PathParameters;

  return { query };
};
