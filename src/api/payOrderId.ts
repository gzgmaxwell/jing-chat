import request from '@/utils/request'

/* 字典模块 */

export interface Res {
  code: string
  msg: string
  data: any
}

// 通过订单充值
export function order_recharge(data: any): Promise<Res> {
  return request.post('/transferRecord/order/recharge', data)
}

// 通过用户id查询钱包地址
export function userAccount_userId(id: string): Promise<Res> {
  return request.get(`/userAccount/userId/${id}`)
}
