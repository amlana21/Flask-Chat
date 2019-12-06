console.log('loaded')

const usrname=localStorage.getItem('flackuser')
const persistchannel=localStorage.getItem('storedchannel')
$('#chat').attr('disabled','disabled')
$('.btn1').attr('disabled','disabled')
//socket
const socket=io()
let directmsgFlag='N'
let directtorecip=''
socket.emit('loggedin',{user:usrname},(msg)=>{
    if(msg=='exist'){
        alert('Already Logged in..Please signout.')
        localStorage.removeItem('flackuser')
        return window.location.assign('/')
    }
    console.log(`This is:${msg}`)
})
// const msgtempl=document.querySelector('#msg-template').innerHTML
// const listtempl=document.querySelector('#list-template').innerHTML
const listdiv=document.querySelector('#listedmsg')
const $msglist=document.querySelector('#msglist')
const url=`${window.location.protocol}//${window.location.host}`

//function to transform the message
const transformMsg=(msgtxt)=>{
    return {
        messageTxt:msgtxt,
        created:new Date().getTime()
    }
}

//function to query channels
const queryChannels=async ()=>{
    let chanls=[]
    let url=`${window.location.protocol}//${window.location.host}`
    const channels=await fetch(`${url}/loadchannels/${usrname}`,{
        method:'GET'
    })
    const chnlOut=await channels.json()
    

    chanls=chnlOut.channels
    return chanls
}

//function to query online users
const querySessions=async ()=>{
    sessions=[]
    let url=`${window.location.protocol}//${window.location.host}`
    const sessionout=await fetch(`${url}/getsessions/${usrname}`)
    const sessionjson=await sessionout.json()
    sessions=sessionjson.sessions
    return sessions
}

$('#logoutlink').click(async ()=>{
    localStorage.removeItem('flackuser')
    // const logoutresp=await fetch(`${url}/delsession/${usrname}`)
    socket.close()
    window.location.assign('/')
})


//display channels in sidebar
let chnlcombo=[]
queryChannels().then(async (channl)=>{
    console.log(channl)
    const msgTbl=$('#msgtbl')
    channl.forEach((ch)=>{
            chnlcombo.push(ch.channelname)
            let msgrw=`<tr><td>${ch.channelname}</td></tr>`
            msgTbl.append(msgrw)
        })

    
        if(persistchannel){
            console.log(`Persisted:${persistchannel}`)
            let dmsgtble=document.getElementById('msgtbl')
            let n=0
            console.log(dmsgtble.rows)
            let arry=dmsgtble.rows
            for(let i=0;i<=dmsgtble.rows.length-1;i++){
                console.log(dmsgtble.rows[i].textContent)
                if(persistchannel===dmsgtble.rows[i].textContent){
                    dmsgtble.rows[i].classList.add('clicked')
                    chnnelName=dmsgtble.rows[i].textContent
                        }
            }

            //display messages
            directmsgFlag='N'
    // console.log($(this).text())
    $('.messagesection').show()
    if(!(chnnelName==='')){
        console.log('in loop and '+chnnelName)
        socket.emit('leave',{username:usrname,room:chnnelName})
        socket.on('left',(msg)=>{
            console.log(msg)
        })
    }
    
    // chnnelName=$(this).text()
    localStorage.setItem('storedchannel',chnnelName)
    console.log(localStorage.getItem('storedchannel'))
    try{
        const msgs=await fetch (`${url}/loadmessages?username=${usrname}&channel=${chnnelName}`)
        const msgJson=await msgs.json()
        console.log(msgJson)
        let msgtble=document.getElementById('listedmsgs')
        if (msgtble.rows.length!=0){
            while(msgtble.hasChildNodes())
                {
                    msgtble.removeChild(msgtble.firstChild);
                }
        }
        let rwcnt=0
        let toppad=78
        let rwnum=0
        msgJson.messages.forEach((msg)=>{
            console.log(`Returned message:${msg.createdAt}`)
            let row1=msgtble.insertRow(rwcnt)
            let cell1=row1.insertCell(0)
            // let trnsMsg=transformMsg(cht.message)
            
            // cell1.innerHTML=`<td><span class="badge badge-pill badge-dark">${moment(msg.createdAt).format('MMM Do YY h:mm:ss a')}</span></br>:${msg.frm}:${msg.msgtxt}</td>`
            let flexdiv=`<div class="d-flex">
            <div class="p-2 bg-info"><strong>${msg.frm}</strong></div>
            <div class="p-2 bg-secondary flex-grow-1"><p>${msg.msgtxt}</p></div>
          </div>`
            cell1.innerHTML=`<td><span class="badge badge-pill badge-dark">${moment(msg.createdAt).format('MMM Do YY h:mm:ss a')}</span></br>${flexdiv}</td>`
            if(rwcnt!=0){
                toppad=toppad-5
                if(toppad>=0){
                    
                    msgtble.style.top=`${toppad}%`
                }
            }else if(rwcnt===0){
                msgtble.style.top=`${toppad}%`
            }
            rwcnt++
        })

        //scroll down
        const scrlelement = document.getElementById("msglist");
        scrlelement.scrollTop = scrlelement.scrollHeight;

        socket.emit('join',{username:usrname,room:chnnelName})
        socket.on('joined',(msg)=>{
            console.log(msg)
        })
    }catch(e){
        console.log(e)
    }
        
        }

    // var table = document.getElementById("msgtbl");
    // channl.forEach((ch)=>{
    //     chnlcombo.push(ch.channelname)
    //     var row = table.insertRow(3);
    //     var cell1 = row.insertCell(0);
    //     cell1.innerHTML = `${ch.channelname}`
    // })
    document.querySelector('#listedmsg').style.display='block'     
    
}).catch((e)=>{
    console.log(e)
})


