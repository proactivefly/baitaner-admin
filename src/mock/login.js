import { param2Obj } from '@/utils'

const userMap = {
  admin: {
    roles: ['admin'],
    token: 'admin', //token
    introduction: '我是超级管理员',
    avatar: 'http://weixin.gantangerbus.com/ebus/admin/favicon.ico',
    name: 'Super Admin'
  },
  editor: {
    roles: ['editor'],
    token: 'editor',
    introduction: '我是编辑',
    avatar: 'http://weixin.gantangerbus.com/ebus/admin/favicon.ico',
    name: 'Normal Editor'
  }
}

export default {
  Login: config => {
    const { username } = JSON.parse(config.body)
    return userMap[username]
  },
  getUserInfo: config => {
    const { token } = param2Obj(config.url)
    if (userMap[token]) {
      return userMap[token]
    } else {
      return false
    }
  },
  logout: () => 'success'
}
