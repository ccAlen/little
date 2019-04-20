// pages/addEducation/addEducation.js
const app = getApp()
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    datePickerValue: ['', '', ''],
    datePickerIsShow: false,
    dateedd: '',
    datePickerValueedd: ['', '', ''],
    datePickerIsShowedd: false,
    searchMajorList:[],//检索职业数组
    postName: '',//岗位输入框的值
    listShow:false,//职位下拉框的显示
    workInfo:{},//修改工作经验的默认数据
    isShow: false,
    isplay: app.globalData.isplay,
    datevalue:'',
    datevalue1:''
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
  // 提交表单
  formSubmit: function (e) {
    var t = this;
    console.log(e)
    var formInfo = e.detail.value;
    if (formInfo.danwei == ''){
      wx.showToast({
        title: '单位不能为空',
        icon: 'none',
        duration: 2000
      })
    } else if (formInfo.zhiwei == ''){
      wx.showToast({
        title: '职位不能为空',
        icon: 'none',
        duration: 2000
      })
    } else if (formInfo.starTime == ''){
      wx.showToast({
        title: '开始时间不能为空',
        icon: 'none',
        duration: 2000
      })
    } else if (formInfo.eddTime == '') {
      wx.showToast({
        title: '结束时间不能为空',
        icon: 'none',
        duration: 2000
      })
    }else{
      var reg = /[\u4e00-\u9fa5]/g;
      var _starTime = t.data.datevalue;
      var _endTime = t.data.datevalue1;
      var reg1 = /,$/gi;
      // str = str.replace(reg, ""); 
      // _starTime = _starTime.replace(reg, "-").replace(/.$/, '').replace(reg1, ""); 
      // _endTime = _endTime.replace(reg, "-").replace(/.$/, '').replace(reg1, "");   
      // 获取token
      wx.getStorage({
        key: 'token',
        success: function (_token) {
          // console.log(_starTime)
          wx.getStorage({
            key: 'edittype',
            success: function (_edittype) {
              console.log(_edittype)
              if (_edittype.data == 'add') {//添加
                console.log("添加工作经历")
                // 用户添加工作经历
                common.nRequest(
                  getApp().data.services + "api/user/addworkhistory",
                  {
                    company: formInfo.danwei,
                    position: formInfo.zhiwei,
                    start_time: _starTime,
                    end_time: _endTime,
                    description: formInfo.textarea
                  },
                  function (res) {
                    // if (getApp().data.Reg.test(res.statusCode)) {
                      if (res.statusCode == app.data.status.s402) {
                        // console.log(res.data.data)
                        // wx.redirectTo({
                        //   url: '../editMaterial/editMaterial'
                        // })
                        wx.navigateBack()
                      }
                    // }
                  },
                  "post",
                  { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + _token.data },
                  function () {
                    console.log('系统错误')
                  }
                );
              } else if (_edittype.data == 'change') {//修改
              console.log("修改工作经历")
                // 用户添加工作经历
                common.nRequest(
                  getApp().data.services + "api/user/updateworkhistory",
                  {
                    id: t.data.workInfo.id,
                    company: formInfo.danwei,
                    position: formInfo.zhiwei,
                    start_time: _starTime,
                    end_time: _endTime,
                    description: formInfo.textarea
                  },
                  function (res) {
                    // console.log(res)
                    // if (getApp().data.Reg.test(res.statusCode)) {
                      if (res.statusCode == app.data.status.s402) {
                        //   console.log(res.statusCode)
                        //   wx.redirectTo({
                        //   url: '../editMaterial/editMaterial'
                        // })
                        wx.navigateBack()
                      }
                    // }
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
  companyfocus:function(){
    this.setData({
      listShow: false
    })
  },
  descriptionFocus:function(){
    this.setData({
      listShow: false
    })
  },
  // 职位搜索
  searchJob:function(e){
    // console.log(e.detail.value)
    const t = this;
    // console.log(e)
    let _val = e.detail.value;

    // 判断输入字符串长度，至少输入两个之后才请求
    let jmz = {};
    jmz.GetLength = function (str) {
      return str.replace(/[\u0391-\uFFE5]/g, "aa").length;  //先把中文替换成两个字节的英文，在计算长度
    };
    if (jmz.GetLength(_val) >= 4) {
      common.nRequest(
        getApp().data.services + "api/prof/retrievalprof",
        { keyword: _val },
        function (res) {
          if (getApp().data.Reg.test(res.statusCode)) {
            if (res.statusCode == app.data.status.s201) { 
              // console.log(res.data.data)
              t.setData({
                searchMajorList: res.data.data,
                listShow:true
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
    }else{
      t.setData({
        searchMajorList: [],
        listShow: false
      })
    }
  },
  // 选择列表
  onclickListFun: function (e) {
    this.setData({
      postName: e.target.dataset.list,
      listShow:false
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
        if(_editwork != ''){
          console.log(_editwork.data)
          t.setData({
            workInfo: _editwork.data,
            postName: _editwork.data.position,
            date: _editwork.data.start_time,
            dateedd: _editwork.data.end_time,
            datevalue: _editwork.data.start_time,
            datevalue1: _editwork.data.end_time
          })
        }else{
          t.setData({
            workInfo: {}
          })
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  
  // 开始时间插件方法
  showDatePicker: function (e) {
    // this.data.datePicker.show(this);
    this.setData({
      datePickerIsShow: true,
      listShow: false
    });
  },

  datePickerOnSureClick: function (e) {
    // console.log('datePickerOnSureClick');
    // console.log(e.detail.value[0] + '-' + e.detail.value[1] + '-' + e.detail.value[2]);
    this.setData({
      date: `${e.detail.value[0]}年${e.detail.value[1]}月${e.detail.value[2]}日`,
      datePickerValue: e.detail.value,
      datePickerIsShow: false,
      datevalue: e.detail.value[0] + '-' + e.detail.value[1] + '-' + e.detail.value[2]
    });
  },

  datePickerOnCancelClick: function (event) {
    console.log('datePickerOnCancelClick');
    console.log(event);
    this.setData({
      datePickerIsShow: false,
    });
  },
  // 结束时间插件方法
  showDatePickeredd: function (e) {
    // this.data.datePicker.show(this);
    this.setData({
      datePickerIsShowedd: true,
      listShow: false
    });
  },

  datePickerOnSureClickedd: function (e) {
    // console.log('datePickerOnSureClickedd');
    // console.log(e);
    // console.log(e.detail.value[0] + '-' + e.detail.value[1] + '-' + e.detail.value[2]);
    this.setData({
      dateedd: `${e.detail.value[0]}年${e.detail.value[1]}月${e.detail.value[2]}日`,
      datePickerValueedd: e.detail.value,
      datePickerIsShowedd: false,
      datevalue1: e.detail.value[0] + '-' + e.detail.value[1] + '-' + e.detail.value[2]
    });
  },

  datePickerOnCancelClickedd: function (event) {
    console.log('datePickerOnCancelClickedd');
    console.log(event);
    this.setData({
      datePickerIsShowedd: false,
    });
  },
})