var app = getApp();
var Base64 = require('../../utils/base64.modified.js');
Page({
  data:{
    show_login : 'block',
    show_register : 'none',
    AutoLogin : false,
    username : null,
    password : null,
    content : '',
  }, 
  onLoad:function(options){

  },
  onReady:function(){
  },
  onShow:function(){
  },
  onHide:function(){
  },
  onUnload:function(){
  },
  onPullDownRefresh: function() {
  },
  onReachBottom: function() {
  },
  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  },
  image : function(){
    wx.navigateBack({     
      url: '../home/home',
    })
  },
  register : function(){
    this.setData({
      show_login: 'none', show_register: 'block'
    })
  },
  radio : function(){
    var AutoLogin = this.data.AutoLogin;
    if (AutoLogin == false){
        this.setData({
          AutoLogin : true
        })
    }
    else if (AutoLogin == true){
      this.setData({
        AutoLogin : false
      })
    }
  },
  login: function () {
    this.setData({
      show_login: 'block', show_register: 'none'
    })

  },
  submit : function(e){
   var that = this;
    var username = e.detail.value.username;
    var password = e.detail.value.password;    
    var usernameTest = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    // ================加密操作============================
    var username_password = username + ':' + password;
    var base = Base64.encode(username_password);   //返回编码后的字符
    console.log("111111111111"+base+"2222222222");
    if (username.length == 0 || username.length != 11 || !usernameTest.test(username)){
      that.setData({
          content : '您输入的手机号格式不正确！'
       })
    }
    else if (password.length == 0){
      that.setData({
        content: '请输入密码！'
      })
    } 
   else{
     that.setData({
        content: ''
      })
      wx.request({
        url: 'http://10.0.26.2:5000/api/v1.0/token',
        data: {
           username : username,
           password : password
        },
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + base
        },
        success: function (res) {
          // wx.navigateBack();
          console.log(res.data);
          var user_name = res.data.user_id;
          console.log(user_name);
          wx.showToast({
            title: '登录成功',
            duration : 2000,
          })
          var usernametelphone = username.substring(0, 3) + "****" + username.substring(8, 11);
          app.globalData.base64 = {base};
          app.globalData.userInfo = {usernametelphone};
          app.globalData.user_id = { user_name};
          var page = getCurrentPages();
          var prevPage = page[page.length - 2];
         prevPage.setData({
           shownodata: 'none', 
           showdata: 'block',    
           show_nodiscuss: 'none',
           show_discuss: 'block'  ,
           userid: user_name
         })
         wx.navigateBack({
           delta : 1
         })
        },
        fail: function (res) {
          console.log(res.data);
        }

      })
   }
   
    
  }
})