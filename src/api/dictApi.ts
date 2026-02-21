import request from '@/utils/request'

/* 字典模块 */

export interface Res {
  code: string
  msg: string
  data: any
}

// 付款类型(支付方式)
export function getPayType(query: { model: 'payType' } = { model: 'payType' }): Promise<Res> {
  return request.get(`/system/sysDictionary/getList?model=${query?.model || ''}`)
}
