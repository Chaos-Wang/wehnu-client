var qcloud = require('../vendor/wafer2-client-sdk/index')
var util = require('./util.js')
var aes = require('./public.js')
var get_info = require('./get.js')
var app=getApp()
import { Loading, Alert } from '../wuss/index'

function unbind(){
  const openid = wx.getStorageSync('openid')
  var token = openid + 'chaoswang'
  var sha1 = util.sha1(token)
  if (openid) {
    wx.request({
      url: 'https://wehnu.chaoswang.cn/weapp/unbind', // 仅为示例，并非真实的接口地址
      data: {
        openid: openid,
        sha1: sha1
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == '200') {
          console.log("解除绑定成功");
          console.log(res)
          
        }
    }
  })
  }
}

function bind(){
    const openid = wx.getStorageSync('openid');
    const student_id = wx.getStorageSync('student_id');
    const student_pwd = wx.getStorageSync('student_pwd');

    var token = student_id + student_pwd + 'chaoswang'
    var sha1 = util.sha1(token)

    var pwd = aes.Encrypt(student_pwd)
  if (openid) {
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
        success(res) {
          if (res.data.code == '200') {
            console.log("已成功");
            wx.navigateBack({
            })
          }
        }
      })
    }

}

function check() {
  const openid = wx.getStorageSync('openid')
  var token = openid + 'chaoswang'
  var sha1 = util.sha1(token)

  if (openid) {
    wx.request({
      url: 'https://wehnu.chaoswang.cn/weapp/check', // 仅为示例，并非真实的接口地址
      data: {
        openid: openid,
        sha1: sha1
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == '200') {
          console.log("用户已经关联教务系统");
          wx.redirectTo({
            url: '../main/main'
          })
        }
        else {
          console.log("用户尚未关联教务系统");
          bind();
          setTimeout(function () {
            fresh();
            wx.redirectTo({
              url: '../main/main'
            })
          }, 1000)
        }
      }
    })
  }
}

function fresh(){
  console.log('开始刷新信息')
  const openid = wx.getStorageSync('openid')
  var token = openid + 'chaoswang'
  var sha1 = util.sha1(token)

wx.request({
  url: 'https://wehnu.chaoswang.cn/weapp/fresh',
  data: {
    openid: openid,
    sha1:sha1
  },
  method: 'POST',
  header: {
    'content-type': 'application/x-www-form-urlencoded' // 默认值
  },
  success(res) {
    console.log('信息刷新成功')
    app.bool_detail=true
    wx.setStorageSync('bool_detail', app.bool_detail)
    Loading.hide()
    }
})
}

function fresh_info() {
  console.log('开始刷新简略信息')
  const openid = wx.getStorageSync('openid')
  var token = openid + 'chaoswang'
  var sha1 = util.sha1(token)

  wx.request({
    url: 'https://wehnu.chaoswang.cn/weapp/fresh_info',
    data: {
      openid: openid,
      sha1: sha1
    },
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    success(res) {
      if (res.data.code == '200') {
        console.log('简略信息刷新成功')
        get_info.info()
        }
    }
  })
}

module.exports.fresh_info = fresh_info;
module.exports.fresh = fresh;
module.exports.bind = bind;
module.exports.check = check;
module.exports.unbind = unbind;

