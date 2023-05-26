type URLObject = {
  /**
   * url文字列に当たる部分
   * @example
   * '/users'
   * '/users/[userID]'
   * '/users/[userID]/[postID]'
   */
  readonly pathname: string;
  /**
   * query parameterを利用する場合に指定する
   * @example
   * '/reservation_complete?reservedID=Reservation_100&reservedCount=5'
   * // => [ 'reservedID', 'reservedCount' ]
   */
  readonly queryParameterKeys?: readonly string[];
};

const USERS = {
  pathname: "/users",
} as const satisfies URLObject;

const USER = {
  pathname: "/users/:userID",
  queryParameterKeys: ["userCategory"],
} as const satisfies URLObject;

export const URL = {
  USER,
  USERS,
};
