/* eslint-disable block-scoped-var */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
// 抓資料
const hostname = 'api.appworks-school.tw';
const apiVersion = '1.0';

// api 是 function 的參數，在這個 function 有用到的是 ${api}
// return 一個 Promise 的 object ，強制 function 帶參數
// promise 是先執行，可以先做其他事情，檢查其他事情後，再看他做好沒
// 在這邊是要讓程式不要只停在這邊，所以用了 promise
const get = api => new Promise((resolve) => {
  const xhr = new XMLHttpRequest();
  const loadingImg = document.createElement('img');
  loadingImg.setAttribute('class', 'loadingImg');
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      loadingImg.style.display = "none";
      resolve(JSON.parse(this.responseText));
    } else {
      loadingImg.src = "img/loading.gif";
      document.body.appendChild(loadingImg);
    }
  };
  xhr.open('GET', `https://${hostname}/api/${apiVersion}${api}`);
  xhr.send();
});

// //parse 網址列
// function getUrlVars() {
//     var vars = {};
//     var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
//         vars[key] = value;
//     });
//     return vars;
// }

// //Get URL Parameters With JavaScript
// //https://html-online.com/articles/get-url-parameters-javascript/
// var productId = getUrlVars()["id"];//對應的是 url = 前面的 key
// console.log(productId);

// 把資料印出來
// week2 part2 -- Product Details
const mainImg = document.querySelectorAll('.mainlyImg');
const productDetailTitle = document.querySelector('.productPage__Container__Sub__Sub__Info__Name');
const productDetailId = document.querySelector('.productPage__Container__Sub__Sub__Info__ID');
const productDetailPrice = document.querySelector('.productPage__Container__Sub__Sub__Info__Price');
const colorBoxContainer = document.querySelector('.productPage__Container__Sub__Info__Color');
const sizeBoxContainer = document.querySelector('.productPage__Container__Sub__Info__Size');
const productDetailNote = document.querySelector('.productPage__Container__Sub__Info__Note');
const productDetailTexture = document.querySelector('.productPage__Container__Sub__Info__Note__Content');
const productDetailDescription = document.querySelector('.productPage__Container__Sub__Info__Note__MadeIn');
const materialPlace = document.querySelector('.materialPlace');
const processPlace = document.querySelector('.processPlace');
const moreDetails = document.querySelector('.productPage__Container__Detail');


// 拿網址列問號後面的東西
const querytString = window.location.search;
// slice 只拿這個位置之後的字串 -->>(去找 = 在第幾個位子 + 1)
const id = querytString.slice(querytString.indexOf('=') + 1);


// 宣告一個 function getProductDetails 是要找 /products/details?id=${id}
// call get 這個 function
const getProductDetails = (_id) => {
  const endPoint = `/products/details?id=${_id}`; // 一串字串
  return get(endPoint); // endpoint 的字串會跑到 get function api 值裡
};

const getColorNameBycode = (data, colorCode) => {
  for (let w = 0; w < data.data.colors.length; w += 1) {
    if (colorCode === data.data.colors[w].code) {
      return data.data.colors[w].name;
    }
  }
  return null;
};

