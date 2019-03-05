//回去看 promise document
//回去看 xhr document


//cart 的 js

//抓資料
const HOST_NAME = 'api.appworks-school.tw';
const API_VERSION = '1.0';
// http://${HOST_NAME}/assets/${id}/main.jpg

//拿庫存
// id of item
const getStock = (id, size, color) => {
	const url = `https://${HOST_NAME}/api/${API_VERSION}/products/details?id=${id}`;
	// 去拿了 url 拿到結果，url 拿到的結果就變成 response 把它轉成 json 檔，再把 json 檔的值傳給 data
	// promise
	return fetch(url)
	.then((res) => res.json())
	.then((data) => data['data']['variants']) // object 的 property 可以用 array 的方式獲取
	.then((variants) => variants.filter( // for each 只要滿足下面條件的, filter 出來的結果會是一個 array
		(variant) => variant['color_code'] === color['code'] && variant['size'] === size))
	.then((variants) => variants[0]['stock'])
}



//改數量
const editQty = (id, color, size, newQty) => {
	var list = JSON.parse(localStorage.getItem('list')) || [];
	for (let item of list) {
		if(item.id == id && item.color.code == color.code && item.size == size) {
			// 找到所有條件都符合的 item

			getStock(id, size, color) // 使用 getStock 來找到庫存, 但因為他是 fetch then 的結構 ( promise )
			.then((stock) => {        // 所以要繼續 then 下去, stock 承接 .then((variants) => variants[0]['stock'])
 				console.log('stock',stock,newQty)    // 所得到的值
				if (newQty <= stock) {   
					item.qty = newQty    // 更新 qty
					localStorage.setItem('list', JSON.stringify(list)) // 因為上面的改動只有在 memory 中進行, 
																														// 為了讓 localstorage 也同步 所以要 轉 json string 存回去
					const totalPriceId = `total_${id}_${color}_${size}`;
					totalPrice = document.getElementById(totalPriceId);
					totalPrice.innerHTML = item['price'] * newQty;
					UpdateTotalPrice(list);
					return true;
				} else {
					return false;

				}
			})
		}
	}
}

//算底下的總價格 （網頁一開始要有值，然後更改數量後又要有值，就很適合寫成 function)
function UpdateTotalPrice(list){
var totalPriceBelow = 0;
    for( var r=0; r < list.length; r++){
	totalPriceBelow += list[r]['qty'] *  list[r]['price'];
	}
	var total = document.getElementById('total');
	total.innerHTML = totalPriceBelow;
	var shippingFee = document.getElementById('shipping-fee');
	shippingFee.innerHTML = '30';
	var totalFee = document.getElementById('total-fee');
	totalFee.innerHTML = parseInt(total.innerHTML, 10) + parseInt(shippingFee.innerHTML, 10);
}


//移除商品
const removeItem = (id, color, size) => {
	var list = JSON.parse(localStorage.getItem('list')) || [];
	// 運用 filter 找到 id color size 不等於的 item 組成新的 list (要刪除以外的 item 全部選出來)
	newList = list.filter((item) => item.id != id || item.color != color || item.size != size)
	localStorage.setItem('list', JSON.stringify(newList))
}



