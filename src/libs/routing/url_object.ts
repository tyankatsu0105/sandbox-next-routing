import { PathParams, getReplacedPath } from "./path_parameter";
import { getQueryString, QueryParameterMap } from "./query_parameter";
export type URLObject = {
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
     * '/users?userCategory=admin' or '/users?userCategory=general'
     * // => [ 'admin', 'general' ]
     */
    expectedValues?: readonly string[];
  }[];
};

/**
 * urlObjectを束縛したいため利用する
 */
export const generatePathCreator = <CreatedURLObject extends URLObject>(
  urlObject: CreatedURLObject
) => {
  const generatePath = (parameters: {
    query: Partial<QueryParameterMap<CreatedURLObject["queryParameters"]>>;
    path: Record<PathParams<CreatedURLObject["pathname"]>, string>;
  }) => {
    const replacedPath = getReplacedPath({
      pathname: urlObject.pathname,
      path: parameters.path,
    });

    const queryString = getQueryString({ query: parameters.query });

    return `${replacedPath}${queryString}`;
  };

  return {
    generatePath,
  };
};

/**
 * NOTE: createURLObjectにわたすオブジェクトは必ずconst assertionをつけること
 */
export const createURLObject = <
  Pathname extends URLObject["pathname"],
  QueryParameters extends URLObject["queryParameters"]
>(urlObject: {
  /**
   * {@link URLObject['pathname']}
   */
  pathname: Pathname;
  /**
   * {@link URLObject['queryParameters']}
   */
  queryParameters: QueryParameters;
}) => {
  const { generatePath } = generatePathCreator(urlObject);

  return {
    pathname: urlObject.pathname,
    /**
     * 型のために利用する。実値での利用は禁止。
     */
    __FOR_TYPE__QUERY_PARAMETERS: urlObject.queryParameters,
    generatePath,
  };
};
