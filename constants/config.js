const corsOptions={
       origin: [
        "http://localhost:5173",
        "http://localhost:4173",
        process.env.CLIENT_URL,
       https://tnisha-chatapp-frontend.vercel.app/ 
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}

const LETSTALK_TOKEN="letstalk-token"


export {corsOptions,LETSTALK_TOKEN};
