var data = {}
var app = getApp()
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var util = require('../../utils/util.js')
var aes = require('../../utils/public.js')
var fresh = require('../../utils/fresh.js')
var get_info = require('../../utils/get.js')

Page({
  data: {
    username: 0,
    list: [
      {
        id: 1,
        years: '2016-2017',
        term: 1,
        open: false,
        table: [],
        jd:null,
      }
    ]
  },

  widgetsToggle: function (e) {
    var id = e.currentTarget.id
    var list = this.data.list
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        // list[i].open = false
      }
    }
    this.setData({
      list: list
    })
  },

  setCurrentTermShow: function () {
    var today = new Date(); // 获得当前日期
    var year = today.getFullYear(); // 获得年份
    var month = today.getMonth() + 1; // 此方法获得的月份是从0---11，所以要加1才是当前月份
    var day = today.getDate(); // 获得当前日期
    var list = this.data.list
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].years.indexOf(year) != -1) {
        if (month >= 6 && list[i].term == 2) {
          list[i].open = true // 上半年看第一学期，下半年第二学期成绩打开
        }else if (month < 6 && list[i].term == 1) {
          list[i].open = true
        }
      }
    }
    this.setData({
      list: list
    })
  },

  fillData: function (options) {
    data = wx.getStorageSync('stu_achievement')
    var list = []
    var tempDiffVal = ''
    var tempItem = {}
    for (var i = 0;i < data.length;i++) {
      var dataRow = data[i]
      var term = dataRow.xqmc.split('-')
      var years = term[0]+'-'+term[1]
      var term = term[2]
      var diffVal = years + term

      if (diffVal != tempDiffVal) { 
        var item = {
          id: list.length + 1,
          years: years,
          term: term,
          open: false,
          table: []
        }

        tempItem = item
        list.push(item) // 把新的栏目放到列表
        tempDiffVal = diffVal
      }

      var tableRow = []
      tableRow[0] = dataRow.kcmc // 课程
      tableRow[1] = dataRow.zcj // 成绩
      tableRow[2] = dataRow.xf // 学分
      tableRow[3] = dataRow.kcxzmc // 类型
      tableRow[4] = dataRow.ksxzmc
      tempItem.table.push(tableRow)
    }
    this.setData({
      list: list,
    })
    this.calc_GPA()
    console.log(this.data)
  },

  calc_GPA:function(){
    var total_xf=0
    var total_xfjd=0


    var data=this.data.list
    for(var i=0;i<data.length;i++){
      var xq_total_xf=0
      var xq_total_xfjd=0
      var xq_total_jd=0
      console.log(data)
      for(var j=0;j<data[i].table.length;j++)

        //补考、重修过特殊情况
        if ((data[i].table[j][4].indexOf('补考') != -1 || data[i].table[j][4].indexOf('重修') != -1 )&& parseFloat(data[i].table[j][1]) >= 60){

          console.log(data[i].table[j][0]+'补考/重修过')
          xq_total_xf += parseFloat((data[i].table[j][2]).toFixed(2))
          xq_total_xfjd += parseFloat(data[i].table[j][2].toFixed(2))
        }
        //补考/重修未过
        else if ((data[i].table[j][4].indexOf('补考') != -1 || data[i].table[j][4].indexOf('重修') != -1) && parseFloat(data[i].table[j][1]) < 60) {

          console.log(data[i].table[j][0] + '补考/重修未过')
          xq_total_xf += parseFloat((data[i].table[j][2]).toFixed(2))
          xq_total_xfjd += 0
        }
        //一般情况过
        else if (data[i].table[j][4] == '正常考试' && parseFloat(data[i].table[j][1]) >=60 && data[i].table[j][3] != '素质教育通选课' && data[i].table[j][3] != '创新创业课' && data[i].table[j][3] != '文化素质教育选修课' ){
          console.log(data[i].table[j][0] + '正常过')
          //学期GPA
          xq_total_xf += parseFloat((data[i].table[j][2]).toFixed(2))
          //成绩换算绩点
          var jd = (parseFloat(data[i].table[j][1]) - 50) / 10 >= 4.0 ? 4.0 : (parseFloat(data[i].table[j][1]) - 50) / 10
          jd = parseFloat(jd.toFixed(2))

          xq_total_xfjd += parseFloat((data[i].table[j][2] * jd).toFixed(2))
        }
        //特殊情况未过补考/重修
        else if (data[i].table[j][4] == '正常考试' && parseFloat(data[i].table[j][1]) < 60 ){
          console.log(data[i].table[j][0] + '正常未过')
          xq_total_xf += parseFloat((data[i].table[j][2]).toFixed(2))
          xq_total_xfjd += 0
        }

      xq_total_jd = parseFloat((xq_total_xfjd/xq_total_xf).toFixed(2))
      data[i].jd = parseFloat((xq_total_jd).toFixed(2))

      total_xf += parseFloat((xq_total_xf).toFixed(2))
      total_xfjd += parseFloat((xq_total_xfjd).toFixed(2))

    }
    console.log(total_xf)
    this.setData({
      list:data,
      jd: parseFloat((total_xfjd / total_xf).toFixed(2))
    })
  },

  onLoad: function (options) {
    var detail = wx.getStorageSync("detail_data")

    this.setData({
      username: detail.xm
    })

    this.setCurrentTermShow()

    this.fillData(options)
  },

  onShow:function(){
    wx.hideNavigationBarLoading()
  },

  onReady: function () {
    var _this=this
    wx.setNavigationBarTitle({
      title:  _this.data.username + '的成绩'
    }
    )
  }
})
