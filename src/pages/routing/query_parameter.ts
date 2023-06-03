/**
 * オブジェクトからquery stringを生成する
 * @example
 * const params = {
 *   query: {
 *     userStatus: 'active',
 *     userCategory: 'admin'
 *   }
 * }
 * const querystring = getQueryString(params)
 * // => '?userCategory=admin&userStatus=active'
 */
export const getQueryString = (params: { query: Record<string, unknown> }) => {
  const queryEntries = Object.entries(params.query);
  const hasQueryParameter = queryEntries.length > 0;

  if (!hasQueryParameter) return "";

  const queryString = queryEntries
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const result = `?${queryString}`;

  return result;
};
