/* main import  */
import ReactDOM from 'react-dom';
import createRoute from './routes';

/* less */
import 'LESS/main.less';

const MOUNT_NODE = document.getElementById('app');
ReactDOM.render(createRoute(), MOUNT_NODE);

if (module.hot) {
	module.hot.accept();
}
