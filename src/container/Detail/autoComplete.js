import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DebounceInput from 'COMPONENTS/DebounceInput';


import searchIcon from 'SVGS/icon-fangdajing.svg?fill=#bfc1d9';
import cancelIcon from 'SVGS/cancel.svg?fill=#d4d4d4';
const defaultRenderFunc = () => {}; //eslint-disable-line
export default class AutoComplete extends Component {
	static propTypes = {
		onChange: PropTypes.func, // 内容改变的回调(value)
		onSelect: PropTypes.func, // 选中的回调(option)
		options: PropTypes.array.isRequired, // 选项
		isClearShow: PropTypes.bool, // 是否有清除填写的功能
		multiSection: PropTypes.bool, // 是否有多级标签
		inputProps: PropTypes.object, // 是否有多级标签
		autoHighlight: PropTypes.bool, // 是否有高亮功能
		getOptionValue: PropTypes.func, // 去得option的值的规则
		// (option, query) => string/ReactElement; query用来标识如何匹配option的内容高亮，默认完全匹配
		renderOption: PropTypes.func,
		noDataElement: PropTypes.object,
		menuStyle: PropTypes.object // 菜单栏样式
	};

	static defaultProps = {
		isClearShow: false,
		placeholder: '请输入配件名称',
		multiSection: false,
		autoHighlight: true,
		noDataElement: null,
		getOptionValue: option => option.id,
		renderOption: defaultRenderFunc,
		menuStyle: {},
		inputProps: {},
		onSelect: () => {} // eslint-disable-line
	};

	constructor(props) {
		super(props);
		this.renderOption = this.renderOption.bind(this);
        this.input = null;
	}

	renderOption(option) {
		const { value } = this.props;
		let liTag = this.props.autoHighlight
			? <li
					dangerouslySetInnerHTML={{
						__html: option.name.replace(
							value,
							`<span class="highlight">${value}</span>`
						)
					}}
				/>
			: <li>{option.name}</li>;
		return (
			<ul
				onClick={() => this.props.onSelect(option)}
				key={option.partsId}
				className="oem-option"
			>
				{liTag}
				<li>OEM: <span>{option.oem}</span></li>
			</ul>
		);
	}
    componentDidMount(){
        this.input.focus();
    }
	renderMenu() {
		if (this.props.multiSection) {
            const menu = this.props.options.map(section => {
				return (
					<div
						className="menu-section"
						key={section.typeName}
						style={this.props.menuStyle}
					>
						<div className="title">{section.typeName}</div>
						{section.result.map(option =>
							this.renderOption(option)
						)}
						<p className="place"></p>
					</div>
				);
			});
            menu.push(<p className="no-data">没有更多数据</p>);
			return menu;
		}
		return (
            <div>
                <div className="menu-section" style={this.props.menuStyle}>
    				{this.props.options.map(option => this.renderOption(option))}
    			</div>
                <p className="no-data">没有更多数据</p>
            </div>

		);
	}

	render() {
		return (
			<div className="auto-complete">
				<div className="complete-header">
					<div>
						<svg viewBox={searchIcon.viewBox} className="search">
							<use xlinkHref={`#${searchIcon.id}`} />
						</svg>
						<form action="/api/search_like" method="post">
							<input
                                ref={(element)=>{this.input = element}}
								{...this.props.inputProps}
								value={this.props.value}
								onChange={e => this.props.onChange(e.target.value)}
							/>
						</form>
						<svg
							viewBox={cancelIcon.viewBox}
							onClick={this.props.clearInput}
							className="cancel"
						>
							<use xlinkHref={`#${cancelIcon.id}`} />
						</svg>
					</div>
					<span onClick={this.props.onCancel}>取消</span>
				</div>
				{
					(this.props.value && this.props.options.length > 0) ?
					this.renderMenu() : (this.props.value && !this.props.isLoading) ?
					this.props.noDataElement : null
				}
			</div>
		);
	}
}
