import request from '@/utils/request'

export interface transfer {
    address?: string
    money?: string
    zfmm?: string
  }
// 转账
export function transferMethod(data: transfer): Promise<Res> {
    return request.post('/transferRecord/add', data)
  }
  // 转账列表
export function getTransferList(): Promise<Res> {
    return request.get(`/transferRecord/mySelf`)
  }
    // 资金明细
export function getFundList(): Promise<Res> {
    return request.get(`/transferRecord/mySelf/fund`)
  }