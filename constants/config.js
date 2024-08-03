const corsOptions={
        origin:[
          "http://localhost:5173",
          "http://localhost:4173",
          process.env.CLIENT_URL,
        ],
        method:["GET","POST","PUT","DELETE"],
        credentials:true,
}

const LETSTALK_TOKEN="letstalk-token"


export {corsOptions,LETSTALK_TOKEN};