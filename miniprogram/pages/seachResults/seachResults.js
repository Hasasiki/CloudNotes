// miniprogram/pages/seachResults/seachResults.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ne: [],  //空的数组，获取到云数据库的数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var key = options.key;
    console.log(key);
    const db = wx.cloud.database();
    db.collection('textNotes').where({
      title: key
    })
      .get({
        //得到数据集，显示在页面
        success:res =>{
          console.log(res.data),
          //将数据存到页面data，前端显示     
          this.setData({
            ne: res.data
          })
          console.log(this.data.ne);
        }
      })
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
  change: function (e) {
    //获取卡片data-text，传入打开的addTextNotes页面
    console.log(e.currentTarget.dataset.text);
    var id = e.currentTarget.dataset.text;
    wx.navigateTo({
      url: '/pages/changeTextNote/changeTextNote?id=' + id,
    })

  },
  //删除笔记
  deleteAndRefresh(e) {
    this.setData({
      modalName: null
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
  }

})