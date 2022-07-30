module.exports = class Grade extends Component {
  render(){
    // console.log("Grade props:",this.props)
    // 求单个学生的平均分和总分
    let rankData = this.props.data.map((item,index)=>{
      return {
        ...item,
        average: ((item.chinese+item.math+item.english)/3).toFixed(2),
        total:item.chinese+item.math+item.english,        
      }
    })
    // 根据总分排序
    rankData.sort((a,b)=>{
      return b.total-a.total;
    })
    let sum=0, sum1=0, sum2=0, sum3=0;
    // 求排名，并统计全班的三科总分和各科总分
    rankData = rankData.map((item,index)=>{
      sum+=item.total;
      sum1+=item.chinese;
      sum2+=item.math;
      sum3+=item.english;
      return {
        ...item,
        rank: index+1,     
      }
    })
    // console.log(rankData)
    return <div>
      <h3>成绩单</h3>
      {/* 展示总人数、平均总分和各科平均分 */}
      <div>总人数：{rankData.length}</div>
      <div>平均总分：{(sum/rankData.length).toFixed(2)}  </div>
      <div>语文平均分：{(sum1/rankData.length).toFixed(2)}  数学平均分：{(sum2/rankData.length).toFixed(2)}  英语平均分：{(sum3/rankData.length).toFixed(2)}  </div>
      {/* 调用原生Vtable组件展示信息 */}
      <Vtable data={rankData} width="1000px">
        <Vcolumn label="姓名" prop="name" width="100px"></Vcolumn>
        <Vcolumn label="年级" prop="grade" width="100px"></Vcolumn>
        <Vcolumn label="学号" prop="no" width="100px"></Vcolumn>
        <Vcolumn label="语文" prop="chinese" width="100px"></Vcolumn>
        <Vcolumn label="数学" prop="math" width="100px"></Vcolumn>
        <Vcolumn label="英语" prop="english" width="100px"></Vcolumn>
        <Vcolumn label="总分" prop="total" width="100px"></Vcolumn>
        <Vcolumn label="排名" prop="rank" width="100px"></Vcolumn>
      </Vtable>
    </div>
  }
}