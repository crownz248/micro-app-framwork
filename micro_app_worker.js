
let state = null;

// 收到信息
self.addEventListener('message',async (e)=>{
  // console.log("worker receive", e.data)
  let data = e.data;
  if(data.type==='event'){
    // 创建新对象struct，来模拟组件的运行环境，在func内可以直接用this.state来访问state
    let struct = {
      state: data.state,
      ref: data.ref,
      props: data.props,
      func: new Function('return '+data.func)(),      
    }
    // 运行func
    struct.func(...data.params)
    // 将结果返回值主线程
    self.postMessage({type:'event', no: data.no, state: struct.state, ref:struct.ref}) 
  }
})

// self.postMessage('hello from worker!');

