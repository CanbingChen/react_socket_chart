import React from 'react';
import Component from 'COMPONENTS/base/component';
import View from 'COMPONENTS/base/view';
import PropTypes from 'prop-types';
import {splitString} from 'UTILS';
export default class Parts extends Component{
	constructor(props){
		super(props);
	}
	changeState(id){
		this.props.history.push(`/parts?sid=${id}`);
	}
	render(){
		const {list,showType} = this.props;
		let spliceLength = showType?22:30;
		return (
			<div className={this.classNames({'tile':showType,'parts-block':!showType})} >
				{list.map((item,index)=>{
					return <div className={this.classNames('parts-item',{'left':index%2===0})} key={index} onClick={this.changeState.bind(this,item.sid)}>
						<h3>{splitString(item.name,spliceLength)}</h3>
                        <div className="img-block">
                            <img src={item.url}/>
                        </div>
					</div>}
				)}
			</div>
		)
	}
}
Parts.propTypes = {
	showType : PropTypes.bool,
	list : PropTypes.array,
};