//display online users
querySessions().then((session)=>{
    const usertbl=$('#onemsgtbl')
    session.forEach((s)=>{
        let trow1=`<tr><td>${s.username}</td></tr>`
        usertbl.append(trow1)
    })
}).catch((e)=>{
    console.log(e)
})

//-------------------default load channel messages

// $('#msgtbl').load( async function() {
//     console.log('aaddd')
//     if(persistchannel){
//         // event.stopImmediatePropagation()
//         // event.preventDefault()
//         console.log(`Persisted:${persistchannel} and text is ${$(this).text()}`)
//     }

// })



let chnnelName=''
//display messages
$('#msgtbl').off().on('click', 'tbody tr', async function(event) {
    event.stopImmediatePropagation()
    event.preventDefault()
    console.log($(this).parent().children().removeClass('clicked'))
    $('#chat').removeAttr('disabled')
    $('.btn1').removeAttr('disabled')
    $('#chat').val('')
    $(this).addClass('clicked')
    console.log(chnnelName==='')
    directmsgFlag='N'
    // console.log($(this).text())
    $('.messagesection').show()
    if(!(chnnelName==='')){
        console.log('in loop and '+chnnelName)
        socket.emit('leave',{username:usrname,room:chnnelName})
        socket.on('left',(msg)=>{
            console.log(msg)
        })
    }
    
    chnnelName=$(this).text()
    localStorage.setItem('storedchannel',chnnelName)
    console.log(localStorage.getItem('storedchannel'))
    try{
        const msgs=await fetch (`${url}/loadmessages?username=${usrname}&channel=${chnnelName}`)
        const msgJson=await msgs.json()
        console.log(msgJson)
        let msgtble=document.getElementById('listedmsgs')
        if (msgtble.rows.length!=0){
            while(msgtble.hasChildNodes())
                {
                    msgtble.removeChild(msgtble.firstChild);
                }
        }
        let rwcnt=0
        let toppad=78
        let rwnum=0
        msgJson.messages.forEach((msg)=>{
            console.log(`Returned message:${msg.createdAt}`)
            let row1=msgtble.insertRow(rwcnt)
            let cell1=row1.insertCell(0)
            // let trnsMsg=transformMsg(cht.message)
            
            // cell1.innerHTML=`<td><span class="badge badge-pill badge-dark">${moment(msg.createdAt).format('MMM Do YY h:mm:ss a')}</span></br>:${msg.frm}:${msg.msgtxt}</td>`
            let flexdiv=`<div class="d-flex">
            <div class="p-2 bg-info"><strong>${msg.frm}</strong></div>
            <div class="p-2 bg-secondary flex-grow-1"><p>${msg.msgtxt}</p></div>
          </div>`
            cell1.innerHTML=`<td><span class="badge badge-pill badge-dark">${moment(msg.createdAt).format('MMM Do YY h:mm:ss a')}</span></br>${flexdiv}</td>`
            if(rwcnt!=0){
                toppad=toppad-5
                if(toppad>=0){
                    
                    msgtble.style.top=`${toppad}%`
                }
            }else if(rwcnt===0){
                msgtble.style.top=`${toppad}%`
            }
            rwcnt++
        })

        //scroll down
        const scrlelement = document.getElementById("msglist");
        scrlelement.scrollTop = scrlelement.scrollHeight;

        socket.emit('join',{username:usrname,room:chnnelName})
        socket.on('joined',(msg)=>{
            console.log(msg)
        })
    }catch(e){
        console.log(e)
    }
})





