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
  pathname: string;
  path: Record<string, string>;
}) => {
  const pathEntries = Object.entries(params.path);
  const hasPathParameter = pathEntries.length > 0;

  if (!hasPathParameter) return params.pathname;

  const result = Object.entries(params.path).reduce((acc, [key, value]) => {
    return acc.replace(`:${key}`, value);
  }, params.pathname);

  return result;
};
