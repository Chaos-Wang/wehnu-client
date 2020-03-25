// pages/core/timetable/timetable.js
var app = getApp()
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var util = require('../../utils/util.js')
var aes = require('../../utils/public.js')
var fresh = require('../../utils/fresh.js')
var get_info = require('../../utils/get.js')
import { Loading, Alert, Confirm } from '../../wuss/index.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    headers: [{}, {}, {}, {}, {}, {}, {}],
    month: "",
    week:"",
    xn:"",
    xq:"",
    term:{},
    schedules: [
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', '']
    ],
    xqs: ["","第一学期", "第二学期"],
    weeks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    times: [{
      time: "07:40",
      end: "08:25",
      num: 1
    }, {
      time: "08:35",
      end: "09:20",
      num: 2
    }, {
      time: "9:45",
      end: "10:30",
      num: 3
    }, {
      time: "10:40",
      end: "11:25",
      num: 4
    }, {
      time: "14:40",
      end: "15:25",
      num: 5
    }, {
      time: "15:35",
      end: "16:20",
      num: 6
    }, {
      time: "16:30",
      end: "17:15",
      num: 7
    }, {
      time: "17:25",
      end: "18:10",
      num: 8
    }, {
      time: "19:40",
      end: "20:25",
      num: 9
    }, {
      time: "20:35", 
      end: "21:20",
      num: 10
    }, {
      time: "21:30",
      end: "22:45",
      num: 11
    }
    ],
    classes:[{time:'上午',num:'4'},{time:'下午',num:'4'},{time:'晚上',num:'3'}]
  },
  handleClick(event) {
    var item = event.currentTarget.dataset.tapitem;
    var content = '任课教师：' + item.jsxm + "\t" + '开课周次：' + item.kkzc +"\t"+'教室：'+item.jsmc
    Alert({
      title: item.kcmc,
      content:content
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    var detail = wx.getStorageSync("detail_data")
    this.week = detail.zc
    this.term = detail.term.split('-');
    wx.setStorageSync('xn', this.term[0])
    wx.setStorageSync('xq', this.term[2])
    this.xn = this.term[0]
    this.xq = this.term[2]
    var _this = this
    // get_info.timetable()

    wx.getStorage({
      key: 'stuclass',
      success: function (res) {
        _this.stuclass = res.data
        _this.render_kb()
      },
    })
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


  render_kb: function () {
    var stuclass = this.stuclass
    var colors = ['green', 'red', 'purple', 'yellow', "blue", "	#FA8072", "	#8A2BE2", "	#A52A2A", "	#DEB887", "	#00FFFF", "	#228B22","#7CFC00"];
    var schedules = [
      [{
        num: 2,
        cls: []
      },{
        num: 2,
        cls: []
      },{
        num: 2,
        cls: []
      },{
        num: 2,
        cls: []
      },{
        num: 2,
        cls: []
      },{
        num: 1,
        cls: []
      },],

      [{
        num: 2,
        cls: []
      },{
        num: 2,
        cls: []
      },{
        num: 2,
        cls: []
      },{
        num: 2,
        cls: []
      },{
        num: 2,
        cls: []
      },{
        num: 1,
        cls: []
      },],

      [{
        num: 2,
        cls: []
      },{
        num: 2,
        cls: []
      },{
        num: 2,
        cls: []
      },{
        num: 2,
        cls: []
      },{
        num: 2,
        cls: []
      },{
        num: 1,
        cls: []
      },],

      [{
        num: 2,
        cls: []
      },{
        num: 2,
        cls: []
      },{
        num: 2,
        cls: []
      },{
        num: 2,
        cls: []
      },{
        num: 2,
        cls: []
      },{
        num: 1,
        cls: []
      },],

      [{
        num: 2,
        cls: []
      },{
        num: 2,
        cls: []
      },{
        num: 2,
        cls: []
      },{
        num: 2,
        cls: []
      },{
        num: 2,
        cls: []
      },{
        num: 1,
        cls: []
      },],

      [{
        num: 2,
        cls: []
      },{
        num: 2,
        cls: []
      },{
        num: 2,
        cls: []
      },{
        num: 2,
        cls: []
      },{
        num: 2,
        cls: []
      },{
        num: 1,
        cls: []
      },],

      [{
        num: 2,
        cls: []
      },{
        num: 2,
        cls: []
      },{
        num: 2,
        cls: []
      },{
        num: 2,
        cls: []
      },{
        num: 2,
        cls: []
        }, {
        num: 1,
        cls: []
      },],
    ]
    if (this.week < 1)
      this.week = 1
    var last_color = -1
    var tmp_colors = {}

    for (var i=0;i<stuclass.length;i++) { 
      var lessons = stuclass[i] 
      var bool_week
        if (lessons) {
            //判断本课本周上不上,格式为'a,b,c'的课
          if (lessons.kkzc.indexOf("-") == -1 && lessons.kkzc.indexOf(",") != -1){
              lessons.kkzc=','+lessons.kkzc+','
            if(lessons.kkzc.indexOf(','+this.week+',')!=-1)
                bool_week=true
            else
                bool_week=false
            lessons.kkzc = lessons.kkzc.substr(1)
            lessons.kkzc = lessons.kkzc.substr(0, lessons.kkzc.length - 1)
            if (parseInt(lessons.sjbz) === 1)
              lessons.kkzc = lessons.kkzc + '（单周）'
            else if (parseInt(lessons.sjbz) === 2)
              lessons.kkzc = lessons.kkzc + '（双周）'
          }
          //格式为'a-b'
          else if (lessons.kkzc.indexOf("-") != -1 && lessons.kkzc.indexOf(",") == -1){
              var week_time = lessons.kkzc.split('-')
              var start_week = week_time[0]
              var end_week = week_time[1]

              if (parseInt(this.week) >= parseInt(start_week)&& parseInt(this.week) <= parseInt(end_week)){
                if (parseInt(lessons.sjbz) === 2 && parseInt(this.week) % 2==0)
                  bool_week=true

                else if (parseInt(lessons.sjbz) === 1 && parseInt(this.week % 2) != 0)
                  bool_week = true

                else if (parseInt(lessons.sjbz) === 0)
                  bool_week = true
                else
                  bool_week = false
              }
              else
                  bool_week = false
              if (parseInt(lessons.sjbz)===1)
                lessons.kkzc = lessons.kkzc+'（单周）'
              else if (parseInt(lessons.sjbz) === 2)
                lessons.kkzc = lessons.kkzc + '（双周）'
              }
          //格式为'a-b,c-d'
          else{
            var div_class=lessons.kkzc.split(',')

            for(var x=0;x<div_class.length;++x){
              var week_time = div_class[x].split('-')
              var start_week = week_time[0]
              var end_week = week_time[1]
              if (parseInt(this.week) >= parseInt(start_week) && parseInt(this.week) <= parseInt(end_week)){
                if (parseInt(lessons.sjbz) === 2 && parseInt(this.week) % 2 == 0){
                  bool_week = true
                  break
                  }

                else if (parseInt(lessons.sjbz) === 1 && parseInt(this.week % 2) != 0){
                  bool_week = true
                  break
                }
                else if (parseInt(lessons.sjbz) === 0){
                  bool_week = true
                  break
                }
                else{
                  bool_week = false
                }
                }
              else{
                bool_week = false
                }
            }
            if (parseInt(lessons.sjbz) === 1)
              lessons.kkzc = lessons.kkzc + '（单周）'
            else if (parseInt(lessons.sjbz) === 2)
              lessons.kkzc = lessons.kkzc + '（双周）'
            }

            //颜色分配
            if (tmp_colors[stuclass[i].kcsj]) {
              var color = tmp_colors[stuclass[i].kcsj] // 之前这门课已经有颜色了。
            } else {
              var color = Math.floor(Math.random() * 5)
                    // 随机颜色
                  if (color == last_color)
                    color = (color + 1) % 5
                  tmp_colors[stuclass[i].kcsj] = color
            }

              //信息导入
                var class_num
                var first_class
                var classes_time=[]
                var class_day = parseInt(lessons.kcsj[0])

                lessons.kcsj = lessons.kcsj.substr(1)

                for (var j=0;j<lessons.kcsj.length;j+=2)
                {
                  classes_time.push(lessons.kcsj.substr(j,2))
                }

                if(classes_time[0]=="01")
                  first_class=1;
                else
                  first_class = Math.floor(parseInt(classes_time[0])/2)+1

            class_num=classes_time.length

            schedules[class_day - 1][first_class-1].num = class_num
          //处理同一门课不同周由不同老师上的情况
          if (bool_week==false&&schedules[class_day - 1][first_class - 1].cls.length!=0&&schedules[class_day - 1][first_class - 1].cls[0].bool_week==true)
              continue
          else (bool_week == true && schedules[class_day - 1][first_class - 1].cls.length != 0)
              schedules[class_day - 1][first_class - 1].cls.pop(0)
          //处理连上三节与晚上上课时的特殊情况
            if (schedules[class_day - 1][first_class-1].num == 3 && (first_class - 1)!=4)
              schedules[class_day - 1][first_class].num = 1
            else if ((first_class - 1) == 4&&schedules[class_day - 1][first_class - 1].num == 3)
              schedules[class_day - 1][first_class].num = 0
          //处理连上四节特殊情况
            if (schedules[class_day - 1][first_class-1].num == 4)
              schedules[class_day - 1][first_class].num = 0


            schedules[class_day - 1][first_class-1].cls.push({
                  cls: lessons,
                  classtime: parseInt(classes_time[0]) + "-" + (parseInt(classes_time[0])+class_num-1) + "节",
                  color: colors[color],
                  bool_week: bool_week
                })
                last_color = color
          }

        }
    console.log(schedules)

    this.initHeaders()
    
    var txn;
    if (this.xq == 2)
      txn = parseInt(this.xn) + 1
    else
      txn = this.xn
    this.setData({
      schedules: schedules,
      headers: this.headers,
      month: this.month,
      week: this.week,
      xn: txn,
      xq: this.xq
    })
  },


  
  changeweek: function (e) {
    this.week = e.detail.value
    get_info.timetable()
    var _this=this
    wx.getStorage({
      key: 'stuclass',
      success: function (res) {
        _this.stuclass = res.data
        _this.render_kb()
      },
    })
  },
  
  initHeaders: function () {
    if (this.xn != this.term[0] || this.xq != this.term[2]) {
      this.month = ""
      this.week = ""
      this.headers = [{
        day: "一"
      }, {
        day: "二"
      }, {
        day: "三"
      }, {
        day: "四"
      }, {
        day: "五"
      }, {
        day: "六"
      }, {
        day: "日"
      }]
    } else {
      if (this.week < 1)
        this.week = 1
      var current = this.getDate(this.week)
      this.month = current.getMonth() + 1
      this.headers = []
      for (var _i2 = 0; _i2 < 7; _i2++) {
        this.headers.push({
          day: [ "一", "二", "三", "四", "五", "六","日"][current.getDay()],
          date: current.getDate()
        });
        current.setDate(current.getDate() + 1);
      }
    }
  },

  getDate: function (week) {
    // 根据周获取日期
    var begin_day = wx.getStorageSync("begin_day")
    var date = new Date(begin_day) // 获取begin_day;
    date = new Date(date.getTime() + 7 * 24 * 3600000 * (week - 1)) //获取到某个的第一天的日期
    return date
  }
})