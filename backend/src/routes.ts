import { Prisma, PrismaClient } from '@prisma/client';
import express from 'express'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import { env } from 'process';
import jwt from 'jsonwebtoken'
import multer from "multer"
import path from "path"
import fs from 'fs'

export const routes = express.Router()
const prisma = new PrismaClient()

routes.post('/create-product', async (req, res) => {
    const token = req.cookies.authToken
    if(!token)
    return res.status(401).json('Session expired, please login to continue')

    if(!req.body.name)
    res.status(400).json("Please enter a name")

    if(!req.body.description)
    res.status(400).json("Please enter a description")

    if(!req.body.price)
    res.status(400).json("Please enter a price")

    let productInput: Prisma.ProductCreateInput
    
    productInput = {
        name: String(req.body.name),
        description: String(req.body.description),
        price: Number(req.body.price),
        published_at: new Date(),
        user: {
            connect: {
                id: Number(req.cookies.userId)
            }
        }
    }

    await prisma.product.create({
        data: productInput
    })

    return res.status(201).json('Product created successfully!')
}) 

routes.get('/my-products/:id', async (req, res) => {
    const token = req.cookies.authToken
    if(!token)
    return res.status(401).json('Session expired, please login to continue')

    const myProducts = await prisma.product.findMany({
        where: {
            userId: Number(req.params.id),
            deleted: false
        },
        orderBy: {
            id: 'desc'
        }
    })
    return res.status(200).json(myProducts)
})

routes.put('/products/:id', async (req, res) => {
    const token = req.cookies.authToken
    if(!token)
    return res.status(401).json('Session expired, please login to continue')

    const productId  = Number(req.params.id)
    const updateProduct = await prisma.product.update({
        where: {id: productId},
        data: {
            price: req.body.price,
            name: req.body.name,
            description: req.body.description
        }
    })
    return res.status(200).json('Product updated successfully')
})

routes.get('/product-detail/:id', async (req, res) => {//Load product on edit page
    const token = req.cookies.authToken
    if(!token)
    return res.status(401).json('Session expired, please login to continue')

    const productId  = Number(req.params.id)
    const productDetail = await prisma.product.findFirst({
        where: {
            id: productId
        }
     })
     return res.status(200).json(productDetail)
})

routes.put('/remove-products/:id', async (req, res) => {
    const token = req.cookies.authToken
    if(!token)
    return res.status(401).json('Session expired, please login to continue')

    const productId  = Number(req.params.id)
    const deleteProduct = await prisma.product.update({
        where: {id: productId},
        data: {
            deleted: true
        }
    })
    return res.status(200).json('Product deleted successfully!')
})

routes.post('/register-user', async (req, res) => {
    if(!req.body.name)
    return res.status(409).json('Insert a valid name!')

    if(!req.body.email)
    return res.status(409).json('Insert a valid email!')

    if(!req.body.password)
    return res.status(409).json('Insert a safe password!')
    //Reading environment variables
    const emailSenderUser = env.EMAIL_SENDER_USER
    const emailSenderPassword = env.EMAIL_SENDER_PASS
    const emailSenderHost = env.EMAIL_SENDER_HOST
    const emailFromAddress = env.EMAIL_FROM_ADDRESS

    const checkIfNameExists = await prisma.user.count({
        where: {
            name: String(req.body.name)
        }
    })
    if(checkIfNameExists > 0) 
    return res.status(409).json('Username already exists')

    const checkIfEmailExists = await prisma.user.count({
        where: {
            email: String(req.body.email)
        }
    })
    if(checkIfEmailExists > 0) 
    return res.status(409).json('E-mail already registered, please try another one!')

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(String(req.body.password), salt);

    let userInput: Prisma.UserCreateInput
    const token = jwt.sign(String(Date.now() + String(req.body.name)), 'jwtkey') //Generating token to validate sign up

    userInput = {
        name: String(req.body.name),
        email: String(req.body.email),
        password: hash,
        verificationToken: token
    }

    await prisma.user.create({
        data: userInput
    })

    const transport = nodemailer.createTransport({
        host: emailSenderHost,
        port: 2525,
        auth: {
          user: emailSenderUser,
          pass: emailSenderPassword
        }
    })

    const mailOptions = {
        from: emailFromAddress,
        to: String(req.body.email),
        subject: 'Please confirm your e-mail',
        html:   `Hello!<br> We are very happy that you became a part of our e-commerce!` +
                `We need you to confirm your email! Please click <a href="http://localhost:8800/verify-email/${token}">here</a> to continue!`
    }

    transport.sendMail(mailOptions, (err) => {
        if(err)
        return res.status(500).json('Unexpected server error, please try again!')

        return res.status(200).json('A verification e-mail has been sent. Please check your inbox!')
    })

    return res.status(201).json('User created successfully. We just sent a verification e-mail, please check your e-mail inbox')
})

