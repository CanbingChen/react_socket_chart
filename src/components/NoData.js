import React from 'react';

const NoData = ({content}) => {
	return (
		<div className="no-data">
			<i></i>
			<p>{content}</p>
		</div>
	)
}

NoData.defaultProps = {
	content: '抱歉，暂无满足您需求的产品',
}

export default NoData;