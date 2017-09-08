import React from 'react';
import PropTypes from 'prop-types';

export default class PullMore extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loadText: '',
			loading: false,
		};

		this.scrollHandler = this.scrollHandler.bind(this);
	}

	componentDidMount() {
		window.addEventListener('scroll', this.scrollHandler, false);
	}
    componentWillReceiveProps(props){
        window.removeEventListener('scroll', this.scrollHandler);
        window.addEventListener('scroll', this.scrollHandler, false);
    }
	scrollHandler() {
		if (!this.props.canLoad) {
			this.setState({
				loadText: '没有更多数据'
			});
			window.removeEventListener('scroll', this.scrollHandler);
			return;
		}
		let pageYOffset = document.body.scrollTop;
		let clientHeight =
			document.documentElement.clientHeight || document.body.clientHeight;
		let offsetHeight = document.body.offsetHeight;
		if (offsetHeight - (pageYOffset + clientHeight) <= 100) {
			if (this.props.canLoad && !this.state.loading) {
				this.setState({
					loadText: '加载中...',
					loading: true
				});
				this.props.handleLoadMore().then(() => {
					this.setState({
						loadText: '上滑加载更多',
						loading: false,
					});
				});
			}
		}
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.scrollHandler);
	}

	render() {
		const {show} = this.props;
		return (
			<div className="content">
				{this.props.children}
				{show&&<div className="loading-bar">
					<p className="load-more">{this.state.loadText}</p>
				</div>}
			</div>
		);
	}
}

PullMore.propTypes = {
	handleLoadMore: PropTypes.func.isRequired,
	canLoad: PropTypes.bool.isRequired,
	show : PropTypes.bool
};
