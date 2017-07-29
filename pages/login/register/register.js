var app = getApp();
Page({
  data: {
    telphonecolor: 'cyan',
    telphoneborder: '4rpx solid cyan',
    show_register_weixin : 'none',
    show_register_telphone : 'block',
    weixincolor: '',
    weixinborder: '',
    checkboxCheck : true,
    disabled : false,
    content : '',
    username : null,
    telphone: null,
    password: null,
    firmpassword: null,
    email: null,
    content : '',
  },
  onLoad: function (options) {
     this.setData({
       show_register_weixin: 'none',
       show_register_telphone: 'block',
     })
  },
  onReady: function () {
  
  },
  onShow: function () {
  
  },

  onHide: function () {
  
  },

  onUnload: function () {
  
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
  
  },
  telphone : function(){
    console.log("232222");
    this.setData({
      telphonecolor: 'cyan',
      telphoneborder: '4rpx solid cyan',
      weixincolor: '',
      weixinborder: '',
      show_register_weixin: 'none',
      show_register_telphone: 'block',
    })
  },
  weixin : function(){
    console.log("1111");
    this.setData({
      telphonecolor: '',
      telphoneborder: '',
      weixincolor: 'cyan',
      weixinborder: '4rpx solid cyan',
      show_register_weixin: 'block',
      show_register_telphone: 'none',
    })
  },
  checkboxCheck : function(){
    var checkboxCheck = this.data.checkboxCheck;
    var disabled = this.data.disabled;
    if (checkboxCheck == false){
       this.setData({
         disabled: false, checkboxCheck : true
       })
    }
    else if (checkboxCheck == true){
      this.setData({
        disabled: true, checkboxCheck : false
      })
    }
  },
  Login : function(){
    wx.navigateBack({
      url:'../login/login',
    })
  },
  submit : function(e){
    var that = this;
    console.log(e);
    var teltest = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    var emailtest = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (e.detail.value.username.length == 0){
      that.setData({
        content: '起个好名字吧！'
      })
    }
     else if (e.detail.value.telphone.length != 11 || !teltest.test(e.detail.value.telphone) ){
      that.setData({
            content : '你输入的手机号码有误！'
      })
    }
    else if (e.detail.value.telphone.length == 0 || e.detail.value.password.length == 0 || e.detail.value.firmpassword.length == 0){
      that.setData({
      content : '请输入手机号码或密码！'
    })
    }
    else if(e.detail.value.password != e.detail.value.firmpassword){
      that.setData({
        content: '你输入的密码不一致！请重新输入'
      })
    }
    else if (!emailtest.test(e.detail.value.email) ){
      that.setData({
        content : '你输入的邮箱格式不正确！'
      })
    }
    else{
      that.setData({
        content : ''
      })
      wx.request({
        url: 'http://10.0.26.2:5000/api/v1.0/users',
        data : {
           email : e.detail.value.email,
           telephone: e.detail.value.telphone,
           password : e.detail.value.password,  
           username: e.detail.value.username,

        },
        method: 'POST',
        header: { 
          'Content-Type': 'application/x-www-form-urlencoded'  
         },
        success : function(res){
          console.log(res.data);
          if (res.data.status == 201){
            wx.showToast({
              title: '注册成功',
            })
            var page = getCurrentPages();
            var prevPage = page[page.length-2];  
            prevPage.setData({
              dataname: e.detail.value.username
            })    
            wx.navigateBack();
            // var username = app.Data.username;
            // that.setData({
            //   username: e.detail.value.username
            // })
          }
          if (!res.data.status){
            wx.showToast({
              title: '您输入的手机号或邮箱已被注册！',
              duration : 2000
            })
          }
          
        },
        fail : function(){
          console.log("11111");
          console.log(e.detail.value.email, e.detail.value.telphone);
        }
        
      })
    }
  },
  agreement : function(e){
    wx.redirectTo({
      url: '../agreement/agreement',
    })
  }
})