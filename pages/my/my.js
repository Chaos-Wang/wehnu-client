// pages/my/my.js
var app = getApp()
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var util = require('../../utils/util.js')
var aes = require('../../utils/public.js')
var fresh = require('../../utils/fresh.js')
var get_info = require('../../utils/get.js')
import { Loading, Alert } from '../../wuss/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible: false,
    detail_info:{},
    detail:false,
    avatarUrl:'',
    nickName: '',
     items1: [
      {
        text: '绑定教务',
         openType:'bind'
      }
    ], 
    items2: [
      {
        text: '更换绑定',
        openType: 'bind'

      },
      {
        text: '取消绑定',
        openType: 'unbind'

      },
      {
        text: '信息刷新（需要较长时间）',
        openType: 'info'
      },
    ],
  },

  info:function(){
    Loading.show({
      content: '刷新中',
      hide: () => Alert({
        title: '提示',
        content: '刷新成功',
      })
    })
    fresh.fresh()

    wx.setStorageSync('bool_detail', app.bool_detail)
  },

  bind:function(){
    wx.redirectTo({
      url: '../login/login',
    })
  },

  handleClick(e) {
    const key = e.currentTarget.dataset.key;
    const item = e.detail;
    if(item.openType=="bind")
    {
      wx.navigateTo({
        url: '../login/login',
      })
      this.setData({
        [`visible${key}`]: false,
      });
    } else if (item.openType == "unbind")
    {
      this.unbind()
      this.setData({
        [`visible${key}`]: false,
      });
    }else
    {
      this.info()
      app.bool_detail=true
      this.setData({
        [`visible${key}`]: false,
      });
    }
  },
  handleClose(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({ [`visible${key}`]: false });
  },
  handleShow(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({ [`visible${key}`]: true });
  },

  unbind:function(){
    fresh.unbind()
    app.bool_detail=false
    wx.setStorage({
      key: 'detail',
      data: false,
    })
    wx.setStorage({
      key: 'detail_data',
      data: null,
    })
    wx.setStorage({
      key: 'bool_detail',
      data: false,
    })
    this.setData({
      detail_info:null,
      detail:false
    })
    wx.reLaunch({
      url: '../my/my',
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var _this = this
    wx.getStorage({
      key: 'detail_data',
      success: function (res) {
        _this.setData({
          detail_info: res.data
          
        })
      },
    })
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        _this.setData({
          avatarUrl: res.data.avatarUrl,
          nickName: res.data.nickName
        })
      },
    })
    wx.getStorage({
      key: 'detail',
      success: function (res) {
        _this.setData({
          detail: res.data
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
})