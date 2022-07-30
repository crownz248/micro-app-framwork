// 判断是否为纯文本vdom
function isTextVdom(vdom) {
  return typeof vdom == 'string' || typeof vdom == 'number';
} // 判断是否为html元素vdom


function isElementVdom(vdom) {
  return typeof vdom == 'object' && typeof vdom.type == 'string';
} // 判断是否为组件vdom


function isComponentVdom(vdom) {
  return typeof vdom.type == 'function';
} // 首次渲染


const render = (vdom, parent = null) => {
  const mount = parent ? el => parent.appendChild(el) : el => el;

  if (isTextVdom(vdom)) {
    //纯文本vdom直接渲染
    return mount(document.createTextNode(vdom));
  } else if (isElementVdom(vdom)) {
    //html元素vdom渲染，需要渲染其子vdom并设置属性
    const dom = mount(document.createElement(vdom.type));

    for (const child of [].concat(...vdom.children)) {
      render(child, dom);
    }

    for (const prop in vdom.props) {
      setAttribute(dom, prop, vdom.props[prop]);
    }

    return dom;
  } else if (isComponentVdom(vdom)) {
    //组件vdom调用renderComponent渲染
    return renderComponent(vdom, parent);
  } else {
    throw new Error(`Invalid VDOM: ${vdom}.`);
  }
}; // 渲染组件


function renderComponent(vdom, parent) {
  // 更新props和children
  const props = Object.assign({}, vdom.props, {
    children: vdom.children
  });

  if (Component.isPrototypeOf(vdom.type)) {
    //继承自Component的组件
    const instance = new vdom.type(props);
    instance.componentWillMount(); //生命周期函数

    const componentVdom = instance.render();
    instance.dom = render(componentVdom, parent);
    instance.dom.__instance = instance;
    instance.dom.__key = vdom.props.key; // ref属性需要调用ref函数

    if (vdom.props.ref) {
      vdom.props.ref(instance.dom);
    }

    instance.componentDidMount(); //生命周期函数

    return instance.dom;
  } else {
    //函数定义的组件
    const componentVdom = vdom.type(props);
    return render(componentVdom, parent);
  }
} // 更新组件并重新渲染


function patch(dom, vdom, parent = dom.parentNode) {
  const replace = parent ? el => {
    parent.replaceChild(el, dom);
    return el;
  } : el => el;

  if (isComponentVdom(vdom)) {
    //组件vdom
    // 更新props和children
    const props = Object.assign({}, vdom.props, {
      children: vdom.children
    });

    if (dom.__instance && dom.__instance.constructor == vdom.type) {
      // 相同组件直接更新即可
      dom.__instance.componentWillReceiveProps(props);

      dom.__instance.props = props;
      return patch(dom, dom.__instance.render(), parent);
    } else if (Component.isPrototypeOf(vdom.type)) {
      // 另一继承自Component的自定义组件，需要首次渲染
      const componentDom = renderComponent(vdom, parent);

      if (parent) {
        parent.replaceChild(componentDom, dom);
        return componentDom;
      } else {
        return componentDom;
      }
    } else if (!Component.isPrototypeOf(vdom.type)) {
      // 由function定义的组件，直接更新即可
      return patch(dom, vdom.type(props), parent);
    }
  } else if (dom instanceof Text) {
    // 纯文本dom
    if (typeof vdom === 'object') {
      // 替换为其他非纯文本节点，需要首次渲染
      return replace(render(vdom, parent));
    } else {
      // 替换文本即可
      return dom.textContent != vdom ? replace(render(vdom, parent)) : dom;
    }
  } else if (dom.nodeName !== vdom.type.toUpperCase() && typeof vdom === 'object') {
    // html元素节点，与dom和vdom不同
    return replace(render(vdom, parent));
  } else if (dom.nodeName === vdom.type.toUpperCase() && typeof vdom === 'object') {
    // html元素节点，与dom和vdom相同，需要更新
    const active = document.activeElement;
    const oldDoms = {};
    [].concat(...dom.childNodes).map((child, index) => {
      const key = child.__key || `__index_${index}`;
      oldDoms[key] = child;
    });
    [].concat(...vdom.children).map((child, index) => {
      const key = child.props && child.props.key || `__index_${index}`;
      dom.appendChild(oldDoms[key] ? patch(oldDoms[key], child) : render(child, dom));
      delete oldDoms[key];
    });

    for (const key in oldDoms) {
      const instance = oldDoms[key].__instance;
      if (instance) instance.componentWillUnmount();
      oldDoms[key].remove();
    }

    for (const attr of dom.attributes) dom.removeAttribute(attr.name);

    for (const prop in vdom.props) setAttribute(dom, prop, vdom.props[prop]);

    active.focus();
    return dom;
  }
}