//render 出來
const printProductDetails = () => {
	//把資料從 localStorage 撈出來，放到 list 這個變數裡
	var list = JSON.parse(localStorage.getItem('list')) || [];
	UpdateTotalPrice(list); //	先印出總價格
	const layout = document.querySelector('.product-blocks')
    for (let i = 0; i < list.length; i++) {
    		const divider = document.createElement('div')
    		divider.setAttribute('class', 'divider');
    		const dressContainer = document.createElement('div')
    		dressContainer.id = `${list[i]['id']}_${list[i]['color']}_${list[i]['size']}`
    		dressContainer.setAttribute('class', 'dressContainer');
	        const dressPicture = document.createElement('div');
	        dressPicture.setAttribute('class', 'Imgbox');
	        const img = document.createElement('img');
            //image 放進來
            const loadingImg = document.createElement('img');
	        img.src=`http://${HOST_NAME}/assets/${list[i]['id']}/main.jpg`;
            img.onload = () => {
                
		        loadingImg.setAttribute("class", "loadingImg");
                loadingImg.src = "img/loading.gif";
                document.body.appendChild(loadingImg);
                while(!img.complete) {
                    sleep(1)
                }
                loadingImg.style.display="none";
            }
            
            

	    	const TextContainer = document.createElement('div');
	    	TextContainer.setAttribute('class', 'TextContainer');
	        const TextCloth = document.createElement('div');
	        TextCloth.innerHTML = list[i]['name'];
	        const TextNumber = document.createElement('div');
	        TextNumber.innerHTML = list[i]['id'];
	        const TextColor = document.createElement('div');
	        TextColor .setAttribute('class', 'TextColor');
	        TextColor.innerHTML = '顏色 | #' + list[i].color.name;
	        const TextSize = document.createElement('div');
	        TextSize.innerHTML = '尺寸 | ' + list[i]['size'];

	        // 產生 select 的 option
	        // 根據 getStock 的 結果產生 (是 promise 所以要用 then 去包)
	        const numberRight = document.createElement('div');
	        numberRight.setAttribute('class', 'numberRight');
	        const QTY = document.createElement('select');
	        QTY.setAttribute('class', 'QTYselect');
	        QTY.setAttribute('_id', list[i]['id']) // 因為要避免跟 html 的 id 衝突
	        QTY.setAttribute('color', JSON.stringify(list[i]['color']))
	        QTY.setAttribute('size', list[i]['size'])

            // 數值改變才會做事
            QTY.onchange = (e) => {
                let target = e.target
                console.log(target.value)
                editQty(target.getAttribute('_id'), JSON.parse(target.getAttribute('color')),
                        target.getAttribute('size'), target.value) // 在這function (editQty) 內差一行更新 total price
            } 

            // 產生 select 的 option
            // 根據 getStock 的 結果產生 (是 promise 所以要用 then 去包)
            getStock(list[i]['id'], list[i]['size'], list[i]['color'])
            .then((stock) => {
            	console.log(list[i]);
                // 0 ~  個 option
                for (let k = 0; k < stock; k++) {
                    const opt = document.createElement('option')
                    if (k + 1 == list[i]['qty']) { 
						opt.selected="selected";
					}
                    opt.innerHTML = k + 1 // 因為從 0 開始
                    QTY.appendChild(opt)
                }
            }) 
	        
            const phonetitles = document.createElement('div');
            phonetitles.setAttribute('class', 'phone-titles');
            const phone_product_quantity = document.createElement('div');
            phone_product_quantity.setAttribute('class', 'phone-product-quantity-title');
            phone_product_quantity.innerHTML = '數量';
            const phone_product_unit = document.createElement('div');
            phone_product_unit.setAttribute('class', 'phone-product-unit-price-title');
            phone_product_unit.innerHTML = '單價';
            const phone_product_total = document.createElement('div');
            phone_product_total.setAttribute('class', 'phone-product-total-title');
            phone_product_total.innerHTML = '小計';
	        const Singleprice = document.createElement('div');
	        Singleprice.setAttribute('class', 'Singleprice');
	        Singleprice.innerHTML = list[i]['price'];

			const Totalprice = document.createElement('div');
			const TotalpriceId = `total_${list[i]['id']}_${list[i]['color']}_${list[i]['size']}`;
			Totalprice.setAttribute('id', TotalpriceId);
	        Totalprice.setAttribute('class', 'Totalprice');
	        Totalprice.innerHTML = list[i]['price'] * list[i]['qty'];

	        const deleteContainer = document.createElement('div');
	        deleteContainer.setAttribute('class', 'deleteContainer');
	        const deleteImg = document.createElement('img');
	        deleteImg.src = 'img/cart-remove.png';
	        // 讓他知道對應的 item 的 id color size 是哪個
	        deleteImg.setAttribute('_id', list[i]['id']) 
	        deleteImg.setAttribute('color', list[i]['color'])
	        deleteImg.setAttribute('size', list[i]['size'])
	        deleteImg.onclick = (e) => {
	        	let target = e.target // 精簡 code, e.target有點長
	        	// removeItem 是 function 在 46 行
	        	removeItem(target.getAttribute('_id'), target.getAttribute('color'),
	        		       target.getAttribute('size'))

	        	// 找到 對應的 dressContainer
	        	let id = `${target.getAttribute('_id')}_${target.getAttribute('color')}_${target.getAttribute('size')}`

	        	let item = document.getElementById(id)
	        	// 找他 parentNode 叫他幹掉他小孩
	        	item.parentNode.removeChild(item)
	        } 

	        numberRight.appendChild(phonetitles);
	        phonetitles.appendChild(phone_product_quantity);
  			phonetitles.appendChild(phone_product_unit);   
  			phonetitles.appendChild(phone_product_total);        
	        dressContainer.appendChild(dressPicture);
	        dressPicture.appendChild(img);

	        dressContainer.appendChild(TextContainer);
	        TextContainer.appendChild(TextCloth);
	        TextContainer.appendChild(TextNumber);
	        TextContainer.appendChild(TextColor);
	        TextContainer.appendChild(TextSize);

	       	dressContainer.appendChild(numberRight);
	        numberRight.appendChild(QTY);
	        numberRight.appendChild(Singleprice);
	        numberRight.appendChild(Totalprice);

	        dressContainer.appendChild(deleteContainer);
	      	deleteContainer.appendChild(deleteImg);
	      	layout.appendChild(divider);
       		layout.appendChild(dressContainer)
    }
}

