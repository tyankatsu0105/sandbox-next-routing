import { RoutingObject } from "./path";

type PathParams<Path extends string> =
  Path extends `:${infer Param}/${infer Rest}`
    ? Param | PathParams<Rest>
    : Path extends `:${infer Param}`
    ? Param
    : Path extends `${any}:${infer Param}`
    ? PathParams<`:${Param}`>
    : never;

export const getReplacedPath = (params: {
  pathname: RoutingObject["pathname"];
  path: Record<string, string>;
}) =>
  Object.entries(params.path).reduce((acc, [key, value]) => {
    if (typeof value !== "string") return acc;

    return acc.replace(`:${key}`, value);
  }, params.pathname);

export const getQueryString = (params: {
  query: Record<string, string | undefined>;
}) => {
  const queryEntries = Object.entries(params.query);
  const hasQueryParameter = queryEntries.length > 0;

  if (!hasQueryParameter) return "";

  const queryString = queryEntries
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `?${queryString}`;
};

/**
 * pathを生成する
 * @example
 * const Routing = {
 *   pathname: '/users/:userID',
 *   queryParameterKeys: ['userCategory', 'userStatus']
 * }
 *
 * generatePath(Routing, {
 *   query: {
 *     userCategory: 'admin',
 *     userStatus: 'active'
 *   },
 *   path: {
 *     userID: '123'
 *   }
 * })
 */
export const generatePath = <Routing extends RoutingObject>(
  url: Routing,
  parameters: {
    query: {
      [key in Routing["queryParameterKeys"][number]]?: string;
    };
    path: {
      [key in PathParams<Routing["pathname"]>]: string;
    };
  }
) => {
  const replacedPath = getReplacedPath({
    pathname: url.pathname,
    path: parameters.path,
  });

  const queryString = getQueryString({ query: parameters.query });

  return `${replacedPath}${queryString}`;
};