routes.get('/verify-email/:token', async (req, res) => {
     if(!req.params.token)
     return res.status(401).json('Token not received or invalid!')
     
     const findUserByToken = await prisma.user.findFirst({
        where: {
            verificationToken: String(req.params.token)
        },
        orderBy: {
            id: 'desc'
        }
     })

     if(!findUserByToken)
     return res.status(403).json('User not found or token has expired')

     const deleteToken = await prisma.user.update({
        where: {
            id: Number(findUserByToken.id)
        },
        data: {
            verificationToken: '',
            active: true
        }
     })

     if(!deleteToken){
        return res.status(403).json('Could not validate email!')
     } else {
        return res.redirect(env.MY_LOCALHOST + 'login')
     }
})

routes.post('/login', async (req, res) => {
    if(!req.body.name || !req.body.password)
    res.status(400).json("Please enter your username and password")

    const findAccount = await prisma.user.findFirst({
        where: {
            name: String(req.body.name),
            active: true
        }
    })

    if(!findAccount)
    return res.status(403).json("User not found")

    const isPasswordCorrect = bcrypt.compareSync(req.body.password, findAccount.password)

    if(!isPasswordCorrect)
    return res.status(400).json("Wrong username or password")

    const authToken = jwt.sign({id: findAccount.id}, 'jwtkey')

    res.cookie('userId', findAccount.id)

    res.cookie('authToken', authToken).status(200).json("Logged in successfully")
})

routes.post('/upload/:id', (req, res) => {
    const token = req.cookies.authToken
    if(!token)
    return res.status(401).json('Session expired, please login to continue')

    const productId = Number(req.params.id)

    let dir = `src/uploads/${productId}`
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, path.join('src', 'uploads', String(productId)));
        },
        filename: function (req, file: any, cb) {
          cb(
            null,
            file.fieldname + '-' + Date.now() + file.originalname.match(/\..*$/)[0],
          );
        },
      });
      const multiUpload = multer({
        storage,
        fileFilter: (req, file, cb) => {
          if (
            file.mimetype == 'image/png' ||
            file.mimetype == 'image/jpeg' ||
            file.mimetype == 'image/jpg'
          ) {
            cb(null, true);
          } else {
            cb(null, false);
            const err = new Error('Only .jpg .jpeg .png images are supported!');
            err.name = 'ExtensionError';
            return cb(err);
          }
        },
    }).array('uploadImages', 10);

    multiUpload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res
            .status(500)
            .send({
                error: { msg: `Uploading error: ${err.message}` },
            })
            .end();
            return;
        } else if (err) {
            //unknown error
            if (err.name == 'ExtensionError') {
            res
                .status(413)
                .send({ error: { msg: `${err.message}` } })
                .end();
            } else {
            res
                .status(500)
                .send({ error: { msg: `unknown uploading error: ${err.message}` } })
                .end();
            }
            return;
        }
        
        const filesUploaded = JSON.parse(JSON.stringify(req.files))
        filesUploaded.map((file: any) => {
            prisma.productsPhotos.create({
                data: {
                    filename: file.path,
                    productId: productId
                }
            }).then()
        })
        res.status(200).send('file uploaded');
    });
})

routes.get('/get-images/:productId', async (req, res) => {
    const token = req.cookies.authToken
    if(!token)
    return res.status(401).json('Session expired, please login to continue')

    const photos = await prisma.productsPhotos.findMany({
        where: {
            productId: Number(req.params.productId)
        }
    })
    return res.status(200).json(photos)
})