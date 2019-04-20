// pages/aiGrade/aiGrade.js
const app = getApp()
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codepath:[],
    isshowcode:false,
    isShow: false,
    isplay: app.globalData.isplay,
    record:{},
    showewm: false,
    imgalist: ["https://xhsmallimage.oss-cn-shenzhen.aliyuncs.com/e7dea7c405682dbef5eeb0a8138b8f0a.png","https://xhsmallimage.oss-cn-shenzhen.aliyuncs.com/e7dea7c405682dbef5eeb0a8138b8f0a.png"]
  },
  codeImage: function (e) {
    wx.previewImage({
      current: this.data.codepath, // 当前显示图片的http链接   
      urls: this.data.codepath // 需要预览的图片http链接列表   
    })
   
  },
  previewImage: function (e) {
    wx.previewImage({
      current: this.data.imgalist, // 当前显示图片的http链接   
      urls: this.data.imgalist // 需要预览的图片http链接列表   
    })

  },
  onLoad:function(options){
    console.log(options)
    var t = this;
    var _record = {};
    _record.percent = parseInt(options.percent)
    _record.score = parseInt(options.score)
    _record.id = parseInt(options.id)
    console.log(_record)
    t.setData({
      record: _record
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var t = this;
    t.setData({
      isShow: app.globalData.isShow,
      isplay: app.globalData.isplay
    })
  },
  linktoCenter:function(){
    wx.reLaunch({
      url: '../center/center',
    })
  },
  joinFun:function(){
    this.setData({
      showewm: true
    })
  },
  closeEwm:function(){
    this.setData({
      showewm:false,
      isshowcode:false
    })
  },
  onShareAppMessage: function (res) {
    // 来自页面内转发按钮
    console.log(res.target)
    return {
      title: '猩职场',
      path: '/pages/aiInterviewer/aiInterviewer',
      success(e) {
        // 转发成功  
        wx.showToast({
          title: '转发成功',
          icon: 'none',
          duration: 2000
        })
      },
      fail(e) {
        console.log(e)
      },
      complete() {

      }
    }
  },
  // 生成二维码
  generateCode:function(){
    var t =this;
    // 获取小程序码或小程序二维码
    wx.getStorage({
      key: 'token',
      success: function (_token) {
        common.nRequest(
          getApp().data.services + "api/getcodeimage",
          {
            path: 'pages/afs/afs?recordid=' + t.data.record.id,
            is_qrcode: 0
          },
          function (res) {
            if (getApp().data.Reg.test(res.statusCode)) {
              console.log(res)
              var _imgurl = res.data.data.path;
              var _codepath = t.data.codepath;
              _codepath[0] = _imgurl;
              t.setData({
                codepath: _codepath,
                isshowcode:true
              })
            }else{
              wx.showToast({
                title: '二维码生成出错啦~',
                icon: 'none',
                duration: 2000
              })
            }
          },
          "post",
          { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + _token.data },
          function () {
            console.log('系统错误')
          }
        );
      },
    })
  }
})