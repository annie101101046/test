// localStorage 流程
// 網頁一開始
// 算完 list 後


// 去拿 loacalStorage 裡面 getItem 這個 function 對應的值 list
// 當「加到購物車」被點選後將選到的商品放進localStorage
// list 是我們的購物車，data 是新買的物品
function getlocalStorage(data) {
  // .getItem 是 localStorage 特有的。從 localStorage 先把 list 拿出來，再丟進 list 變數
  // list 這個變數其實就是 localStorage 的物品拿出來，放到 list 裡
  // localStorage 存的是 JSON
  const list = JSON.parse(localStorage.getItem('list')) || [];
  const cartButton = document.querySelector('.productPage__Container__Sub__Info__Cart');
  /*
	[
		{
			id: 201807201824,
			name: 'asdf',
		},
		{
			id: 201807201823,
			name: 'asdeef',
		}
	]
    */


  // 點了加入購物車後，會把 list 更新，還沒到 localStorage
  // 要怎麼改掉「加入購物車的顏色ㄚ」
  cartButton.addEventListener('click', () => {
    const count = document.querySelector('.productPage__Container__Sub__Info__Amount__Container__Num');
    count.value = parseInt(count.innerHTML, 10);
    const sizesSelect = document.querySelector('.productPage__Container__Sub__Info__Size__Size__Block__Selected p');
    const color__Value = document.querySelector('.productPage__Container__Sub__Info__Color__block__Selected img').style.backgroundColor.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)/i);// 把空白字元去掉，match 是找 rgb 裡面的值
    const color__Value__Hex = `${Number(color__Value[1]).toString(16)}${Number(color__Value[2]).toString(16)}${Number(color__Value[3]).toString(16)}`.toUpperCase();
    const currentColor = color__Value__Hex;
    const currentSize = sizesSelect.innerHTML;
    const currentAmount = count.value;
	    let j = 0;

    // localStorage list 有值時，就開始判斷有無重複
	    // if (list.length > 0) {
	    for (let i = 0; i < list.length; i++) {
	        // 判斷資料內有沒有一模一樣的商品被買過
	        if (list[i].id === data.data.id && list[i].color.code === currentColor && list[i].size === currentSize) {
	            list[i].qty = currentAmount;
	        } else {
	            j++; // j = list.length
	        }
	    }

    // 創了一個 color 的 object，一個是 name，一個是 code，為了 checkout Api 做準備的
    // https://github.com/AppWorks-School/API-Doc/tree/master/Stylish#order-check-out-api
    // checkou 對應的 api 是要 object
	    const colorObj = {
	    	name: getColorNameBycode(data, currentColor),
	    	code: currentColor,
	    };


	    // 當我點了 add to cart，list 就會開始寫入這個品項
	    // 當j的數字等於list陣列的長度就代表沒有買過一模一樣的商品，所以需要再新增一個
	    if (j === list.length) {
	        const buyProduct = {};
	        buyProduct.id = data.data.id;
	        buyProduct.name = data.data.title;
	        buyProduct.price = data.data.price;
	        buyProduct.color = colorObj;
	        buyProduct.size = currentSize;
	        buyProduct.qty = currentAmount;
	        // 把新的資料push加到list陣列裡
	        // 購物車欄位就會多一個品項
	        list.push(buyProduct);
	    }

	    // 再把已經有新資料的list轉成string存到localstorage裡
	    localStorage.setItem('list', JSON.stringify(list));


	    // } else {
	    //     let buyProduct = {};
	    //     currentSize
	    //     buyProduct.id = data.id;
	    //     buyProduct.name = data.title;
	    //     buyProduct.price = data.price;
	    //     buyProduct.color = {
	    //         "name": `${currentColorName}`,
	    //         "code": `${currentColor}`
	    //     };
	    //     buyProduct.size = currentSize;
	    //     buyProduct.qty = currentAmount;

	    //     // 把新的資料push加到list陣列裡
	    //     list.push(buyProduct);

	    //     // 再把已經有新資料的list轉成string存到localstorage裡
	    //     localStorage.setItem('list', JSON.stringify(list));
	    // }

	    // 顯示目前加到購物車的商品數量
	    // addToCart();

	  updateCartNumber(list);
  });
  updateCartNumber(list);// 網頁一開啟時做的事 list 這個變數是在大 function 裡
}


// 執行這個 function
// 把 list 畫出來
function updateCartNumber(list) {
  // 計算目前加入購物車的商品數量
  // 我在這邊的做法是只看他有幾種品項，而不是詳細 total
  // var count = 0;
  // for (var i = 0; i < list.length; i++) {
  //     count = list[i].qty + count;
  // }

  // list 是一個有很多 object 的清單，object 裡面有個欄位是 qty

  // 將數量顯示在購物車的數字上
  const cartCount = document.querySelector('.number');
  const howManu = document.querySelector('.howManu');
  let count = 0;
  // for loop each item of list
  for (const item of list) {
    	count += item.qty;
  }
  cartCount.innerHTML = count;
  howManu.innerHTML = count;
}

// 把他選好的東西加到 list 裡面， list 裡頭有很多 object --> color、size、qty(數量)
// 接下來再把 list 存到 loacalStorage
// 接下來再 update 購物車旁邊的數字

const cart = document.querySelector('.cart');
cart.addEventListener('click', () => {
  window.location = './cart.html';
});


const shoopingcart = document.querySelector('.shoopingcart__mobile-iconbox');
shoopingcart.addEventListener('click', () => {
  window.location = './cart.html';
});
