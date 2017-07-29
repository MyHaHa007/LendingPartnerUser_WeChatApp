var tcity = require("../../../../utils/city.js");
Page({
  data:{
    citys : [],
    provinces : '',
  },
  onLoad:function(options){
    var that = this;    
    tcity.init(that);
    var cityData = that.data.cityData; 
    var provinces = options.provinces;
    var index = options.index;
    var lists = [];
    that.setData({
      provinces : provinces
    })
    console.log(cityData[index].sub);
    that.setData({
      citys : cityData[index].sub
    })
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
  citysClick : function(e){
    var that = this;
    var provinces = that.data.provinces;
    var index = e.currentTarget.id;
    var city = that.data.citys;
    console.log(city[index].name);
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];//当前页面
    var prevPage = pages[pages.length - 3];
    //  provinces + "  " + city[index].name
    prevPage.setData({
      place : provinces + "  " + city[index].name
    })
    wx.navigateBack({
      delta: 2, // 回退前 delta(默认为1) 页面
    })
  }
})