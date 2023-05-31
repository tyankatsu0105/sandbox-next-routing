export type RoutingObject = {
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
   */
  readonly queryParameters: readonly {
    /**
     * query parameterのkey
     * @example
     * '/users?userCategory=admin'
     * // => 'userCategory'
     */
    key: string;
    /**
     * valueとして入ってくる可能性のある値を指定する
     *
     * 何も指定しない場合はstringとして扱われる
     * @example
     * '/users?userCategory=admin'
     * // => [ 'admin', 'general' ]
     */
    expectedValues?: readonly string[];
  }[];
};

/**
 * path parameter含む文字列から、path parameterにあたる文字列の string literal union を生成する
 *
 * @example
 * type Result = PathParams<'/users/:userID/:postID'>
 * // type Result = 'userID' | 'postID'
 */
export type PathParams<Path extends string> =
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
}) => {
  const pathEntries = Object.entries(params.path);
  const hasPathParameter = pathEntries.length > 0;

  if (!hasPathParameter) return params.pathname;
  return Object.entries(params.path).reduce((acc, [key, value]) => {
    if (typeof value !== "string") return acc;

    return acc.replace(`:${key}`, value);
  }, params.pathname);
};

export const getQueryString = (params: { query: Record<string, unknown> }) => {
  const queryEntries = Object.entries(params.query);
  const hasQueryParameter = queryEntries.length > 0;

  if (!hasQueryParameter) return "";

  const queryString = queryEntries
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `?${queryString}`;
};

/**
 * NOTE: satisfiesが使えない場合、この関数を用いてrouting objectを生成する。
 * - 引数のオブジェクトは必ずconst assertionすること。
 *
 * @example
 * const USER = createRoutingObject({
 *  pathname: "/users/:userID",
 *  queryParameterKeys: ["userCategory", "userStatus"],
 * } as const)
 * // const USER: {
 * //   pathname: "/users/:userID";
 * //   queryParameterKeys: readonly ["userCategory", "userStatus"];
 * // }
 */
export const createRoutingObject = <
  Pathname extends RoutingObject["pathname"],
  QueryParameters extends RoutingObject["queryParameters"]
>(routingObject: {
  pathname: Pathname;
  queryParameters: QueryParameters;
}) => {
  /**
   * pathを生成する
   * @example
   * const USER = {
   *   pathname: '/users/:userID',
   *   queryParameters: [
   *     {
   *       key: 'userCategory',
   *       expectedValues: ['admin', 'general']
   *     },
   *    {
   *      key: 'userStatus',
   *      expectedValues: ['active', 'inactive']
   *     }
   *   ]
   * }
   *
   * USER.generatePath({
   *   query: {
   *     userCategory: 'admin',
   *     userStatus: 'active'
   *   },
   *   path: {
   *     userID: '123'
   *   }
   * })
   * // /users/123?userCategory=admin&userStatus=active
   */
  const generatePath = (parameters: {
    query: {
      [Key in QueryParameters[number]["key"]]?: Extract<
        QueryParameters[number],
        { key: Key }
      > extends {
        key: Key;
        expectedValues?: readonly (infer ExpectedValues)[];
      }
        ? ExpectedValues | (string & {})
        : string;
    };
    path: {
      [key in PathParams<Pathname>]: string;
    };
  }) => {
    const replacedPath = getReplacedPath({
      pathname: routingObject.pathname,
      path: parameters.path,
    });

    const queryString = getQueryString({ query: parameters.query });

    return `${replacedPath}${queryString}`;
  };

  return {
    pathname: routingObject.pathname,
    generatePath,
  };
};
