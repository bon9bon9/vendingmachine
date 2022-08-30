var dbUser = {유사원:{잔돈:10000,구매액:0},
			  이대리:{잔돈:10000,구매액:0},
			  김과장:{잔돈:10000,구매액:0},
			  박차장:{잔돈:10000,구매액:0}};
var dbDrink={사이다:{가격:800,수량:7,누적판매수량:0},
			 콜라:{가격:1000,수량:5,누적판매수량:0},
			 탄산수:{가격:1200,수량:3,누적판매수량:0}};
var dbHistory=[{시간:'시간',구매자:'구매자',상품:'상품',수량:'수량',수익:'매입/매출'}]


var jandon=0;

$(function(){
	//1.로그인하는 기능
	$('#firstPage>input:button').click(function(){
		var inputName = $('#firstPage>input:text').val();
		if(inputName=='나사장'){
			$('.leftBox').empty();
			$('#firstPage').addClass('dontshow').removeClass('show');
			$('#masterPage').removeClass('dontshow').addClass('show');
			load_leftBox();
		}
		else if(inputName=='유사원'||inputName=='이대리'||inputName=='김과장'||inputName=='박차장'){
			$('#firstPage').addClass('dontshow').removeClass('show');
			$('#userPage').removeClass('dontshow').addClass('show');
			$('#profile>h2:nth-child(2)').text(inputName);
			$('#profile>h2:nth-child(4)').text(dbUser[inputName].잔돈);
			load_leftBox();
		}
		else{
			alert('등록된 사용자가 아닙니다. 다시 입력해 주세요.');
		}
	});//1. 로그인 하는 기능 함수 닫음

	//2. range 수량 값 바뀔때
	$(document).on('click','.item input',function(){
		var total=parseInt($('#cartTotal>div').text());
		var count=$(this).val();//몇갠지
		var price=$(this).prev().text();//얼만지
		var name=$(this).prev().prev().text();//상품명은 뭔지
		$(this).next().text(count);

		if($('.cart:contains('+name+')').length ==0&&count>0){
			$('.cartList').append('<tr class="cart"><td>'+name+'</td><td>'+count+'</td><td>'+(price*count)+'</td></tr>');
			total+=price*count;
		}
		else if(count==0){
			total-=$('.cart:contains('+name+')>td:last').text();
			$('.cart:contains('+name+')').remove();
		}
		else{
			$('.cart:contains('+name+')>td:first').text(name);
			$('.cart:contains('+name+')>td:nth-child(2)').text(count);
			total+=price*count-$('.cart:contains('+name+')>td:last').text();
			$('.cart:contains('+name+')>td:last').text(price*count);
		}
		$('#cartTotal>div').text(total);
	}); //2. 수량값 바뀔때 함수 닫음

	//3. 결제 버튼 누를때
	$(document).on('click','#cartTotal input:first',function(){
		var userName=$('#profile>h2:nth-child(2)').text()
		var total=$('#cartTotal>div').text()
		var input=parseInt($('#inputTotal>span').text());
		if(total>input){
			alert('투입 금액이 총액보다 적습니다.')
		}
		else{
			alert('결제하였습니다.')
			var loginName=$('#profile>h2:nth-child(2)').text();
			dbUser[loginName].구매액+=parseInt(total);
			
			$('#profile>h2:nth-child(4)').text(dbUser[userName].잔돈-input);
			dbUser[userName].잔돈-=input;
			$('#cartTotal>div').text(0);
			
			for(var i=0; i<$('.cart').length;i++){
				var cartName = $('.cart:eq('+i+')>td:first').text();
				var cartCount = $('.cart:eq('+i+')>td:nth-child(2)').text();
				var now=getNow();
				dbHistory.push({시간:now,구매자:loginName,상품:cartName,수량:cartCount*(-1),수익:cartCount*dbDrink[cartName].가격});
				dbDrink[cartName].수량-=cartCount;
				dbDrink[cartName].누적판매수량+=parseInt(cartCount);
			}
			$('.cartList').empty();
			jandon+=input-total;
			$('#jandon>div').text(jandon);
			$('#inputTotal>span').text(0);
			load_leftBox();
		}
	})//3. 결제버튼 누를때 종료

	//4. 로그아웃 버튼
	$('button').click(function(){
		$('#userPage').addClass('dontshow').removeClass('show');
		$('#masterPage').addClass('dontshow').removeClass('show');
		$('#firstPage').removeClass('dontshow').addClass('show');
		$('.cartList').empty();
		$('thead').empty();
		$('tbody').empty();
		$('#downloadExcel').addClass('dontshow');
	})// 4.로그아웃 버튼 눌렀을때

	//5. 1000원 투입/빼기 버튼 눌렀을때
	$('#inputTotal>input').click(function(){
		var now=parseInt($('#inputTotal>span').text());
		var remain=parseInt($('#profile>h2:nth-child(4)').text());
		if($(this).val()=="+1000"){
			if(now+1000>remain){
				alert('잔액보다 많이 투입할 수 없습니다.');
			}
			else{
				$('#inputTotal>span').text(now+1000);
			}
		}
		else{
			if(now-1000<0){
				alert('투입금액은 음수가 될 수 없습니다.')
			}
			else{
				$('#inputTotal>span').text(now-1000);
			}
		}
	});//5번 기능 닫기

	//6.회수하기버튼누를때
	$('#jandon>input').click(function(){
		var loginName=$('#profile>h2:nth-child(2)').text();
		dbUser[loginName].잔돈+=jandon;
		jandon=0;
		$('#profile>h2:nth-child(4)').text(dbUser[loginName].잔돈);
		$('#jandon>div').text(0);

	});//6번 기능 닫기

	//7. 상품 새로 입력할 때
	$('#addItem>input:button').click(function(){
		var name=$('#addItem>input:nth-child(1)').val();
		var price=$('#addItem>input:nth-child(2)').val();
		var count=parseInt($('#addItem>input:nth-child(3)').val());
		if(name==''){
			alert('상품명을 입력하세요');
		}
		else if(price==''){
			alert('가격을 입력하세요');
		}
		else if(count==''){
			alert('수량을 입력하세요');
		}
		else{
			if($('.leftBox:contains('+name+')').length ==0&&count>0){
				dbDrink[name]={가격:price, 수량:count, 누적판매수량:0};
			}
			else{
				dbDrink[name].가격=price;
				dbDrink[name].수량+=count;
			}
			var now=getNow();
			dbHistory.push({시간:now,구매자:'나사장',상품:name,수량:count*(1),수익:count*price*(-1)});
		}
		$('#addItem>input:nth-child(1)').val('');
		$('#addItem>input:nth-child(2)').val('');
		$('#addItem>input:nth-child(3)').val('');
		load_leftBox();
	})// 7번 기능 닫음

	//8번. 재시작 버튼
	$("#restart").click(function(){
		for(users in dbUser){
			dbUser[users].잔돈+=10000;
		}
		alert("재시작하여 모든 고객의 잔돈이 10000원 충전되었습니다.")
	});// 8번 기능 닫음

	//9번. 정산하기 버튼 눌렀을 때
	$("#calculate>input").click(function(){
		$('thead').empty();
		$('tbody').empty();
		$('#rank>thead').append('<tr><th><이용자 순위></th></tr><tr><th>순위</th><th>이름</th><th>구매액</th></tr>');
		$('#history>thead').append('<tr><th><판매 내역></th></tr><tr><th>시간</th><th>구매자</th><th>상품명</th><th>수량</th><th>매입/매출</th></tr>');
		$('#drinksRank>thead').append('<tr><th><음료 총 판매량></th></tr><tr><th>순위</th><th>음료명</th><th>총 판매량</th></tr>');

		//$('#rank').append('<tr><td>순위</td><td>이름</td><td>구매액</td></tr>');
		var sortedList = Object.keys(dbUser).sort(function(a,b){
			return dbUser[b].구매액-dbUser[a].구매액;
		});
		for(key in sortedList){
			$('#rank>tbody').append('<tr><th>'+(parseInt(key)+1)+'</th><td>'+sortedList[key]+'</td><td>'+dbUser[sortedList[key]].구매액+'</td></tr>');
		}

		for(key=1;key<dbHistory.length;key++){
			$('#history>tbody').append('<tr><td>'+dbHistory[key].시간+'</td><td>'+dbHistory[key].구매자+'</td><td>'+dbHistory[key].상품+'</td><td>'+dbHistory[key].수량+'</td><td>'+dbHistory[key].수익+'</td></tr>')
		}
		$('#downloadExcel').removeClass('dontshow');

		var drinkList = Object.keys(dbDrink).sort(function(a,b){
			return dbDrink[b].누적판매수량-dbDrink[a].누적판매수량;
		});
		for(key in drinkList){
			$('#drinksRank').append('<tr><th>'+(parseInt(key)+1)+'</th><td>'+drinkList[key]+'</td><td>'+dbDrink[drinkList[key]].누적판매수량+'</td></tr>');
		}
		if(dbDrink[drinkList[0]].누적판매수량!=0){
			dbDrink[drinkList[0]].가격=parseInt(dbDrink[drinkList[0]].가격)+100;
			alert('가장 인기 상품인 '+drinkList[0]+'의 가격을 100원 인상합니다.')
			load_leftBox();
		}

	});//9번 기능 끝

	//10번 기능 엑셀 다운로드
	$('#downloadExcel').click(function(){
		alert('1');
		exportExcel();
	});//10번 기능 끝


}); // 전체 function로드 닫음

