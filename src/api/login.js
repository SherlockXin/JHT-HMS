import request from '@/utils/request'

export function login(username, password, captcha) {
  const data = 'username=' + username + '&password=' + password + '&captcha=' + captcha
  return request({
    url: '/sys/login',
    method: 'post',
    data: data
  })
}

export function getNav() {
  return request({
    url: '/sys/menu/nav',
    method: 'get'
    // params: { token }
  })
}

export function getInfo() {
  return request({
    url: '/sys/user/info',
    method: 'get'
  })
}

export function updateInfo(info) {
  return request({
    url: '/user/info',
    method: 'post',
    data: info
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
