module.exports = class Grade extends Component {
  render() {
    // console.log("Grade props:",this.props)
    // 求单个学生的平均分和总分
    let rankData = this.props.data.map((item, index) => {
      return { ...item,
        average: ((item.chinese + item.math + item.english) / 3).toFixed(2),
        total: item.chinese + item.math + item.english
      };
    }); // 根据总分排序

    rankData.sort((a, b) => {
      return b.total - a.total;
    });
    let sum = 0,
        sum1 = 0,
        sum2 = 0,
        sum3 = 0; // 求排名，并统计全班的三科总分和各科总分

    rankData = rankData.map((item, index) => {
      sum += item.total;
      sum1 += item.chinese;
      sum2 += item.math;
      sum3 += item.english;
      return { ...item,
        rank: index + 1
      };
    });
    console.log(rankData);
    return createElement("div", null, createElement("h3", null, "\u6210\u7EE9\u5355"), createElement("div", null, "\u603B\u4EBA\u6570\uFF1A", rankData.length), createElement("div", null, "\u5E73\u5747\u603B\u5206\uFF1A", (sum / rankData.length).toFixed(2), "  "), createElement("div", null, "\u8BED\u6587\u5E73\u5747\u5206\uFF1A", (sum1 / rankData.length).toFixed(2), "  \u6570\u5B66\u5E73\u5747\u5206\uFF1A", (sum2 / rankData.length).toFixed(2), "  \u82F1\u8BED\u5E73\u5747\u5206\uFF1A", (sum3 / rankData.length).toFixed(2), "  "), createElement(Vtable, {
      data: rankData,
      width: "1000px"
    }, createElement(Vcolumn, {
      label: "\u59D3\u540D",
      prop: "name",
      width: "100px"
    }), createElement(Vcolumn, {
      label: "\u5E74\u7EA7",
      prop: "grade",
      width: "100px"
    }), createElement(Vcolumn, {
      label: "\u5B66\u53F7",
      prop: "no",
      width: "100px"
    }), createElement(Vcolumn, {
      label: "\u8BED\u6587",
      prop: "chinese",
      width: "100px"
    }), createElement(Vcolumn, {
      label: "\u6570\u5B66",
      prop: "math",
      width: "100px"
    }), createElement(Vcolumn, {
      label: "\u82F1\u8BED",
      prop: "english",
      width: "100px"
    }), createElement(Vcolumn, {
      label: "\u603B\u5206",
      prop: "total",
      width: "100px"
    }), createElement(Vcolumn, {
      label: "\u6392\u540D",
      prop: "rank",
      width: "100px"
    })));
  }

};