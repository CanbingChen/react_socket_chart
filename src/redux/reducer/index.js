import { combineReducers } from 'redux';
import loanReducer from 'CONTAINER/LoanInfo/reducer';
import { reducer as formReducer } from 'redux-form'

// 返回的一个汇总的函数
const rootReducer = combineReducers({
    loanInfo: loanReducer,
	form: formReducer
});

export default rootReducer;