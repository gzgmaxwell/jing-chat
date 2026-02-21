import request from '@/utils/request'

/* otc项目 */
export function upload(data: { file: File }): Promise<any> {
  return request.post('/mobile/upload', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
