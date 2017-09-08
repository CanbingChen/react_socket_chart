import React from "react";
import Component from "COMPONENTS/base/component";
import View from "COMPONENTS/base/view";
import {paramsObject,paramsString,changeBodyTile} from "UTILS";
import io from "socket.io-client";
const FADE_TIME = 150; // ms
const TYPING_TIMER_LENGTH = 400; // ms
const COLORS = [
  '#e21400', '#91580f', '#f8a700', '#f78b00',
  '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
  '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
];
let socket = io();
export default class Chart extends Component{
    constructor(props){
        super(props);
        this.state = {
            setUsername : false,
            username : ''
        };
        ['setUsername'].forEach((item)=>{
			this[item] = this[item].bind(this);
		});
    }

    componentWillMount(){

    }
    componentDidMount(){

    }
    componentWillUnmount(){

    }
    setUsername(event){
        console.log(event);
        socket.emit('add user', username);
    }
    render(){
        return (
            <ul className="pages">
              <li className="chat page">
                <div className="chatArea">
                  <ul className="messages"></ul>
                </div>
                <input className="inputMessage" placeholder="Type here..."/>
              </li>
              <li className="login page">
                <div className="form">
                  <h3 className="title">What's your nickname?</h3>
                  <input className="usernameInput" onKeyUp={this.setUsername} type="text" maxLength="14" />
                </div>
              </li>
            </ul>
        )
    }
}
