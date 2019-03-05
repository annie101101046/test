const querytString = window.location.search;
// slice 只拿這個位置之後的字串 -->>(去找 = 在第幾個位子 + 1)
const orderNum = querytString.slice(querytString.indexOf('=') + 1);

// 宣告一個 function getProductDetails 是要找 /products/details?id=${id}
// call get 這個 function

const printOrderNumber = (data) => {
  const header = document.querySelector('.header');
  const checkmark = document.querySelector('.checkmark');
  header.innerHTML = '感謝您的訂購：）';
  checkmark.innerHTML = `您的訂單編號是：${data}`;
};

printOrderNumber(orderNum);
