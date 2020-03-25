var qcloud = require('../../../vendor/wafer2-client-sdk/index')
var util = require('../../../utils/util.js')
var aes = require('../../../utils/public.js')
var fresh = require('../../../utils/fresh.js')
var get_info = require('../../../utils/get.js')
var app = getApp();
import { Confirm } from '../../../wuss/index';


Page({
  data: {
    userNameRules: {
      maxLength: {
        value: 6,
        message: '姓名最多6个字',
      },
      minLength: {
        value: 2,
        message: '姓名最少两个字',
      },
    },
    isRequired: {
      required: {
        value: true,
        message: '必填',
      },
    }
  },

  handlePickerOpen() {
    this.setData({ textarea_visible: true })
  },
  handlePickerCancel() {
    this.setData({ textarea_visible: false })
  },
  wussFormSubmit(e) {
    wx.setStorageSync('cet', e.detail)

    get_info.CET_GET(e.detail.type)

  },
  find: function (e) {
    wx.redirectTo({
      url: './find/find',
    })
  },
  wussFormReset(e) { },


})