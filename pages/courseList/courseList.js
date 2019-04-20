// pages/courseList/courseList.js  
const app = getApp()
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recommend: [],
    imgUrls: [],
    isShow: false,
    isplay: app.globalData.isplay,
    page:1,
    ispulldown:true,
    showLogin: false
  },
  getKey: function (e) {
    console.log(e)
    this.setData({
      showLogin: e.detail
    })
  },
  onReachBottom: function () {
    // console.log('下拉')
    if (this.data.ispulldown){
      this.data.page = parseInt(this.data.page) + 1
      this.getCourseList(this.data.page);
    }else{
      return false;
    }
  },
  // 请求课程列表接口
  getCourseList: function (_page){
    var t = this;
    common.nRequest(
      getApp().data.services + "api/course/getcourses",
      {
        page: _page,
        per_page: '10',
        is_hot: 0,
        is_recommend: 0,
        is_home: 0
      },
      function (res) {
        if (getApp().data.Reg.test(res.statusCode)) {
          // console.log(res)
          if (res.data.data.length > 0) {
            var recommend = t.data.recommend;
            for (var i = 0; i < res.data.data.length; i++) {
              recommend.push(res.data.data[i])
            }
            t.setData({
              recommend: recommend,
              ispulldown: true
            })
          }else{
            t.setData({
              ispulldown:false
            })
          }
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.pid) {
      common.getLogin(this, 'courseList')
    }
    const t = this;
    // 课程列表
    t.getCourseList(1)
    // 广告列表
    common.nRequest(
      getApp().data.services + "api/getad",
      {
        position_no: '20180824'
      },
      function (res) {
        if (getApp().data.Reg.test(res.statusCode)) {
          // console.log(res.data.data[0].ads)
          t.setData({
            imgUrls: res.data.data
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

  textualAssistantLink: function (e) {
    // console.log(e.currentTarget.dataset.courseid)
    // wx.setStorage({
    //   key: "courseId",
    //   data: e.currentTarget.dataset.courseid
    // })
    wx.navigateTo({
      url: '../courseDetails/courseDetails?courseid=' + e.currentTarget.dataset.courseid + '&into=1'
    })
  },
})