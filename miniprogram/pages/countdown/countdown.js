// miniprogram/pages/countdown/countdown.js
const date = new Date()
const years = []
const months = []
const days = []
const hours = []
const minutes = []
var thisMon = date.getMonth();
var thisDay = date.getDate();
var thisHours = date.getHours();
var thisMinutes = date.getMinutes();
var util = require('../../utils/util.js');
for (let i = 2017; i <= date.getFullYear() + 1; i++) {
  years.push(i)
}

for (let i = date.getMonth(); i <= 11; i++) {
  var k = i;
  if (0 <= i && i < 9) {
    k = "0" + (i + 1);
  } else {
    k = (i + 1);
  }
  months.push(k)
}
if (0 <= thisMon && thisMon < 9) {
  thisMon = "0" + (thisMon + 1);
} else {
  thisMon = (thisMon + 1);
}
if (0 <= thisDay && thisDay < 10) {
  thisDay = "0" + thisDay;
}

var totalDay = mGetDate(date.getFullYear(), thisMon);
for (let i = 1; i <= 31; i++) {
  var k = i;
  if (0 <= i && i < 10) {
    k = "0" + i
  }
  days.push(k)
}

for (let i = 0; i <= 23; i++) {
  var k = i;
  if (0 <= i && i < 10) {
    k = "0" + i
  }
  hours.push(k)
}
for (let i = 0; i <= 59; i++) {
  var k = i;
  if (0 <= i && i < 10) {
    k = "0" + i
  }
  minutes.push(k)
}
function mGetDate(year, month) {
  var d = new Date(year, month, 0);
  return d.getDate();
}
var app = getApp();
var api = app.globalData.api;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkTime: date.getFullYear() + "-" + thisMon + "-" + thisDay + " " + thisHours + ":" + thisMinutes,
    //---时间控件参数
    flag: true,
    years: years,
    year: date.getFullYear(),
    months: months,
    month: thisMon,
    days: days,
    day: thisDay,
    value: [1, thisMon - 1, thisDay - 1, 0, 0],
    hours: hours,
    hour: thisHours,
    minutes: minutes,
    minute: thisMinutes,
    intitle: "",
  },
  showModel: function (e) {
    this.setData({ flag: false });
  },
  getTime: function (e) {
    var times = this.data.year + "-" + this.data.month + "-" + this.data.day + " " + this.data.hour + ":" + this.data.minute
    this.setData({
      flag: true,
      checkTime: times
    });
  },
  bindChange: function (e) {
    const val = e.detail.value
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      day: this.data.days[val[2]],
      hour: this.data.hours[val[3]],
      minute: this.data.minutes[val[4]],
    })
    var totalDay = mGetDate(this.data.year, this.data.month);
    var changeDate = [];
    for (let i = 1; i <= totalDay; i++) {
      var k = i;
      if (0 <= i && i < 10) {
        k = "0" + i
      }
      changeDate.push(k)
    }
    this.setData({
      days: changeDate
    })
  },
  //保存日期，将设定好的日期传到dateNotes数据库
  saveDate:function(){
    console.log(this.data.year + "/" + this.data.month + "/" + this.data.day + " " + this.data.hour + ":" + this.data.minute + ":00" )
    //存储到云端
    const db = wx.cloud.database()
    db.collection('dateNotes').add({
      data: {
        title: this.data.intitle,
        date: this.data.year + "/" + this.data.month + "/" + this.data.day + " " + this.data.hour + ":" + this.data.minute + ":00" 
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          counterId: res._id,
          count: 1
        })
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
    wx.navigateTo({
      url: '/pages/main/main',
    })
  },
  //获取标题输入
  titleInput: function (e) {
    this.setData({
      intitle: e.detail.value
    });
    var inputtitle = this.data.intitle;
    console.log(inputtitle);
  },
})