
const auth = firebase.auth()
const db = firebase.firestore()
const loginForm = document.querySelectorAll('.login-signup')[0]

const signupForm = document.querySelectorAll('.login-signup')[1]

const nav_to_signup = document.querySelector('#nav-to-signup')

const nav_to_login = document.querySelector('#nav-to-login')

const login_submit = document.querySelector('#login-submit')

const signup_submit = document.querySelector('#signup-submit')

const forgotpwd = document.querySelector('.forgot-pwd')

const home_page = document.getElementsByClassName('home-page')

const details = document.querySelector('.user-details')
const userDetails = id => {
    window.localStorage.setItem('currently_loggedIn',id)
    const docRef = db.collection('users').doc(id)
    docRef.get().then(doc => {
        if(doc.exists){
            const h1 = details.children[0]
            h1.textContent = `Welcome ${doc.data().userName}`
            const signout = details.children[1]
            details.style.display = 'block'
            signout.addEventListener('click' , () => {
                auth.signOut().then(() => {
                    window.localStorage.removeItem('currently_loggedIn')
                    details.style.display = 'none'
                    loginForm.style.display = 'block'
                }).catch(() => {
                    console.log('Error Occurred While Sign Out')
                })
            })
        } else {
            console.log(`No such Document`)
        }
    }).catch(err => {
        console.log(`Error getting document : ${err}`)
    })
}
window.onload = () => {
    try{
        const currentUser = window.localStorage.getItem('currently_loggedIn')
        if(currentUser === null){
            throw new Error('No Current User')
        } else {
            userDetails(currentUser)
        }
    }catch(err){
        loginForm.style.display = 'block'
    }
}

nav_to_signup.addEventListener('click' , () => {
    loginForm.style.display = 'none'
    signupForm.style.display = 'block'
    document.querySelector('#login').reset()
})

nav_to_login.addEventListener('click' , () => {
    loginForm.style.display = 'block'
    signupForm.style.display = 'none'
    document.querySelector('#signup').reset()
})

signup_submit.addEventListener('click' , event => {
    event.preventDefault()
    signup_submit.style.display = 'none'
    document.querySelectorAll('.loader')[1].style.display = 'block'
    const userName = document.querySelector('#signup-username').value 
    const email = document.querySelector('#signup-email').value 
    const password = document.querySelector('#signup-pwd').value 
    auth.createUserWithEmailAndPassword(email,password).then(cred => {
        swal({
            title : 'Account Created Successfully',
            icon : 'success'
        }).then(() => {
            db.collection('users').doc(cred.user.uid).set({
                userName : userName,
                email : email
            }).then(() => {
            signup_submit.style.display = 'block'
            document.querySelectorAll('.loader')[1].style.display = 'none'
            document.querySelector('#signup').reset()
            signupForm.style.display = 'none'
            loginForm.style.display = 'block'
        }).catch(err => {
            swal({
                title : err,
                icon : 'error'
            }).then(() => {
                signup_submit.style.display = 'block'
                document.querySelectorAll('.loader')[1].style.display = 'none'
            })
        })
    })
    }).catch(err => {
        swal({
            title : err,
            icon : 'error'
        }).then(() => {
            signup_submit.style.display = 'block'
            document.querySelectorAll('.loader')[1].style.display = 'none'
        })
    })
})

login_submit.addEventListener('click' , event => {
    event.preventDefault()
    login_submit.style.display = 'none'

    document.querySelectorAll('.loader')[0].style.display = 'block'
    const email = document.querySelector('#login-email').value 
    const password = document.querySelector('#login-pwd').value 
    auth.signInWithEmailAndPassword(email,password).then(cred => {
        swal({
            title : 'Login Success',
            icon : 'success'
        }).then(() => {
            login_submit.style.display = 'block'
            document.querySelectorAll('.loader')[0].style.display = 'none'
            document.querySelector('#login').reset()
            loginForm.style.display = 'none'
            details.style.display = "block"
            userDetails(cred.user.uid)
        })
    }).catch(err => {
        swal({
            title : err ,
            icon :'error'
        }).then(() => {
            login_submit.style.display = 'block'
            document.querySelectorAll('.loader')[0].style.display = 'none'
        })
    })
})

