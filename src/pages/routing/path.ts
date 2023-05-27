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
   * @example
   * '/users?userCategory=admin&userStatus=active'
   * // => [ 'userCategory', 'userStatus ]
   */
  readonly queryParameterKeys: readonly string[];
};

/**
 * NOTE: satisfiesが使えない場合、この関数を用いてroutingobjectを生成する。
 * 引数はRoutingObjectと必ず同じ型になるようにすること。ただ、直接RoutingObject型を参照するとリテラル型が抽出できなくなるので禁止。
 * 引数のオブジェクトは必ずconst assertionすること。
 *
 * TODO: satisfiesが使えるようになったらこの関数は削除し、オブジェクトに直接 `as const satisfies RoutingObject`をつける。
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
  QueryParameterKeys extends RoutingObject["queryParameterKeys"]
>(routingObject: {
  pathname: Pathname;
  queryParameterKeys: QueryParameterKeys;
}) => routingObject;

const USERS = createRoutingObject({
  pathname: "/users",
  queryParameterKeys: [],
} as const);

const USER = createRoutingObject({
  pathname: "/users/:userID",
  queryParameterKeys: ["userCategory", "userStatus"],
} as const);

// const USERS = {
//   pathname: "/users",
//   queryParameterKeys: [],
// } as const satisfies RoutingObject;

export const Routing = {
  USER,
  USERS,
};
