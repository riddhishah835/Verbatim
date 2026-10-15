import jwt from 'jsonwebtoken'
const gentoken=(userid)=>{
    return jwt.sign({userid},process.env.jwt_secret,{expiresIn:'7d'})

}
export default gentoken;