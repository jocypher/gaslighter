

 const envConstants ={
    HOST: process.env.HOST??'localhost',
    PORT: Number(process.env.PORT)??5432,
    USERNAME: process.env.USERNAME??'',
    PASSWORD: process.env.PASSWORD??'',
    DATABASE: process.env.DATABASE??''
}

export default envConstants