function isEventListenerAttr(key, value) {
  return typeof value == 'function' && key.startsWith('on');
}

function isStyleAttr(key, value) {
  return key == 'style' && typeof value == 'object';
}

function isPlainAttr(key, value) {
  return typeof value != 'object' && typeof value != 'function';
}

function isRefAttr(key, value) {
  return key === 'ref' && typeof value === 'function';
}

const setAttribute = (dom, key, value) => {
  if (isEventListenerAttr(key, value)) {
    // 事件监听
    const eventType = key.slice(2).toLowerCase();
    dom.__handlers = dom.__handlers || {};
    dom.removeEventListener(eventType, dom.__handlers[eventType]);
    dom.__handlers[eventType] = value;
    dom.addEventListener(eventType, dom.__handlers[eventType]);
  } else if (key == 'checked' || key == 'value' || key == 'className') {
    // 特殊属性，直接赋值
    dom[key] = value;
  } else if (isRefAttr(key, value)) {
    // ref属性，需要执行函数
    value(dom);
  } else if (isStyleAttr(key, value)) {
    // style属性，直接设置即可
    Object.assign(dom.style, value);
  } else if (key == 'key') {
    // key属性
    dom.__key = value;
  } else if (isPlainAttr(key, value)) {
    dom.setAttribute(key, value);
  }
}; // 创建属性，JSX元素编译后需要调用createElement方法


const createElement = (type, props, ...children) => {
  if (props === null) props = {}; // Object.keys(props).forEach(item => {
  //     if (props[item] === undefined || props[item] === null) delete obj[item]
  // })     

  return {
    type,
    props,
    children: children.filter(item => {
      return item !== null;
    })
  };
}; // 自定义组件的父类


class Component {
  constructor(props) {
    // 初始化props state ref
    this.props = props || {};
    this.state = {};
    this.ref = {}; // 调用子类的setup，默认不做任何事情

    this.setup(props); // 检查组件的特定属性

    for (let key of Object.getOwnPropertyNames(this)) {
      if (typeof this[key] === 'function') {
        // 函数类型的成员，需要进行包装，令其逻辑在逻辑层(worker)运行
        const func = this[key];

        let newFunc = function () {
          // 获取该函数的参数
          let params = [].concat(...arguments);
          let ref = {}; // 将ref的重要属性包装发送至worker

          Object.keys(this.ref).forEach(key => {
            let ele = this.ref[key];

            if (ele.nodeName === 'INPUT') {
              //input保留value
              ref[key] = {
                value: ele.value
              };
            } else if (ele.nodeName === 'SELECT') {
              //select保留value
              ref[key] = {
                value: ele.value
              };
            } else if (ele.nodeName === 'BUTTON') {
              //button保留innerText
              ref[key] = {
                innerText: ele.innerText
              };
            }
          }); // 设置eventMap，可以根据事件的编号获取组件的vdom

          eventMap.set(eventCount, this); // 发送state、ref、props、func、params、no给worker

          myWorker.postMessage({
            type: 'event',
            state: this.state,
            ref,
            props: this.props,
            func: func.toString(),
            params,
            no: eventCount
          });
          eventCount++;
        };

        this[key] = newFunc; //更新func
      }
    }
  } // 更新state，只在worker处理完逻辑层函数后调用，更新组件


  setState(nextState) {
    this.state = Object.assign(this.state, nextState);

    if (this.dom) {
      patch(this.dom, this.render());
    }
  } // 默认setup函数不做任何事


  setup(props) {} // 生命周期函数


  componentWillMount() {}

  componentDidMount() {}

  componentWillReceiveProps() {}

  componentWillUnmount() {}

} // 生成worker


let myWorker = new Worker('worker.js');
let eventMap = new Map();
let eventCount = 0; // 从worker收到信息

myWorker.onmessage = function (e) {
  // console.log("main receive", e.data)
  let data = e.data;

  if (data.type === 'event') {
    // event结束后返回
    // 获取组件，并从Map中删去
    let component = eventMap.get(data.no);
    eventMap.delete(data.no); // 更新组件

    component.setState(data.state); // 将修改后ref的属性更新到组件的dom上

    Object.keys(data.ref).forEach(key => {
      if (component.ref[key]) {
        Object.keys(data.ref[key]).forEach(attr => {
          component.ref[key][attr] = data.ref[key][attr];
        });
      }
    });
  }
};