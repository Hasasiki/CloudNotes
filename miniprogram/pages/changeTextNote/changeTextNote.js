// miniprogram/pages/changeTextNote/changeTextNote.js
//获取标题和笔记输入，置顶布尔类型，点击保存后讲data内的数据保存到本地内存池
var util = require('../../utils/util.js');
var noteId;
Page({
  data: {
    intitle: "",
    note: "",
    _id: '',
    ne: []
  },

  onLoad: function (options) {
    var id = options.id;
    noteId = options.id;
    console.log(noteId);
    // this.setData({
    //   _id:id
    // })
    // console.log(_id);

    if (id == null) {
      console.log("there is no id transpt here");
    } else {
      //将传进来的值放进title和note里
      const db = wx.cloud.database({
        env: 'cloudnotes-4pv4u'
      })
      db.collection('textNotes').where({
        _id: id
      }).get({
        success: res => {
          console.log(res.data)
          this.setData({
            ne: res.data
          })
        }
      })
    }
  },

  //保存笔记到本地缓存
  saveNote: function () {
    //弹窗提示
    wx.showToast({
      title: '保存成功！',
    }),
      //写入
      wx.setStorage({
        key: 'text',
        data: {
          "title": this.data.intitle,
          "note": this.data.note,
          "data": util.formatTime(new Date())
        },
      })
    //数据库更新
    const db = wx.cloud.database()
    db.collection('textNotes').doc(noteId).update({
      data: {
        title: this.data.intitle,
        note:this.data.note
      },
      success: res => {
        console.success("success")
      },
      fail: err => {
        icon: 'none',
          console.error('[数据库] [更新记录] 失败：', err)
      }
    })
    /*
    db.collection('textNotes').add({
      data: {
        title: this.data.intitle,
        note: this.data.note,
        data: util.formatTime(new Date()),
        type: 1
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
    */
    //返回main
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
  //获取笔记输入
  noteInput: function (e) {
    this.setData({ note: e.detail.value });
    var inNote = this.data.note;
    console.log(inNote);
  }

})