
		function renderCamp(data) {
			data = JSON.parse(data);
			campaigns = document.getElementById("campaigns");
			slideSize = data['data'].length
			for (let i=0; i<slideSize; i++) {
				let campaign = document.createElement('div')
				campaign.classList.add('campaign')
				// id 拿來記第幾個 campaign
				// `${}`template string -->把變數印出來
				campaign.id=`campaign_${i}`
				if (i != 0) {
					campaign.style.display = "none"
				}

				//塞 image 給創造出來的 div
				//url(${data['data'][i]['picture']}) => 'url(' + data['data'][i]['picture'] + ')' 
				campaign.style.backgroundImage = url('http://18.214.165.31/' + ${data['data'][i]['picture']})
				let container = document.createElement('div')
				container.classList.add('container')
				

				let story = document.createElement('div')
				story.classList.add('story')
				// \n 換行 \r 回到那一行開頭。/([\r\n]+)/g regex 會找 \r n 的字詞， + 指多個，g 指所有
				story.innerHTML = data['data'][i]['story'].replace(/([\r\n]+)/g,"<br>")
				

				let circles = document.createElement('div')
				circles.classList.add('circles')
				for (let j=0; j < data['data'].length; j++) {
					let circle = document.createElement('div')
					circle.classList.add('circle')
				//第 j 個就是 current
					if (i == j) {
						circle.classList.add('current')
					}
					circles.appendChild(circle)
				}
				container.appendChild(story)
				container.appendChild(circles)
				campaign.appendChild(container)

				let left = document.createElement('a')
				//寫了一個 callbackfunction，裡面會執行 showSlides(-1) function，不要它馬上執行
				left.onclick = () => showSlides(-1)
				left.textContent = '←'
				left.classList.add('prev')

				let right = document.createElement('a')
				right.onclick = () => showSlides(1)
				right.textContent = '→'
				right.classList.add('next')

				campaigns.appendChild(campaign)
				campaigns.appendChild(left)
				campaigns.appendChild(right)
			}

		}