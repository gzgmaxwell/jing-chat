import request from '@/utils/request'

/**
 * 实名认证
 */

export interface Res {
  code: string
  msg: string
  data: any
}

export interface RealNameAuthData {
  name: string // 姓名
  idNumber: string // 身份证号
  sfzZm: string // 身份证正面
  sfzFm: string // 身份证反面
  level: '1' | '2' // 认证类型 1 初级认证 2 高级认证，不传默认初级，人像通过之后传2
}

// 初级/高级实名认证
export function addRealNameAuthApi(data: RealNameAuthData): Promise<Res> {
  return request.post('/userRealAuth/add', data)
}

// 删除付款方式
export function delPayMethod(data: Array<string>): Promise<Res> {
  return request.post('/paymentMethod/deletes', data)
}

// 设置默认付款方式
export function setDefaultPayMethod(id: string): Promise<Res> {
  return request.post(`/paymentMethod/setDefault/${id}`)
}

// 付款方式列表  1支付宝 2 微信 3银行卡
export function getPayMethodListByType(payType: '1' | '2' | '3'): Promise<Res> {
  return request.get(`/paymentMethod/all?payType=${payType}`)
}

// 付款方式列表汇总
export function getPayMethodList(): Promise<Res> {
  return request.get(`/paymentMethod/mySelf`)
}
