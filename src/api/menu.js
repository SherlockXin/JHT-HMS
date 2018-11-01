import request from '@/utils/request'

export function getMenu(param) {
  return request({
    url: '/sys/menu/list',
    method: 'get',
    data: param
  })
}