$('#chat').keydown(async function (e) {
    // e.preventDefault()

    if (e.ctrlKey && e.keyCode == 13) {
        // e.preventDefault()
        // $(this.form).submit()
        // e.preventDefault()
        // return false
    let msgtxt=$(this).val()
    if(msgtxt==='' || !msgtxt){
        return alert('Please type a message!!')
    }
    let transformed_msg=transformMsg(msgtxt)
    console.log(transformed_msg)
    if (directmsgFlag==='N'){
        //--------------------------------for channel messages------
        const chatout=await fetch(`${url}/sendmessage`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                username:usrname,
                messagetxt:msgtxt,
                channelname:chnnelName
            })
        })
        //const chatJson=await chatout.json()
        socket.emit('sendmsg',{username:usrname,room:chnnelName,msgTxt:msgtxt,created:transformed_msg.created})
        let tbl1=document.getElementById('listedmsgs')
        let topstr=tbl1.style.top.toString()
        let topval=topstr.substr(0,topstr.length-1)
        console.log(topval)
        let lngth=tbl1.rows.length
        console.log(lngth)
        let tblrw=tbl1.insertRow(lngth)
        let cellrw=tblrw.insertCell(0)
        let flexdiv=`<div class="d-flex">
                <div class="p-2 bg-info"><strong>${usrname}</strong></div>
                <div class="p-2 bg-secondary flex-grow-1">${msgtxt}</div>
              </div>`
              
        // cellrw.innerHTML=`<td>${moment(transformed_msg.created).format('MMM Do YY h:mm:ss a')}:${usrname}:${msgtxt}</td>`
        cellrw.innerHTML=`<td><span class="badge badge-pill badge-dark">${moment(transformed_msg.created).format('MMM Do YY h:mm:ss a')}</span></br>${flexdiv}</td>`
        if(!topval){
            topval=78
        }else{
            topval=topval-5
        }
        
        if(topval>=0){                    
            tbl1.style.top=`${topval}%`
        }
    
        //scroll down
        const scrlelement = document.getElementById("msglist");
        scrlelement.scrollTop = scrlelement.scrollHeight;
        $('#chat').val('')
    }else{
        console.log('in another loop')
        //----------------------------send direct
        // $('#sendmsg').addClass('directmsgform')
        // //send direct
        // const dirsendform=document.querySelector('.directmsgform')
        // dirsendform.addEventListener('submit',async (e)=>{
        // e.preventDefault()
        // e.stopImmediatePropagation()
        // let msgtxt=e.target.elements.chat.value
        // let transformed_msg=transformMsg(msgtxt)
        console.log(transformed_msg)
        const chatout=await fetch(`${url}/senddirect/${usrname}`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                to:directtorecip,
                msg:msgtxt
                // channelname:chnnelName
            })
        })
        //const chatJson=await chatout.json()
        //socket.emit('directjoin',{username:usrname,room:curUserName})
        socket.emit('senddirectmsg',{username:usrname,room:directtorecip,msgTxt:msgtxt,created:transformed_msg.created})
        let tbl1=document.getElementById('listedmsgs')
        let topstr=tbl1.style.top.toString()
        let topval=topstr.substr(0,topstr.length-1)
        console.log(topval)
        let lngth=tbl1.rows.length
        console.log(lngth)
        let tblrw=tbl1.insertRow(lngth)
        let cellrw=tblrw.insertCell(0)
        let flexdiv=`<div class="d-flex">
            <div class="p-2 bg-info"><strong>${usrname}</strong></div>
            <div class="p-2 bg-secondary flex-grow-1">${msgtxt}</div>
            </div>`
  
        // cellrw.innerHTML=`<td>${moment(transformed_msg.created).format('MMM Do YY h:mm:ss a')}:${usrname}:${msgtxt}</td>`
        cellrw.innerHTML=`<td><span class="badge badge-pill badge-dark">${moment(transformed_msg.created).format('MMM Do YY h:mm:ss a')}</span></br>${flexdiv}</td>`
        if(!topval){
            topval=78
        }else{
            topval=topval-5
        }

        if(topval>=0){                    
            tbl1.style.top=`${topval}%`
        }

        //scroll down
        const scrlelement = document.getElementById("msglist");
        scrlelement.scrollTop = scrlelement.scrollHeight;

        $('#chat').val('')


    // })
    }


    }
  })