printProductDetails();



//cart_page redirect
var men__Button = document.querySelector('.men__Button');
var women__Button = document.querySelector('.women__Button');
var accessories__Button = document.querySelector('.accessories__Button');
var btn_logo01 = document.querySelector('.btn_logo01');
var member = document.querySelector('.member');
var member_mobile = document.querySelector('.member__mobile-iconbox');

men__Button.addEventListener('click', () => {
  window.location = "index.html?men";
})

women__Button.addEventListener('click', () => {
  window.location = "index.html?women";
})

accessories__Button.addEventListener('click', () => {
  window.location = "index.html?accessories";
})

btn_logo01.addEventListener('click', () => {
  window.location = "index.html";
})

member.addEventListener('click', () => {
  window.location = "profile.html";
})

member_mobile.addEventListener('click', () => {
  window.location = "profile.html";
})




// TapPay設定
TPDirect.setupSDK(12348, 'app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF', 'sandbox');

TPDirect.card.setup({
    fields: {
        number: {
            // css selector
            element: '#card-number',
            placeholder: '**** **** **** ****'
        },
        expirationDate: {
            // DOM object
            element: document.getElementById('card-expiration-date'),
            placeholder: 'MM / YY'
        },
        ccv: {
            element: '#card-ccv',
            placeholder: '後三碼'
        }
    },
    styles: {
        // Style all elements
        'input': {
            'color': 'gray'
        },
        // Styling ccv field
        'input.cvc': {
            'font-size': '16px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            'font-size': '16px'
        },
        // Styling card-number field
        'input.card-number': {
            'font-size': '16px'
        },
        // style focus state
        ':focus': {
            // 'color': 'black'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    }
});


//postMessage 錯誤的解法：安全性關係瀏覽器會鎖住這個功能，所以要加一個 server 來跑
//在 sublinetext 裡加了一個套件 subline server，會加一個簡單的 html server，去 tools 地方開關
//http://localhost:8080/stylish/cart.html
TPDirect.card.onUpdate(function (update) {
    // update.canGetPrime === true
    // --> you can call TPDirect.card.getPrime()
    //卡號正確
    if (update.canGetPrime) {
        // Enable submit Button to get prime.
        submitButton.removeAttribute('disabled')
    } else {
        // Disable submit Button to get prime.
        submitButton.setAttribute('disabled', true)
    }

    // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unknown']
    if (update.cardType === 'visa') {
        // Handle card type visa.
    }

    // number 欄位是錯誤的
    if (update.status.number === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.number === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }

    if (update.status.expiry === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.expiry === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }

    if (update.status.cvc === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.cvc === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }
});

// call TPDirect.card.getPrime when user submit form to get tappay prime
// $('form').on('submit', onSubmit)

function onSubmit(event) {
    event.preventDefault()

    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus();

    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        alert('信用卡資訊輸入有誤，請再確認是否資訊正確');
        return false;
    }

    // Get prime
    const prime = new Promise((resolve, reject) => {
        TPDirect.card.getPrime((result) => {
            const {
                status,
                msg,
                card
            } = result;
            const {
                prime
            } = card;

            if (status !== 0) {
                console.log(`Get prime error ${msg}`);
                reject(`Get prime error ${msg}`);
            }

            resolve(prime);

            // send prime to your server, to pay with Pay by Prime API .
            // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
        });
    });

    return prime;

}

const submitButton = document.querySelector('.confirm-button');
const basicInfo = document.querySelector('.order-information');


// check購物車內是否有東西
function checkCart(list) {

    // 確認購物車內有無商品
    if (list.length > 0) {
        return true;
    } else {
        alert("購物車內沒有商品");
        return false;
    }

}

function attCheck(attr, value) {
    
    const regex = {
        'phone': /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
        'email': /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/,
    }
    if(attr in regex) {
        return regex[attr].test(value);
    } else {
        // Not support regex parse, always return true.
        return true
    }
}

// check基本資訊是否都有填好
function checkBasciInfo() {

    const formData = new FormData(basicInfo);

    for(let key of formData.keys()) {
        const value = formData.get(key)
        if (value === "") {
            alert("訂購資料尚未填妥，請再確認是否資訊完整");
            return false;
        }
        if (!attCheck(key, value)) {
            alert("訂購資料尚未填妥，請再確認是否資訊完整");
            return false;
        }
        
    }
    return true;
    
}



var accessToken = undefined; // 一開始先不定義它


//現在只有當 FB login 的時候，要拿到 response 的 accessToken 把它送到 425 行的 accessToken 變數裡
function checkLogin(){
    FB.getLoginStatus(function(response) {
     if (response.status === 'connected') {
        console.log(response);
        accessToken = response.authResponse.accessToken;
        console.log(accessToken);
     } 
    });
}


//把 FB 的東西 load 進來
    window.fbAsyncInit = function() {
            FB.init({
              appId      : '157112091854354',
              cookie     : true,
              xfbml      : true,
              version    : 'v3.2'
            });
              
            FB.AppEvents.logPageView();
            checkLogin();
          };
//在整個網頁 load 完以後，才把 FB init 起來，才做 getLoginStatus
//          FB.login(function(response) {
//          console.log(response);
//              statusChangeCallback(response);

// }, {scope: 'public_profile,email'});

//初始化完成以後，要判斷有沒有 log in

          (function(d, s, id){
             var js, fjs = d.getElementsByTagName(s)[0];
             if (d.getElementById(id)) {return;}
             js = d.createElement(s); js.id = id;
             js.src = "https://connect.facebook.net/en_US/sdk.js";
             fjs.parentNode.insertBefore(js, fjs);
           }(document, 'script', 'facebook-jssdk'));




// 傳送資料
//上面定義過了
// const HOST_NAME = '18.214.165.31';
// const API_VERSION = '1.0'

function postData(data) {
    return new Promise((resolve, reject) => {

        const xhr = new XMLHttpRequest();

        xhr.open("POST", `https://${HOST_NAME}/api/${API_VERSION}/order/checkout`);

        if(accessToken !== undefined){
            //把 AccessToken 放到 header 裡，而不是放到 body 裡（通常主要資料會放 body）
          xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);   
        }
        //API 要求壹定要
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        //onload 是一個 callback function，什麼時候要 return，什麼時候不用，要看 document
        // 查 onload 這個 callback function
        xhr.onload = function () {
            resolve(this.responseText);
            return this.responseText;
        }
        xhr.onerror = function () {
            reject("Something went wrong!");
        }

        xhr.send(data);
    });
}

