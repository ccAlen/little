// pages/tipsList/tipsList.js  
const app = getApp()
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    isplay: app.globalData.isplay,
    token:'',
    tipsList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t = this;
    wx.getStorage({
      key: 'token',
      success: function (_token) {
        t.setData({
          token: _token.data
        })
        // 获取站内信列表及详情
        common.nRequest(
          getApp().data.services + "api/message/getmessages",
          {},
          function (res) {
            if (getApp().data.Reg.test(res.statusCode)) {
              var tipsidList = [];
              t.setData({
                tipsList: res.data.data
              })
              for (var i = 0; i < res.data.data.length; i++){
                tipsidList.push(res.data.data[i].id)
              }
              // console.log(tipsidList)
              // 标记全部站内信为已读
              common.nRequest(
                getApp().data.services + "api/message/setallread",
                { ids: tipsidList },
                function (res) {
                  if (getApp().data.Reg.test(res.statusCode)) {
                    console.log(res)
                    // t.setData({
                    //   tipsList: res.data.data
                    // })
                  }
                },
                "post",
                { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + _token.data },
                function () {
                  console.log('系统错误')
                }
              );
            }
          },
          "post",
          { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + _token.data },
          function () {
            console.log('系统错误')
          }
        );
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
    this.setData({
      isShow: app.globalData.isShow,
      isplay: app.globalData.isplay
    })
  },
  // 跳转消息详情页
  tipsDetailsLink:function(e){
    // console.log(e.currentTarget.dataset.id)
    for (var i = 0; i < this.data.tipsList.length; i++){
      if (this.data.tipsList[i].id == e.currentTarget.dataset.id){
        wx.setStorage({
          key: 'tipsDetails',
          data: this.data.tipsList[i],
          success:function(){
            wx.navigateTo({
              url: '../tipsDetails/tipsDetails',
            })
          }
        })
      }
    }
  }
})