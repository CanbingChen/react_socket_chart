import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import apiService from 'SERVICE';
import './autoComplete.less';
import searchIcon from 'SVGS/icon-fangdajing.svg?fill=#bfc1d9';
import cancelIcon from 'SVGS/cancel.svg?fill=#d4d4d4';

const noDataElement = () => {
	return null;
}

const defaultRenderFunc = () => {}; //eslint-disable-line
class AutoComplete extends Component {
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
				key={option.oem}
				className="oem-option"
			>
				{liTag}
				<li>OEM: <span>{option.oem}</span></li>
			</ul>
		);
	}

	renderMenu() {
		if (this.props.multiSection) {
			return this.props.options.map(section => {
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
		}
		return (
			<div className="menu-section" style={this.props.menuStyle}>
				{this.props.options.map(option => this.renderOption(option))}
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
						<form action="">
							<input
								{...this.props.inputProps}
								value={this.props.value}
								onChange={this.props.onChange}
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
					this.renderMenu() : 
					this.props.noDataElement
				}
			</div>
		);
	}
}

export default class inputField extends Component {
	constructor() {
		super();
		this.state = {
			isSearchActive: false,
			value: '',
			options: [],
		};
		this.onChange = this.onChange.bind(this);
	}

	onChange(e) {
		this.setState({
			value: e.target.value
		});
		apiService.searchLike({
			paraStr: e.target.value
		}).then(data => {
			this.setState({
				options: data.searchResult
			})
		})
	}

	render() {
		return this.state.isSearchActive
			? <AutoComplete
					options={this.state.options}
					multiSection
					onCancel={() =>
						this.setState({
							isSearchActive: false
						})}
					autoHighlight={false}
					inputProps={{
						placeholder: '请输入配件名称',
						type: 'search'
					}}
					value={this.state.value}
					onChange={this.onChange}
					onSelect={option => this.props.history.push(`/detail?id=${option.oem}`)}
					clearInput={() => {
						this.setState({
							value: '',
							options: []
						});
					}}
					noDataElement={noDataElement}
				/>
			: <div onClick={() => this.setState({ isSearchActive: true })}>
					<span>请输入配件名称</span>
				</div>;
	}
}