//檢查前就要先把 list 拿出來
submitButton.addEventListener("click", () => {
    var list = JSON.parse(localStorage.getItem('list')) || [];
    if (checkCart(list) !== false && checkBasciInfo() !== false) {


        // 按鈕呈現在loading的狀態
        submitButton.textContent = "";
        submitButton.classList.add('loading');


        let checkCard = onSubmit(event);
        const formData = new FormData(basicInfo);
        const subtotal = document.querySelector(".should-pay");

        if (checkCard !== false) {
            // 取得Promise資料
            return checkCard.then((result) => {

                // 刪除list內多餘的key與值
                for (var i = 0; i < list.length; i++) {
                    delete list[i].img;
                    delete list[i].max;
                }

                var checkOutOrder = {
                    prime: result,
                    order: {
                        shipping: "delivery",
                        payment: "credit_card",
                        subtotal: subtotal.innerHTML,
                        freight: 30,
                        total: subtotal.innerHTML + 30,
                        recipient: {
                            name: formData.get('name'),
                            phone: formData.get('phone'),
                            email: formData.get('email'),
                            address: formData.get('address'),
                            time: formData.get('deliver-time')
                        },
                        list: list
                    }

                };

                checkOutOrder = JSON.stringify(checkOutOrder);

                // 送出資料並取得number
                let orderData = postData(checkOutOrder);

//前面 onload return 丟給我的 
                orderData.then((result) => {
                    const responseMsg = JSON.parse(result);

                    // 確認是否拿到正確的資料
                    if (responseMsg.error === undefined) {
                        let orderNumber = responseMsg.data.number;
                        console.log(orderNumber);
                        localStorage.clear();
                        // 跟首頁跳到 product id 
                        window.location.href = `./thank-you.html?orderNumber=${orderNumber}`;
                    } else {
                        console.log(responseMsg.error);
                        alert('哪裡出錯了！請確認資料是否都正確並再填寫一次');
                        window.location.href = "../pages/cart.html";
                    }

                });

            }).catch((error) => {
                console.log(error);
            });
        }

    }

});