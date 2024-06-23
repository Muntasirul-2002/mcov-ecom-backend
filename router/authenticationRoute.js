import express from 'express'
import { adminsController, deleteAdminController, deleteUserController, forgotPasswordController, getUserDetailsController, loginController, newAdmin, ownerCheckRouteController, signupController, updateUserController } from '../controller/authenticationController.js'
import { isAdmin, requireSignIn } from '../middleware/authenticationMiddleware.js'

const router = express.Router()


//signup user
router.post('/signup', signupController)
//get user details
router.get('/get-user', getUserDetailsController)

// login user
router.post('/login', loginController)

// delete user
router.delete('/delete-user/:id', deleteUserController)
// delete user
router.delete('/delete-admin/:id', deleteAdminController)

//forgot password
router.post('/forgot-password', forgotPasswordController)

//update user profile
router.put('/update-profile', requireSignIn,updateUserController)

//protected user route
router.get('/user-auth', requireSignIn, (req,res)=>{
    res.status(200).send({ok:true})
})

//protected admin route
router.get('/admin-auth', requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true})
})

// testing owner route
router.get('/owner-test', requireSignIn,isAdmin,ownerCheckRouteController)

//create new admin
router.post('/admin-signup', newAdmin)

//view admins
router.get('/admins', adminsController)

export default router;

