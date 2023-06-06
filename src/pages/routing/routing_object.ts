import { PathParams, getReplacedPath } from "./path_parameter";
import { getQueryString, QueryParameterMap } from "./query_parameter";
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
 * routingObjectを束縛したいため利用する
 */
export const generatePathCreator = <CreatedRoutingObject extends RoutingObject>(
  routingObject: CreatedRoutingObject
) => {
  const generatePath = (parameters: {
    query: Partial<QueryParameterMap<CreatedRoutingObject["queryParameters"]>>;
    path: Record<PathParams<CreatedRoutingObject["pathname"]>, string>;
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
  /**
   * {@link RoutingObject['pathname']}
   */
  pathname: Pathname;
  /**
   * {@link RoutingObject['queryParameters']}
   */
  queryParameters: QueryParameters;
}) => {
  const { generatePath } = generatePathCreator(routingObject);

  return {
    pathname: routingObject.pathname,
    /**
     * 型のために利用する。実値での利用は禁止。
     */
    __FOR_TYPE__QUERY_PARAMETERS: routingObject.queryParameters,
    generatePath,
  };
};
