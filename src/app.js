
let List = require('list.js');
let Grade = require('grade.js');

module.exports = class App extends Component {
    setup(props){
        this.state = {
            tableData: [{name:"cgz",grade:"高三",no:"1950638",chinese:110, math:140, english:135}],
            showGrade: false,
        }
        this.updataTable = function() {
            this.state.tableData = [
                ...this.state.tableData,
                {name:"abc", no:"1234567"}
            ]
            console.log(this.state)
        }
        this.getSelect = function() {
            console.log("select value:", this.ref.select.value)
        }
        this.handleAdd = function() {
            console.log(this.ref)
            this.state.tableData = [
                ...this.state.tableData,
                {
                    name:this.ref.name.value, 
                    grade:this.ref.grade.value,
                    no:this.ref.no.value,
                    chinese:this.ref.chinese.value==''?0:parseInt(this.ref.chinese.value),
                    math:this.ref.math.value==''?0:parseInt(this.ref.math.value),
                    english:this.ref.english.value==''?0:parseInt(this.ref.english.value),
                }
            ]
            this.ref.name.value = '';
            this.ref.no.value = '';
            this.ref.chinese.value = '';
            this.ref.math.value = '';
            this.ref.english.value = '';
            console.log(this.state.tableData,this.ref)
        }
        this.deleteRow = function(targetIndex) {
            this.state.tableData = this.state.tableData.filter((item,index)=>{
                return targetIndex !== index;
            })
        }
        this.upRow = function(index) {
            if(index>0){
                [this.state.tableData[index-1],this.state.tableData[index]] = [this.state.tableData[index],this.state.tableData[index-1]]
            }
        }
        this.downRow = function(index) {
            if(index<this.state.tableData.length-1){
                [this.state.tableData[index+1],this.state.tableData[index]] = [this.state.tableData[index],this.state.tableData[index+1]]
            }
        }
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

    render() {
        return <div>
            {/* <Vtable data={this.state.tableData}>
                <Vcolumn label="姓名" prop="name" width="200px" style={{background:"yellow"}}></Vcolumn>
                <Vcolumn label="学号" prop="no"></Vcolumn>
            </Vtable>
            <Vselect data={['1',{label:'二', value:'2'},'3']} style={{width:"100px"}} ref="select"></Vselect>
            <List textColor={'#000'}/>
            <button onClick={() => {this.updataTable(); this.getSelect();}}>add</button> */}
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
                <tr v-if="this.state.tableData.length == 0">
                    <th>空</th>
                    <th>空</th>
                    <th>空</th>
                    <th>空</th>
                    <th>空</th>
                    <th>空</th>
                </tr>
                <tr v-for="this.state.tableData">
                    <th>{item.name}</th>
                    <th>{item.grade}</th>
                    <th>{item.no}</th>
                    <th>{item.chinese}</th>
                    <th>{item.math}</th>
                    <th>{item.english}</th>
                    <th><a href="#" onClick={()=>{ this.deleteRow(index); }}>删除</a></th>
                    <th><a href="#" onClick={()=>{ this.upRow(index); }}>向上</a></th>
                    <th><a href="#" onClick={()=>{ this.downRow(index); }}>向下</a></th>
                </tr>                
            </table>
            <h3 style={{width:"100%"}}>
                添加成绩
            </h3>
            <input ref="name" style={{width:"100px"}}></input>
            <Vselect data={['高一','高二','高三']} ref="grade" style={{width:"100px"}}></Vselect>
            <input ref="no" style={{width:"100px"}}></input>
            <input ref="chinese" style={{width:"100px"}}></input>
            <input ref="math" style={{width:"100px"}}></input>
            <input ref="english" style={{width:"100px"}}></input>
            <button onClick={() => {this.handleAdd()}}>添加</button>
            <br/>
            <button ref="gradeButton" onClick={() => {this.showGradeChange()}}>展示成绩单</button>
            <div v-if="this.state.showGrade">
                <Grade data={this.state.tableData}></Grade>
            </div>
        </div>
    }
}



