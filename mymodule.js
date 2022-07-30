

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
  // console.log(filename.split('.'),extname)
  MyModule._extensions[extname](this,filename);

  this.loaded = true;

}


MyModule._extensions['.js'] = function(module, filename) {
  console.log(filename)
  let response = $.ajax({
    url: 'dist/' + filename,
    async: false,
  })
  // console.log(response)
  if(response.status == 200){
    let content = response.responseText;
    // console.log(content)
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

  // let compiledWrapper = vm.runInThisContext(wrapper, {
  //   filename, lineOffset: 0, displayErrors: true,
  // })
  compiledWrapper = eval(wrapper)
  // console.log(wrapper, compiledWrapper)
  compiledWrapper(this.exports, this.require, this);

  // console.log(this.exports,this.exports, this.require, this)

}

MyModule._extensions['.json'] = function (module, filename) {
  const content = fs.readFileSync(filename, 'utf8');
  module.exports = JSONParse(content);
}


const require = MyModule.prototype.require;

