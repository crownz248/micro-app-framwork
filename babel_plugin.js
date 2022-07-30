module.exports = function (babel) {
  return {
      visitor: {
          JSXElement (path, statas) {
              const { node } = path
              const { types: t } = babel
              // console.log("\n\n\n\n",node.openingElement.attributes)
              for(let attr of node.openingElement.attributes){
                //ref属性
                if(attr.name.name === 'ref' ){
                  //编译成箭头函数的形式
                  let left = t.MemberExpression(t.MemberExpression(t.ThisExpression(),t.Identifier("ref")),t.Identifier(attr.value.value))
                  let assingment = t.AssignmentExpression('=',left,t.Identifier("ele"))
                  let arrowFunc = t.ArrowFunctionExpression([t.Identifier("ele")],t.BlockStatement([t.ExpressionStatement(assingment)]))
                  let expr = t.JSXExpressionContainer(arrowFunc)
                  attr.value = expr;
                }
                //v-for属性
                if(attr.name.name === 'v-for'){
                  //调用map函数，通过item和index来遍历list
                  const originalNode = node;
                  originalNode.openingElement.attributes=originalNode.openingElement.attributes.filter((attr)=>{return attr.name.name !== 'v-for'})
                  const arrowFunc = t.ArrowFunctionExpression([t.Identifier("item"),t.Identifier("index")],t.BlockStatement([t.ReturnStatement(originalNode)]))
                  const container = t.JSXExpressionContainer(t.CallExpression(t.MemberExpression(t.Identifier(attr.value.value),t.Identifier("map")),[arrowFunc]))
                  path.replaceWith(container) //替换当前节点
                }
                //v-if属性
                if(attr.name.name === 'v-if'){
                  const parentNode = path.parentPath.node;
                  const startIndex = parentNode.children.indexOf(node);
                  let endIndex = startIndex;
                  let currentNode = node;
                  currentNode.openingElement.attributes=currentNode.openingElement.attributes.filter((attr)=>{return attr.name.name !== 'v-if'})
                  //expr：condition?currentNode:null
                  let expr = t.ConditionalExpression(t.Identifier(attr.value.value),currentNode,t.NullLiteral())
                  const container = t.JSXExpressionContainer(expr)
                  //找到与该v-if同一层级的匹配的v-elif和v-else
                  while(currentNode = parentNode.children[++endIndex]){
                    let flag = false;
                    if(currentNode.type === 'JSXElement'){
                      for(let nodeAttr of currentNode.openingElement.attributes){
                        // v-elif
                        if(nodeAttr.name.name === 'v-elif'){
                          flag=true;  //继续向后匹配v-elif和v-else
                          currentNode.openingElement.attributes=currentNode.openingElement.attributes.filter((attr)=>{return attr.name.name !== 'v-elif'})
                          expr.alternate = t.ConditionalExpression(t.Identifier(nodeAttr.value.value),currentNode,t.NullLiteral())
                          expr = expr.alternate;                          
                          break;
                        }
                        // v-else
                        else if(nodeAttr.name.name === 'v-else'){
                          // 无需再向后匹配
                          currentNode.openingElement.attributes=currentNode.openingElement.attributes.filter((attr)=>{return attr.name.name !== 'v-else'})
                          expr.alternate = currentNode;
                          endIndex++;
                          break;
                        }
                      }
                      if(flag){
                        continue;
                      }
                    }
                    else if(currentNode.type === 'JSXText'){
                      // 纯文本节点，若为空格和换行，则忽略该节点，继续匹配
                      let reg = /[\n \t]*/;
                      if(currentNode.value.match(reg)){
                        continue;
                      }
                    }
                    break;
                  }
                  parentNode.children = parentNode.children.filter((item, index)=>{return !(startIndex<index && index<endIndex)})
                  path.parentPath.replaceWith(parentNode)
                  path.replaceWith(container) //替换当前节点
                }
              }
          }
      }
  }
}