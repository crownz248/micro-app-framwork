let App = require('app.js');

let root = document.getElementById('root');
render(createElement(App, null), root); // let list =[1,2,3,4];
// let x=<div v-for="list"><span>{item}</span></div>;
// x=<div v-for="list"/>;
// {list.map((item,index)=>{<div></div>})} 
// let x=false;
// let xx=true;
// <div>
// <div v-if="x" />
// <div v-if="x"></div>
// <div v-elif="xx" />
// <div v-else />
// <div xxxxx></div>
// </div>