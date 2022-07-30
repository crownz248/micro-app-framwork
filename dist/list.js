function Item(props) {
  return createElement("li", {
    className: "item",
    style: props.style
  }, props.children, "  ", createElement("a", {
    href: "#",
    onClick: props.onRemoveItem
  }, "X "));
}

module.exports = class List extends Component {
  setup(props) {
    console.log("setup");
    this.state = {
      list: [{
        text: 'aaa',
        color: 'pink'
      }, {
        text: 'bbb',
        color: 'orange'
      }, {
        text: 'ccc',
        color: 'yellow'
      }]
    };

    this.handleItemRemove = function (index) {
      // console.log("arguments: ",arguments, index)
      // this.setState({
      //     list: this.state.list.filter((item, i) => i !== index)
      // });
      this.state.list = this.state.list.filter((item, i) => i !== index);
    };

    this.handleAdd = function () {
      // console.log("arguments: ",arguments)
      console.log(this);
      this.state.list = [...this.state.list, {
        text: this.ref.input.value // text: '1111'

      }]; // this.setState(this.state);
    };
  }

  render() {
    return createElement("div", null, createElement("ul", {
      className: "list"
    }, this.state.list.map((item, index) => {
      return createElement(Item, {
        style: {
          background: item.color,
          color: this.state.textColor
        },
        onRemoveItem: () => this.handleItemRemove(index)
      }, item.text);
    })), createElement("div", null, createElement("input", {
      ref: ele => {
        this.ref.input = ele;
      }
    }), createElement("button", {
      onClick: () => this.handleAdd()
    }, "add")));
  }

};