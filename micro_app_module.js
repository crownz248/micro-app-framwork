

function MyModule(id = ''){
  this.id = id;
  this.exports = {};
  this.filename = null;
  this.loaded = false;
}


MyModule.prototype.require = function(id){
  return MyModule._load(id);
}

MyModule._cache = Object.create(null)
MyModule._extensions = Object.create(null);


MyModule._load = function(request){
  let filename = request;
  let cacheModule = MyModule._cache[filename]
  if(cacheModule !== undefined){
    return cacheModule.exports;
  }

  let module = new MyModule(filename);

  module.load(filename);

  return module.exports;

}


MyModule.prototype.load = function(filename){
  let splits = filename.split('.');
  let extname = '.'+splits[splits.length-1];
  MyModule._extensions[extname](this,filename);
  this.loaded = true;

}


MyModule._extensions['.js'] = function(module, filename) {
  // 同步ajax请求取回js文件
  let response = $.ajax({
    url: 'dist/' + filename,
    async: false,
  })
  if(response.status == 200){ // 编译js文件
    let content = response.responseText;
    module._compile(content, filename);
  }
  
}

MyModule.wrapper = [
  '(function (exports, require, module) { ',
  '\n});'
];


MyModule.wrap = function (script) {
  return MyModule.wrapper[0] + script + MyModule.wrapper[1];
};

MyModule.prototype._compile = function(content, filename){
  let wrapper = MyModule.wrap(content);

  compiledWrapper = eval(wrapper)
  compiledWrapper(this.exports, this.require, this);

}

MyModule._extensions['.json'] = function (module, filename) {
  const content = fs.readFileSync(filename, 'utf8');
  module.exports = JSONParse(content);
}


const require = MyModule.prototype.require;

