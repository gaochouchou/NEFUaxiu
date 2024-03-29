// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // env: 'travel-254c4c'
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async(event, context) => {
  var id=event.score;
  console.log('云数据库中id值：'+id);
  try {
    return await db.collection('repair').doc(id).update({
      // data 传入需要局部更新的数据
      data: {
        description: '已完成维修',
      }
    })
  } catch (e) {
    console.error(e)
  }

}