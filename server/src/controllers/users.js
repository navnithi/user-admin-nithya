const registerUser = (req, res) => {
    try {
        res.status(201).json({
            message: "user is created"
        })
        
    } catch (error) {
         res.status(500).json({
           error: error.message,
         });
        
    }

}

module.exports= {registerUser}