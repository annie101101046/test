/* eslint-disable no-shadow */
/* eslint-disable prefer-const */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable no-tabs */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-undef */
// facebook initialize
// fb 的元件初始化

function checkLogin() {
  FB.getLoginStatus((response) => {
	 const fbButton = document.querySelector('.fb-login-button');
	 const loadingImg = document.createElement('img');
	 const header = document.querySelector('.header');
	 // 在 callback function 拿到資料後就會被覆寫
	 header.style.backgroundImage = 'url(img/loading.gif)';
	 loadingImg.setAttribute('class', 'loadingImg');
	 if (response.status === 'connected') {
		 statusChangeCallback(response);
		 loadingImg.style.display = 'none';
	 }
  });
}

window.fbAsyncInit = function () {
		    FB.init({
		      appId: '157112091854354',
		      cookie: true,
		      xfbml: true,
		      version: 'v3.2',
		    });
		    FB.AppEvents.logPageView();
		    checkLogin();
		  };
// 在整個網頁 load 完以後，才把 FB init 起來，才做 getLoginStatus
// 		    FB.login(function(response) {
// 		    console.log(response);
//    			statusChangeCallback(response);

// }, {scope: 'public_profile,email'});

// 初始化完成以後，要判斷有沒有 log in

		  (function (d, s, id) {
		     let js; const
    fjs = d.getElementsByTagName(s)[0];
		     if (d.getElementById(id)) { return; }
		     js = d.createElement(s); js.id = id;
		     js.src = 'https://connect.facebook.net/en_US/sdk.js';
		     fjs.parentNode.insertBefore(js, fjs);
		   }(document, 'script', 'facebook-jssdk'));

		 // facebook會在網頁load進來後拿到這些 response
		 // 已判斷是不是已經 login
		 // 如果沒 login ，就再去拿 FB login 的 function

// response 給的資料
// {
//     status: 'connected',
//     authResponse: {
//         accessToken: '...',
//         expiresIn:'...',
//         reauthorize_required_in:'...'
//         signedRequest:'...',
//         userID:'...'
//     }
// }


// 如果 status 沒有 connected，就要去拿 FB login 的 function
// statusChangeCallback(response)在上面被 call 過了，拿到了 accessToken，FB 會幫處理
function statusChangeCallback(response) {
  FB.api(
    // https://developers.facebook.com/docs/graph-api/reference/user
    '/me', // 直接拿 login 這個人的資料
    'GET',
    { fields: 'picture.type(large), email, name' },
    (response) => {
      const header = document.querySelector('.header');
      header.style.backgroundImage = `url('${response.picture.data.url}')`;

      const checkmark = document.querySelector('.checkmark');
      checkmark.innerHTML = `姓名： ${response.name}`;
      const crossmark = document.querySelector('.crossmark');
      crossmark.innerHTML = `Email： ${response.email}`;
      // Insert your code here
    },
  );
}
// reply 回來的樣子
// {
//  "name": "Your Name",
//  "id": "your-user-id"
// }
