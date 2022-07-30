// ��ȡApp
let App = require('app.js'); // ��ȡrootԪ��


let root = document.getElementById('root'); // ��Ⱦ

render(createElement(App, null), root); // let list =[1,2,3,4];
// let x=<div><div v-for="list"><span>{item}</span></div></div>;
// x=<div v-for="list"/>;
// {list.map((item,index)=>{<div></div>})} 
// let x=false;
// let xx=true;
// <div>
// <div v-if="x" />
// let x= <div>
// <div v-if="x1"></div>
// <div v-elif="x2" />
// <div v-else />
// </div>
// <div xxxxx></div>
// </div>