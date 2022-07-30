// 自定义组件
class Vtable extends Component {
  setup(props){
    // console.log("vtable children",props.children)
  }

  render(){
    let cols = this.props.children.map((item,index)=>{
      if(item.type !== Vcolumn){
        throw new Error(`Invalid Column Type: ${item.type}.`);
      }
      return {
        prop: item.props.prop, 
        label: item.props.label, 
        style: {width: item.props.width, ...item.props.style},
      }
    })
    // console.log(cols)
    this.state = {
      data: this.props.data,
      cols: cols,
      style: {width: this.props.width || "100%", ...this.props.style},
    }
    return <table style={this.state.style}>
      <tr>
        {this.state.cols.map((col,index)=>{
          // console.log(col)
          return <th style={col.style}>
            {col.label}
          </th>
        })}
      </tr>
      {this.state.data.map((row,index)=>{
        return <tr>
          {this.state.cols.map((col,index)=>{
            return <th style={col.style}>
              {row[col.prop]}
            </th>
          })}
        </tr>
      })}
    </table>
  }

} 

class Vcolumn extends Component {}

class Vselect extends Component {
  setup(props){
    // console.log("Vselect ",props)
  }

  render() {
    return <select style={this.props.style}>
      {this.props.data.map((item,index)=>{
        let x = typeof item === 'object'?item:{label:item,value:item}
        return <option value={x.value}>
          {x.label}
        </option>
      })}
    </select>
  }

}

