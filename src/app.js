// 动态加载grade组件
let Grade = require('grade.js');

module.exports = class App extends Component {
    setup(props){
        this.state = {
            // table的数据，初始只有一条数据
            tableData: [{name:"cgz",grade:"高三",no:"1950638",chinese:110, math:140, english:135}],
            // 是否展示成绩单
            showGrade: false,
        }
        // 添加新数据
        this.handleAdd = function() {
            console.log(this.ref)
            this.state.tableData = [
                ...this.state.tableData,
                {
                    // 通过ref获取输入数据
                    name:this.ref.name.value, 
                    grade:this.ref.grade.value,
                    no:this.ref.no.value,
                    // 成绩为Number
                    chinese:this.ref.chinese.value==''?0:parseInt(this.ref.chinese.value),
                    math:this.ref.math.value==''?0:parseInt(this.ref.math.value),
                    english:this.ref.english.value==''?0:parseInt(this.ref.english.value),
                }
            ]
            // 将input全部清空
            this.ref.name.value = '';
            this.ref.no.value = '';
            this.ref.chinese.value = '';
            this.ref.math.value = '';
            this.ref.english.value = '';
        }
        // 删除第index行
        this.deleteRow = function(targetIndex) {
            this.state.tableData = this.state.tableData.filter((item,index)=>{
                return targetIndex !== index;
            })
        }
        // 第index行上移
        this.upRow = function(index) {
            if(index>0){
                [this.state.tableData[index-1],this.state.tableData[index]] = [this.state.tableData[index],this.state.tableData[index-1]]
            }
        }
        // 第index行下移
        this.downRow = function(index) {
            if(index<this.state.tableData.length-1){
                [this.state.tableData[index+1],this.state.tableData[index]] = [this.state.tableData[index],this.state.tableData[index+1]]
            }
        }
        // 是否展示成绩单，将更新showGrade属性和gradeButton的文本
        this.showGradeChange = function(){
            if(this.state.showGrade){
                this.state.showGrade=false;
                this.ref.gradeButton.innerText="展示成绩单"
            }
            else{
                this.state.showGrade=true;
                this.ref.gradeButton.innerText="关闭成绩单"
            }
        }
    }

    // 渲染
    render() {
        return <div>
            <h3>原始成绩单</h3>
            <table>
                <tr>
                    <th style={{width:"100px"}}>姓名</th>
                    <th style={{width:"100px"}}>年级</th>
                    <th style={{width:"100px"}}>学号</th>
                    <th style={{width:"100px"}}>语文</th>
                    <th style={{width:"100px"}}>数学</th>
                    <th style={{width:"100px"}}>英语</th>
                    <th></th>
                    <th></th>
                    <th></th>
                </tr>
                {/* 若tableData内没有数据，则展示‘空’ */}
                <tr v-if="this.state.tableData.length == 0">
                    <th>空</th>
                    <th>空</th>
                    <th>空</th>
                    <th>空</th>
                    <th>空</th>
                    <th>空</th>
                </tr>
                {/* 使用v-for展示tableData的数据 */}
                <tr v-for="this.state.tableData">
                    <th>{item.name}</th>
                    <th>{item.grade}</th>
                    <th>{item.no}</th>
                    <th>{item.chinese}</th>
                    <th>{item.math}</th>
                    <th>{item.english}</th>
                    {/* 三个按钮，用于删除、向上和向下 */}
                    <th><a href="#" onClick={()=>{ this.deleteRow(index); }}>删除</a></th>
                    <th><a href="#" onClick={()=>{ this.upRow(index); }}>向上</a></th>
                    <th><a href="#" onClick={()=>{ this.downRow(index); }}>向下</a></th>
                </tr>                
            </table>
            <h3 style={{width:"100%"}}>
                添加成绩
            </h3>
            {/* 输入要添加的数据 */}
            <input ref="name" style={{width:"100px"}}></input>
            <Vselect data={['高一','高二','高三']} ref="grade" style={{width:"100px"}}></Vselect>
            <input ref="no" style={{width:"100px"}}></input>
            <input ref="chinese" style={{width:"100px"}}></input>
            <input ref="math" style={{width:"100px"}}></input>
            <input ref="english" style={{width:"100px"}}></input>
            <button onClick={() => {this.handleAdd()}}>添加</button>
            <br/>
            {/* 是否展示成绩单 */}
            <button ref="gradeButton" onClick={() => {this.showGradeChange()}}>展示成绩单</button>
            <div v-if="this.state.showGrade">
                {/* 调用自定义的Grade组件，数据为tableData */}
                <Grade data={this.state.tableData}></Grade>
            </div>
        </div>
    }
}



