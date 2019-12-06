console.log('loaded')
const url=`${window.location.protocol}//${window.location.host}`
const usrName=localStorage.getItem('flackuser')
if(!usrName){
    console.log('no user')
}else{
    // console.log(usrName)
    window.location.assign(`${url}/home/${usrName}`)
}

const loginFrm=document.querySelector('#loginfrm')

loginFrm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const usrTxt=e.target.elements.usrtxt.value
    // console.log(usrTxt)
    localStorage.setItem('flackuser',`${usrTxt}`)
    console.log(localStorage.getItem('flackuser'))
    window.location.assign(`${url}/home/${usrTxt}`)
})