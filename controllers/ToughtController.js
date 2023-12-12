//Import Models
const User = require('../models/User');
const Tought = require('../models/Tought');
const { Op, where } = require('sequelize');

module.exports = class ToughtController {

    static async showToughts(req, res) {

        let search = '';
        let order = 'DESC'


        console.log(req.query.search)
        if (req.query.search) {
            console.log(123)
            search = req.query.search;
        }

        if (req.query.order === 'old') {
            order = 'ASC'
        }

        let toughtsData = await Tought.findAll(
            {
                include: User,
                where: {
                    title: { [Op.like]: `%${search}%` }
                },
                order: [['createdAt', order]]
            });

        let toughts = toughtsData.map((tought) => tought.get({ plain: true }));
        let toughtsQty = toughts.length;

        if (toughtsQty === 0) {
            toughtsQty = false;
        }

        res.render('toughts/home', { toughts, search, toughtsQty });
    }

    static async dashboard(req, res) {

        try {
            const userid = req.session.userid;
            const user = await User.findOne({
                where: {
                    id: userid
                },
                include: Tought,
                plain: true
            })
            if (!user) {
                res.redirect('/login')
                return

            }

            const toughts = user.Toughts.map((result) => result.dataValues);
            let emptyToughts = false;

            if (toughts.length === 0) {
                emptyToughts = true;
            }

            res.render('toughts/dashboard', { toughts, emptyToughts });

        } catch (error) {
            console.log(error);
        }
    }

    static createTought(req, res) {
        res.render('toughts/create');
    }

    static async createToughtSave(req, res) {
        const tought = {
            title: req.body.title,
            UserId: req.session.userid
        }

        try {
            await Tought.create(tought)
                .then(() => {
                    req.flash('message', 'Pensamento criado com sucesso!');

                    req.session.save(() => {
                        res.redirect('/toughts/dashboard');
                    });
                })


        } catch (error) {
            console.log("Erro: " + error);
        }


    }

    static async removeTought(req, res) {
        const id = req.body.id;
        const UserId = req.session.userid;

        try {
            await Tought.destroy({
                where: {
                    id: id,
                    UserId: UserId
                }
            }).then(() => {
                req.flash('message', 'Pensamento removido com sucesso!')

                    req.session.save(() => {
                        res.redirect('/toughts/dashboard');
                    });

                });


        } catch (error) {
            console.log("Erro: " + error);
        }
    }

    static async updateTought(req, res) {
        const id = req.params.id;

        const tought = await Tought.findOne({ where: { id: id } });
        res.render('toughts/edit', { tought: tought.dataValues });

    }

    static async updateToughtSave(req, res) {
        const id = req.body.id;

        const tought = {
            title: req.body.title
        }

        try {

            await Tought.update(tought, { where: { id: id } }).then(
                () => {
                    req.flash('message', 'Pensamento atualizado com sucesso!')


                    req.session.save(() => {
                        res.redirect('/toughts/dashboard');
                    });

                }
            )

        } catch (error) {
            console.log("Erro: " + error);
        }
    }


}
