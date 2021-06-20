
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

router.get('/', function(req, res, next) {
    bdd.query("SELECT offre_id, offre_titre, offre_description, offre_salaire, offre_lieu, offre_emploi.type_id, type_nom, offre_emploi.societe_id, societe_nom FROM offre_emploi JOIN type_offre ON offre_emploi.type_id = type_offre.type_id JOIN societe ON offre_emploi.societe_id = societe.societe_id", [], function(err, result) {
        if (err) throw err;
        res.send(result);
    })
});

router.get('/getForForm', function(req, res, next) {
    isAdmin(req).then((admin) => {
        if (!admin) {
            res.sendStatus(401);
            return;
        }
    
        bdd.query("SELECT type_id, type_nom FROM type_offre", [], function(err, result) {
            if (err) throw err;
    
            bdd.query("SELECT societe_id, societe_nom FROM societe", [], function(err, resultbis) {
                if (err) throw err;
    
                res.send([result, resultbis]);
            })
        })
    });
});

router.post('/getById', function(req, res, next) {
    if (req.body.id != null && !isNaN(req.body.id)) {
        bdd.query("SELECT offre_id, offre_titre, offre_description, offre_salaire, offre_lieu, offre_emploi.type_id, type_nom, offre_emploi.societe_id, societe_nom FROM offre_emploi JOIN type_offre ON offre_emploi.type_id = type_offre.type_id JOIN societe ON offre_emploi.societe_id = societe.societe_id WHERE offre_id = ?", [
            req.body.id
        ], function(err, result) {
            if (err) throw err;
            res.send(result);
        })
    } else {
        res.sendStatus(404);
    } 
});

router.post('/addWithUser', function(req, res, next) {
    if (req.cookies.userData != null && req.body.societe_id != null && !isNaN(req.body.societe_id)) {
        bdd.query("SELECT emploi_access FROM employer WHERE user_id = ? AND societe_id = ?", [
            req.cookies.userData.id, req.body.societe_id
        ], function(err, result) {
            if (err) return reject(err);

            if (result != null && result[0] != null && result[0].emploi_access != null && (result[0].emploi_access == 1 || result[0].emploi_access == 2)) {
                let titre = req.body.offre_titre;
                let description = req.body.offre_description;
                let salaire = req.body.offre_salaire;
                let lieu = req.body.offre_lieu;
                let type_id = req.body.type_id;
                let societe_id = req.body.societe_id;

                if (titre != null && description != null && salaire != null && lieu != null && type_id != null && !isNaN(type_id) && societe_id != null && !isNaN(societe_id)) {
                    bdd.query(`INSERT INTO offre_emploi (offre_titre, offre_description, offre_salaire, offre_lieu, type_id, societe_id) VALUES ( ?, ?, ?, ?, ?, ?)`, [
                        titre, description, salaire, lieu, type_id, societe_id
                    ], function(err, result) {
                        if (err) throw err;

                        res.send("OK");
                    });    
                } else {
                    res.send("NOK");
                }  
            } else {
                res.sendStatus(401);
            }
        });
    } else {
        res.sendStatus(404);
    }
});

