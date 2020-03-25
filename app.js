//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
  version: "1.0.0.1",
  xn:"",
  xq:"",
  bool_detail:"",
  week: 1,
  remind: "",
  offline: false,
  unauth: true,
  onLaunch: function () {
    wx.setStorageSync('begin_day', '2018/2/25')

    var check_Storage1 = wx.getStorageInfoSync().keys.toString()
    if (check_Storage1.indexOf('bool_detail')==-1){
      this.bool_detail=false
      wx.setStorageSync('bool_detail', false)
    }else
      this.bool_detail = wx.getStorageSync('bool_detail')

    var check_Storage2 = wx.getStorageInfoSync().keys.toString()
    if (check_Storage2.indexOf('detail_data') == -1){
      wx.setStorageSync('detail_data', null)
    } 

    var check_Storage3 = wx.getStorageInfoSync().keys.toString()
    if (check_Storage3.indexOf('detail') == -1) {
      wx.setStorageSync('detail', false)
    } 

    qcloud.setLoginUrl(config.service.loginUrl)
    if (wx.getUpdateManager) { // 首先进行更新检测
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
      })
      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })
      updateManager.onUpdateFailed(function () {})
    }
    if (wx.getStorageSync("version") != this.version) { //需要清空所有数据，重大版本变化
      wx.clearStorageSync()
      wx.setStorageSync("version", this.version)
    }
    
  
  },
  
  globalData: {
    userInfo: null,
    logged: false
  },

  
})