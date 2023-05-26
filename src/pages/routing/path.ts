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

const USERS = {
  pathname: "/users",
  queryParameterKeys: [],
} as const satisfies RoutingObject;

const USER = {
  pathname: "/users/:userID",
  queryParameterKeys: ["userCategory", "userStatus"],
} as const satisfies RoutingObject;

export const Routing = {
  USER,
  USERS,
};
