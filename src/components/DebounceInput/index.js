import React from 'react';

const debounceFn = (fn, time) => {
	let timer;
	return function(value) {
		timer && clearTimeout(timer);
		timer = setTimeout(() => {
			timer && clearTimeout(timer);
			fn(value);
		}, time);
	}
}

const DebounceInput = (props) => {
	let { debounce, ...otherProps } = props;
	let onChange = debounce === false ? props.onChange : debounceFn(props.onChange, debounce)
	return <input {...otherProps} onChange={e => onChange(e.target.value)}/>
}

DebounceInput.defaultProps = {
	debounce: 500,
}

export default DebounceInput;