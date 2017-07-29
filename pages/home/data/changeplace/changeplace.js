var tcity = require("../../../../utils/city.js");
Page({
  data:{
    provinces : [],
    cityData : '',
    showCity : 'none',
  },
  onLoad:function(options){

    var that = this;    
    tcity.init(that);
    var cityData = that.data.cityData; 
    that.setData({
      provinces : cityData
    })
    // console.log(cityData);    
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
 provincesClick : function(e){
   let index = e.currentTarget.id;
   let provinces = this.data.provinces[index].name;
   
   wx.navigateTo({
     url: '../changecity/changecity?provinces='+provinces+'&&index='+index,
     success: function(res){
     }
   })
 }
})