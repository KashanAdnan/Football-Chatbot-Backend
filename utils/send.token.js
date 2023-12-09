const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();
  
    // Options for Cookie
    const option = {
      expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.status(statusCode).json({
      succes: true,
      user,
      token,
    });
    
  };
  
  module.exports = sendToken;