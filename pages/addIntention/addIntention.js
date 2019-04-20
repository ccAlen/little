// pages/addIntention/addIntention.js
const app = getApp()
var common = require("../../utils/util.js"); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    isplay: app.globalData.isplay,
    listShow:false,
    profession:'',//职位value
    searchMajorList: [],//搜索职位关键字返回的列表
    selectShow:false,//职位下拉框是否显示
    searchHangyeList: [],//搜索行业关键字返回的列表
    selectShow_hy: false,//行业下拉框是否显示
    record:'',//薪资value
    zhiweiId:'',//职位id
    hangyeId:'',//行业id
    workInfo:{},//修改求职意愿，从上一个页面带过来的数据
  },
  schollFocus:function(){
    this.setData({
      selectShow_hy: false,
      selectShow:false
    })
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t = this;
    wx.getStorage({
      key: 'editwork',
      success: function (_editwork) {
        console.log(_editwork)
        if (_editwork.data) {
          t.setData({
            workInfo: _editwork.data,
            profession_cat: _editwork.data.profession_cat,
            profession: _editwork.data.prof.prof_name,
          })
        } else {
          t.setData({
            workInfo: {}
          })
        }
      },
    })
  },
  // 
  descriptionFun:function(){
    this.setData({
      selectShow: false
    })
  },
  hangyeFun:function(){
    this.setData({
      selectShow: false
    })
  },
  // 职位输入框监听
  getInputValFun: function (e) {
    const t = this;
    // console.log(e)
    let _val = e.detail.value;

    // 判断输入字符串长度，至少输入两个之后才请求
    let jmz = {};
    jmz.GetLength = function (str) {
      return str.replace(/[\u0391-\uFFE5]/g, "aa").length;  //先把中文替换成两个字节的英文，在计算长度
    };
    //职位检索
    t.setData({
      profession: _val,
      selectShow: false,
      zhiweiId:''
    });
    if (jmz.GetLength(_val) >= 4) {
      common.nRequest(
        getApp().data.services + "api/prof/retrievalprof",
        { keyword: _val },
        function (res) {
          if (getApp().data.Reg.test(res.statusCode)) {
            console.log(res)
            t.setData({
              searchMajorList: res.data.data,
              selectShow:true
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
  // 行业输入框监听
  getInputHangyeFun:function(e){
    const t = this;
    // console.log(e)
    let _val = e.detail.value;

    // 判断输入字符串长度，至少输入两个之后才请求
    let jmz = {};
    jmz.GetLength = function (str) {
      return str.replace(/[\u0391-\uFFE5]/g, "aa").length;  //先把中文替换成两个字节的英文，在计算长度
    };
    //职位检索
    t.setData({
      profession_cat: _val,
      hangyeId: ''
    });
    if (jmz.GetLength(_val) >= 4) {
      common.nRequest(
        getApp().data.services + "api/prof/retrievalprofcat",
        { keyword: _val },
        function (res) {
          if (getApp().data.Reg.test(res.statusCode)) {
            console.log(res)
            t.setData({
              searchHangyeList: res.data.data,
              selectShow_hy: true
            })
          }
        },
        "post",
        { 'content-type': 'application/x-www-form-urlencoded' },
        function () {
          console.log('系统错误')
        }
      );
    }else{
      t.setData({
        selectShow_hy: false
      })
    }
  },

  hideListFun:function(){
    this.setData({
      selectShow_hy:false
    })
  },
  // 选择职业列表
  onclickListFun: function (e) {
    // console.log(e)
    this.setData({
      profession: e.target.dataset.zhiye,
      selectShow: false,
      zhiweiId:e.target.dataset.id
    })
  },
  // 行业列表
  onclickListFunhy:function(e){
    // console.log(e)
    this.setData({
      profession_cat: e.target.dataset.hangye,
      selectShow_hy: false,
      hangyeId: e.target.dataset.id
    })
  },
  // 选择薪资
  // selectRecord: function (e) {
  //   this.setData({
  //     listShow: !this.data.listShow,
  //     record: e.currentTarget.dataset.val,
  //     selectShow: false
  //   })
  // },
  // 提交表单
  formSubmit: function (e) {
    console.log(e.detail)
    var t = this;
    var formInfo = e.detail.value;
    console.log(formInfo)
    if (formInfo.hangye == '') {
      wx.showToast({
        title: '行业不能为空',
        icon: 'none',
        duration: 2000
      })
    }else if (formInfo.zhiwei == '') {
      wx.showToast({
        title: '职位不能为空',
        icon: 'none',
        duration: 2000
      })
    } else if (formInfo.xinzi == '') {
      wx.showToast({
        title: '薪资不能为空',
        icon: 'none',
        duration: 2000
      })
    }
    //  else if (formInfo.jianbai == '') {
    //   wx.showToast({
    //     title: '意向简白不能为空',
    //     icon: 'none',
    //     duration: 2000
    //   })
    // } 
    else {
      // 获取token
      wx.getStorage({
        key: 'token',
        success: function (_token) {
          // console.log(_starTime)
          wx.getStorage({
            key: 'edittype',
            success: function (_edittype) {
              console.log(t.data.zhiweiId)
              // profession_cat_id: t.data.zhiweiId == '' ? '' : t.data.zhiweiId,//行业id
              // profession_cat: t.data.zhiweiId == '' ? formInfo.hangye : '',//行业
              // profession_id: t.data.zhiweiId == '' ? '' : t.data.zhiweiId,//职业id
              // // profession: t.data.zhiweiId == '' ? formInfo.zhiwei : '',//职业
              // salary: formInfo.xinzi,//薪资
              // description: formInfo.jianbai
              var canshu = {
                salary: formInfo.xinzi,//薪资
                description: formInfo.jianbai
              }
              if (t.data.zhiweiId != '') {
                canshu.profession_id = t.data.zhiweiId//职业id
              } else {
                canshu.profession = formInfo.zhiwei//职业
              }
              if (t.data.hangyeId != ''){
                canshu.profession_cat_id = t.data.hangyeId
              }else{
                canshu.profession_cat = formInfo.hangye
              }
              if (_edittype.data == 'add') {//添加
                console.log("添加求职意愿")
                                
                // 用户求职意愿
                common.nRequest(
                  getApp().data.services + "api/user/savejobintention",
                  canshu,
                  function (res) {
                    if (res.statusCode == app.data.status.s203) {
                      console.log(res.data.data)
                      wx.navigateBack()
                      // wx.redirectTo({
                      //   url: '../editMaterial/editMaterial'
                      // })
                    }
                  },
                  "post",
                  { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + _token.data },
                  function () {
                    console.log('系统错误')
                  }
                );
              } else if (_edittype.data == 'change') {//修改
                // console.log("修改工作经历")
                // 用户修改求职意愿
                common.nRequest(
                  getApp().data.services + "api/user/savejobintention",
                  canshu,
                  function (res) {
                    if (res.statusCode == app.data.status.s203) {
                      console.log(res.statusCode)
                      // wx.redirectTo({
                      //   url: '../editMaterial/editMaterial'
                      // })
                      wx.navigateBack()
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
          })
        }
      })
    }
  },
})