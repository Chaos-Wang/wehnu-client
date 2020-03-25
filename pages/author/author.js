//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  // 用户登录示例
  bindGetUserInfo: function () {
    if (this.data.logged) return

    util.showBusy('正在登录')

    const session = qcloud.Session.get()

    if (session) {
      qcloud.loginWithCode({
        success: res => {
          this.setData({ userInfo: res, logged: true })
          app.globalData.userInfo = res
          app.globalData.logged = true
          util.showSuccess('登录成功')
          console.log('登录成功2')
          wx.setStorage({
            key: 'openid',
            data: res.openId,
          })
          wx.setStorage({
            key: 'userinfo',
            data: res,
          })
        },
        fail: err => {
          console.error(err)
          wx.redirectTo({
            url: '../author/author',
          })
          util.showModel('登录错误', err.message)
          console.log('登录失败2')
        }
      })
    } else {
      // 首次登录
      qcloud.login({
        success: res => {
          this.setData({ userInfo: res, logged: true })
          app.globalData.userInfo = res
          app.globalData.logged = true

          util.showSuccess('登录成功')
          wx.setStorageSync('logged', true)
          wx.setStorage({
            key: 'openid',
            data: res.openId,
          })
          wx.setStorage({
            key: 'userinfo',
            data: res,
          })
          console.log('登录成功1')
        },
        fail: err => {
          wx.setStorageSync('logged', false)
          console.error(err)
          wx.redirectTo({
            url: '../author/author',
          })
          util.showModel('登录错误', err.message)
          console.log('登录失败1')
        }
      })
    }

    var log = wx.getStorageInfoSync('logged')
    console.log('test'+log)
    if (log)
      wx.switchTab({
        url: '../my/my',
      })

  },
  onLoad:function()
  {
    var storage=JSON.stringify(wx.getStorageInfoSync().keys)
    if(storage.indexOf('logged')!=-1)
    {
      if(wx.getStorageSync('logged'))
      if(wx.getStorageSync('detail'))
        wx.switchTab({
          url: '../index/index',
        })
      else
        wx.switchTab({
          url: '../my/my',
        })
    }
    else
      if(wx.getStorageSync('author_times'))
      {
        wx.setStorageSync('author_times', 1)
        wx.redirectTo({
          url: './author',
        })
      }
  },

  // 切换是否带有登录态
  switchRequestMode: function (e) {
    this.setData({
      takeSession: e.detail.value
    })
    this.doRequest()
  },

  doRequest: function () {
    util.showBusy('请求中...')
    var that = this
    var options = {
      url: config.service.requestUrl,
      login: true,
      success(result) {
        util.showSuccess('请求成功完成')
        that.setData({
          requestResult: JSON.stringify(result.data)
        })
      },
      fail(error) {
        util.showModel('请求失败', error);
      }
    }
    if (this.data.takeSession) {  // 使用 qcloud.request 带登录态登录
      qcloud.request(options)
    } else {    // 使用 wx.request 则不带登录态
      wx.request(options)
    }
  },
})