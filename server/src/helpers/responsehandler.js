const errorHandler = (res, statusCode, message) =>{
    
      return res.status(statusCode).json({
        ok:false,
        message: message,
      });
};

const successHandler = (res, statusCode, message, data ) => {
  return res.status(statusCode).json({
    ok: true,
    message: message,
    data: data
  });
};

module.exports = {errorHandler, successHandler};