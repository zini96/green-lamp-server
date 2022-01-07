//models안에 파일이 추가되면 sequelize는 이걸 읽어서 테이블과 컬럼을 생성함
//mysql create문을 대신한다고 생각하면 됨
module.exports = function(sequelize,DataTypes){
    const product = sequelize.define('Product',{
        //컬럼
        //타입은 대문자로 작성
        name: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER(10),
            allowNull: false
        },
        imageUrl:{
            type: DataTypes.STRING(300),
            allowNull:true
        },
        description:{
            type: DataTypes.STRING(300),
            allowNull:false
        },
        seller:{
            type: DataTypes.STRING(30),
            allowNull:false
        }
    });
    return product
}