//send message
const sendform=document.querySelector('#sendmsg')
sendform.addEventListener('submit',async (e)=>{
    e.preventDefault()
    e.stopImmediatePropagation()
    let msgtxt=e.target.elements.chat.value
    let transformed_msg=transformMsg(msgtxt)
    console.log(transformed_msg)
    if (directmsgFlag==='N'){
        //--------------------------------for channel messages------
        const chatout=await fetch(`${url}/sendmessage`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                username:usrname,
                messagetxt:msgtxt,
                channelname:chnnelName
            })
        })
        //const chatJson=await chatout.json()
        socket.emit('sendmsg',{username:usrname,room:chnnelName,msgTxt:msgtxt,created:transformed_msg.created})
        let tbl1=document.getElementById('listedmsgs')
        let topstr=tbl1.style.top.toString()
        let topval=topstr.substr(0,topstr.length-1)
        console.log(topval)
        let lngth=tbl1.rows.length
        console.log(lngth)
        let tblrw=tbl1.insertRow(lngth)
        let cellrw=tblrw.insertCell(0)
        let flexdiv=`<div class="d-flex">
                <div class="p-2 bg-info"><strong>${usrname}</strong></div>
                <div class="p-2 bg-secondary flex-grow-1">${msgtxt}</div>
              </div>`
              
        // cellrw.innerHTML=`<td>${moment(transformed_msg.created).format('MMM Do YY h:mm:ss a')}:${usrname}:${msgtxt}</td>`
        cellrw.innerHTML=`<td><span class="badge badge-pill badge-dark">${moment(transformed_msg.created).format('MMM Do YY h:mm:ss a')}</span></br>${flexdiv}</td>`
        if(!topval){
            topval=78
        }else{
            topval=topval-5
        }
        
        if(topval>=0){                    
            tbl1.style.top=`${topval}%`
        }
    
        //scroll down
        const scrlelement = document.getElementById("msglist");
        scrlelement.scrollTop = scrlelement.scrollHeight;
        $('#chat').val('')
    }else{
        console.log('in another loop')
        //----------------------------send direct
        // $('#sendmsg').addClass('directmsgform')
        // //send direct
        // const dirsendform=document.querySelector('.directmsgform')
        // dirsendform.addEventListener('submit',async (e)=>{
        // e.preventDefault()
        // e.stopImmediatePropagation()
        // let msgtxt=e.target.elements.chat.value
        // let transformed_msg=transformMsg(msgtxt)
        console.log(transformed_msg)
        const chatout=await fetch(`${url}/senddirect/${usrname}`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                to:directtorecip,
                msg:msgtxt
                // channelname:chnnelName
            })
        })
        //const chatJson=await chatout.json()
        //socket.emit('directjoin',{username:usrname,room:curUserName})
        socket.emit('senddirectmsg',{username:usrname,room:directtorecip,msgTxt:msgtxt,created:transformed_msg.created})
        let tbl1=document.getElementById('listedmsgs')
        let topstr=tbl1.style.top.toString()
        let topval=topstr.substr(0,topstr.length-1)
        console.log(topval)
        let lngth=tbl1.rows.length
        console.log(lngth)
        let tblrw=tbl1.insertRow(lngth)
        let cellrw=tblrw.insertCell(0)
        let flexdiv=`<div class="d-flex">
            <div class="p-2 bg-info"><strong>${usrname}</strong></div>
            <div class="p-2 bg-secondary flex-grow-1">${msgtxt}</div>
            </div>`
  
        // cellrw.innerHTML=`<td>${moment(transformed_msg.created).format('MMM Do YY h:mm:ss a')}:${usrname}:${msgtxt}</td>`
        cellrw.innerHTML=`<td><span class="badge badge-pill badge-dark">${moment(transformed_msg.created).format('MMM Do YY h:mm:ss a')}</span></br>${flexdiv}</td>`
        if(!topval){
            topval=78
        }else{
            topval=topval-5
        }

        if(topval>=0){                    
            tbl1.style.top=`${topval}%`
        }

        //scroll down
        const scrlelement = document.getElementById("msglist");
        scrlelement.scrollTop = scrlelement.scrollHeight;

        $('#chat').val('')


    // })
    }
    


})



