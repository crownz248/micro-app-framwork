module.exports = function (babel) {
  return {
      visitor: {
          JSXElement (path, statas) {
              const { node } = path
              const { types: t } = babel
              // console.log("\n\n\n\n",node.openingElement.attributes)
              for(let attr of node.openingElement.attributes){
                //ref����
                if(attr.name.name === 'ref' ){
                  //����ɼ�ͷ��������ʽ
                  let left = t.MemberExpression(t.MemberExpression(t.ThisExpression(),t.Identifier("ref")),t.Identifier(attr.value.value))
                  let assingment = t.AssignmentExpression('=',left,t.Identifier("ele"))
                  let arrowFunc = t.ArrowFunctionExpression([t.Identifier("ele")],t.BlockStatement([t.ExpressionStatement(assingment)]))
                  let expr = t.JSXExpressionContainer(arrowFunc)
                  attr.value = expr;
                }
                //v-for����
                if(attr.name.name === 'v-for'){
                  //����map������ͨ��item��index������list
                  const originalNode = node;
                  originalNode.openingElement.attributes=originalNode.openingElement.attributes.filter((attr)=>{return attr.name.name !== 'v-for'})
                  const arrowFunc = t.ArrowFunctionExpression([t.Identifier("item"),t.Identifier("index")],t.BlockStatement([t.ReturnStatement(originalNode)]))
                  const container = t.JSXExpressionContainer(t.CallExpression(t.MemberExpression(t.Identifier(attr.value.value),t.Identifier("map")),[arrowFunc]))
                  path.replaceWith(container) //�滻��ǰ�ڵ�
                }
                //v-if����
                if(attr.name.name === 'v-if'){
                  const parentNode = path.parentPath.node;
                  const startIndex = parentNode.children.indexOf(node);
                  let endIndex = startIndex;
                  let currentNode = node;
                  currentNode.openingElement.attributes=currentNode.openingElement.attributes.filter((attr)=>{return attr.name.name !== 'v-if'})
                  //expr��condition?currentNode:null
                  let expr = t.ConditionalExpression(t.Identifier(attr.value.value),currentNode,t.NullLiteral())
                  const container = t.JSXExpressionContainer(expr)
                  //�ҵ����v-ifͬһ�㼶��ƥ���v-elif��v-else
                  while(currentNode = parentNode.children[++endIndex]){
                    let flag = false;
                    if(currentNode.type === 'JSXElement'){
                      for(let nodeAttr of currentNode.openingElement.attributes){
                        // v-elif
                        if(nodeAttr.name.name === 'v-elif'){
                          flag=true;  //�������ƥ��v-elif��v-else
                          currentNode.openingElement.attributes=currentNode.openingElement.attributes.filter((attr)=>{return attr.name.name !== 'v-elif'})
                          expr.alternate = t.ConditionalExpression(t.Identifier(nodeAttr.value.value),currentNode,t.NullLiteral())
                          expr = expr.alternate;                          
                          break;
                        }
                        // v-else
                        else if(nodeAttr.name.name === 'v-else'){
                          // ���������ƥ��
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
                      // ���ı��ڵ㣬��Ϊ�ո�ͻ��У�����Ըýڵ㣬����ƥ��
                      let reg = /[\n \t]*/;
                      if(currentNode.value.match(reg)){
                        continue;
                      }
                    }
                    break;
                  }
                  parentNode.children = parentNode.children.filter((item, index)=>{return !(startIndex<index && index<endIndex)})
                  path.parentPath.replaceWith(parentNode)
                  path.replaceWith(container) //�滻��ǰ�ڵ�
                }
              }
          }
      }
  }
}