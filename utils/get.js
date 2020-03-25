var qcloud = require('../vendor/wafer2-client-sdk/index')
var util = require('./util.js')
var aes = require('./public.js')
var fresh =require("./fresh.js")
var app=getApp()
import { Loading, Alert, Confirm } from '../wuss/index.js'


function info() {
  console.log('开始接收用户信息')
  const openid = wx.getStorageSync('openid')
  var token = openid + 'chaoswang'
  var sha1 = util.sha1(token)

  if (openid) {
    wx.request({
      url: 'https://wehnu.chaoswang.cn/weapp/get_info', // 仅为示例，并非真实的接口地址
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
          console.log('接收用户信息成功')

          wx.setStorageSync('detail_data',{
              bj:res.data.bj,
              rxnf:res.data.rxnf,
              xb:res.data.xb,
              xh:res.data.xh,
              xm:res.data.xm,
              yxmc:res.data.yxmc,
              zc:res.data.zc,
              term: res.data.term,
              zymc: res.data.zymc.indexOf('类')!=-1 ? res.data.zymc.substring(0, res.data.zymc.indexOf('类')+1) : res.data.zymc
            }
          )

          var detail = wx.getStorageSync("detail_data")
          app.week = detail.zc
          var term = detail.term.split('-');
          wx.setStorageSync('xn', term[0])
          wx.setStorageSync('xq', term[2])
          app.xn = term[0]
          app.xq = term[2]

          console.log("获取用户信息成功")
          wx.switchTab({
            url: '../my/my',
          });      
          Loading.hide()
        }
        else {

          console.log("获取用户信息失败");
         
        }
      }
    })
  }
}

function timetable(){
  const openid = wx.getStorageSync('openid')
  var token = openid + 'chaoswang'
  var sha1 = util.sha1(token)

  if (openid) {

    wx.request({
      url: 'https://wehnu.chaoswang.cn/weapp/get_timetable',
      data: {
        openid: openid,
        sha1: sha1
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: "POST",

      success: function (res) {
        var data = res.data.timetable.replace(/\ufeff/g, "")
        data=JSON.parse(data)

        var result = [data[0]];
        for (var i = 1; i < data.length; i++) {
          var item = data[i];
          var repeat = false;
          for (var j = 0; j < result.length; j++) {
            if (item.kcsj == result[j].kcsj && item.kkzc == result[j].kkzc)
            {
              repeat = true;
              break;
            }
          }
          if (!repeat) {
            result.push(item);
          }
        }

        wx.setStorageSync('stuclass', result)

      }
    })
  }
}


function achievement() {
  const openid = wx.getStorageSync('openid')
  var token = openid + 'chaoswang'
  var sha1 = util.sha1(token)

  if (openid) {

    wx.request({
      url: 'https://wehnu.chaoswang.cn/weapp/get_grade',
      data: {
        openid: openid,
        sha1: sha1
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: "POST",

      success: function (res) {
        var data = JSON.parse(res.data.grade)
        wx.setStorageSync('stu_achievement', data)

      }
    })
  }
} 

function CET_GET(type) {
  const openid = wx.getStorageSync('openid')
  var token = openid + 'chaoswang'
  var sha1 = util.sha1(token)

  if (openid) {

    wx.request({
      url: 'https://wehnu.chaoswang.cn/weapp/get_cet',
      data: {
        type:type,
        openid: openid,
        sha1: sha1
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: "POST",

      success: function (res) {
        console.log(res)
        if(res.statusCode==200)
        Confirm({
          title: '提示',
          showCancel: false,
          content: res.data.xm+'同学,你上次提交' + type + '考号是' + res.data.kh + ' 点击确定复制到剪贴板',
          confirm:()=>{
            wx.setClipboardData({
              data:res.data.kh,
              success(res) {}
            })
          }
        })
        else
          Confirm({
            title: '提示',
            showCancel: false,
            content: '您未存储四六级考号,如有疑问请联系开发者',
            confirm: () => {
            }
          })
      }
    })
  }
} 

function CET_GET_TIME(type) {
  const openid = wx.getStorageSync('openid')
  var token = openid + 'chaoswang'
  var sha1 = util.sha1(token)

  if (openid) {

    wx.request({
      url: 'https://wehnu.chaoswang.cn/weapp/get_cet',
      data: {
        type: type,
        openid: openid,
        sha1: sha1
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: "POST",

      success: function (res) {
        console.log(res)
        Confirm({
          title: '警告',
 
          content: '你上次提交' + type + '考号的时间是' + res.data.last_date + ' 是否覆盖提交？',

          confirm: () => {

            CET_UPDATE()
            wx.redirectTo({
              url: '../my/my',
            })
          },
          cancel: () => { },
        })

      }
    })
  }
} 

function CET_UPDATE() {
  const openid = wx.getStorageSync('openid')
  var token = openid + 'chaoswang'
  var sha1 = util.sha1(token)

  if (openid) {
    var data=wx.getStorageSync('cet')
    console.log(data)
    wx.request({
      url: 'https://wehnu.chaoswang.cn/weapp/update_cet',
      data: {
        xm:data.userName,
        cet_type:data.type,
        kh:data.zkzh,
        openid: openid,
        sha1: sha1
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: "POST",

      success: function (res) {
        if(res.header==416)
          Alert({
            title: '提示',
            content: '出现了一些错误，请联系开发者',
            confirm: () => {
              console.log('ok');
            },
          });
          else
          Alert({
            title: '提示',
            content: '上传成功',
            confirm: () => {
              console.log('ok');
              wx.navigateBack({
              })
            },
          });
      }
    })
  }
} 

module.exports.achievement = achievement;
module.exports.timetable = timetable;
module.exports.info = info;
module.exports.CET_GET = CET_GET;
module.exports.CET_UPDATE = CET_UPDATE;
module.exports.CET_TIME = CET_GET_TIME;