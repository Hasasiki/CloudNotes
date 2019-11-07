// pages/main/main.js
//首次渲染从本地内存池读取笔记内容列表动态加载
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timer: '',//定时器名字
    countDownNum: '60',//倒计时初始值
    endTime: '2019-11-08',//2018/11/22 10:40:30这种格式也行
    ne: [],  //这是一个空的数组，等下获取到云数据库的数据将存放在其中
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
  //计时器
  countDown: function () {
    var that = this;
    var nowTime = new Date().getTime();//现在时间（时间戳）
    var endTime = new Date(that.data.endTime).getTime();//结束时间（时间戳）
    var time = (endTime - nowTime) / 1000;//距离结束的毫秒数
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
  //小于10的格式化函数（2变成02）
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
    //1、引用数据库   
    const db = wx.cloud.database({
      //这个是环境ID不是环境名称     
      env: 'cloudnotes-4pv4u'
    })
    //2、开始查询数据了  news对应的是集合的名称   
    db.collection('textNotes').get({
      //如果查询成功的话    
      success: res => {
        console.log(res.data)
        //这一步很重要，给ne赋值，没有这一步的话，前台就不会显示值      
        this.setData({
          ne: res.data
        })
      }
    })

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
    var test = wx.getStorageSync('text')
    console.log(test)

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