import { login, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: { //通过操作mutations 间接操作state,优点是可异步操作，第一个参数为context对象
    // 登录
    Login(context, userInfo) {
      let username = userInfo.username.trim();
      let password = userInfo.password.trim();
      return new Promise((resolve, reject) => {
        login(username, password).then(response => {
          let data=response.data
          //登陆成功之后把服务器token通过分发  SET_TOKEN事件 写到store中
          context.commit('SET_TOKEN', data.token)
          // 写到cookie中
          setToken(response.data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo(context) {
      return new Promise((resolve, reject) => {
        getUserInfo(context.state.token).then(response => {
          if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
            reject('error')
          }
          const data = response.data
          context.commit('SET_ROLES', data.roles) //设置更新state.roles角色
          context.commit('SET_NAME', data.name)
          context.commit('SET_AVATAR', data.avatar)
          context.commit('SET_INTRODUCTION', data.introduction) //设置介绍
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },


    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '') // 对比react-redux ，react是获取初始state后，单独给token赋空值，然后返回新的state对象
        removeToken()
        resolve()
      })
    },

    // 动态修改权限 (需求中不可切换角色 时 可删除)
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    }
  }
}

export default user
