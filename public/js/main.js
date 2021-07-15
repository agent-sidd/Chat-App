const chatform = document.getElementById('my-chat-form')
const chatBox= document.querySelector('.chat-box')
const roomName =document.getElementById('room-name');
const userList = document.getElementById('users')
const  {username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix :true
}) 

//message from server
const socket = io();
//join room
socket.emit('joinRoom',{username, room });
//update the users in lobby
socket.on('roomUser',({room,users})=>{
  updateRoom(room);
  updateUsers(users);
})

//get those messages 
socket.on('message', (message) => {
  MessageRender(message);
  //sroll down everytime when we get meessage
chatBox.scrollTop = chatBox.scrollHeight ;
})
//when user send the data
chatform.addEventListener('submit', e=>{
  e.preventDefault();
 let msg = e.target.elements.msg.value;
 //emit the message to backend
socket.emit('chatMsg', msg)
e.target.elements.msg.value = '';
e.target.elements.msg.focus();
})
//dom render
function MessageRender(message){
 const div = document.createElement('div');
 div.classList.add('message');
 div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
 <p class="msg-data">${message.text}</p>`
 document.querySelector('.chat-box').appendChild(div);
}
//room nmae update
function updateRoom(room){

  roomName.innerText = room;
}
//update users
function updateUsers(users){
userList.innerHTML = `${users.map(user =>`<li>${user.username}</li>`).join('')}
`;
}