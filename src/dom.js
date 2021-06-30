window.dom = {
    //create(tagName) {
      //  return document.createElement(tagName);
      //dom.create = function(){}
      create(string){
          const container = document.createElement('template');// 因为这个容器是div，div里面是不能放td的，
          //有什么标签是可以放任意元素，而不出错：template:容纳任何内容，不会在页面中显示
          container.innerHTML = string.trim();//字符串要trim一下，不然有空格
          return container.content.firstChild;
    },
    after(node,node2){
        //node.parentNode.insertBefore(node.node2) //这样是可以把node2插到node前面，但是我们要做的是插到后面
        node.parentNode.insertBefore(node2, node.nextSibling);
    }, //在一个节点后面插入一个节点node2，新增弟弟节点
    before(node, node2){
        node.parentNode.insertBefore(node2, node);
    },//做一个接口，就是在前一个节点，这是默认支持的接口，新增哥哥节点
    append(parent,node){
        parent.appendChild(node);
    }, //新增加孩子
    wrap(node, parent){
        dom.before(node,parent)  //把parent放到node前面，eg：在div1和div2中间插入div3
        dom.append(parent,node)  //在把node放到parent里面，eg: 把div2删掉，放到div3里面
    }, 
    remove(node){
        node.parentNode.removeChild(node) //从爸爸这个节点删除这个儿子
        return node  //删的人还可以保持这个节点的引用
    },
    empty(node){   //给一个节点，把这个节点所有的儿子给干掉
        // node.innerHTML = "" 但是没办法获取节点的引用  
        // const {childNodes} = node
        const array = []
        let x = node.firstChild
        while(x){
            array.push(dom.remove(node.firstChild))
            x = node.firstChild  //这里的firstchild是之前第二个节点递阶上去，变成第一个儿子
        }
        return array
    },
    attr(node, name, value){          //过程叫做重载；接受一个节点，属性名，属性值
        if(arguments.length === 3){
            node.setAttribute(name,value)
        }else if(arguments.length === 2){
            return node.getAttribute(name)
        }         
      },
    text(node, string){  //这种写代码的方式叫适配，用于读写文本内容
        // console.log('innerText' in node) //检测innerText在不在Node里面，答：在
        if(arguments.length === 2){
            if('innerText' in node){
                node.innerText = string //ie
            }else{
                node.innerContent = string //firefox /chrome
            }
        }else if(arguments.length === 1){
            if('innerText' in node){
                return node.innerText //ie
            }else{
                return node.innerContent //firefox /chrome
            }
        }
    },
    html(node, string){  //改html;text和html完成了即可读，也可以写
        if(arguments.length === 2){  //如果参数长度为2，设置
            node.innerHTML = string
        }else if(arguments.length === 1){ //如果参数长度为1
            return node.innerHTML
        }        
    },
    style(node, name, value){ //如果name等于字符串
        if(arguments.length === 3){
            //dom.style(div, 'color', 'red') 把div的颜色改成红色;dom style三个参数
            node.style[name] = value
        }else if(arguments.length ===2) {
            if(typeof name === 'string'){
                //dome.style(div, 'color') 想获取div里面的color;dom style两个参数
                return node.style[name]
            }else if(name instanceof Object){
                //dom.style(div,{color:'red'}) dom style后面接一个对象
                const Object = name
                for(let key in Object){  //因为key可能是等于border,也可能是color
                    // node.style.border = ...
                    // node.style.color = ... 正常来说应该是这两行写的，但是因为border和color是变量，
                    //所以下一行代码的key要放在[]里面，没加[]，key会变成字符串
                    node.style[key] = Object[key]  //原本Object改成了name，name就是Object的对象
                } 
            }
  
        }
    },
    class:{  //class是个对象
        add(node, className){
            node.classList.add(className)
        },
        remove(node, className){
            node.classList.remove(className)
        },
        has(node, className){ //node里面有没有className，有的话就调用它
           return node.classList.contains(className)
        }//检查元素的类属性种是否存在指定的类值
    },
    on (node, eventName, fn){
        node.addEventListener(eventName, fn)
    },
    off(node, eventName, fn){
        node.addEventListener(eventName, fn)
    },
    find(selector, scope){   //给一个选择器;scope是范围的意思
        return (scope || document).querySelectorAll(selector) //如果有scope，就在里面查找，如果没有就再doc里面调用querySelectorAll
    },
    parent(node){  //获取爸爸元素
        return node.parentNode
    },
    children(node){  //获取子元素
        return node.children
    },
    siblings(node){  //获取兄弟姐妹，不能返回自己的
       return Array.from(node.parentNode.children)
       .filter(n => n !== node) //children是伪数组，所以要变成数组要加array.from;
       //filter+数组,filter对应每个节点，不等于传给我这个节点,这样就可以获取所有的兄弟姐们节点
    },
    next(node){ //获取s2的下一个节点
        let x = node.nextSibling
        while(x && x.nodeType ===3 ){ //如果x存在，且，x节点等于3,3是文本
            x = x.nextSibling   //让x等于s的下一个文本节点，一直这么循环，直到找到下一个节点不是文本
        } 
        return x
    },
    previous(node){  //查找上一个节点
        let x = node.previousSibling
        while(x && x.nodeType ===3 ){ //如果x存在，且，x节点等于3,3是文本
            x = x.previousSibling   //让x等于s的下一个文本节点，一直这么循环，直到找到下一个节点不是文本
        } 
        return x
    },
    each(nodeList, fn){  //给一个节点的列表，给一个函数
        for(let i = 0; i< nodeList.length; i++){
            fn.call(null, nodeList[i]) //调用fn，传的是this，没有this，this不传，传的第一个参数就是列表的第i个
        }//对节点的每一个函数进行调用
    },
    index(node){  //获取这个节点排行第几
        const list = dom.children(node.parentNode) //让列表等于获取爸爸的所有的儿子
        let i  //这样i的声明作用域就作用到return i了，i就可以拿到值了
        for(i = 0; i<list.length;i++){  //遍历这个列表
            if(list[i] === node){ //让列表的i跟节点匹配，如果等于这个节点，就停下来
                break
            }
        }
        return i
    }
};

