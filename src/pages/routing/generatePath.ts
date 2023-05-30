import { PathParams, CreatedRoutingObject } from './shared'

export const getReplacedPath = (params: { pathname: CreatedRoutingObject['pathname']; path: Record<string, string> }) =>
  Object.entries(params.path).reduce((acc, [key, value]) => {
    if (typeof value !== 'string') return acc

    return acc.replace(`:${key}`, value)
  }, params.pathname)

export const getQueryString = (params: { query: Record<string, unknown> }) => {
  const queryEntries = Object.entries(params.query)
  const hasQueryParameter = queryEntries.length > 0

  if (!hasQueryParameter) return ''

  const queryString = queryEntries.map(([key, value]) => `${key}=${value}`).join('&')

  return `?${queryString}`
}

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
 * generatePath(USER, {
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
export const generatePath = <Routing extends CreatedRoutingObject>(
  routingObject: Routing,
  parameters: {
    query: {
      [Key in Routing['__INTERNAL__queryParameters'][number]['key']]?: Extract<Routing['__INTERNAL__queryParameters'][number], { key: Key }> extends {
        key: Key
        expectedValues?: readonly (infer ExpectedValues)[]
      }
        ? ExpectedValues | (string & {})
        : string
    }
    path: {
      [key in PathParams<Routing['pathname']>]: string
    }
  }
) => {
  const replacedPath = getReplacedPath({
    pathname: routingObject.pathname,
    path: parameters.path
  })

  const queryString = getQueryString({ query: parameters.query })

  return `${replacedPath}${queryString}`
}
