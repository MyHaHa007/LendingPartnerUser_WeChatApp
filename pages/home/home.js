var app = getApp();
Page({
  data:{
    member : '../images/tabbar/home/member.png',
    homeuserImg : '../images/tabbar/home/userImg.png',
    shownodata: 'block',
    showdata: 'none',
    username : '',
    userid : ''
  },
  onLoad: function (options){
    // 页面初始化 options为页面跳转所带来的参数   
     var that = this;

  },
  onReady:function(){
    // 页面渲染完成
  },  
  onShow:function(){
     var that = this;
     var username = app.globalData.userInfo;
     var userid = app.globalData.user_id.user_name;
     if (username){
       that.setData({
         username: app.globalData.userInfo.usernametelphone,
         userid: app.globalData.user_id.user_name,
         shownodata: 'none',
         showdata: 'block',
       })
     }
      if (!username) {
        that.setData({
          shownodata: 'block',
          showdata: 'none',
        })
      }
    
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  dataa : function(){
    var usernames = app.globalData.userInfo;
    console.log(usernames);
  }
})