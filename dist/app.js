// 动态加载grade组件
let Grade = require('grade.js');

module.exports = class App extends Component {
  setup(props) {
    this.state = {
      // table的数据，初始只有一条数据
      tableData: [{
        name: "cgz",
        grade: "高三",
        no: "1950638",
        chinese: 110,
        math: 140,
        english: 135
      }],
      // 是否展示成绩单
      showGrade: false
    }; // 添加新数据

    this.handleAdd = function () {
      // console.log(this.ref)
      this.state.tableData = [...this.state.tableData, {
        // 通过ref获取输入数据
        name: this.ref.name.value,
        grade: this.ref.grade.value,
        no: this.ref.no.value,
        // 成绩为Number
        chinese: this.ref.chinese.value == '' ? 0 : parseInt(this.ref.chinese.value),
        math: this.ref.math.value == '' ? 0 : parseInt(this.ref.math.value),
        english: this.ref.english.value == '' ? 0 : parseInt(this.ref.english.value)
      }]; // 将input全部清空

      this.ref.name.value = '';
      this.ref.no.value = '';
      this.ref.chinese.value = '';
      this.ref.math.value = '';
      this.ref.english.value = '';
    }; // 删除第index行


    this.deleteRow = function (targetIndex) {
      this.state.tableData = this.state.tableData.filter((item, index) => {
        return targetIndex !== index;
      });
    }; // 第index行上移


    this.upRow = function (index) {
      if (index > 0) {
        [this.state.tableData[index - 1], this.state.tableData[index]] = [this.state.tableData[index], this.state.tableData[index - 1]];
      }
    }; // 第index行下移


    this.downRow = function (index) {
      if (index < this.state.tableData.length - 1) {
        [this.state.tableData[index + 1], this.state.tableData[index]] = [this.state.tableData[index], this.state.tableData[index + 1]];
      }
    }; // 是否展示成绩单，将更新showGrade属性和gradeButton的文本


    this.showGradeChange = function () {
      if (this.state.showGrade) {
        this.state.showGrade = false;
        this.ref.gradeButton.innerText = "展示成绩单";
      } else {
        this.state.showGrade = true;
        this.ref.gradeButton.innerText = "关闭成绩单";
      }
    };
  } // 渲染


  render() {
    return createElement("div", null, createElement("h3", null, "\u539F\u59CB\u6210\u7EE9\u5355"), createElement("table", null, createElement("tr", null, createElement("th", {
      style: {
        width: "100px"
      }
    }, "\u59D3\u540D"), createElement("th", {
      style: {
        width: "100px"
      }
    }, "\u5E74\u7EA7"), createElement("th", {
      style: {
        width: "100px"
      }
    }, "\u5B66\u53F7"), createElement("th", {
      style: {
        width: "100px"
      }
    }, "\u8BED\u6587"), createElement("th", {
      style: {
        width: "100px"
      }
    }, "\u6570\u5B66"), createElement("th", {
      style: {
        width: "100px"
      }
    }, "\u82F1\u8BED"), createElement("th", null), createElement("th", null), createElement("th", null)), this.state.tableData.length == 0 ? createElement("tr", null, createElement("th", null, "\u7A7A"), createElement("th", null, "\u7A7A"), createElement("th", null, "\u7A7A"), createElement("th", null, "\u7A7A"), createElement("th", null, "\u7A7A"), createElement("th", null, "\u7A7A")) : null, this.state.tableData.map((item, index) => {
      return createElement("tr", null, createElement("th", null, item.name), createElement("th", null, item.grade), createElement("th", null, item.no), createElement("th", null, item.chinese), createElement("th", null, item.math), createElement("th", null, item.english), createElement("th", null, createElement("a", {
        href: "#",
        onClick: () => {
          this.deleteRow(index);
        }
      }, "\u5220\u9664")), createElement("th", null, createElement("a", {
        href: "#",
        onClick: () => {
          this.upRow(index);
        }
      }, "\u5411\u4E0A")), createElement("th", null, createElement("a", {
        href: "#",
        onClick: () => {
          this.downRow(index);
        }
      }, "\u5411\u4E0B")));
    })), createElement("h3", {
      style: {
        width: "100%"
      }
    }, "\u6DFB\u52A0\u6210\u7EE9"), createElement("input", {
      ref: ele => {
        this.ref.name = ele;
      },
      style: {
        width: "100px"
      }
    }), createElement(Vselect, {
      data: ['高一', '高二', '高三'],
      ref: ele => {
        this.ref.grade = ele;
      },
      style: {
        width: "100px"
      }
    }), createElement("input", {
      ref: ele => {
        this.ref.no = ele;
      },
      style: {
        width: "100px"
      }
    }), createElement("input", {
      ref: ele => {
        this.ref.chinese = ele;
      },
      style: {
        width: "100px"
      }
    }), createElement("input", {
      ref: ele => {
        this.ref.math = ele;
      },
      style: {
        width: "100px"
      }
    }), createElement("input", {
      ref: ele => {
        this.ref.english = ele;
      },
      style: {
        width: "100px"
      }
    }), createElement("button", {
      onClick: () => {
        this.handleAdd();
      }
    }, "\u6DFB\u52A0"), createElement("br", null), createElement("button", {
      ref: ele => {
        this.ref.gradeButton = ele;
      },
      onClick: () => {
        this.showGradeChange();
      }
    }, "\u5C55\u793A\u6210\u7EE9\u5355"), this.state.showGrade ? createElement("div", null, createElement(Grade, {
      data: this.state.tableData
    })) : null);
  }

};