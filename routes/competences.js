
var express = require('express');
var router = express.Router();
var bdd = require('./module/bdd');

function isAdmin(param) {
    return new Promise((resolve, reject) => {
        if (param.cookies.userData != null) {
            bdd.query("SELECT user_droit_acces FROM utilisateur WHERE user_id = ?", [
                param.cookies.userData.id
            ], function(err, result) {
                if (err) return reject(err);

                if (result != null && result[0] != null && result[0].user_droit_acces != null && result[0].user_droit_acces == 1) {
                    return resolve(true);
                } else {
                    return resolve(false);
                }
            });
        } else {
            return resolve(false);
        }    
    })
}

/* GET users listing. */
router.get('/', function(req, res, next) {
    isAdmin(req).then((admin) => {
        if (!admin) {
            res.sendStatus(401);
            return;
        }
    
        bdd.query("SELECT compe_id, compe_nom FROM competences", [], function(err, result) {
            if (err) throw err;
            res.send(result);
        });
    });
});

router.post('/getById', function(req, res, next) {
    isAdmin(req).then((admin) => {
        if (!admin) {
            res.sendStatus(401);
            return;
        }
    
        if (req.body.id != null && !isNaN(req.body.id)) {
            bdd.query("SELECT compe_id, compe_nom FROM competences WHERE compe_id = ?", [
                req.body.id
            ], function(err, result) {
                if (err) throw err;
                res.send(result);
            });
        } else {
            res.sendStatus(404);
        }  
    });
});

router.post('/add', function(req, res, next) {
    isAdmin(req).then((admin) => {
        if (!admin) {
            res.sendStatus(401);
            return;
        }
    
        let nom = req.body.compe_nom;

        if (nom != null) {
            bdd.query(`SELECT * FROM competences WHERE compe_nom = ?`, [
                nom
            ], function(err, result) {
                if (err) throw err;

                if (result.length == 0) {
                    bdd.query(`INSERT INTO competences (compe_nom) VALUES (?)`, [
                        nom
                    ], function(err, result) {
                        if (err) throw err;
                        res.send("OK");
                    });
                } else {
                    res.send("NOK");
                }
            });       
        } else {
            res.send("NOK");
        }  
    });
});

router.post('/update', function(req, res, next) {
    isAdmin(req).then((admin) => {
        if (!admin) {
            res.sendStatus(401);
            return;
        }
    
        let id = req.body.compe_id;
        let nom = req.body.compe_nom;

        if (nom != null && id != null && !isNaN(id)) {
            bdd.query(`SELECT * FROM competences WHERE compe_id = ?`, [
                id
            ], function(err, result) {
                if (err) throw err;

                if (result.length == 1) {
                    bdd.query(`SELECT * FROM competences WHERE compe_id != ? AND compe_nom = ?`, [
                        id, nom
                    ], function(err, result) {
                        if (err) throw err;
            
                        if (result.length == 0) {
                            bdd.query(`UPDATE competences SET compe_nom = ? WHERE compe_id = ?`, [
                                nom, id
                            ], function(err, result) {
                                if (err) throw err;
                                res.send("OK");
                            });
                        } else {
                            res.send("NOK");
                        } 
                    });                   
                } else {
                    res.send("NOK");
                }
            });        
        } else {
            res.send("NOK");
        }  
    });
});

router.post('/remove', function(req, res, next) {
    isAdmin(req).then((admin) => {
        if (!admin) {
            res.sendStatus(401);
            return;
        }
    
        let id = req.body.compe_id;

        if (id != null && !isNaN(id)) {
            bdd.query(`SELECT * FROM competences WHERE compe_id = ?`, [
                id
            ], function(err, result) {
                if (err) throw err;

                if (result.length == 1) {
                    bdd.query(`DELETE FROM competences WHERE compe_id = ?`, [
                        id
                    ], function(err, result) {
                        if (err) throw err;
                        res.send("OK");
                    });
                } else {
                    res.send("NOK");
                }
            });       
        } else {
            res.send("NOK");
        } 
    });
});

module.exports = router;
