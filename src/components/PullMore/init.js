import Hammer from 'hammerjs';

const defaults = {
	contentEl: 'content',
	distance: 70,
}

const pan = {
	enbaled: false,
	distance: 0,
	startingPositionY: 0,
}
let options;

const _panStart = (e) => {
	pan.enabled = true;

}

const _panDown = (e) => {
	if ( ! pan.enabled || pan.distance === 0 ) {
		return;
	}
	e.preventDefault();
}

const _panUp = (e) => {
	if (!pan.enabled) {
		return;
	}
	e.preventDefault();
	let pageYOffset = document.body.scrollTop;
    let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
    let offsetHeight = document.body.offsetHeight;
    if (pageYOffset + clientHeight >= offsetHeight) {
		pan.distance = -(e.distance / 2.5);
		options.contentEl.style.transform = options.contentEl.style.webkitTransform = `translate3d(0, '${pan.distance}'px, 0)`;
	}
}

const _panEnd = (e) => {
	if (!pan.enabled) {
		return;
	}
	e.preventDefault();
	options.contentEl.style.transform = options.contentEl.style.webkitTransform = '';
	pan.enabled = false;
}


export default function init(params = {}) {
	options = {
		contentEl: params.contentEl || document.getElementById(defaults.contentEl),
		distance: params.distance || defaults.distance,
		hammerOptions: params.hammerOptions || {
			touchAction: "pan-y",
			preventDefault: true,
		}
	};

	let h = new Hammer(options.contentEl, options.hammerOptions);

	h.get('pan').set({
		direction: Hammer.DIRECTION_VERTICAL
	});

	h.on('panstart', _panStart);
	h.on('pandown', _panDown);
	h.on('panup', _panUp);
	h.on('panend', _panEnd);
}