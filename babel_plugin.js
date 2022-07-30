module.exports = function (babel) {
  return {
      visitor: {
          JSXElement (path, statas) {
              const { node } = path
              const { types: t } = babel
              // console.log("\n\n\n\n",node.openingElement.attributes)
              for(let attr of node.openingElement.attributes){
                if(attr.name.name === 'ref' ){
                  // console.log(attr.value)
                  let left = t.MemberExpression(t.MemberExpression(t.ThisExpression(),t.Identifier("ref")),t.Identifier(attr.value.value))
                  let assingment = t.AssignmentExpression('=',left,t.Identifier("ele"))
                  let arrowFunc = t.ArrowFunctionExpression([t.Identifier("ele")],t.BlockStatement([t.ExpressionStatement(assingment)]))
                  let expr = t.JSXExpressionContainer(arrowFunc)
                  attr.value = expr;
                }
                if(attr.name.name === 'v-for'){
                  // console.log(attr,attr.name.name,attr.value.value)
                  // for(let keyAttr of node.openingElement.attributes){
                  //   if(keyAttr.name.name === 'key'){
                  //     let expr = t.JSXExpressionContainer(t.CallExpression(t.Identifier("eval"),[t.stringLiteral(keyAttr.value.value)]));
                  //     keyAttr.value = expr;
                  //   }
                  // }
                  const originalNode = node;
                  originalNode.openingElement.attributes=originalNode.openingElement.attributes.filter((attr)=>{return attr.name.name !== 'v-for'})
                  const arrowFunc = t.ArrowFunctionExpression([t.Identifier("item"),t.Identifier("index")],t.BlockStatement([t.ReturnStatement(originalNode)]))
                  const container = t.JSXExpressionContainer(t.CallExpression(t.MemberExpression(t.Identifier(attr.value.value),t.Identifier("map")),[arrowFunc]))
                  // const newDiv = t.JSXElement(t.JSXOpeningElement(t.JSXIdentifier("div"),[]),t.JSXClosingElement(t.JSXIdentifier("div")),[container])
                  path.replaceWith(container)
                }
                if(attr.name.name === 'v-if'){
                  // console.log(attr,attr.name.name,attr.value.value)
                  // const originalNode = node;
                  // originalNode.openingElement.attributes=originalNode.openingElement.attributes.filter((attr)=>{return attr.name.name !== 'v-for'})
                  // const arrowFunc = t.ArrowFunctionExpression([t.Identifier("item"),t.Identifier("index")],t.BlockStatement([t.ExpressionStatement(originalNode)]))
                  // const container = t.JSXExpressionContainer(t.CallExpression(t.MemberExpression(t.Identifier(attr.value.value),t.Identifier("map")),[arrowFunc]))
                  // const newDiv = t.JSXElement(t.JSXOpeningElement(t.JSXIdentifier("div"),[]),t.JSXClosingElement(t.JSXIdentifier("div")),[container])
                  // path.replaceWith(newDiv)
                  const parentNode = path.parentPath.node;
                  const startIndex = parentNode.children.indexOf(node);
                  // console.log(startIndex);
                  let endIndex = startIndex;
                  let currentNode = node;
                  currentNode.openingElement.attributes=currentNode.openingElement.attributes.filter((attr)=>{return attr.name.name !== 'v-if'})
                  let expr = t.ConditionalExpression(t.Identifier(attr.value.value),currentNode,t.NullLiteral())
                  const container = t.JSXExpressionContainer(expr)
                  while(currentNode = parentNode.children[++endIndex]){
                    // console.log(currentNode.type)
                    let flag = false;
                    if(currentNode.type === 'JSXElement'){
                      for(let nodeAttr of currentNode.openingElement.attributes){
                        console.log(nodeAttr.name.name)
                        if(nodeAttr.name.name === 'v-elif'){
                          flag=true;
                          currentNode.openingElement.attributes=currentNode.openingElement.attributes.filter((attr)=>{return attr.name.name !== 'v-elif'})
                          expr.alternate = t.ConditionalExpression(t.Identifier(nodeAttr.value.value),currentNode,t.NullLiteral())
                          expr = expr.alternate;                          
                          break;
                        }
                        else if(nodeAttr.name.name === 'v-else'){
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
                      // console.log(currentNode.value)
                      let reg = /[\n \t]*/;
                      if(currentNode.value.match(reg)){
                        continue;
                      }
                    }
                    break;
                  }
                  console.log(startIndex, endIndex)

                  parentNode.children = parentNode.children.filter((item, index)=>{return !(startIndex<index && index<endIndex)})
                  path.parentPath.replaceWith(parentNode)
                  path.replaceWith(container)
                }
              }
          }
      }
  }
}