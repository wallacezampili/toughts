const { where } = require('sequelize');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = class AuthController{
    static async login(req, res){
        res.render('auth/login');
    }

    static async loginPost(req, res){
        const {email, password} = req.body;

        const user = await User.findOne({where: {email:email}});

        //Check if user exists
        if (!user)
        {
            req.flash('message', 'Usuário não encontrado!');
            res.render('auth/login');
            return;
        }
        //Check password
        const passwordMatch = bcrypt.compareSync(password, user.password);

        if (!passwordMatch)
        {
            req.flash('message', 'Senha ou e-mail inválido!');
            res.render('auth/login');
            return;
        }

        //Login
        req.session.userid = user.id;
        req.flash('message', 'Login realizado com sucesso!');
        req.session.save(() => {
            res.redirect('/');
        })
    }
    static async register(req, res){
        res.render('auth/register');
    }
    static async registerPost(req, res){
        const {name, email, password, confirmpassword} = req.body;

        if (password != confirmpassword)
        {
            req.flash('message', 'As senhas digitadas não conferem, tente novamente.');
            res.render('auth/register');

            return;
        }
        
        //Check if user exists
        const checkUser = await User.findOne({where: {email : email}});   
        if (checkUser)
        {
            req.flash('message', 'O e-mail já está em uso!');
            res.render('auth/register');

            return;
        }

        //Let bcrypt cook 
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name: name,
            email: email,
            password: hashedPassword
        }

        try{
            const createdUser = await User.create(user)
            
            //Set up session
            req.session.userid = createdUser.id;
            req.flash('message', 'Cadastrado com sucesso!')

            req.session.save(() => {
                res.redirect('/')
            })



        }catch(err)
        {
            console.log(err);
        }

    }

    static logout(req, res) {
        req.session.destroy();
        res.redirect('/login')
    }
}