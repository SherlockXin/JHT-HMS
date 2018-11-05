import request from '@/utils/request'

export function getMenu(param) {
  return request({
    url: '/sys/menu/list',
    method: 'get',
    data: param
  })
}

export function selectMenu() {
  return request({
    url: '/sys/menu/select',
    method: 'get'
  })
}

export function getMenuInfo(id) {
  return request({
    url: '/sys/menu/info/' + id,
    method: 'get'
  })
}

export function saveOrUpdateMenu(menuInfo) {
  return request({
    url: menuInfo.menuId ? '/sys/menu/update' : '/sys/menu/save',
    method: 'post',
    data: menuInfo
  })
}

export function cancelMenu(menuId) {
  return request({
    url: '/sys/menu/delete',
    method: 'get',
    params: { menuId }
  })
}
