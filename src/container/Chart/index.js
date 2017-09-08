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
            username : '',
            socketConnected : false,
            sendMessage : '',
            messagetList : [],
        };
        ['setUsername','sendMessage'].forEach((item)=>{
			this[item] = this[item].bind(this);
		});
    }

    componentWillMount(){
        socket.on('new message', function (data) {
          this.addChatMessage(data);
        });
        // Whenever the server emits 'user joined', log it in the chat body
        socket.on('user joined', function (data) {
          this.log(data.username + ' joined');
          this.addParticipantsMessage(data);
        });
        // Whenever the server emits 'user left', log it in the chat body
        socket.on('user left', function (data) {
          this.log(data.username + ' left');
          this.addParticipantsMessage(data);
          this.removeChatTyping(data);
        });
        // Whenever the server emits 'typing', show the typing message
        socket.on('typing', function (data) {
          this.addChatTyping(data);
        });
        // Whenever the server emits 'stop typing', kill the typing message
        socket.on('stop typing', function (data) {
          this.removeChatTyping(data);
        });
        socket.on('disconnect', function () {
          this.log('you have been disconnected');
        });
        socket.on('reconnect', function () {
          this.log('you have been reconnected');
          if (username) {
            socket.emit('add user', username);
          }
        });
        socket.on('reconnect_error', function () {
          this.log('attempt to reconnect has failed');
        });
    }
    componentDidMount(){

    }
    componentWillUnmount(){

    }
    setUsername(event){
        if(event.which === 13){
            this.setState({
                setUsername : true
            });
            // socket.emit('add user', this.state.username);
        }
        this.setState({
            username : event.target.value
        });
    }
    sendMessage(event){
        if(event.which === 13){
            if(this.socketConnected && this.state.sendMessage){
                socket.emit('new message', message);
                this.addChatMessage({
                    message : message,
                    username : this.state.username
                });
            }
        }
        this.setState({
            sendMessage : event.target.value.trim()
        });

    }
    addChatMessage(data){
        let messagetList = this.state.messagetList;
        messagetList.push(data);
        this.setState({
            messagetList : messagetList
        });
    }
    renderMessageList(){
        return this.state.messagetList.map((message) =>{
            return <div>
                <span className="username">{message.username}</span>
                <span className="message">{message.message}</span>
            </div>
        });
    }
    log(){
        return
    }
    render(){
        let {setUsername} = this.state;
        return (
            <ul className="pages">
              {setUsername&&<li className="chat page">
                <div className="chatArea">
                  <ul className="messages"></ul>
                </div>
                <input className="inputMessage" onKeyUp={this.sendMessage} placeholder="Type here..."/>
              </li>}
              {!setUsername&&<li className="login page">
                <div className="form">
                  <h3 className="title">What's your nickname?</h3>
                  <input className="usernameInput" onKeyUp={this.setUsername} type="text" maxLength="14" />
                </div>
              </li>}
            </ul>
        )
    }
}
