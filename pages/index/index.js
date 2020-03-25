// pages/index/index.js
var app = getApp()
var fresh = require("../../utils/fresh.js")
import { Loading, Alert, Confirm } from '../../wuss/index.js'
var get_info = require('../../utils/get.js')

Page({
  data: {
    routers: [
      {
        name: '课程表',
        url: '../timetable/timetable',
        icon: '../../../../images/timetable.png'
      },
      {
        name: '成绩',
        url: '../achievement/achievement',
        icon: '../../../../images/grade.png'
      },
      {
        name: 'CET准考证',
        url: '../cet/cet',
        icon: '../../../../images/cet.png'
      },
    ]  ,
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    imgUrls: [
      'https://wx.chaoswang.cn/weapp/image/24213.jpg',
      'https://wx.chaoswang.cn/weapp/image/24280.jpg',
      'https://wx.chaoswang.cn/weapp/image/1444983318907-_DSC1826.jpg'
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  toTimetable:function(){
    wx.navigateTo({
      url: '../timetable/timetable',
   })
  },
  toAchievement: function () {
    wx.navigateTo({
      url: '../achievement/achievement',
    })
  },
  toCET: function () {
    wx.navigateTo({
      url: '../cet/cet',
    })
  },
  onLoad: function (options) {
  if (wx.getStorageSync('detail')) {
    get_info.achievement()
    get_info.timetable()
  }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!wx.getStorageSync('detail')) {
      Confirm({
        title: '警告',
        content: '尚未绑定教务系统，是否绑定？',
        confirm: () => {
            wx.redirectTo({
              url: '../login/login',
            })
        },
        cancel: () => {
          wx.reLaunch({
            url: '../my/my',
          })
        },
      })
    }
    else{
      if(!app.bool_detail){
      Confirm({
        title: '警告',
        content: '尚未更新教务系统信息，是否更新？',
        confirm: () => {
          if (wx.getStorageSync('detail_data') != null) {
            Loading.show({
              content: '更新中',
              hide: () => Alert({
              }),
            })
            fresh.fresh()

          } else {
            wx.redirectTo({
              url: '../login/login',
            })
          }
        },
        cancel: () => {
          wx.reLaunch({
            url: '../my/my',
          })
        },
      })
    }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})