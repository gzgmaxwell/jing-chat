import request from '@/utils/request'

/* 卖币模块 */
export interface LoginData {
  phoneNum: string
  code?: string
  vsCode?: string
  password?: string
  messageId?: string
  phoneAreaPrefix?: string
}

export interface LoginRes {
  token: string
}

export interface UpdateUserInfo {
  header?: string
  nickName?: string
  emailAddress?: string
}

export interface LogoutRes {
  code: string
  msg: string
  data: any
}

export interface SellCoinsListMyself {
  orderStatus?: '1' | '6' | '7' // 传 1
  payTypeSearch?: string
  cfcf?: string
  startingAmount?: string
  cutOffAmount?: string
}

export interface SellCoinsListAll {
  orderStatus?: '1' | '7' | '8' // 1挂单中 ，7 进行中 8 已完成
  payTypeSearch?: '1' | '2' | '3' | ''// 1支付宝、 2 微信 、3银行卡 、 空 = 全部
  cfcf?: '1' | '2' | '' // 1拆分、2不可拆分
}

export interface BuyCoins {
  money: string // 金额
  orgOrderId: string // 卖单id
  payType: string // 支付方式 1支付宝、 2 微信 、3银行卡
}

export interface SellCoins {
  money: number // 金额
  zfmm: string // 支付密码
  cfcf: string // 是否拆分 1拆分 2不可拆分
  zdgm: number // 最低购买量
  payTypeArray: Array<string> // 支付方式 1支付宝、 2 微信 、3银行卡
  payAccountIdsArray?: Array<string> // 支付账号id
}

export interface QuickBuyCoins {
  money: string // 金额
  payType: string // 卖单id
}

export interface BuyCoinsListQuery {
  orderStatus: '7' | '8'
}

export interface Res {
  code: string
  msg: string
  data: any
}

/* otc项目 */
/* 买单 */
// 提交买单(自选买币 购买按钮)
export function buyCoins(data: BuyCoins): Promise<Res> {
  return request.post('/buyCoins/add', data)
}

// 提交买单(自选买币 购买按钮)
export function quickBuyCoins(data: QuickBuyCoins): Promise<Res> {
  return request.post('/buyCoins/quickBuyCoins', data)
}

// 买单列表
export function getBuyCoinsList(query: BuyCoinsListQuery): Promise<Res> {
  return request.get(`/buyCoins/all?orderStatus=${query?.orderStatus || ''}`)
}
// 买单详情
export function getBuyCoinsDetail(id): Promise<Res> {
  return request.get(`buyCoins/get/${id}`)
}

// 交易提醒买家
export function transactionReminder(id): Promise<Res> {
  return request.get(`buyCoins/lxmj/${id}`)
}

// 交易提醒卖家
export function sellCoinsReminder(id): Promise<Res> {
  return request.get(`sellCoins/lxmj/${id}`)
}
// 取消订单
export function cancelOrder(id): Promise<Res> {
  return request.post(`buyCoins/cancelOrder/${id}`)
}
// 卖币取消订单
export function cancelSellOrder(id): Promise<Res> {
  return request.post(`sellCoins/cancelOrder/${id}`)
}
// 已付款通知卖家
export function commitSeller(id): Promise<Res> {
  return request.post(`buyCoins/commit/${id}`)
}
// 放行 通过支付密码放行
export function commitBuyCoins(data): Promise<Res> {
  return request.post(`buyCoins/v2/release/${data.id}`,{zfmm:data.zfmm})
}
/* 卖单 */
// 卖单列表（自己）
export function getSellCoinsList(query: SellCoinsListMyself): Promise<Res> {
  return request.get(`/sellCoins/myself?orderStatus=${query?.orderStatus || ''}&payTypeSearch=${query?.payTypeSearch || ''}&cfcf=${query?.cfcf || ''}&startingAmount=${query?.startingAmount || ''}&cutOffAmount=${query?.cutOffAmount || ''}`)
}

// 卖单列表（全部）
export function getSellCoinsListAll(query: SellCoinsListAll): Promise<Res> {
  return request.get(`/sellCoins/all?orderStatus=${query?.orderStatus || ''}&payTypeSearch=${query?.payTypeSearch || ''}&cfcf=${query?.cfcf || ''}`)
}
// 卖单详情
export function getSellCoinsDetail(id:any): Promise<Res> {
  return request.get(`/sellCoins/get/${id}`)
}
// 卖单详情
export function buyCoinsContact(id:any): Promise<Res> {
  return request.get(`/buyCoins/lxmj/${id}`)
}
// 提交卖单(卖币)
export function sellCoins(data: SellCoins): Promise<Res> {
  return request.post('/sellCoins/add', data)
}

// 付款方式列表
export function getPayType(): Promise<Res> {
  return request.get(`/paymentMethod/all`)
}

/* 废弃 */
// 修改用户信息
export function updateUserInfo(data: UpdateUserInfo): Promise<any> {
  return request.post('/user/updateUserInfo', data)
}

// 退出登录
export function otclogout(): Promise<LogoutRes> {
  return request.get('/auth/logout')
}

// 图形验证码
export function getCaptcha(): Promise<any> {
  return request.get('code/getVerificationCode', {
    responseType: 'blob', // 重要：指定响应类型为 blob
  })
}
