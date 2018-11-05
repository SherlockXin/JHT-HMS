/**
 * Created by zhangxin on 18/11/03.
 */
'use strict'

import { getSysDict } from '@/api/common'
exports.install = function(Vue, options) {
  // 获取后台数据字典，以数组形式返回
  Vue.prototype.getSysDictList = function(names) {
    return new Promise(resolve => {
      getSysDict(names).then(response => {
        resolve(response)
      })
    })
  }

  Vue.prototype.getSysDictMap = function(names) {
    return new Promise(resolve => {
      getSysDict(names).then(response => {
        const sysDictMap = {}
        names.forEach(element => {
          sysDictMap[element] = listToMap(response[element])
        })
        resolve(sysDictMap)
      })
    })
  }

  // 数据字典List<Map>转成简单Map对象
  // 传入参数：
  //    list  旧数组对象
  // 返回：     新的Map对象
  Vue.prototype.listToMap = listToMap
}

function listToMap(list) {
  var map = {}
  list.forEach(element => {
    map[element.key] = element.value
  })
  return map
}
