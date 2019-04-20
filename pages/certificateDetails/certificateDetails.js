// pages/certificateDetails/certificateDetails.js 
var common = require("../../utils/util.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailsList:{},
    idindex:[],
    //article将用来存储towxml数据
    article:[],
    isShow: false,
    isplay: app.globalData.isplay,
    // top标签显示（默认不显示）
    backTopValue: false  
  },
  // 监听滚动条坐标
  onPageScroll: function (e) {
    //console.log(e)
    var that = this
    var scrollTop = e.scrollTop
    // console.log(scrollTop)
    var backTopValue = scrollTop > 300 ? true : false
    that.setData({
      backTopValue: backTopValue
    })
  },

  // 滚动到顶部
  backTop: function () {
    // 控制滚动
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 查询证书并保存查询记录
    const t = this;
    wx.getStorage({
      key: 'certs_id',
      success: function (certs_id) {
        common.nRequest(
          getApp().data.services + "api/cert/getcertdetail",
          { id: certs_id.data },
          function (res) {
            if (getApp().data.Reg.test(res.statusCode)) {
              // console.log(res.data.data)
              var _idindex = t.data.idindex;
              var _content = res.data.data.content;
              var _listcontent = [];
              var _arr = [3,5,4,6,2,7,0,1,8];
              var _contentArr = [];
              var _detailsList = {};
              wx.setNavigationBarTitle({
                title: res.data.data.cert_name
              })
              for (var i = 0; i < _arr.length; i++){
                _idindex[i] = false;
                // console.log(_arr[i])
                // console.log(_content[_arr[i]])
                _contentArr.push(_content[_arr[i]])
                if (_content[_arr[i]].content != ''){
                  let wxml = app.towxml.toJson(_content[_arr[i]].content,'html',t);
                  // console.log(wxml)
                  _listcontent.push(wxml)
                  // console.log(_listcontent)
                  t.setData({
                    article: _listcontent
                  })
                }
              }
              _detailsList.content = _contentArr;
              t.setData({
                detailsList: _detailsList,
                idindex: _idindex
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
      fail: function (res) {
        wx.showToast({
          title: '没有获取到对应的证书id',
          icon: 'none',
          duration: 2000
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
    this.setData({
      isShow: app.globalData.isShow,
      isplay: app.globalData.isplay
    })
  },
  slideFun: function (e) {
    var _idindex = this.data.idindex;
    _idindex[e.currentTarget.dataset.id] = !_idindex[e.currentTarget.dataset.id];
    // console.log(_idindex)
    this.setData({
      idindex: _idindex
    })
  },
  slideDownFun:function(e){
    var _idindex = this.data.idindex;
    _idindex[e.currentTarget.dataset.id] = false;
    this.setData({
      idindex: _idindex,
    })
  }
})