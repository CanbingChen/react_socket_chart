import React from 'react';
const FOOTER_CONTENT = [{
	title : "如何查看VIN码",
	content : ['1.车辆行驶证车辆识别代码即为VIN码：', '2.车辆前挡风玻璃左下角(驾驶员)一侧可看到VIN码。']
}, {
	title : "VIN码示例",
	content : ['LGBL22E208Y001121']
}, {
	title : "支持品牌",
	content : ['奔驰', '更多品牌陆续支持中......']
}];
export default function Footer (){
	return <div className="footer">
		{FOOTER_CONTENT.map((item, index)=>{
			return <div key={index}>
				<h3>{item.title}</h3>
				<ul>
					{item.content.map((Item, i)=>{
						return <li key={i}>{Item}</li>
					})}
				</ul>
			</div>
		})}
	</div>
}
