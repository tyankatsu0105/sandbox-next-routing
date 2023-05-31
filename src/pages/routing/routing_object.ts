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
     * 型のstring literal unionを作るために利用するため、実際に値として利用されない
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
 * path parameterを含む文字列から、path parameterにあたる文字列の string literal union を生成する
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

export const createGeneratePath = <CreatedRoutingObject extends RoutingObject>(
  routingObject: CreatedRoutingObject
) => {
  const generatePath = (parameters: {
    query: {
      [Key in CreatedRoutingObject["queryParameters"][number]["key"]]?: Extract<
        CreatedRoutingObject["queryParameters"][number],
        { key: Key }
      > extends {
        key: Key;
        expectedValues?: readonly (infer ExpectedValues)[];
      }
        ? ExpectedValues | (string & {})
        : string;
    };
    path: {
      [key in PathParams<CreatedRoutingObject["pathname"]>]: string;
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
    generatePath,
  };
};

export const createRoutingObject = <
  Pathname extends RoutingObject["pathname"],
  QueryParameters extends RoutingObject["queryParameters"]
>(routingObject: {
  pathname: Pathname;
  queryParameters: QueryParameters;
}) => {
  const queryParameterKeys: QueryParameters[number]["key"][] =
    routingObject.queryParameters.map((queryParameter) => queryParameter.key);

  const { generatePath } = createGeneratePath(routingObject);

  return {
    pathname: routingObject.pathname,
    queryParameterKeys,
    generatePath,
  };
};