//create channel
const chnlCreateFrm=document.querySelector('#createchannel')
chnlCreateFrm.addEventListener('submit',async (e)=>{
e.preventDefault()
let url=`${window.location.protocol}//${window.location.host}`
const inpChnlName=$('#chnlinput').val()
console.log(inpChnlName)
const createout=await fetch(`${url}/addchannel/${usrname}`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
        channelname:inpChnlName
    })
    })

const createjson=await createout.json()
if(createjson.status==='exist'){
    alert('Channel already Exist!!!')    
}else{
    const chnlTbl=$('#msgtbl')
    const cnlrw=`<tr><td>${inpChnlName}</td></tr>`
    chnlTbl.prepend(cnlrw)
    // $('#myModal').css('display','none')
    $('#myModal').hide()
    $('.modal-backdrop').hide()
    }

})



//
socket.on('left',(msg)=>{
    console.log(msg)
})

socket.on('msgsent',(msgdata)=>{
    console.log(msgdata)
    let tbl1=document.getElementById('listedmsgs')
    let lngth=tbl1.rows.length
    console.log(lngth)
    // let tbl1=document.getElementById('listedmsgs')
        let topstr=tbl1.style.top.toString()
        let topval=topstr.substr(0,topstr.length-1)
        console.log(topval)
        // let lngth=tbl1.rows.length
        console.log(lngth)
        let tblrw=tbl1.insertRow(lngth)
        let cellrw=tblrw.insertCell(0)
        let flexdiv=`<div class="d-flex">
            <div class="p-2 bg-info"><strong>${msgdata.username}</strong></div>
            <div class="p-2 bg-secondary flex-grow-1">${msgdata.msgTxt}</div>
            </div>`
  
        // cellrw.innerHTML=`<td>${moment(transformed_msg.created).format('MMM Do YY h:mm:ss a')}:${usrname}:${msgtxt}</td>`
        cellrw.innerHTML=`<td><span class="badge badge-pill badge-dark">${moment(msgdata.created).format('MMM Do YY h:mm:ss a')}</span></br>${flexdiv}</td>`
        if(!topval){
            topval=78
        }else{
            topval=topval-5
        }

        if(topval>=0){                    
            tbl1.style.top=`${topval}%`
        }

        //scroll down
        const scrlelement = document.getElementById("msglist");
        scrlelement.scrollTop = scrlelement.scrollHeight;




    // let tblrw=tbl1.insertRow(lngth)
    // let cellrw=tblrw.insertCell(0)
    // cellrw.innerHTML=`<td>${moment(msgdata.created).format('MMM Do YY h:mm:ss a')}:${msgdata.username}:${msgdata.msgTxt}</td>`
})

