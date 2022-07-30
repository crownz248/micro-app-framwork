
let state = null;

// �յ���Ϣ
self.addEventListener('message',async (e)=>{
  // console.log("worker receive", e.data)
  let data = e.data;
  if(data.type==='event'){
    // �����¶���struct����ģ����������л�������func�ڿ���ֱ����this.state������state
    let struct = {
      state: data.state,
      ref: data.ref,
      props: data.props,
      func: new Function('return '+data.func)(),      
    }
    // ����func
    struct.func(...data.params)
    // ���������ֵ���߳�
    self.postMessage({type:'event', no: data.no, state: struct.state, ref:struct.ref}) 
  }
})

// self.postMessage('hello from worker!');

