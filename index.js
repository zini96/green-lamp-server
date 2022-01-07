const express = require("express");
const cors = require("cors");
const app = express();
//heroku에서 지정하는게 있으면 그 포트번호를 사용하고, 없으면 8080포트를 사용하도록 설정
const port = process.env.PORT || 8080;
const models = require('./models');
app.use("/upload",express.static("upload"));
//업로드 이미지를 관리하는 스토리지 서버로 멀터 사용
const multer = require('multer');
//이미지 파일을 받고 저장할 위치 지정
const upload = multer({
    storage: multer.diskStorage({
        destination:function(req,file,cd){
            //어디에 저장할지 지정
            cd(null,'upload/')
        },
        filename: function(req,file,cd){
            //어떤이름으로 저장할지 지정
            //받은 파일에 있는 원본이름으로 저장
            cd(null,file.originalname)
        }
    })
})

//json형식의 데이터를 처리할수 있게 설정하는 코드
app.use(express.json());
//브라우저의 CORS이슈를 막기위해 사용하는 코드
app.use(cors());

// get방식 응답 지정
app.get('/products',async(req,res)=>{
    //get방식 쿼리데이터 전송 
    const queryString = req.query; //데이터 받기(GET방식의 데이터는 query에 담겨있음)
    //console.log(queryString.id);
    //console.log(queryString.name);
    //데이터베이스 조회하기
    //findAll 전체항목 조회 findOne 하나만 조회
    //조건지정가능
    //limit로 항목 갯수 지정
    //order 정렬변경
    //attributes 원하는 컬럼만 선택하기
    //Product=>table이름
    models.Product.findAll({
        limit:16,
        order:[
            ["createdAt","DESC"]
        ],
        attributes:[
            "id",
            "name",
            "price",
            "seller",
            "createdAt",
            "imageUrl"
        ]
    })
    .then((result)=>{
        res.send({
            product: result
        })
    })
    .catch((error)=>{
        console.log(error);
        res.send('데이터를 가져오지 못했습니다.')
    })
})


//post방식 응답 지정
app.post('/products',async(req,res)=>{
    const body = req.body; //데이터 받기(POST방식의 데이터는 body에 담겨있음)
    const {name,description,price,seller,imageUrl} = body;
    //Product테이블에 데이터 삽입
    //구문 > models.테이블이름.create
    models.Product.create({  //컬럼명:받아온 값
        name:name,
        description: description,
        price: price,
        seller,  //키와 값의 변수명이 동일하기 때문에 한번만 적어도 됨
        imageUrl
    }).then((result)=>{
        console.log("상품 생성 결과: ", result);
        res.send({
            result
        })
    })
    .catch((error)=>{
        console.error(error);
        res.send("상품 업로드에 문제가 발생했습니다.")
    })
})


//get방식 경로 파라미터 관리하기
app.get('/products/:id', async(req,res)=>{
    const params = req.params;
    console.log(params);
    //하나만 찾을때는(select할때는) findOne
    models.Product.findOne({
        //조건절
        where: {
            id: params.id
        }
    })
    .then((result)=>{
        res.send({
            product: result
        })
    })
    .catch((error)=>{
        console.error(error);
        res.send('상품조회에 문제가 생겼습니다.')
    })
})

//이미지파일을 POST로 요청했을때 업로드 폴더에 이미지를 저장
app.post('/image',upload.single('image'),(req,res)=>{
    const file = req.file;
    res.send({
        imageUrl: file.destination + "/" + file.filename
    })
})

//delete삭제하기
app.delete('/products/:id',async(req,res)=>{
    const params = req.params;
    console.log('사진삭제');
    models.Product.destroy({where:{id:params.id}})
    .then(res.send(
        "상품이 삭제되었습니다"
    ));
})

//banners로 요청이 왔을때 응답하기
app.get("/banners", (req,res)=>{
    models.Banner.findAll({
        limit:3,
        attributes:["imageUrl","id","href"]
    })
    .then((result)=>{
        res.send({
            banners: result,
        })
    })
    .catch((error)=>{
        console.error(error);
        res.send('에러가 발생했습니다.')
    })
})

//설정한 app을 실행시키기
app.listen(port,()=>{
    console.log('그린램프 서버가 정상적으로 돌아가고 있습니다.');
    models.sequelize
    //데이터베이스와 동기화(sqlite와 연결)
    .sync()
    .then(()=>{
        console.log('DB연결성공')
    })
    .catch(function(err){
        console.error(err);
        console.log('DB연결에러')
        process.exit();
    })
})