//rule link
var modal = document.getElementById("myModal");
document.querySelector('#createchannelpic').addEventListener('click',(e)=>{
    e.preventDefault()
    // document.querySelector('#popupform').style.display='block'
    // Get the modal

modal.style.display = "block";


})

var span = document.getElementsByClassName("close")[0];
span.onclick = function() {
    modal.style.display = "none";
    $(".modal-backdrop").remove();
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
      $(".modal-backdrop").remove();
    }
  }


  ///----------------------------direct messages--------------------------------------------------------
  let dirchnnelName=''
  let curUserName=''
//display messages
$('#onemsgtbl').off().on('click', 'tbody tr', async function(event) {
    event.stopImmediatePropagation()
    event.preventDefault()
    $('#chat').removeAttr('disabled')
    $('.btn1').removeAttr('disabled')
    directmsgFlag='Y'
    directtorecip=$(this).text()
    $(this).parent().children().removeClass('clicked')
    $(this).parent().children().removeClass('sentalert')
    // dmsgtble.rows[i].classList.add('clicked')
    $(this).addClass('clicked')
    console.log(dirchnnelName==='')
    // console.log($(this).text())
    $('.messagesection').show()
    if(!(dirchnnelName==='')){
        console.log('in loop and '+dirchnnelName)
        socket.emit('leave',{username:usrname,room:dirchnnelName})
        socket.on('left',(msg)=>{
            console.log(msg)
        })
    }
    
    dirchnnelName=$(this).text()+usrname
    curUserName=$(this).text()
    try{
        const msgs=await fetch (`${url}/loaddirect/${usrname}?getuser=${curUserName}`)
        const msgJson=await msgs.json()
        console.log(`Direct Message: ${msgJson}`)
        let msgtble=document.getElementById('listedmsgs')
        if (msgtble.rows.length!=0){
            while(msgtble.hasChildNodes())
                {
                    msgtble.removeChild(msgtble.firstChild);
                }
        }
        let rwcnt=0
        let toppad=78
        let rwnum=0
        msgJson.messages.forEach((msg)=>{
            console.log(`Returned message:${msg.createdAt}`)
            let row1=msgtble.insertRow(rwcnt)
            let cell1=row1.insertCell(0)
            // let trnsMsg=transformMsg(cht.message)
            
            // cell1.innerHTML=`<td><span class="badge badge-pill badge-dark">${moment(msg.createdAt).format('MMM Do YY h:mm:ss a')}</span></br>:${msg.frm}:${msg.msgtxt}</td>`
            let flexdiv=`<div class="d-flex">
            <div class="p-2 bg-info"><strong>${msg.frm}</strong></div>
            <div class="p-2 bg-secondary flex-grow-1"><p>${msg.msg}</p></div>
          </div>`
            cell1.innerHTML=`<td><span class="badge badge-pill badge-dark">${moment(msg.createdAt).format('MMM Do YY h:mm:ss a')}</span></br>${flexdiv}</td>`
            if(rwcnt!=0){
                toppad=toppad-5
                if(toppad>=0){
                    
                    msgtble.style.top=`${toppad}%`
                }
            }else if(rwcnt===0){
                msgtble.style.top=`${toppad}%`
            }
            rwcnt++
        })

        //scroll down
        const scrlelement = document.getElementById("msglist");
        scrlelement.scrollTop = scrlelement.scrollHeight;
        

        socket.emit('directjoin',{username:usrname,room:curUserName})
        // socket.on('dirjoined',(msg)=>{
        //     console.log(msg)
        // })


        
        
    }catch(e){
        console.log(e)
    }
})


