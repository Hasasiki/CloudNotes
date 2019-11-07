// pages/main/main.js
//首次渲染从本地内存池读取笔记内容列表动态加载
var _endTime;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timer: '',//定时器名字
    countDownNum: '60',//倒计时初始值
    endTime: '',//2018/11/22 10:40:30
    ne: [],  //空的数组，获取到云数据库的数据
    dateList: [] //存储countNotes返回值
  },
//侧边模态框显示与隐藏
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
    console.log(e.currentTarget.dataset.text);
    var id = e.currentTarget.dataset.text;
    wx.setStorageSync('id', id);
  },
  hideModal(e) {
    this.setData({
      modalName: null
    });
  },
  //修改笔记
  change:function(e){
    //获取卡片data-text，传入打开的addTextNotes页面
    console.log(e.currentTarget.dataset.text);
    var id = e.currentTarget.dataset.text;
    wx.navigateTo({
      url: '/pages/changeTextNote/changeTextNote?id=' + id,
    })

  },
  //删除笔记
  deleteAndRefresh(e){
    this.setData({
      modalName:null
    })
    //if (e.currentTarget.dataset.text) {
      const db = wx.cloud.database();
      var id = wx.getStorageSync('id');
      console.log(id);
      db.collection('textNotes').doc(id).remove({
        success: res => {
          wx.showToast({
            title: '删除成功',
          })
          this.setData({
            counterId: '',
            count: null,
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '删除失败',
          })
          console.error('[数据库] [删除记录] 失败：', err)
        }
      })
    //} else {
      wx.showToast({
        title: '无记录可删，请见创建一个记录',
      })
   // }
    wx.reLaunch({
      url: 'main',
    })
  },
  //删除定时
  deleteAndRefreshTimer(e) {
    this.setData({
      modalName: null
    })
    //if (e.currentTarget.dataset.text) {
    const db = wx.cloud.database();
    var id = wx.getStorageSync('id');
    console.log(id);
    db.collection('dateNotes').doc(id).remove({
      success: res => {
        wx.showToast({
          title: '删除成功',
        })
        this.setData({
          counterId: '',
          count: null,
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '删除失败',
        })
        console.error('[数据库] [删除记录] 失败：', err)
      }
    })
    //} else {
    wx.showToast({
      title: '无记录可删，请见创建一个记录',
    })
    // }
    wx.reLaunch({
      url: 'main',
    })
  },
  //添加笔记
  addNote:function(){
    wx.showToast({
      title: 'add!',
    })
  },
  //添加文字笔记
  addTextNote:function(){
    wx.showToast({
      title: 'text note added!',
    })
    //从此处跳转
    wx.navigateTo({
      url: '/pages/addTextNote/addTextNote',
    })
  },
  //添加日期笔记
  addDateNote:function(){
    wx.showToast({
      title: 'date setting page',
    })
    wx.navigateTo({
      url: '/pages/countdown/countdown',
    })

  },
  //计时器
  countDown: function () {
    var that = this;
    var nowTime = new Date().getTime();//现在时间（时间戳）
    var endTime = new Date(that.data.endTime).getTime();//结束时间（时间戳）
    var time = (endTime - nowTime) / 1000;///距离结束的毫秒数
    // 获取天、时、分、秒
    let day = parseInt(time / (60 * 60 * 24));
    let hou = parseInt(time % (60 * 60 * 24) / 3600);
    let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
    let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
    // console.log(day + "," + hou + "," + min + "," + sec)
    day = that.timeFormin(day),
      hou = that.timeFormin(hou),
      min = that.timeFormin(min),
      sec = that.timeFormin(sec)
    that.setData({
      day: that.timeFormat(day),
      hou: that.timeFormat(hou),
      min: that.timeFormat(min),
      sec: that.timeFormat(sec)
    })
    // 每1000ms刷新一次
    if (time > 0) {
      that.setData({
        countDown: true
      })
      setTimeout(this.countDown, 1000);
    } else {
      that.setData({
        countDown: false
      })
    }
  },
  //小于10的格式化函数
  timeFormat(param) {
    return param < 10 ? '0' + param : param;
  },
  //小于0的格式化函数（不会出现负数）
  timeFormin(param) {
    return param < 0 ? 0 : param;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.countDown()
    var _this = this;
    //引用数据库   
    const db = wx.cloud.database({
      //环境ID
      env: 'cloudnotes-4pv4u'
    })
    //查询textNotes数据  
    db.collection('textNotes').get({
      //如果查询成功的话    
      success: res => {
        console.log(res.data)
        //将数据存到页面data，前端显示      
        this.setData({
          ne: res.data
        })
      }
    })
    //查询dateNotes数据
    db.collection('dateNotes').get({
      //如果查询成功的话    
      success: res => {
        console.log(res.data);
        //console.log(res.data[0].data);
        //将数据存到页面data，前端显示      
        this.setData({
          dateList: res.data,
        })
      }
    })
  },

  //查询功能
  onSearch:function(e){
    //get the key
    var key = e.detail.value;
    console.log(key);
    // const db = wx.cloud.database();
    // db.collection('textNotes').where({
    //   title: key
    // })
    //   .get({
    //     //得到数据集，传递给搜索结果页面并跳转
    //     success(res) {
    //       console.log(res.data)
    //       wx.navigateTo({
    //         url: '',
    //       })
    //     }
    //   })
      //将value传到搜索结果页面，搜索功能由搜索结果页面实现
      wx.navigateTo({
        url: '/pages/seachResults/seachResults?key=' + key,
      })
  }
})