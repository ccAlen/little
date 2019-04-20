// pages/notes/notes.js
const app = getApp()
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPullDown: false,
    recommend:{},
    isShow: false,
    isplay: app.globalData.isplay,
    courseList: [],
  },
  onShareAppMessage: function () {
    return {
      title: '考证及就业建议结果',
      path:'/pages/textualAssistant/textualAssistant',
      imageUrl:'../img/share.jpg'
    };
  },
  /**
   * 生命周期函数--监听页面加载 
   */
  
  onLoad: function (options) {
    console.log(options)
    var t = this;
    if (options.new_search == '1'){
      // 需要传new_search值给后台，添加记录
      app.globalData.testRecord = true
      wx.getStorage({
        key: 'token',
        success: function (_token) {
          t.getSearchcert(options.zhuanyeid, options.zhiyeid, _token.data, 'new_search')
        },
        fail: function () {
          t.getSearchcert(options.zhuanyeid, options.zhiyeid, 'new_search')
        }
      })
    }else{
      // 不用传new_search值给后台，不添加记录
      wx.getStorage({
        key: 'token',
        success: function (_token) {
          t.getSearchcert(options.zhuanyeid, options.zhiyeid, _token.data)
        },
        fail: function () {
          t.getSearchcert(options.zhuanyeid, options.zhiyeid)
        }
      })
    }
    
    // 获取相关课程
    common.nRequest(
      getApp().data.services + "api/course/getrelatedcourses",
      {
        label_type:'1',
        label_id: options.zhuanyeid,
        per_page:'2',
        page:'1'
      },
      function (res) {
        if (getApp().data.Reg.test(res.statusCode)) {
          // console.log(res)
          t.setData({
            courseList: res.data.data
          })
        }
      },
      "post",
      { 'content-type': 'application/x-www-form-urlencoded' },
      function () {
        console.log('系统错误')
      }
    );
  },

  /**
   * 生命周期函数--监听页面显示
   */
  //调用证书查询接口
  getSearchcert: function (_zhuanyeid, _zhiyeid, _token, new_search){
    var t = this;
    // 查询证书并保存查询记录 
    var postData = {}
    if (new_search){
      postData.new_search = '1'
    }
    if (_zhiyeid && _zhiyeid !='0'){
      postData.profession_id = _zhiyeid
    }
    if (_zhuanyeid){
      postData.major_id = _zhuanyeid
    }
    common.nRequest(
      getApp().data.services + "api/cert/searchcert",
      postData,
      function (res) {
        if (getApp().data.Reg.test(res.statusCode)) {
          console.log(res)
          t.setData({
            recommend: res.data.data
          })
        }
      },
      "post",
      { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + _token },
      function () {
        console.log('系统错误')
      }
    );
  },
  onShow: function () {
    const t =this;
    t.setData({
      isShow: app.globalData.isShow,
      isplay: app.globalData.isplay
    })
  },

  

  slideFun: function () {
    this.setData({
      isPullDown: !this.data.isPullDown,
    })
  },
  linkCertificateDetails: function(e){
    // console.log(e.currentTarget.dataset.zsid)
    wx.setStorage({
      key: "certs_id",
      data: e.currentTarget.dataset.zsid
    })
    wx.navigateTo({
      url: '../certificateDetails/certificateDetails'
    })
  },
  // 跳转职业详情
  occupationLink: function (e) {
    wx.setStorage({
      key: "occupationId",
      data: e.currentTarget.dataset.zsid
    })
    wx.navigateTo({
      url: '../occupationDetails/occupationDetails'
    })
  }
})