// 옆에 로드하는 함수
var load_leftBox = function(){
	$('.leftBox').empty();
	for(drinks in dbDrink){
		if($('#masterPage').hasClass("show")==true){
			$('#masterPage .leftBox').append('<div class="item btn btn-outline-success"><p>상품명</p><p>가격</p>현재 수량 : <span></span></div>')
			var pwd='#masterPage .leftBox>div:last-child';
			$(pwd+'>span').text(dbDrink[drinks].수량);
		}
		else{
			$('#userPage .leftBox').append('<div class="item btn btn-outline-success"><p>상품명</p><p>가격</p><input type="range" class="form-range" min="0" max="5" value="0" step="1" name=""><span>0</span>개</div>')
			var pwd='#userPage .leftBox>div:last-child';
			$(pwd+'>input').attr('max',dbDrink[drinks].수량);
		}
		$(pwd+'>p:first').text(drinks);
		$(pwd+'>p:last').text(dbDrink[drinks].가격);
		if(dbDrink[drinks].수량==0&&$('#masterPage').hasClass("show")==false){
			document.querySelector(".leftBox").lastChild.firstChild.textContent+='[품절]';
		}
		else if(dbDrink[drinks].수량==0){
			document.querySelectorAll(".leftBox")[1].lastChild.firstChild.textContent+='[품절]';
		}
	}
	$('#firstPage>input:text').val("");
}//load_leftBox 닫기

