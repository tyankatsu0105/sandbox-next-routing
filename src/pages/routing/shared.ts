export type RoutingObject = {
  /**
   * url文字列に当たる部分
   * @example
   * '/users'
   * '/users/:userID'
   * '/users/:userID/:postID'
   */
  readonly pathname: string
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
    key: string
    /**
     * valueとして入ってくる可能性のある値を指定する
     *
     * 何も指定しない場合はstringとして扱われる
     * @example
     * '/users?userCategory=admin'
     * // => [ 'admin', 'general' ]
     */
    expectedValues?: readonly string[]
  }[]
}

/**
 * createRoutingObjectの戻り値にあたる型
 */
export type CreatedRoutingObject = {
  readonly pathname: RoutingObject['pathname']
  /**
   * 型のために利用する。外部からは利用しない。
   */
  readonly __INTERNAL__queryParameters: RoutingObject['queryParameters']
}

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
export const createRoutingObject = <Pathname extends RoutingObject['pathname'], QueryParameters extends RoutingObject['queryParameters']>(routingObject: {
  pathname: Pathname
  queryParameters: QueryParameters
}) => ({
  pathname: routingObject.pathname,
  __INTERNAL__queryParameters: routingObject.queryParameters
})

/**
 * path parameter含む文字列から、path parameterにあたる文字列の string literal union を生成する
 *
 * @example
 * type Result = PathParams<'/users/:userID/:postID'>
 * // type Result = 'userID' | 'postID'
 */
export type PathParams<Path extends string> = Path extends `:${infer Param}/${infer Rest}`
  ? Param | PathParams<Rest>
  : Path extends `:${infer Param}`
  ? Param
  : Path extends `${any}:${infer Param}`
  ? PathParams<`:${Param}`>
  : never
