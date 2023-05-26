type PathParams<Path extends string> =
  Path extends `:${infer Param}/${infer Rest}`
    ? Param | PathParams<Rest>
    : Path extends `:${infer Param}`
    ? Param
    : Path extends `${any}:${infer Param}`
    ? PathParams<`:${Param}`>
    : never;

type RoutingObject = {
  /**
   * url文字列に当たる部分
   * @example
   * '/users'
   * '/users/:userID'
   * '/users/:userID/:postID'
   */
  readonly pathname: string;
  /**
   * query parameterを利用する場合に指定する
   * @example
   * '/users?userCategory=admin&userStatus=active'
   * // => [ 'userCategory', 'userStatus ]
   */
  readonly queryParameterKeys: readonly string[];
};

const USERS = {
  pathname: "/users",
  queryParameterKeys: [],
} as const satisfies RoutingObject;

const USER = {
  pathname: "/users/:userID",
  queryParameterKeys: ["userCategory", "userStatus"],
} as const satisfies RoutingObject;

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
  const replacedPath = Object.entries(parameters.path).reduce(
    (acc, [key, value]) => {
      if (typeof value !== "string") return acc;

      return acc.replace(`:${key}`, value);
    },
    url.pathname
  );
  const queryString = Object.entries(parameters.query)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  if (queryString === "") return replacedPath;

  return `${replacedPath}?${queryString}`;
};

export const Routing = {
  USER,
  USERS,
};