// 宣告 function 把拿到的 data 畫出來
const printProductDetails = (data) => {
  mainImg[0].setAttribute('src', data.data.main_image);
  productDetailTitle.appendChild(document.createTextNode(data.data.title));
  productDetailId.appendChild(document.createTextNode(data.data.id));
  productDetailPrice.appendChild(document.createTextNode(`TWD.${data.data.price}`));

  for (let i = 0; i < data.data.colors.length; i += 1) {
    const colorBoxBorder = document.createElement('div');
    colorBoxBorder.setAttribute('class', 'colorBoxBorder');
    const img = document.createElement('img');
    const colorBox = document.createElement('div');
    colorBox.setAttribute('class', 'productPage__Container__Sub__Info__Color__block');

    img.style.backgroundColor = `#${data.data.colors[i].code}`;
    colorBox.appendChild(img);
    colorBoxBorder.appendChild(colorBox);
    colorBoxContainer.appendChild(colorBoxBorder);
  }

  for (let i = 0; i < data.data.sizes.length; i += 1) {
    const sizeBox = document.createElement('div');
    sizeBox.setAttribute('class', 'productPage__Container__Sub__Info__Size__Size__Block');
    const p = document.createElement('p');
    p.appendChild(document.createTextNode(data.data.sizes[i]));
    sizeBoxContainer.appendChild(sizeBox);
    sizeBox.appendChild(p);
  }

  productDetailNote.appendChild(document.createTextNode(data.data.note));
  productDetailTexture.appendChild(document.createTextNode(data.data.texture));
  const str = data.data.description;
  const str1 = str.slice(0, str.indexOf('\r\n'));
  const str2 = str.slice(str.indexOf('\r\n') + 1);
  const br = document.createElement('br');
  productDetailDescription.appendChild(document.createTextNode(str1));
  productDetailDescription.appendChild(br);
  productDetailDescription.appendChild(document.createTextNode(str2));
  materialPlace.appendChild(document.createTextNode(`素材產地/${data.data.place}`));
  processPlace.appendChild(document.createTextNode(`加工產地/${data.data.place}`));

  for (let i = 0; i < data.data.images.length; i += 1) {
    const productDetailStory = document.createElement('div');
    productDetailStory.setAttribute('class', 'productPage__Container__Detail__Text');
    productDetailStory.appendChild(document.createTextNode(data.data.story));

    const detailImgContainer = document.createElement('div');
    detailImgContainer.setAttribute('class', 'productPage__Container__Detail');
    const productDetailImg = document.createElement('img');
    productDetailImg.setAttribute('class', 'productPage__Container__Detail__Pic');
    productDetailImg.setAttribute('src', data.data.images[i]);
    detailImgContainer.appendChild(productDetailImg);

    moreDetails.appendChild(productDetailStory);
    moreDetails.appendChild(detailImgContainer);
  }
};

// 這邊的 data 要再問一次
// 真正執行 gerProductDetails 會回傳去 promise
// .then 是為了看 promiise 好了沒，好了就會執行裡頭的 function
// function data 參數跟 function 裡面一樣就好
getProductDetails(id).then((data) => {
  printProductDetails(data);
  // eslint-disable-next-line no-use-before-define
  productHandleStock(data);
  // eslint-disable-next-line no-undef
  getlocalStorage(data);
  // --->這裡要把 localStorage 的 data 傳進來
});


// product_page redirect
const men__Button = document.querySelector('.men__Button');
const women__Button = document.querySelector('.women__Button');
const accessories__Button = document.querySelector('.accessories__Button');
const btn_logo01 = document.querySelector('.btn_logo01');
const member = document.querySelector('.member');
const member__iconbox = document.querySelector('.member__mobile-iconbox');

men__Button.addEventListener('click', () => {
  window.location = './index.html?men';
});

women__Button.addEventListener('click', () => {
  window.location = './index.html?women';
});

accessories__Button.addEventListener('click', () => {
  window.location = './index.html?accessories';
});

btn_logo01.addEventListener('click', () => {
  window.location = './index.html';
});

member.addEventListener('click', () => {
  window.location = 'profile.html';
});


member__iconbox.addEventListener('click', () => {
  window.location = 'profile.html';
});
/* Array of object 轉成 object of object
const data = {
    '#fff': {
        's': 3,
        'm': 2,
        'l': 1,
    }
}

const colors = Object.keys(data); // ['#fff', '#000']

*/

// part3
// 拿資料 varant
// 點了一個顏色後就去掃這個 JSON varant，找到對應的顏色後跟各 size 的數量
// 如果 stock 是 0 size 按鈕就不能按
// 如果 stock = JSON 的

// 當我的 + 到某個數量的時候，就會變灰色，然後不能再 + //設定 id
// 當我的 - 到 0 的時候就不能再減 //設定 id

// 顏色或尺寸被選擇時css改變

// 拿 variants 值

// 點某個顏色，當他尺寸沒的時候，要反灰或反黑

