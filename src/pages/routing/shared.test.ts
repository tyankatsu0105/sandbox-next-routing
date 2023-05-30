import { expectTypeOf } from 'expect-type'

import * as Feature from './shared'

describe('shared', () => {
  describe('createRoutingObject', () => {
    it('返却されたオブジェクトは、CreatedRoutingObjectと同等である', () => {
      const routingObject = Feature.createRoutingObject({
        pathname: '/users/:userID',
        queryParameters: [
          {
            key: 'userCategory',
            expectedValues: ['admin', 'general']
          }
        ]
      } as const)

      expectTypeOf<typeof routingObject>().toMatchTypeOf<Feature.CreatedRoutingObject>()
    })
  })

  describe('PathParams', () => {
    describe('genericsに「:」のついたpath parametersにあたる文字列を含む文字列を渡すと、', () => {
      it('path parametersの文字列のstring literalを返す', () => {
        type Path = '/users/:userID'
        expectTypeOf<Feature.PathParams<Path>>().toEqualTypeOf<'userID'>()
      })

      it('path parametersの文字列のstring literal unionを返す', () => {
        type Path = '/users/:userID/:postID'

        expectTypeOf<Feature.PathParams<Path>>().toEqualTypeOf<'userID' | 'postID'>()
      })
    })
  })
})
