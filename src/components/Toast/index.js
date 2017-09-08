import React, {
	Component
} from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import is from 'UTILS/is';

import 'LESS/base/toast.less';

const ICON_NAME = {
	success: 'success',
	error: 'error',
	warn: 'warn',
	loading: 'loading'
};

const TYPE_ARR = ['error', 'warn', 'success'];

const div = document.createElement('div');
document.body.appendChild(div);

class ToastComponent extends Component {
	static displayName = 'Toast';

	static defaultProps = {
		closeTimeoutMS: 1000000,
		msg: '提示信息不能为空',
		type: '',
		className: 'alert-modal-container',
		closeOnMask: true
	};

	constructor(props) {
		super(props);
		this.state = {
			isShow: true
		};

		this.timer = null;
		this.delayClose = this.delayClose.bind(this);
		this.clearToast = this.clearToast.bind(this);
		this.clear = this.clear.bind(this);
	}

	componentDidMount() {
		this.delayClose(this.props.closeTimeoutMS);
	}

	componentWillUpdate(nextProps) {
		this.delayClose(nextProps.closeTimeoutMS);
	}

	componentWillUnmount() {
		this.timer && clearTimeout(this.timer);
	}

	delayClose(closeTimeoutMS) {
		this.timer && clearTimeout(this.timer);
		if (closeTimeoutMS) {
			this.timer = setTimeout(this.clearToast, closeTimeoutMS);
		}
	}

	clearToast() {
		ReactDOM.unmountComponentAtNode(div);
		is.function(this.props.onClose) && this.props.onClose();
	}

	clear() {
		if (this.props.type === ICON_NAME.loading || !this.props.closeOnMask)
			return;
		this.clearToast();
	}

	render() {
		const {
			type,
			msg,
			className
		} = this.props;
		const {
			isShow
		} = this.state;

		const isLoading = type === ICON_NAME.loading;
		const iconClassName = classnames({
			'icon-tishi_chenggong': type === ICON_NAME.success,
			'icon-tishi_cuowu': type === ICON_NAME.error,
			'icon-tishi_tanhao': type === ICON_NAME.warn
		});

		if (!isShow) return null;
		return (
			<div className={className} onClick={this.clear}>
				<div className="modal-directive-mask" />
				{!isLoading &&
					<div className="alert-box">

						<p>{msg}</p>
					</div>}

				{isLoading &&
					/*<div className="loading-container">
						<div className="loading-mask" />
						<div className="loading-content">
							<div className="loading-cirle" />
							<div className="loading-round" />
							<div className="half-left two-quarters-circle" />
							<div className="half-right two-quarters-circle" />
						</div>
					</div>*/
					<div className="loading-svg">
						<svg className="circular" viewBox="25 25 50 50">
							<circle
								className="path"
								cx="50"
								cy="50"
								r="20"
								fill="none"
							/>
						</svg>
						<span>加载中</span>
					</div>}
			</div>
		);
	}
}

const toast = msg => {
	let config = is.object(msg) ? msg : { msg };
	const component = React.createElement(ToastComponent, config);
	ReactDOM.render(component, div);
};

toast.loading = () => {
	toast({
		type: 'loading',
		closeTimeoutMS: false
	});
};
toast.close = () => {
	ReactDOM.unmountComponentAtNode(div);
};
TYPE_ARR.forEach(type => {
	toast[type] = msg => {
		let config = is.object(msg) ? {
			...msg,
			type
		} : {
			type,
			msg
		};
		toast(config);
	};
});

/*
ref提供了一种对于react标准的数据流不太适用的情况下组件间交互的方式ref，
但react不建议在父组件中直接访问子组件的实例方法(ref)来完成某些逻辑，
在大部分情况下请使用标准的react数据流的方式来代替则更为清晰..
*/
// export const Toast = () => {
// 	return (<ToastComponent ref={toastInstance => {toast.instance = toastInstance}}/>)
// }

export default toast;
