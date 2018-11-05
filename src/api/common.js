import request from '@/utils/request'

export function getSysDict(names) {
  return request({
    url: '/sysdict/listByNames',
    method: 'post',
    data: { names }
  })
}
