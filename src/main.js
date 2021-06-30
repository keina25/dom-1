// document.createElement('div')等同于下面两行，可以少写很多字母
//const div = dom.create('div');
//const span = dom.create('span')
// div.appendChild(span);  //加入span
const div = dom.create("<div>newDiv</div>"); //但是有bug，将内容改成<td>hi</td>,就出现undefine
console.log(div);  //因为这里没有引入div，所以需要去html做把JS引入进来

dom.after(test,div);

const div3 = dom.create('<div id = "parent"> </div>') //创建div3
dom.wrap(test, div3) //把div3包到test外面

const nodes = dom.empty(window.empty)
console.log(nodes)

dom.attr(test,'title','hi,I am XX') //attr是attribute缩写,改属性名
const title = dom.attr(test, 'title') //用attr这个属性获取这个title这个的属性，test,'title'属性放在const title变量里面
console.log(`title:${title}`)//这里的``是tap上面的符号

dom.text(test,'你好，这是新的内容') //设置div的文本内容为这个
dom.text(test)

dom.style(test, {border:'1px solid red',color:'blue'}) //有一个对象，key的节点是它的属性名和属性值
console.log(dom.style(test, 'border'))//参数两个，有可能设置，也有可能是读取
dom.style(test, 'border', '1px solid black')// 参数是三个的，就是设置

dom.class.add(test, 'red')//dom上面有个class，上面添加一个red
dom.class.add(test, 'blue')
dom.class.remove(test, 'blue') //删除掉这个红色
console.log(dom.class.has(test, 'blue')) //查是否有蓝色这个颜色

//test.addEventListener('click')原本要写这么长，改成如下写法
const fn = () =>{
    console.log('点击了')
}
dom.on(test, 'click', fn) //用于添加事件监听
dom.off(test, 'click', fn) //用于删除事件监听


const testDiv = dom.find('#test')[0]  //不获取第0个，会是个数组，而不是div;这里是引号''
// dom.find('.red', testDiv)  //这样就默认再test2里面找，而不是再test里面找了，testDiv是指定找的范围是什么
console.log(testDiv)
const test2 = dom.find('#test2')[0]
console.log(dom.find('.red', test2)[0])//这里获取到的是多个节点，所以要加个0

console.log(dom.parent(test))  //查找这个test的爸爸，就是空的div

const s2 = dom.find('#s2')[0]
console.log(dom.siblings(s2))//找到s2的所有兄弟姐妹的节点
console.log(dom.next(s2))  //查找s2的下一个节点,但是这样会出现回车，所有dom.js要加是否循环
console.log(dom.previous(s2))  //查找s2的上一个节点

const t = dom.find('#travel')[0]  //遍历的元素是t,没加0，返回的就是一个数组
dom.each(dom.children(t), (n) => dom.style(n,'color','red'))//遍历t的每一个子元素,对应每个元素进行站位n，每一个元素的颜色变成红色

console.log(dom.index(s2))  //查找s2排行第几