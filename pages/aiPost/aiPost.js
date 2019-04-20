// pages/aiPost/aiPost.js 
const app = getApp()
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    isplay: app.globalData.isplay,
    professionList:[],//岗位类型列表
    selected:'',//选择的岗位类型id
    postList:[],//岗位列表
    postselected: '',//选择的岗位id
    shadowshow:false,//是否显示弹框
    postDetails:{},//职业详情
    descriptionList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t = this;
    // 获取职业分类及职业
    common.nRequest(
      getApp().data.services + "api/prof/getprofessioncats",
      {
        id:''
      },
      function (res) {
        if (getApp().data.Reg.test(res.statusCode)) {
          console.log(res)
          t.setData({
            professionList: res.data.data,
            selected:res.data.data[0].id
          })
          // 获取职业分类及职业
          common.nRequest(
            getApp().data.services + "api/prof/getprofcatswithprofs",
            {
              id: res.data.data[0].id,
              show_in_ai:'1'
            },
            function (_post) {
              if (getApp().data.Reg.test(_post.statusCode)) {
                console.log(_post)
                t.setData({
                  postList: _post.data.data
                })
              }
            },
            "post",
            { 'content-type': 'application/x-www-form-urlencoded' },
            function () {
              console.log('系统错误')
            }
          );
        }
      },
      "post",
      { 'content-type': 'application/x-www-form-urlencoded' },
      function () {
        console.log('系统错误')
      }
    );
  },
  selectClassFun:function(e){
    // console.log(e.currentTarget.dataset.id)
    var t = this;
    t.setData({
      selected: e.currentTarget.dataset.id
    })
    // 获取职业分类及职业
    common.nRequest(
      getApp().data.services + "api/prof/getprofcatswithprofs",
      {
        id: e.currentTarget.dataset.id,
        show_in_ai: '1'
      },
      function (res) {
        if (getApp().data.Reg.test(res.statusCode)) {
          console.log(res)
          t.setData({
            postList: res.data.data
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
  postSelectFun:function(e){
    var t = this;
    t.setData({
      postselected: e.currentTarget.dataset.postid,
      shadowshow:true
    })
    // wx.getStorage({
    //   key: 'occupationId',
    //   success: function (newsId) {
        // 咨询详情
        common.nRequest(
          getApp().data.services + "api/prof/getprofessiondetail",
          { id: e.currentTarget.dataset.postid },
          function (res) {
            if (getApp().data.Reg.test(res.statusCode)) {
              console.log(res)
              console.log(res.data.data.notice.split("\n"))
              t.setData({
                postDetails:res.data.data,
                descriptionList: res.data.data.notice.split("\n")
              })
              // if (res.data.data.content) {
              //   //html转WXML
              //   // let wxml = app.towxml.toJson(res.data.data.content);
              //   // t.setData({
              //   //   article: wxml,
              //   //   newsDetails: res.data.data
              //   // })
              //   // console.log(wxml)
              // } else {
              //   t.setData({
              //     newsDetails: res.data.data
              //   })
              // }
            }
          },
          "post",
          { 'content-type': 'application/x-www-form-urlencoded' },
          function () {
            console.log('系统错误')
          }
        );
    //   },
    //   fail: function (res) {
    //     wx.showToast({
    //       title: '没有获取到对应的资讯id',
    //       icon: 'none',
    //       duration: 2000
    //     })
    //   }
    // })
  },
  readygoFun:function(){
    console.log('postid')
    console.log(this.data.postselected)
    // 存储选择的岗位id到缓存
    wx.setStorage({
      key: 'postid',
      data: this.data.postselected,
    })
    wx.redirectTo({
      url: '../aiQuestion/aiQuestion',
    })
  },
  closeFun:function(){
    this.setData({
      shadowshow: false
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.setStorage({
      key: 'answerArr',
      data: '',
    })
    wx.setStorage({
      key: 'audioList',
      data: '',
    })
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