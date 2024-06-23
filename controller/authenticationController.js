import { comparePassword, hashPassword } from "../helper/authenticationHelper.js";
import userModel from "../models/userModel.js";
import JWT from 'jsonwebtoken'
// Signup controller
export const signupController = async (req, res) => {
    try {
      const { name, email, password, phone, address, security_answer } = req.body;
      // Check all fields
      if (!name || !email || !password || !phone || !address || !security_answer) {
        return res.status(400).send({
          success: false,
          message: "All fields are required",
        });
      }
  
      // Check if user is already registered
      const existing_user = await userModel.findOne({ email });
      if (existing_user) {
        return res.status(200).send({
          success: false,
          message: "Already Registered",
        });
      }
  
      const hashedPassword = await hashPassword(password);
      const user = new userModel({
        name,
        email,
        phone,
        address,
        password: hashedPassword,
        security_answer,
      });
      await user.save();
  
      res.status(201).send({
        success: true,
        message: "User successfully registered",
        user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
  
  // Get user details
  export const getUserDetailsController = async (req, res) => {
    try {
      const user = await userModel.find({ role: "0" });
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
  
  // Login controller
  export const loginController = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(404).send({
          success: false,
          message: "Invalid email or password",
        });
      }
  
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Email not found",
        });
      }
  
      const match = await comparePassword(password, user.password);
      if (!match) {
        return res.status(404).send({
          success: false,
          message: "Invalid Password",
        });
      }
  
      const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
  
      res.status(200).send({
        success: true,
        message: "Login successful",
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
          userID: user._id,
        },
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        success: false,
        message: "Internal Server Error",
      });
    }
  };


  // delete user controller
  export const deleteUserController = async (req,res)=>{
    try {
      const {id} = req.params;
      await userModel.findByIdAndDelete(id);
      res.status(200).send({
        success: true,
        message:'User deleted successfully'
      })
    } catch (error) {
      console.log(error)
    }
  }

  // delete admin
  export const deleteAdminController = async(req,res)=>{
    try {
      const {id} = req.params
      await userModel.findByIdAndDelete(id)
      res.status(200).send({
        success:true,
        message: 'Admin deleted successfully'
      })
    } catch (error) {
      console.log(error)
    }
  }

  //forgot password controller
  export const forgotPasswordController = async (req,res)=>{
    try {
      const {email, newPassword , security_answer} = req.body;
      if(!email || !newPassword || !security_answer){
        return res.status(404).send({
          success:false,
          message: 'email password and security answer is required'
        })
      
      }

      const user = await userModel.findOne({email,security_answer});
      if(!user){
        return res.status(404).send({
          success:false,
          message:'Email not found in the database'
        })
      }

      const hashed = await hashPassword(newPassword)
      await userModel.findByIdAndUpdate(user._id, {password:hashed})
      res.status(200).send({
        success:true,
        message:'Password updated successfully'
      })
    } catch (error) {
      console.log(error)
    }
  }

  //update user controller
  export const updateUserController = async (req,res)=>{
    try {
      const {name,email,password,address,phone} = req.body
      const user = await userModel.findById(req.user._id)
      if(password && password.length < 6){
        return res.json({error:'password must be at least 6 characters'})
      }
      const hashedPassword = password? await hashPassword(password):undefined
      const updateUser = await userModel.findByIdAndUpdate(
        req.user._id,
        {
          name:name || user.name,
          email:email || user.email,
          password:hashedPassword || user.password,
          address:address || user.address,
          phone:phone || user.phone
        },
        {new : true}
      )
      res.status(200).send({
        success: true,
        message:"profile updated successfully",
        updateUser,

      })
    } catch (error) {
      console.log(error)
    }
  }

  // owner test route
  export const ownerCheckRouteController = async (req,res)=>{
    try {
      res.send("Protected owner route")
    } catch (error) {
      console.log(error);
      res.send({error})
    }
  }

  //new owner create
  export const newAdmin = async(req,res)=>{
    try {
      const {name, email, password, phone, address, security_answer} = req.body
      if(!name || !email || !password || !phone || !address || !security_answer){
        return res.send('All Fields is required');
      }
      //check existing
      const existingOwner = await userModel.findOne({email})
      if(existingOwner){
        return res.status(200).send({
          success:true,
          message:'Admin Already Exists'
        })
      }

      // hash password

      const hashedPassword = await hashPassword(password)
      const admin = new userModel({
        name,
        email,
        phone,
        address,
        password: hashedPassword,
        security_answer,
        role:1,
      })
await admin.save()
res.status(201).send({
  success:true,
  message: 'new admin added',
  admin,
})
    } catch (error) {
      console.log(error)
    }
  }

// get admin details
export const adminsController = async (req,res)=>{
  try {
    const admin = await userModel.find({role:'1'})
    res.status(200).json(admin)
  } catch (error) {
    console.log(error)
  }
}