# micro-app-framwork

## 使用方法

安装apache、node

```shell
yum install httpd nodejs
apt-get install httpd nodejs
```

将该仓库git clone至/var/www/html目录下（或指定的apache目录下）

```shell
git clone https://github.com/crownz248/micro-app-framwork.git
```

安装nodejs依赖

```shell
npm install
```

编译源码，编译后的源码在dist文件夹下，若未对源码进行修改，可忽略该步骤

```shell
npm run build
```

通过apache服务直接访问index.html即可

## 小程序框架语法

### 组件声明

```js
class XXX extends Component {
    setup(props){
        this.state= {
            ... //state内容
        }
        this.func1 = function(){
            
        }
    }
    render(){
        return <div>
        	//JSX元素
        </div>
    }
    
}
```

组件需要继承Component组件，setup函数中进行组件的属性进行构造（包括state，需要使用的函数等），传入的参数props是声明该组件时的各项属性。需要注意的是，函数的定义必须写成function的形式，不能采用箭头函数的形式，这与小程序框架的双线程架构有关，若不遵守会出现报错。

### 主页声明

小程序的主页由App组件定义，需要在App.js中定义App组件，主页会调用App类来构造页面

### 条件渲染

语法为：

```js
<element v-if="condition">
    <children />
</element>
```

v-if属性的赋值为字符串，在编译时会编译成表达式，因此可以使用类似v-if = "this.state.tabelShow"的语句。除此之外还支持v-elif和v-else语句。

```js
<div v-if="x1" id="div1"></div>
<div v-elif="x2" id="div2" />
<div v-else id="div3" />
```

以上语句会被编译成

```js
x1?<div id="div1"></div>:x2?<div id="div2" />:<div id="div3" />
```

除此之外，可以用react的方式来实现条件渲染

### 循环

语法为：

```js
<div v-for="list">
    {index}: {item.text}
</div>
```

v-for属性的赋值为字符串，与v-if一样会被编译成表达式。循环将遍历list里的item，可以直接用item和index来取得当前遍历到的item和item在list中的序号。

以上语句会被编译成

```js
list.map((item, index) => {
  return <div>
    {index}: {item.text}
</div>
})
```

假设list为`[{text:"123"}, {text:"456"}, {text:"789"}, ]`

最终会渲染出dom：

```html
<div>
	0: 123
</div>
<div>
	1: 456
</div>
<div>
	2: 789
</div>
```

### 组件引用

声明自定义组件后，以自定义组件MyTable为例，可以直接使用如下语句来引用

```js
<MyTable tabledata={this.state.data}></MyTable>
```

自定义组件的属性（如上代码中的data）会以props的成员的形式传递到组建内部。在组建内部可以通过this.props.tabledata的形式访问。

### 跨文件引用

在apache中支持了类似nodejs的require。

若想引用不同js文件内的模组，可以用以下的形式来实现。

```js
// a.js
module.exports = class A extends Component {
 	...//声明组件   
}
//b.js
let A = require('a.js')
module.exports = class B extends Component {
 	render(){
        return <A></A>
    }
}
```

### ref

若想在组件内部访问某一html元素，可以使用ref属性

语法如下：

```js
<input ref="textinput"></input>
```

声明后可以在组件内部使用this.ref.textinput的形式来访问，可以实现读取和修改，对元素属性的修改可以反馈到html页面上。

注：因webworker的worker线程不能直接操纵dom元素，因此只能将html元素的重要属性提取到一个Object中传递到worker线程。

目前只支持：input的value，select的value，button的innerText。

## 原生组件

### Vtable

使用方式：

```js
<Vtable data={this.state.rankData} width="1000px" style={{...}}>
    <Vcolumn label="数学" prop="math" width="100px" style={{...}}></Vcolumn>
    <Vcolumn label="英语" prop="english"></Vcolumn>
	//可以添加更多Vcolumn
</Vtable>
```

Vtable的data属性和Vcolumn的label和prop属性是必需的。

Vtable的data属性是一个数组，每个item代表一行的数据。

Vcolumn的label属性的值为表头的内容，prop属性决定了该列将展示的数据名，比如prop="math"，则该列每一行将展示item['math']的值。



Vtable和Vcolumn的width和style属性都是可选的属性。

Vtable的width为整个表的宽度，style为渲染出的table元素的样式

Vcolum的width为该列的宽度，style为该列渲染出的对应th元素的样式



### Vselect

使用方式：

```js
<Vselect data={this.state.selectData} style={{...}}></Vselect>
```

data属性为待选项的值，为一个数组。数组中的元素代表一个option HTML元素。

数组中的每个元素可以是字符串或是Object。若是字符串，则option的label和value都是该字符串；若是Object，则该Object必须包含label和value属性，对应option元素的label和value。

















