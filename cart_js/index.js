//cart 的 js

//抓資料
const HOST_NAME = '18.214.165.31';
const API_VERSION = '1.0'
// http://${HOST_NAME}/assets/${id}/main.jpg

//拿庫存
// id of item
const getStock = (id, size, color) => {
	const url = `http://${HOST_NAME}/api/${API_VERSION}/products/details?id=${id}`;
	// 去拿了 url 拿到結果，url 拿到的結果就變成 response 把它轉成 json 檔，再把 json 檔的值傳給 data
	// promise
	return fetch(url)
	.then((res) => res.json())
	.then((data) => data['data']['variants']) // object 的 property 可以用 array 的方式獲取
	.then((variants) => variants.filter( // for each 只要滿足下面條件的, filter 出來的結果會是一個 array
		(variant) => variant['color_code'] === color && variant['size'] === size))
	.then((variants) => variants[0]['stock'])
}

//改數量
const editQty = (id, color, size, newQty) => {
	var list = JSON.parse(localStorage.getItem('list')) || [];
	for (let item of list) {
		if(item.id == id && item.color == color && item.size == size) {
			// 找到所有條件都符合的 item

			getStock(id, size, color) // 使用 getStock 來找到庫存, 但因為他是 fetch then 的結構 ( promise )
			.then((stock) => {        // 所以要繼續 then 下去, stock 承接 .then((variants) => variants[0]['stock'])
 				console.log(stock)    // 所得到的值
				if (newQty <= stock) {   
					item.qty = newQty    // 更新 qty
					localStorage.setItem('list', JSON.stringify(list)) // 因為上面的改動只有在 memory 中進行, 
																														// 為了讓 localstorage 也同步 所以要 轉 json string 存回去
					const totalPriceId = `total_${id}_${color}_${size}`;
					totalPrice = document.getElementById(totalPriceId);
					totalPrice.innerHTML = item['price'] * newQty;
					return true;
				} else {
					return false;

				}
			})
		}
	}
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
	        img.src=`http://${HOST_NAME}/assets/${list[i]['id']}/main.jpg`;

	    	const TextContainer = document.createElement('div');
	    	TextContainer.setAttribute('class', 'TextContainer');
	        const TextCloth = document.createElement('div');
	        TextCloth.innerHTML = list[i]['name'];
	        const TextNumber = document.createElement('div');
	        TextNumber.innerHTML = list[i]['id'];
	        const TextColor = document.createElement('div');
	        TextColor .setAttribute('class', 'TextColor');
	        TextColor.innerHTML = '顏色 | #' + list[i]['color'];
	        const TextSize = document.createElement('div');
	        TextSize.innerHTML = '尺寸 | ' + list[i]['size'];

	        // 產生 select 的 option
	        // 根據 getStock 的 結果產生 (是 promise 所以要用 then 去包)
	        const numberRight = document.createElement('div');
	        numberRight.setAttribute('class', 'numberRight');
	        const QTY = document.createElement('select');
	        QTY.setAttribute('class', 'QTYselect');
	        QTY.setAttribute('_id', list[i]['id']) // 因為要避免跟 html 的 id 衝突
	        QTY.setAttribute('color', list[i]['color'])
	        QTY.setAttribute('size', list[i]['size'])

            // 數值改變才會做事
            QTY.onchange = (e) => {
                let target = e.target
                console.log(target.value)
                editQty(target.getAttribute('_id'), target.getAttribute('color'),
                        target.getAttribute('size'), target.value) // 在這function (editQty) 內差一行更新 total price
            } 

            // 產生 select 的 option
            // 根據 getStock 的 結果產生 (是 promise 所以要用 then 去包)
            getStock(list[i]['id'], list[i]['size'], list[i]['color'])
            .then((stock) => {
                // 0 ~  個 option
                for (let k=0; k < stock; k++) {
                    const opt = document.createElement('option')
                    if (k == list[i]['qty']) { 
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
	        Totalprice.innerHTML = list[i]['price']*list[i]['qty'];

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