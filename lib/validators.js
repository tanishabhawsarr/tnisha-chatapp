import { body, param, validationResult } from "express-validator";
import { ErrorHandler } from "../utils/utility.js";


const validateHandler=(req,res,next)=>{
    const errors=validationResult(req);

    const errormessage=errors
    .array()
    .map((error)=>error.msg)
    .join(", ");

    if(errors.isEmpty()) return next();
        else next(new ErrorHandler(errormessage,400));
};

const registerValidator=()=>[
    body("name","Please enter name").notEmpty(),
    body("username","Please enter username").notEmpty(),
    body("password","Please enter password").notEmpty(),
    body("bio","Please enter bio").notEmpty(),
];

const loginValidator=()=>[
    body("username","Please enter username").notEmpty(),
    body("password","Please enter password").notEmpty(),
];

const newGroupValidator=()=>[
    body("name","Please enter name").notEmpty(),
    body("members")
    .notEmpty()
    .withMessage("Please enter members")
    .isArray({min:2,max:100})
    .withMessage("Members must be 2-100"),
];

const addMembersValidator=()=>[
    body("chatId","Please enter Chat ID").notEmpty(),
    body("members")
    .notEmpty()
    .withMessage("Please enter members")
    .isArray({min:1,max:97})
    .withMessage("Members must be 1-97"),
];

const removeMemberValidator=()=>[
    body("chatId","Please enter chat ID").notEmpty(),
    body("userId","Please enter user ID").notEmpty(),
];

const sendAttachmentsValidator=()=>[
    body("chatId","Please enter chat ID").notEmpty(),
];

const chatIdValidator=()=>[
    param("id","Please enter chat ID").notEmpty(),
];

const renameValidator=()=>[
    param("id","Please enter chat ID").notEmpty(),
    body("name","Please enter New Name").notEmpty(),
];

const sendRequestValidator=()=>[
    body("userId","Please enter user ID").notEmpty(),
];

const acceptRequestValidator=()=>[
    body("requestId","Please enter Request ID").notEmpty(),
    body("accept")
    .notEmpty()
    .withMessage("Please Add Accept")
    .isBoolean()
    .withMessage("Accept must be a boolean")
];

const adminLoginValidator=()=>[
    body("secretKey","Please enter Secret Key").notEmpty()
];


export {
    acceptRequestValidator, addMembersValidator, adminLoginValidator, chatIdValidator, loginValidator, newGroupValidator, registerValidator, removeMemberValidator, renameValidator, sendAttachmentsValidator, sendRequestValidator, validateHandler
};
