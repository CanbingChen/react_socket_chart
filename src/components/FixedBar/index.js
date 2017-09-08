import React from 'react';

/**
 * 计算元素的left和top值
 * @param  {[type]} node [description]
 * @return {[type]}      [description]
 */
function calulateWH(node) {
	var actualLeft = node.offsetLeft,
		actualTop = node.offsetTop,
		parent = node.offsetParent;
	while (parent) {
		actualLeft += parent.offsetLeft;
		actualTop += parent.offsetTop;
		parent = parent.offsetParent;
	}
	return {
		actualLeft: actualLeft,
		actualTop: actualTop
	};
}

function calculateScroll(el) {
	let w = el.offsetWidth,
		actualObj = calulateWH(el),
		actualTop = actualObj.actualTop;

	return function() {
		let scrollTop =
			document.body.scrollTop || document.documentElement.scrollTop;

		if (scrollTop > actualTop) {
			el.style.position = 'fixed';
			el.style.width = w + 'px';
			el.style.top = 0;
			el.style.left = '0px';
			el.style.zIndex = 9999999;
			el.style.boxShadow = '2px 2px 2px rgba(0, 0, 0, .2)';
		} else {
			el.style.position = 'relative';
			el.style.top = '0';
			el.style.left = '0px';
			el.style.zIndex = 1;
			el.style.boxShadow = '0 0 0 rgba(0, 0, 0, 0)';
		}
	};
}

export default class FixedBar extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.calculateScroll = calculateScroll(this.fixedBar);
		window.addEventListener('scroll', this.calculateScroll, false);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.calculateScroll, false);
	}

	render() {
		return (
			<div
				className="fixed-bar"
				ref={fixedBar => {
					this.fixedBar = fixedBar;
				}}
			>
				{this.props.children}
			</div>
		);
	}
}
