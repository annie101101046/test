//facebook initialize
		window.fbAsyncInit = function() {
		    FB.init({
		      appId      : '157112091854354',
		      cookie     : true,
		      xfbml      : true,
		      version    : 'v3.2'
		    });
		      
		    FB.AppEvents.logPageView();
//在整個網頁 load 完以後，才把 FB init 起來，才做 getLoginStatus
		    FB.login(function(response) {
		    console.log(response);
   			statusChangeCallback(response);
}, {scope: 'public_profile,email'});
		  };

		  (function(d, s, id){
		     var js, fjs = d.getElementsByTagName(s)[0];
		     if (d.getElementById(id)) {return;}
		     js = d.createElement(s); js.id = id;
		     js.src = "https://connect.facebook.net/en_US/sdk.js";
		     fjs.parentNode.insertBefore(js, fjs);
		   }(document, 'script', 'facebook-jssdk'));

		 //facebook會在網頁load進來後拿到這些 response
		 //已判斷是不是已經 login 
		 //如果沒 login ，就再去拿 FB login 的 function




//response 給的資料
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


//如果 status 沒有 connected，就要去拿 FB login 的 function
//statusChangeCallback(response)在上面被 call 過了，拿到了 accessToken，FB 會幫處理
function statusChangeCallback(response){
	if(response.status !== 'connected'){
		FBlogin();
		return;
	} 

	FB.api(
//https://developers.facebook.com/docs/graph-api/reference/user
  			'/me', //直接拿 login 這個人的資料
  			'GET',
  			{"fields":"picture.type(large), email, name"},
  			function(response) {
  			coxnsole.log(response)
  			var header = document.querySelector('.header');
  			header.style.backgroundImage = `url('${response['picture']['data']['url']}')`;
  			var checkmark = document.querySelector('.checkmark');
  			checkmark.innerHTML = '姓名： ' + response['name'];
  			var crossmark = document.querySelector('.crossmark');
  			crossmark.innerHTML = 'Email： ' + response['email'];
      // Insert your code here
  			}
	);
	}
	//reply 回來的樣子
	// {
 //  "name": "Your Name",
 //  "id": "your-user-id"
	// }

function FBlogin(){


}

