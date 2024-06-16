const asyncHandle = (requestHandler) => {
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((error)=>next(error))
    }
}

export {asyncHandle}

// const asyncHandle = () => {}
// const asyncHandle = (func) => () => {}
// const asyncHandle = (func) => async () => {}

// const asyncHandle = (fn) => async (req,res,next) => {
//    try {
//     await fn(req,res,next)
//    } catch (error) {
//     req.status(err.code || 500).json({
//         success:false,
//         message:err.message
//     })
//    } 
// }