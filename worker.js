
let state = null;




self.addEventListener('message',async (e)=>{
  console.log("worker receive", e.data)
  let data = e.data;
  if(data.type==='event'){
    // console.log(func)
    let struct = {
      state: data.state,
      ref: data.ref,
      props: data.props,
      func: new Function('return '+data.func)(),      
    }
    console.log(struct)
    struct.func(...data.params)
    console.log(struct.state)   
    self.postMessage({type:'event', no: data.no, state: struct.state, ref:struct.ref}) 
  }
})

self.postMessage('hello from worker!');


// self.addEventListener('event',(e)=>{
//   console.log("worker receive", e.data)
// })