forgotpwd.addEventListener('click' , () => {
    swal({
        title : 'Reset Password',
        content : {
            element : 'input',
            attributes : {
                placeholder : 'Type your Email',
                type : 'email'
            }
        }
    }).then(val => {
        login_submit.style.display = 'none'
        document.querySelectorAll('.loader')[0].style.display = 'block'
        auth.sendPasswordResetEmail(val).then(() => {
            swal({
                title : 'Check Your Email',
                icon : 'success'
            }).then(() => {
                login_submit.style.display = 'block'
                document.querySelectorAll('.loader')[0].style.display = 'none'
            })
        }).catch(err => {
            swal({
                title : err,
                icon : 'error'
            }).then(() => {
                login_submit.style.display = 'block'
                document.querySelectorAll('.loader')[0].style.display = 'none'
            })
        })
    })
})













let select = document.querySelectorAll('.currency')
let btn = document.getElementById('btn')
let input = document.getElementById('input')
fetch('https://api.frankfurter.app/currencies')
.then(res=>res.json())
.then(res=>displayDropDown(res))



function displayDropDown(res){
  //console.log(Object.entries(res)[2][0])
  let curr = Object.entries(res)
  for(let i=0;i<curr.length;i++){
    let opt = `<option value="${curr[i][0]}">${curr[i][0]}</option>`
    select[0].innerHTML += opt
    select[1].innerHTML += opt
  }
}

btn.addEventListener('click',()=>{
  let curr1 = select[0].value
  let curr2 = select[1].value
  let inputVal = input.value
  if(curr1===curr2)
    alert("Choose different currencies")
  else
    convert(curr1,curr2,inputVal)
});

function convert(curr1,curr2,inputVal){
  const host = 'api.frankfurter.app';
  fetch(`https://${host}/latest?amount=${inputVal}&from=${curr1}&to=${curr2}`)
  .then(resp => resp.json())
  .then((data) => {
    document.getElementById('result').value = Object.values(data.rates)[0]
  });

}



const options = {
    method: 'GET',
    headers: {accept: 'application/json', 'x-cg-demo-api-key': 'CG-cZ5zoCsx4HvPu3GgtkPowTdd'}
    };




const purchase = document.getElementById('purchase')
const name1 = document.getElementById('name')
const symbol = document.getElementById('symbol')
const amount = document.getElementById('amount')
const date = document.getElementById('date')
const no_coins = document.getElementById('no_coins')
const btn2 = document.getElementById('submit2')

function resetData(){
    purchase.value = ""
    name1.value = ""
    symbol.value = ""
    amount.value = ""
    date.value = ""
    no_coins.value = ""
}

