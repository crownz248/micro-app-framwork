// �Զ������
class Vtable extends Component {
  setup(props) {// console.log("vtable children",props.children)
  }

  render() {
    let cols = this.props.children.map((item, index) => {
      if (item.type !== Vcolumn) {
        throw new Error(`Invalid Column Type: ${item.type}.`);
      }

      return {
        prop: item.props.prop,
        label: item.props.label,
        style: {
          width: item.props.width,
          ...item.props.style
        }
      };
    }); // console.log(cols)

    this.state = {
      data: this.props.data,
      cols: cols,
      style: {
        width: this.props.width || "100%",
        ...this.props.style
      }
    };
    return createElement("table", {
      style: this.state.style
    }, createElement("tr", null, this.state.cols.map((col, index) => {
      console.log(col);
      return createElement("th", {
        style: col.style
      }, col.label);
    })), this.state.data.map((row, index) => {
      return createElement("tr", null, this.state.cols.map((col, index) => {
        return createElement("th", {
          style: col.style
        }, row[col.prop]);
      }));
    }));
  }

}

class Vcolumn extends Component {}

class Vselect extends Component {
  setup(props) {
    console.log("Vselect ", props);
  }

  render() {
    return createElement("select", {
      style: this.props.style
    }, this.props.data.map((item, index) => {
      let x = typeof item === 'object' ? item : {
        label: item,
        value: item
      };
      return createElement("option", {
        value: x.value
      }, x.label);
    }));
  }

}