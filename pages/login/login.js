var qcloud = require('../../vendor/wafer2-client-sdk/index')
var util = require('../../utils/util.js')
var aes = require('../../utils/public.js')
var fresh = require('../../utils/fresh.js')
var get_info = require('../../utils/get.js')
import { Loading, Alert } from '../../wuss/index'
var app = getApp();

Page({
  data: {
    inputPassword: false,
    isLoading: false,
    student_id: '',
    student_pwd: ''
  },
  onReady: function () {
    
  },
  pwdFocus() {
    this.setData({
      inputPassword: true
    })
  },
  pwdBlur() {
    this.setData({
      inputPassword: false
    })
  },

  bindIdentity() {
    this.setData({
      isLoading: true
    })

    setTimeout(() => {
      this.setData({
        isLoading: false
      })
    }, 1000)

  },

  bind: function () {
    var _this = this;

    const openid = wx.getStorageSync('openid');
    const student_id = wx.getStorageSync('student_id');
    const student_pwd = _this.data.student_pwd

    var token = student_id + student_pwd + 'chaoswang'
    var sha1 = util.sha1(token)
    var pwd = aes.Encrypt(student_pwd)

    wx.request({
      url: 'https://wehnu.chaoswang.cn/weapp/bind',
      data: {
        openid: openid,
        student_id: student_id,
        student_pwd: pwd,
        sha1: sha1
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.statusCode == 200) {
          wx.setStorageSync('detail', true)
          console.log('绑定成功,开始获取简略信息')

          Loading.show({
            content: '获取信息',
            hide: () => Alert({
              title: '提示',
              content: '信息获取成功',
            })
          })

          fresh.fresh_info();
          
          fresh.fresh();

        }
        else {
          wx.showToast({
            title: '绑定失败,请检查用户名密码',
            icon: 'none',
            duration: 1000
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '绑定失败，未知错误',
          icon: 'none',
          duration: 1000
        })
      }
    });
  },


  useridInput: function (e) {
    this.setData({
      student_id: e.detail.value
    });
    wx.setStorageSync('student_id', e.detail.value)
  },

  passwdInput: function (e) {
    this.setData({
      student_pwd: e.detail.value
    });
  },

});