socket.on('dirjoined',(msg)=>{
    console.log(`Joined direct:${msg}`)
})

//------------display direct sent message
socket.on('sentdirect',(msg)=>{
    console.log(`Sent direct:${msg}`)
    if(curUserName===msg.username){

        let tbl1=document.getElementById('listedmsgs')
        let topstr=tbl1.style.top.toString()
        let topval=topstr.substr(0,topstr.length-1)
        console.log(topval)
        let lngth=tbl1.rows.length
        console.log(lngth)
        let tblrw=tbl1.insertRow(lngth)
        let cellrw=tblrw.insertCell(0)
        //{username:usrname,room:directtorecip,msgTxt:msgtxt,created:transformed_msg.created}
        let flexdiv=`<div class="d-flex">
            <div class="p-2 bg-info"><strong>${msg.username}</strong></div>
            <div class="p-2 bg-secondary flex-grow-1">${msg.msgTxt}</div>
            </div>`
  
        // cellrw.innerHTML=`<td>${moment(transformed_msg.created).format('MMM Do YY h:mm:ss a')}:${usrname}:${msgtxt}</td>`
        cellrw.innerHTML=`<td><span class="badge badge-pill badge-dark">${moment(msg.created).format('MMM Do YY h:mm:ss a')}</span></br>${flexdiv}</td>`
        if(!topval){
            topval=78
        }else{
            topval=topval-5
        }

        if(topval>=0){                    
            tbl1.style.top=`${topval}%`
        }

        //scroll down
        const scrlelement = document.getElementById("msglist");
        scrlelement.scrollTop = scrlelement.scrollHeight;






    }else{
        let dmsgtble=document.getElementById('onemsgtbl')
            let n=0
            console.log(dmsgtble.rows)
            let arry=dmsgtble.rows
            for(let i=0;i<=dmsgtble.rows.length-1;i++){
                console.log(dmsgtble.rows[i].textContent)
                if(msg.username===dmsgtble.rows[i].textContent){
                    dmsgtble.rows[i].classList.add('sentalert')
                    // chnnelName=dmsgtble.rows[i].textContent
                        }
            }
    }

})

socket.on('sessionadd',(usr)=>{
    console.log(usr)
    const dtbl=$('#onemsgtbl')
    // session.forEach((s)=>{
    let trowd=`<tr><td>${usr}</td></tr>`
    dtbl.append(trowd)
    // })

})

socket.on('sessiondel',(deluser)=>{
    console.log(`To Delete:${deluser}`)
    const todel=deluser[0].username
    let dmsgtble=document.getElementById('onemsgtbl')
    let n=0
    console.log(dmsgtble.rows)
    let arry=dmsgtble.rows
    for(let i=0;i<=dmsgtble.rows.length-1;i++){
        console.log(dmsgtble.rows[i].textContent)
        if(todel===dmsgtble.rows[i].textContent){
            dmsgtble.rows[i].remove()
                }
    }
    // while(n<=dmsgtble.rows.length-1){
    //     console.log(dmsgtble.rows)
    // }
        // if (dmsgtble.rows.length!=0){
        //     while(msgtble.hasChildNodes())
        //         {
        //             msgtble.removeChild(msgtble.firstChild);
        //         }
        // }

    // for (rw in arry){
    //     console.log(rw)
    //     if(todel===rw.textContent){
    //                 rw.remove()
    //             }
    // }
        // arry.each((rw)=>{
        //     if(todel===rw.textContent){
        //         rw.remove()
        //     }
        // })
})