router.post('/updateWithUser', function(req, res, next) {
    if (req.cookies.userData != null && req.body.societe_id != null && !isNaN(req.body.societe_id)) {
        bdd.query("SELECT emploi_access FROM employer WHERE user_id = ? AND societe_id = ?", [
            req.cookies.userData.id, req.body.societe_id
        ], function(err, result) {
            if (err) return reject(err);

            if (result != null && result[0] != null && result[0].emploi_access != null && (result[0].emploi_access == 1 || result[0].emploi_access == 2)) {
                let id = req.body.offre_id;
                let titre = req.body.offre_titre;
                let description = req.body.offre_description;
                let salaire = req.body.offre_salaire;
                let lieu = req.body.offre_lieu;
                let type_id = req.body.type_id;
                let societe_id = req.body.societe_id;

                if (titre != null && description != null && salaire != null && lieu != null && type_id != null && !isNaN(type_id) && societe_id != null && !isNaN(societe_id) && id != null && !isNaN(id)) {
                    bdd.query(`SELECT * FROM offre_emploi WHERE offre_id = ?`, [
                        id
                    ], function(err, result) {
                        if (err) throw err;

                        if (result.length == 1) {
                            bdd.query(`UPDATE offre_emploi SET offre_titre = ?, offre_description = ?, offre_salaire = ?, offre_lieu = ?, type_id = ?, societe_id = ? WHERE offre_id = ?`, [
                                titre, description, salaire, lieu, type_id, societe_id, id
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
            } else {
                res.sendStatus(401);
            }
        });
    } else {
        res.sendStatus(404);
    }
});

router.post('/removeWithUser', function(req, res, next) {
    if (req.cookies.userData != null && req.body.societe_id != null && !isNaN(req.body.societe_id)) {
        bdd.query("SELECT emploi_access FROM employer WHERE user_id = ? AND societe_id = ?", [
            req.cookies.userData.id, req.body.societe_id
        ], function(err, result) {
            if (err) return reject(err);

            if (result != null && result[0] != null && result[0].emploi_access != null && (result[0].emploi_access == 1 || result[0].emploi_access == 2)) {
                let id = req.body.offre_id;

                if (id != null && !isNaN(id)) {
                    bdd.query(`SELECT * FROM offre_emploi WHERE offre_id = ?`, [
                        id
                    ], function(err, result) {
                        if (err) throw err;

                        if (result.length == 1) {
                            bdd.query(`DELETE FROM offre_emploi WHERE offre_id = ?`, [
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
            } else {
                res.sendStatus(401);
            }
        });
    } else {
        res.sendStatus(404);
    }
});

router.post('/add', function(req, res, next) {
    isAdmin(req).then((admin) => {
        if (!admin) {
            res.sendStatus(401);
            return;
        }
    
        let titre = req.body.offre_titre;
        let description = req.body.offre_description;
        let salaire = req.body.offre_salaire;
        let lieu = req.body.offre_lieu;
        let type_id = req.body.type_id;
        let societe_id = req.body.societe_id;

        if (titre != null && description != null && salaire != null && lieu != null && type_id != null && !isNaN(type_id) && societe_id != null && !isNaN(societe_id)) {
            bdd.query(`INSERT INTO offre_emploi (offre_titre, offre_description, offre_salaire, offre_lieu, type_id, societe_id) VALUES ( ?, ?, ?, ?, ?, ?)`, [
                titre, description, salaire, lieu, type_id, societe_id
            ], function(err, result) {
                if (err) throw err;
                res.send("OK");
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
    
        let id = req.body.offre_id;
        let titre = req.body.offre_titre;
        let description = req.body.offre_description;
        let salaire = req.body.offre_salaire;
        let lieu = req.body.offre_lieu;
        let type_id = req.body.type_id;
        let societe_id = req.body.societe_id;

        if (titre != null && description != null && salaire != null && lieu != null && type_id != null && !isNaN(type_id) && societe_id != null && !isNaN(societe_id) && id != null && !isNaN(id)) {
            bdd.query(`SELECT * FROM offre_emploi WHERE offre_id = ?`, [
                id
            ], function(err, result) {
                if (err) throw err;

                if (result.length == 1) {
                    bdd.query(`UPDATE offre_emploi SET offre_titre = ?, offre_description = ?, offre_salaire = ?, offre_lieu = ?, type_id = ?, societe_id = ? WHERE offre_id = ?`, [
                        titre, description, salaire, lieu, type_id, societe_id, id
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

router.post('/remove', function(req, res, next) {
    isAdmin(req).then((admin) => {
        if (!admin) {
            res.sendStatus(401);
            return;
        }
    
        let id = req.body.offre_id;

        if (id != null && !isNaN(id)) {
            bdd.query(`SELECT * FROM offre_emploi WHERE offre_id = ?`, [
                id
            ], function(err, result) {
                if (err) throw err;

                if (result.length == 1) {
                    bdd.query(`DELETE FROM offre_emploi WHERE offre_id = ?`, [
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
