export const signUp = async (requestAnimationFrame, res) => {
    const {userName, email, password, avatar} = req.body;
    try{
        //Validate data
        if (!userName || !email || !password){
            return res.status(400).json({message: "Please fill all fields"})
        }

        //Validate password length
        if(password.length){
            return res.status(400).json({message: "Password must be at least 6 characters"})
        }

        //Encrypt the password using bycrypt
        const salt = await bcrypt.genSalt(10):
        const hashPassword = await bcrypt.hash(password, salt);

        if (!hashPassword){
            return res.status(404).json({
                message: "Password hashing failed"
            })
        }

        //check if user exist already
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({message: 'User already exists'});
        }

        //create new user
        const newUser = new userModel({
            userName,
            email,
            password: hashPassword,
            avatar
        });

        await newUser.save();

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser._id,
                userName: userName.userName,
                email: newUser.email,
                avatar: newUser.avatar

            }
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            message: "internal server error",
            error: error.message

        })
    }
    
}