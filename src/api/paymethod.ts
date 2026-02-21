import request from '@/utils/request'

/**
 * 收付款方式
 */
export interface LoginData {
  phoneNum: string // 手机号
  code?: string // 验证码
  vsCode?: string // 图形验证码
  password?: string // 密码
  // phoneAreaPrefix?: string
}

export interface Res {
  code: string
  msg: string
  data: any
}

export interface AddPayMethod {
  payType: '1' | '2' | '3' // 付款类型 1 支付宝 2 微信 3 银行卡
  name: string // 姓名
  zfbAccount?: string // 支付宝账号
  zfbEwm?: string // 支付宝二维码
  wxAccount?: string // 微信账号
  wxEwm?: string // 微信二维码
  bankName?: string // 银行名称
  bankCardNumber?: string // 银行卡号
}

// 新增付款方式
export function addPayMethod(data: AddPayMethod): Promise<Res> {
  return request.post('/paymentMethod/add', data)
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