var getNow = function(){
	var Now = new Date();
	var NowTime = Now.getFullYear();
	NowTime += '-' + (Now.getMonth()+1);
	NowTime += '-' + Now.getDate();
	NowTime += ' ' + Now.getHours();
	NowTime += ':' + Now.getMinutes();
	NowTime += ':' + Now.getSeconds();
	return NowTime;
}

//엑셀 다운로드를 위한..
function s2ab(s) { 
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;    
}
function exportExcel(){ 
    // step 1. workbook 생성
    var wb = XLSX.utils.book_new();

    // step 2. 시트 만들기 
    var newWorksheet = excelHandler.getWorksheet();
    
    // step 3. workbook에 새로만든 워크시트에 이름을 주고 붙인다.  
    XLSX.utils.book_append_sheet(wb, newWorksheet, excelHandler.getSheetName());

    // step 4. 엑셀 파일 만들기 
    var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});

    // step 5. 엑셀 파일 내보내기 
    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), excelHandler.getExcelFileName());
}

var excelHandler = {
	getExcelFileName : function(){
		return 'na_sa_jang.xlsx';
	},
	getSheetName : function(){
		return '매입_매출';
	},
	getExcelData : function(){
		return document.getElementById('history'); 
	},
	getWorksheet : function(){
		return XLSX.utils.table_to_sheet(this.getExcelData());
	}
}