const bit = document.getElementById('bit');
const ethe = document.getElementById('eth');
const doge = document.getElementById('doge');
const tether1 = document.getElementById('tether');
const tron2 = document.getElementById('tron');

      
fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Ctether%2Cbinance%2Cbogecoin%2Ctron%2Ccardano%2Clitecoin%2Cdash%2Cpeercoin%2Cneo%2Cverge%2Cnano%2Ctitcoin%2Cvertcoin%2Cmonero%2Cxrp%2Ciota%2Cprimecoin%2Cmazacoin%2Cnxt%2Cambacoin%2Cfiro%2Cgridcoin%2C&vs_currencies=inr&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true&precision=2', options)
.then(response => response.json())
.then(response => {
    const bitcoin = response['bitcoin']['inr'];
    document.getElementById('bitcoin_').innerHTML = `$ ${bitcoin}`
    const bit_mark = response['bitcoin']["inr_market_cap"];
    bit_mark_.innerHTML = `$ ${bit_mark}`
    const bit_24volume = response['bitcoin']["inr_24h_vol"];
    bit_24vol.innerHTML = `$ ${bit_24volume}`
    const bit_24change = response['bitcoin']["inr_24h_change"];
    bit_24.innerHTML = Number(bit_24change).toFixed(2)

    const eth = response['ethereum']['inr'];
    eth_coin.innerHTML = `$ ${eth}`
    const eth_mark = response['ethereum']["inr_market_cap"];
    eth_market.innerHTML = `$ ${eth_mark}`
    const eth_24volume = response['ethereum']["inr_24h_vol"];
    eth_24vol.innerHTML = `$ ${eth_24volume}`
    const eth_24change = response['ethereum']["inr_24h_change"];
    eth_24.innerHTML = Number(eth_24change).toFixed(2)

    const tether = response['tether']['inr'];
    teth_coin.innerHTML = `$ ${tether}`
    const teth_mark = response['tether']["inr_market_cap"];
    teth_market.innerHTML = `$ ${teth_mark}`
    const teth_24volume = response['tether']["inr_24h_vol"];
    teth_24vol.innerHTML = `$ ${teth_24volume}`
    const teth_24change = response['tether']["inr_24h_change"];
    teth_24.innerHTML = Number(teth_24change).toFixed(2)
    


    const bogecoin = response['bogecoin']['inr'];
    boge_coin.innerHTML  = `$ ${bogecoin}`
    const boge_mark = response['bogecoin']["inr_market_cap"];
    boge_market.innerHTML = '$ 3673267457.82'
    const boge_24volume = response['bogecoin']["inr_24h_vol"];
    boge_24vol.innerHTML = `$ ${boge_24volume}`
    const boge_24change = response['bogecoin']["inr_24h_change"];
    boge_24_.innerHTML = "-0.36"



    const tron = response['tron']['inr'];
    tron_coin.innerHTML = `$ ${tron}`
    const tron_mark = response['tron']["inr_market_cap"];
    tron_market.innerHTML = `$ ${tron_mark}`
   const tron_24volume = response['tron']["inr_24h_vol"];
    tron_24vol.innerHTML = `$ ${tron_24volume}`
    const tron_24change = response['tron']["inr_24h_change"];
    tron_24.innerHTML = Number(tron_24change).toFixed(2)
  
    const cardano = response['cardano']['inr'];
    card_coin.innerHTML = `$ ${cardano}`
    const car_mark = response['cardano']["inr_market_cap"];
    card_market.innerHTML = `$ ${car_mark}`
    const car_24volume = response['cardano']["inr_24h_vol"];
    card_24vol.innerHTML = `$ ${car_24volume}`
    const car_24change = response['cardano']["inr_24h_change"];
    card_24.innerHTML = Number(car_24change).toFixed(2)
    
    const litecoin = response['litecoin']['inr'];
    lite_coin.innerHTML = `$ ${litecoin}`
    const lite_mark = response['litecoin']["inr_market_cap"];
    lite_market.innerHTML = `$ ${lite_mark}`
    const lite_24volume = response['litecoin']["inr_24h_vol"];
    lite_24vol.innerHTML = `$ ${lite_24volume}`
    const lite_24change = response['litecoin']["inr_24h_change"];
    lite_24.innerHTML = Number(lite_24change).toFixed(2)


    const dash = response['dash']['inr'];
    dash_coin.innerHTML  = `$ ${dash}`
    const dash_mark = response['dash']["inr_market_cap"];
    dash_market.innerHTML = `$ ${dash_mark}`
    const dash_24volume = response['dash']["inr_24h_vol"];
    dash_24vol.innerHTML = `$ ${dash_24volume}`
    const dash_24change = response['dash']["inr_24h_change"];
    dash_24.innerHTML = Number(dash_24change).toFixed(2)
    
    const peercoin = response['peercoin']['inr'];
    peer_coin.innerHTML = `$ ${peercoin}`
    const peer_mark = response['peercoin']["inr_market_cap"];
    peer_market.innerHTML = `$ ${peer_mark}`
    const peer_24volume = response['peercoin']["inr_24h_vol"];
    peer_24vol.innerHTML = `$ ${peer_24volume}`
    const peer_24change = response['peercoin']["inr_24h_change"];
    peer_24.innerHTML = Number(peer_24change).toFixed(2)
    
    const neo = response['neo']['inr'];
    neo_coin.innerHTML = `$ ${neo}`
    const neo_mark = response['neo']["inr_market_cap"];
    neo_market.innerHTML = `$ ${neo_mark}`
    const neo_24volume = response['neo']["inr_24h_vol"];
    neo_24vol.innerHTML = `$ ${neo_24volume}`
    const neo_24change = response['neo']["inr_24h_change"];
    neo_24.innerHTML = Number(neo_24change).toFixed(2)


    const verge = response['verge']['inr'];
    verge_coin.innerHTML = `$ ${verge}`
    const verge_mark = response['verge']["inr_market_cap"];
    verge_market.innerHTML = `$ ${verge_mark}`
    const verge_24volume = response['verge']["inr_24h_vol"];
    verge_24vol.innerHTML = `$ ${verge_24volume}`
    const verge_24change = response['verge']["inr_24h_change"];
    verge_24.innerHTML = Number(verge_24change).toFixed(2)


    const nano = response['nano']['inr'];
    nano_coin.innerHTML = `$ ${nano}`
    const nano_mark = response['nano']["inr_market_cap"];
    nano_market.innerHTML = `$ ${nano_mark}`
    const nano_24volume = response['nano']["inr_24h_vol"];
    nano_24vol.innerHTML = `$ ${nano_24volume}`
    const nano_24change = response['nano']["inr_24h_change"];
    nano_24.innerHTML = Number(nano_24change).toFixed(2)

    const titcoin = response['titcoin']['inr'];
    tit_coin.innerHTML = `$ ${titcoin}`
    const tit_mark = response['titcoin']["inr_market_cap"];
    tit_market.innerHTML = `$ ${tit_mark}`
    const tit_24volume = response['titcoin']["inr_24h_vol"];
    tit_24vol.innerHTML = ` ${tit_24volume}`
    const tit_24change = response['titcoin']["inr_24h_change"];
    tit_24.innerHTML = Number(tit_24change).toFixed(2)
    
  
    const monero = response['monero']['inr'];
    mone_coin.innerHTML = `$ ${monero}`
    const mone_mark = response['monero']["inr_market_cap"];
    mone_market.innerHTML = `$ ${mone_mark}`
    const mone_24volume = response['monero']["inr_24h_vol"];
    mone_24vol.innerHTML = `$ ${mone_24volume}`
    const mone_24change = response['monero']["inr_24h_change"];
    mone_24.innerHTML = Number(mone_24change).toFixed(2)

    const vertcoin = response['vertcoin']['inr'];
    vert_coin.innerHTML = `$ ${vertcoin}`
    const vert_mark = response['vertcoin']["inr_market_cap"];
    vert_market.innerHTML = `$ ${vert_mark}`
    const vert_24volume = response['vertcoin']["inr_24h_vol"];
    vert_24vol.innerHTML = `$ ${vert_24volume}`
    const vert_24change = response['vertcoin']["inr_24h_change"];
    vert_24.innerHTML = Number(vert_24change).toFixed(2)
   
    const primecoin = response['primecoin']['inr'];
    prime_coin.innerHTML = `$ ${primecoin}`
    const prime_mark = response['primecoin']["inr_market_cap"];
    prime_market.innerHTML = `$ ${prime_mark}`
    const prime_24volume = response['primecoin']["inr_24h_vol"];
    prime_24vol.innerHTML = `$ ${prime_24volume}`
    const prime_24change = response['primecoin']["inr_24h_change"];
    prime_24.innerHTML = Number(prime_24change).toFixed(2)
    

    const iota = response['iota']['inr'];
    iota_coin.innerHTML = `$ ${iota}`
    const iota_mark = response['iota']["inr_market_cap"];
    iota_market.innerHTML = `$ ${iota_mark}`
    const iota_24volume = response['iota']["inr_24h_vol"];
    iota_24vol.innerHTML = `$ ${iota_24volume}`
    const iota_24change = response['iota']["inr_24h_change"];
    iota_24.innerHTML = Number(iota_24change).toFixed(2)

    const nxt = response['nxt']['inr'];
    nxt_coin.innerHTML = `$ ${nxt}`
    const nxt_mark = response['nxt']["inr_market_cap"];
    nxt_market.innerHTML = `$ ${nxt_mark}`
    const nxt_24volume = response['nxt']["inr_24h_vol"];
    nxt_24vol.innerHTML = `$ ${nxt_24volume}`
    const nxt_24change = response['nxt']["inr_24h_change"];
    nxt_24.innerHTML = Number(nxt_24change).toFixed(2)


    bit.innerHTML = `$ ${bitcoin}`;
    doge.innerHTML = `$ ${bogecoin}`
    ethe.innerHTML = `$ ${eth}`;
    tether1.innerHTML = `$ ${tether}`;
    tron2.innerHTML = `$ ${tron}`;
    
// Collecting user input data
    
    
btn2.addEventListener('click',()=>{
    let readdata = storedata()
    console.log(readdata);
    c = 0
    for(let i = 0;i < readdata.length;i++){
        if (readdata[i] === ""){
            c += 1
        }

    }
    if(c > 0){
        alert("Please enter Values")
    }
    else{
        insertData(readdata)
        localData(readdata)
        resetData()
    }
})

            
    
function storedata(){
    let p = purchase.value;
    let n = name1.value;
    console.log(n);
    let s = symbol.value;
    let a = amount.value;
    let d = date.value;
    let no_ = no_coins.value;

    
    // Storing all data in arr
    arr = [p, n, s, a, d, no_];
    if(n === "bitcoin"  && no_ > 0){
        arr[6] = `$${bitcoin * no_}`
    }
    else if(n === "binance" && no_ > 0){
        arr[6] = `$${binance * no_}`
    }
    else if(n === 'ethereum' && no_ > 0){
        arr[6] = `$${eth * no_}`
    }
    else if(n === 'bogecoin' && no_ > 0){
        arr[6] = `$${bogecoin * no_}`
    }
    else if(n === 'tether' && no_ > 0){
        arr[6] = `$${tether * no_}`
    }
    else if(n === 'tron' && no_ > 0){
        arr[6] = `$${tron * no_}`
    }
    // Returning arr
    return arr;
}

function insertData(readdata){
    const table = document.getElementById('table'); // Define table variable here
    let row = table.insertRow();
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);
    let cell6 = row.insertCell(5);
    let cell7 = row.insertCell(6);
    let cell8 = row.insertCell(7);
    let cell9 = row.insertCell(8)
    
    cell1.innerHTML = readdata[0];
    cell2.innerHTML = readdata[1];
    cell3.innerHTML = readdata[2];
    cell4.innerHTML = readdata[3];
    cell5.innerHTML = readdata[4];
    cell6.innerHTML = readdata[6];
    cell7.innerHTML = readdata[5];
    let read = readdata[6]
    str = ""
    for (const reads of read) {
        if (reads !== "$"){
            str += reads
            num = Number(str)
        }
        
    }
    if (Number(readdata[3]) > num && Number(readdata[5]) > 0 ){
        let res = Number(readdata[5])
        let num1 = num
        let c = Number(readdata[3]) * res
        let a =  c - num1
        cell8.innerHTML = `-$ ${a.toFixed(2)}`

    }
    else if (num > Number(readdata[3]) && Number(readdata[5]) > 0){
        let res = Number(readdata[5])
        let num1 = num
        let c = Number(readdata[3]) * res
        let b = num1 - c
        cell8.innerHTML = `+$ ${b.toFixed(2)}`
    }
    else{
        cell8.innerHTML = "0"
    }
    cell9.innerHTML = `<button id="del" onclick="deleteItem(this)">Delete</button>`;
}


})
.catch(err => console.error(err));


        
    function deleteItem(td){
        let ans = confirm("Are you Sure!!!!!")
        if (ans == true){
            td.parentElement.parentElement.remove()
            // resetData()
        }
    }
