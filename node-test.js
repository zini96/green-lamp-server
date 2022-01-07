//node는 Common JS를 사용
//import할때 require사용

const http = require('http');
//127.0.0.1 = 내 컴퓨터 주소(localhost와 같다)
const hostname = "127.0.0.1";
const port = 8080;

//서버만들기 createServer
const server = http.createServer(function(req,res){ 
    //요청되는 정보 req ->method, url을 다 가지고있음
    //응답하는 정보 res
    const path = req.url;
    const method = req.method;
    if(path === "/products"){
        if(method === "GET"){
            //응답을 보낼때 json객체타입을 헤더에 보내기
            res.writeHead(200,{'Content-Type':"application/json"})
            const products = JSON.stringify([  //stringify 문자로 바꿔주는 메서드
                {
                    name:"거실조명",
                    price:50000
                }
            ])
            res.end(products);
        }else if(method === "POST"){
            res.end("생성되었습니다.")
        }
    }
    console.log('요청하는 정보 : ', req);
    res.end("Hello Client!");
})

//
server.listen(port,hostname);
console.log('그린 조명 서버 on!');