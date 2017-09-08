import React from "react";
import Modal from "react-modal";
import Component from "COMPONENTS/base/component";
import View from "COMPONENTS/base/view";
import Liebiao from "SVGS/liebiao.svg?fill=#848484";
import Pingpu from "SVGS/pingpu.svg?fill=#848484";
import PropTypes from "prop-types";
import {disableScroll,enableScroll} from "UTILS/disable_scroll";
export default class Tab extends Component{
	constructor(props){
		super(props);
		this.state = {
			selectedItem : 0,
			positionTop : false,
			touchPageY : 0,
			eleTop : -1
		};
		["changeShowType","scrollHandler","touchHandler"].forEach((item,index)=>{
			this[item] = this[item].bind(this);
		});
	}
	selectTab(item, index){
		this.props.changeTab(index);
        let eleTop = this.state.eleTop === -1?this.elementOffsetTop() : this.state.eleTop ;
        if(document.body.scrollTop>=eleTop){
            window.scroll(0,eleTop);
        }
	}
	changeShowType(){
		this.props.changeShowType();
	}
	componentDidMount(){
		window.addEventListener("touchstart",this.touchHandler, false);
		window.addEventListener("touchmove",this.touchMoveHandler, false);
		window.addEventListener("scroll",this.scrollHandler, false);
	}
	componentWillUnmount(){
		window.removeEventListener("scroll", this.scrollHandler);
		window.removeEventListener("touchstart",this.touchHandler);
		window.removeEventListener("touchmove",this.touchMoveHandler);
        enableScroll();
	}
	touchHandler(e){
		const eleTop =this.state.eleTop === -1?this.elementOffsetTop():this.state.eleTop;
		if(e.touches[0].pageY<eleTop){
			disableScroll();
		}else{
			enableScroll();
		}
		this.setState({
			touchPageY : e.touches[0].pageY
		});
	}
	touchMoveHandler(e){

	}
	scrollHandler(e){
		const scrollTop =document.body.scrollTop;
		const eleTop =this.state.eleTop === -1?this.elementOffsetTop():this.state.eleTop;
		if(scrollTop>eleTop){
			this.element.style.position = "fixed";
			this.element.style.top = "0px";
            this.copyElement.style.display = "block";
			this.setState({
				eleTop : eleTop,
				positionTop : true
			});
		}else{
			this.setState({
				positionTop : false
			});
			this.copyElement.style.display = "none";
            	this.element.style.position = "relative";
		}
	}
	elementOffsetTop(){
		let actualTop = this.element.offsetTop;
		let current = this.element.offsetParent;
		while (current !== null){
	   	    actualTop += current.offsetTop;
	   	    current = current.offsetParent;
	   	}
		return actualTop;
	}
	renderTabs(){
		const {tabs,selectedIndex} = this.props;
		if(tabs){
			return tabs.map((item,index)=>{
				return <div key={index} className={this.classNames("swiper-slide",{"active":index===selectedIndex})} onClick={this.selectTab.bind(this,item,index)}>{item.structurePName}</div>;
			});
		}
	}
	render(){
		const {showType} = this.props;
		const {positionTop} = this.state;
		return(
			<div>
				<div className="tabs-block copy-block" ref={(element)=>{this.copyElement = element;}}>

				</div>
				<div className="tabs-block"  ref={(element)=>{this.element = element;}}>
					<div className="tabs" >
						<div className="change-block" onClick={this.changeShowType}>
							{!showType&&<svg viewBox={Liebiao.viewBox} onClick={this.changeShow}>
								<use xlinkHref={`#${Liebiao.id}`} />
							</svg>}
							{showType&&<svg viewBox={Pingpu.viewBox} onClick={this.changeShow}>
								<use xlinkHref={`#${Pingpu.id}`} />
							</svg>}
						</div>
						<div className="swiper-container">
				   			<div className="swiper-wrapper">
					   			{this.renderTabs()}
				   			</div>
			   			</div>
					</div>
				</div>
			</div>
		);
	}
}
Tab.propTypes = {
	showType : PropTypes.bool,
	tabs : PropTypes.array,
	changeTab : PropTypes.func,
	changeShowType : PropTypes.func
};
