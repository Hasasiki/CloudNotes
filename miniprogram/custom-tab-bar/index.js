// custom-tab-bar/index.js
Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "/images/tabbar/about.png",
      selectedIconPath: "/images/tabbar/about_cur.png",
      text: "主页"
    }, {
        pagePath: "/pages/addTextNote/addTextNote",
        iconPath: "/images/tabbar/about.png",
        selectedIconPath: "/images/tabbar/about_cur.png",
        text: "+"
      }, 
    {
      pagePath: "/pages/main/main",
        iconPath: "/images/tabbar/basics.png",
        selectedIconPath: "/images/tabbar/basics_cur.png",
      text: "管理"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({ url })
      this.setData({
        selected: data.index
      })
    }
  }
})