function productHandleStock(data) {
  console.log(data.data.variants);

  // function checkStockColor(data) {
  //   const productPage__Container__Sub__Info__Size__Size__Block__Selected = document.querySelector('.productPage__Container__Sub__Info__Size__Size__Block__Selected');
  //   if (productPage__Container__Sub__Info__Size__Size__Block__Selected) {
  //     const size__Value = document.querySelector('.productPage__Container__Sub__Info__Size__Size__Block__Selected p').innerHTML;
  //     for (let i = 0; i < data.data.variants.length; i += 1) {
  //       if (data.data.variants[i].size === size__Value) {
  //         if (data.data.variants[i].stock === 0) {
  //           const productPage__Container__Sub__Info__Color__block = document.querySelectorAll('.productPage__Container__Sub__Info__Color__block');
  //           for (let j = 0; j < productPage__Container__Sub__Info__Color__block.length; j += 1) {
  //             const color__Value = productPage__Container__Sub__Info__Color__block[j].innerHTML.match(/\d+/g).map(Number);
  //             const color = `${Number(color__Value[0]).toString(16)}${Number(color__Value[1]).toString(16)}${Number(color__Value[2]).toString(16)}`.toUpperCase();
  //             if (color === data.data.variants[i].color_code) {
  //               productPage__Container__Sub__Info__Color__block[j].className += ' outOfStockColor';
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // }


  // function toggleOutOfStockColor() {
  //   const outOfStock = document.querySelectorAll('.outOfStockColor');

  //   // 先把 ourOfStock 回復成原本的顏色
  //   outOfStock.forEach((element) => {
  //     // eslint-disable-next-line no-param-reassign
  //     element.className = 'productPage__Container__Sub__Info__Color__block';
  //   });
  // }

  const productHandleStock__Color = document.querySelectorAll('.productPage__Container__Sub__Info__Color__block');
  productHandleStock__Color.forEach((element) => {
    element.addEventListener('click', () => {
      if (document.querySelector('.productPage__Container__Sub__Info__Color__block__Selected') === element) {
        // 有的會變沒有，沒有的變有，把這個 class 移除掉
        element.classList.toggle('productPage__Container__Sub__Info__Color__block__Selected');
      } else {
        const productHandleStock__Colors = document.querySelectorAll('.productPage__Container__Sub__Info__Color__block');
        productHandleStock__Colors.forEach((elements) => {
          // classname 沒有 outOfStockColor 的情況下，如果沒有值會是-1
          if (elements.className.indexOf('outOfStockColor') < 0) {
            elements.className = 'productPage__Container__Sub__Info__Color__block';
          }
        });

        element.className += ' productPage__Container__Sub__Info__Color__block__Selected';
      }
    });
  });

  // function checkStockSize() {
  //   const productPage__Container__Sub__Info__Color__block__Selected = document.querySelector('.productPage__Container__Sub__Info__Color__block__Selected');
  //   if (productPage__Container__Sub__Info__Color__block__Selected) {
  //     // color_Value 是先讀出 rgb ， //color_Value_Hex 就是把 rgb 10 進位轉成 16 進位(Api 是 16 進位，但 css 是 10 進位)
  //     const color__Value = document.querySelector('.productPage__Container__Sub__Info__Color__block__Selected img').style.backgroundColor.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)/i);// 把空白字元去掉，match 是找 rgb 裡面的值
  //     const color__Value__Hex = `${Number(color__Value[1]).toString(16)}${Number(color__Value[2]).toString(16)}${Number(color__Value[3]).toString(16)}`.toUpperCase();
  //     for (let i = 0; i < data.data.variants.length; i += 1) {
  //       // 這裡的 data 是最外層 function productHandleStock(data) 的 data
  //       if (data.data.variants[i].color_code === color__Value__Hex) {
  //         if (data.data.variants[i].stock === 0) {
  //           const productPage__Container__Sub__Info__Size__Size__Block = document.querySelectorAll('.productPage__Container__Sub__Info__Size__Size__Block');
  //           // eslint-disable-next-line max-len
  //           for (let j = 0; j < productPage__Container__Sub__Info__Size__Size__Block.length; j += 1) {
  //             if (productPage__Container__Sub__Info__Size__Size__Block[j].innerHTML === `<p>${data.data.variants[i].size}</p>`) {
  //               productPage__Container__Sub__Info__Size__Size__Block[j].className += ' outOfStockSize';
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // }

  // function toggleOutOfStockSize() {
  //   const outOfStock = document.querySelectorAll('.outOfStockSize');
  //   outOfStock.forEach((element) => {
  //     // eslint-disable-next-line no-param-reassign
  //     element.className = 'productPage__Container__Sub__Info__Size__Size__Block__Selected';
  //   });
  // }

  const productHandleStock__Size = document.querySelectorAll('.productPage__Container__Sub__Info__Size__Size__Block');
  productHandleStock__Size.forEach((element) => {
    element.addEventListener('click', () => {
      if (document.querySelector('.productPage__Container__Sub__Info__Size__Size__Block__Selected') === element) {
        element.classList.toggle('productPage__Container__Sub__Info__Size__Size__Block__Selected');
      } else {
        const productHandleStock__Sizes = document.querySelectorAll('.productPage__Container__Sub__Info__Size__Size__Block');
        productHandleStock__Sizes.forEach((elements) => {
          if (elements.className.indexOf('outOfStockSize') < 0) {
            elements.className = 'productPage__Container__Sub__Info__Size__Size__Block';
          }
        });
        element.classList += ' productPage__Container__Sub__Info__Size__Size__Block__Selected';
      }
 
      const productPage__Container__Sub__Info__Color__block__Selected = document.querySelector('.productPage__Container__Sub__Info__Color__block__Selected');
      const productPage__Container__Sub__Info__Size__Size__Block__Selected = document.querySelector('.productPage__Container__Sub__Info__Size__Size__Block__Selected');
    });
  });

  const productPage__Container__Sub__Info__Amount__Container__Minus = document.querySelector('.productPage__Container__Sub__Info__Amount__Container__Minus');
  const productPage__Container__Sub__Info__Amount__Container__Plus = document.querySelector('.productPage__Container__Sub__Info__Amount__Container__Plus');
  const productPage__Container__Sub__Info__Amount__Container__Num = document.querySelector('.productPage__Container__Sub__Info__Amount__Container__Num');

  function minus() {
    if (Number(productPage__Container__Sub__Info__Amount__Container__Num.innerHTML) > 0) {
      // eslint-disable-next-line max-len
      productPage__Container__Sub__Info__Amount__Container__Num.innerHTML = Number(productPage__Container__Sub__Info__Amount__Container__Num.innerHTML) - 1;
    }
  }

  function plus() {
    const productPage__Container__Sub__Info__Color__block__Selected = document.querySelector('.productPage__Container__Sub__Info__Color__block__Selected');
    const productPage__Container__Sub__Info__Size__Size__Block__Selected = document.querySelector('.productPage__Container__Sub__Info__Size__Size__Block__Selected');
    if (productPage__Container__Sub__Info__Color__block__Selected && productPage__Container__Sub__Info__Size__Size__Block__Selected) {
      const color__Value = document.querySelector('.productPage__Container__Sub__Info__Color__block__Selected img').style.backgroundColor.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)/i);
      const color__Value__Hex = `${Number(color__Value[1]).toString(16)}${Number(color__Value[2]).toString(16)}${Number(color__Value[3]).toString(16)}`.toUpperCase();
      const size__Value = document.querySelector('.productPage__Container__Sub__Info__Size__Size__Block__Selected p').innerHTML;

      // Number 是自己定義的
      // eslint-disable-next-line no-undef
      // eslint-disable-next-line no-use-before-define
      maxAmount = findMaxAmount(data, color__Value__Hex, size__Value);
      if (maxAmount > Number(productPage__Container__Sub__Info__Amount__Container__Num.innerHTML)) {
        productPage__Container__Sub__Info__Amount__Container__Num.innerHTML = Number(productPage__Container__Sub__Info__Amount__Container__Num.innerHTML) + 1;
      }
    }
  }

  // 只有 minus 跟 plus 跟 findMaxAmount function 有用到
  productPage__Container__Sub__Info__Amount__Container__Minus.addEventListener('click', minus);
  productPage__Container__Sub__Info__Amount__Container__Plus.addEventListener('click', plus);


  // data 是 api 回傳的 後面兩個參數是我自己定義的
  // 如果是相同的顏色且相同的尺寸， stock 就會回傳回去
  function findMaxAmount(data, color__Value__Hex, size__Value) {
    for (let i = 0; i < data.data.variants.length; i += 1) {
      if (data.data.variants[i].color_code === color__Value__Hex && data.data.variants[i].size === size__Value) {
        const maxAmount = data.data.variants[i].stock;
        const productPage__Container__Sub__Info__Amount__Container__Num = document.querySelector('.productPage__Container__Sub__Info__Amount__Container__Num');

        // //跳到不同尺寸的時候的數量變回原本的 max amount
        if (Number(productPage__Container__Sub__Info__Amount__Container__Num.innerHTML) > maxAmount) {
          productPage__Container__Sub__Info__Amount__Container__Num.innerHTML = maxAmount;
        }
        return maxAmount;
      }
    }
  }

  // 一開始數量的框框要是 opacity 0.1
  const productPage__Container__Sub__Info__Amount__Container = document.querySelector('.productPage__Container__Sub__Info__Amount__Container');
  productPage__Container__Sub__Info__Amount__Container.style.opacity = 0.1;

  // 點擊加入購物車後要改 style
  const clickMe = document.getElementById('clickMe');
  clickMe.addEventListener('click', () => {
    clickMe.style.opacity = 0.5;
    setTimeout(() => { clickMe.style.opacity = 1; }, 200);
  });

  // 做整個頁面點擊，判斷尺寸＋顏色有沒有庫存
  document.addEventListener('click', () => {
    console.log('click');
    const productPage__Container__Sub__Info__Amount__Container__Minus = document.querySelector('.productPage__Container__Sub__Info__Amount__Container__Minus');
    const productPage__Container__Sub__Info__Amount__Container__Plus = document.querySelector('.productPage__Container__Sub__Info__Amount__Container__Plus');
    const productPage__Container__Sub__Info__Amount__Container__Num = document.querySelector('.productPage__Container__Sub__Info__Amount__Container__Num');
    const productPage__Container__Sub__Info__Amount__Container = document.querySelector('.productPage__Container__Sub__Info__Amount__Container');
    const cart_p = document.querySelector('.cart_p p');
    const productPage__Container__Sub__Info__Color__block__Selected = document.querySelector('.productPage__Container__Sub__Info__Color__block__Selected');
    if (productPage__Container__Sub__Info__Color__block__Selected) {
      // 把 color 的值從 10 進位轉成 16 進位
      const color__Value = document.querySelector('.productPage__Container__Sub__Info__Color__block__Selected img').style.backgroundColor.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)/i);
      var color__Value__Hex = `${Number(color__Value[1]).toString(16)}${Number(color__Value[2]).toString(16)}${Number(color__Value[3]).toString(16)}`.toUpperCase();
    }

    const productPage__Container__Sub__Info__Size__Size__Block__Selected = document.querySelector('.productPage__Container__Sub__Info__Size__Size__Block__Selected');
    if (productPage__Container__Sub__Info__Size__Size__Block__Selected) {
      var size__Value = document.querySelector('.productPage__Container__Sub__Info__Size__Size__Block__Selected p').innerHTML;
    }
    if (productPage__Container__Sub__Info__Color__block__Selected && productPage__Container__Sub__Info__Size__Size__Block__Selected) {
      const maxAmount = findMaxAmount(data, color__Value__Hex, size__Value);
      if (maxAmount === 0) {
        productPage__Container__Sub__Info__Amount__Container__Num.innerHTML = '0';
        productPage__Container__Sub__Info__Amount__Container.className = 'productPage__Container__Sub__Info__Amount__Container_opacity';
      } else if (Number(productPage__Container__Sub__Info__Amount__Container__Num.innerHTML) > maxAmount) {
        productPage__Container__Sub__Info__Amount__Container__Num.innerHTML = maxAmount;
      }
    }
    // 如果我只點顏色或尺寸或沒有點，opacity = 0.5
    if (productPage__Container__Sub__Info__Size__Size__Block__Selected && productPage__Container__Sub__Info__Color__block__Selected) {
      productPage__Container__Sub__Info__Amount__Container.style.opacity = 1;
      cart_p.style.opacity = 1;
    } else {
      console.log(productPage__Container__Sub__Info__Amount__Container);
      productPage__Container__Sub__Info__Amount__Container.style.opacity = 0.1;
    }
  });
}
