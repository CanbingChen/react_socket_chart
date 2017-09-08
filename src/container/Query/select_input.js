import Component from 'COMPONENTS/base/component';
import React from 'react';
import cancel from 'SVGS/cancel.svg?fill=#969696';
import PropTypes from 'prop-types';
export default class SelectInput extends Component{
	constructor(props){
		super(props);
		this.state = {
			inputFocus : false,
			inputValue : '',
		};
		['inputFocus', 'inputBlur', 'OnChange', 'selectOption', 'documentClick', 'cancelInput'].forEach((item)=>{
			this[item] = this[item].bind(this);
		});
	}
	inputFocus(e){
		e.nativeEvent.stopImmediatePropagation();
		this.setState({
			inputFocus : true,
		});
	}
	inputBlur(){
		this.setState({
			inputFocus : false,
		});
	}
	cancelInput(){
		this.input.value = '';
		this.props.change('');
		this.setState({
			inputValue : ''
		});
	}
	documentClick(){
		this.input.blur();
		this.setState({
			inputFocus : false,
		});
	}
	componentWillMount(){
		this.input = {value:''};
	}
	componentDidMount(){
		document.addEventListener('touchstart', this.documentClick);
	}
	componentWillUnmount() {
		document.removeEventListener('touchstart', this.documentClick);
	}
	OnChange(e){
		this.props.change(e.target.value);
		this.setState({
			inputValue : e.target.value
		});
	}
	selectOption(e){
		e.preventDefault();
		this.props.change(e.target.innerText);
		this.input.value = e.target.innerText;
		this.setState({
			inputFocus : false,
		});
	}
	renderSelect(){
		const {options} = this.props;
		const {inputFocus,inputValue} = this.state;
		const rege = new RegExp('^'+inputValue);
		return <ul className="select" >
			{options.length > 0 && inputFocus && options.map((item, index) =>{
				return rege.test(item)?<li className={this.classNames()} onTouchStart={this.selectOption} key={index}>{item}</li>:null
			})}
		</ul>
	}
	render(){
		const {option} = this.props;
		return (
			<div className="select-input">
				<div className="input-block">
					<label>{option.label}</label>
						<div className="input-content">
							<div className="input">
								<input placeholder={option.placeholder} ref={(input)=>{this.input = input}} type="text" onTouchStart={this.inputFocus} onChange={this.OnChange}/>
									{this.input.value && <svg viewBox={cancel.viewBox} onTouchStart={this.cancelInput}>
			                            <use xlinkHref={`#${cancel.id}`} />
			                        </svg>}
							</div>
						</div>
				</div>
				{this.renderSelect()}
			</div>
		)
	}
}
SelectInput.propTypes = {
	options : PropTypes.array,
	Change : PropTypes.func,
	option : PropTypes.object
}
