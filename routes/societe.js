
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
    isAdmin(req).then((admin) => {
        if (!admin) {
            res.sendStatus(401);
            return;
        }
    
        bdd.query("SELECT societe_id, societe_nom, societe_siren, societe_description FROM societe", [], function(err, result) {
            if (err) throw err;
            res.send(result);
        })  
    });
});

router.post('/getById', function(req, res, next) {
    isAdmin(req).then((admin) => {
        if (!admin) {
            if (req.cookies.userData != null && req.body.id != null && !isNaN(req.body.id)) {
                bdd.query("SELECT emploi_access FROM employer WHERE user_id = ? AND societe_id = ?", [
                    req.cookies.userData.id, req.body.id
                ], function(err, result) {
                    if (err) return reject(err);
        
                    if (!(result != null && result[0] != null && result[0].emploi_access != null && result[0].emploi_access == 2)) {
                        res.sendStatus(401);
                        return;
                    }
                });
            } else {
                res.sendStatus(404);
                return;
            }
        }
    
        if (req.body.id != null && !isNaN(req.body.id)) {
            bdd.query("SELECT societe_id, societe_nom, societe_siren, societe_description FROM societe WHERE societe_id = ?", [
                req.body.id
            ], function(err, result) {
                if (err) throw err;
                res.send(result);
            })
        } else {
            res.sendStatus(404);
        } 
    });
});

router.post('/addWithUser', function(req, res, next) {
    if (req.cookies.userData != null) {
        let nom = req.body.societe_nom;
        let siren = req.body.societe_siren;
        let description = req.body.societe_description;

        if (nom != null && description != null && siren != null && !isNaN(siren)) {
            bdd.query(`SELECT * FROM societe WHERE societe_siren = ?`, [
                siren
            ], function(err, result) {
                if (err) throw err;

                if (result.length == 0) {
                    bdd.query(`INSERT INTO societe (societe_nom, societe_siren, societe_description) VALUES (?, ?, ?)`, [
                        nom, siren, description, 
                    ], function(err, result) {
                        if (err) throw err;
                        
                        bdd.query(`SELECT societe_id FROM societe WHERE societe_siren = ?`, [
                            siren
                        ], function(err, result) {
                            if (err) throw err;
            
                            if (result.length == 1) {
                                bdd.query(`INSERT INTO employer (societe_id, user_id, emploi_access) VALUES (?, ?, ?)`, [
                                    result[0].societe_id, req.cookies.userData.id, 2
                                ], function(err, result) {
                                    if (err) throw err;
                                    res.send("OK");
                                });
                            } else {
                                res.send("ERREUR");
                            }
                        }); 
                    });
                } else {
                    res.send("NOK");
                }
            });       
        } else {
            res.send("NOK");
        } 
    } else {
        res.sendStatus(404);
    }
});

router.post('/updateWithUser', function(req, res, next) {
    if (req.cookies.userData != null && req.body.societe_id != null && !isNaN(req.body.societe_id)) {
        bdd.query("SELECT emploi_access FROM employer WHERE user_id = "+ req.cookies.userData.id + " AND societe_id = " + req.body.societe_id, [
            id
        ], function(err, result) {
            if (err) return reject(err);

            if (result != null && result[0] != null && result[0].emploi_access != null && result[0].emploi_access == 2) {
                let id = req.body.societe_id;
                let nom = req.body.societe_nom;
                let siren = req.body.societe_siren;
                let description = req.body.societe_description;

                if (nom != null && description != null && siren != null && !isNaN(siren) && id != null && !isNaN(id)) {
                    bdd.query(`SELECT * FROM societe WHERE societe_id = ?`, [
                        id
                    ], function(err, result) {
                        if (err) throw err;

                        if (result.length == 1) {
                            bdd.query(`SELECT * FROM societe WHERE societe_id != ? AND societe_siren = ?`, [
                                id, siren
                            ], function(err, result) {
                                if (err) throw err;
                    
                                if (result.length == 0) {
                                    bdd.query(`UPDATE societe SET societe_nom = ?, societe_siren = ?, societe_description = ? WHERE societe_id = ?`, [
                                        nom, siren, description, id
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

            if (result != null && result[0] != null && result[0].emploi_access != null && result[0].emploi_access == 2) {
                let id = req.body.societe_id;

                if (id != null && !isNaN(id)) {
                    bdd.query(`SELECT * FROM societe WHERE societe_id = ?`, [
                        id
                    ], function(err, result) {
                        if (err) throw err;

                        if (result.length == 1) {
                            bdd.query(`DELETE FROM societe WHERE societe_id = ?`, [
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
    
        let nom = req.body.societe_nom;
        let siren = req.body.societe_siren;
        let description = req.body.societe_description;

        if (nom != null && description != null && siren != null && !isNaN(siren)) {
            bdd.query(`SELECT * FROM societe WHERE societe_siren = ?`, [
                siren
            ], function(err, result) {
                if (err) throw err;

                if (result.length == 0) {
                    bdd.query(`INSERT INTO societe (societe_nom, societe_siren, societe_description) VALUES ( ?, ?, ?)`, [
                        nom, siren, description
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
    
        let id = req.body.societe_id;
        let nom = req.body.societe_nom;
        let siren = req.body.societe_siren;
        let description = req.body.societe_description;

        if (nom != null && description != null && siren != null && !isNaN(siren) && id != null && !isNaN(id)) {
            bdd.query(`SELECT * FROM societe WHERE societe_id = ?`, [
                id
            ], function(err, result) {
                if (err) throw err;

                if (result.length == 1) {
                    bdd.query(`SELECT * FROM societe WHERE societe_id != ? AND societe_siren = ?`, [
                        id, siren
                    ], function(err, result) {
                        if (err) throw err;
            
                        if (result.length == 0) {
                            bdd.query(`UPDATE societe SET societe_nom = ?, societe_siren = ?, societe_description = ? WHERE societe_id = ?`, [
                                nom, siren, description, id
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
    
        let id = req.body.societe_id;

        if (id != null && !isNaN(id)) {
            bdd.query(`SELECT * FROM societe WHERE societe_id = ?`, [
                id
            ], function(err, result) {
                if (err) throw err;

                if (result.length == 1) {
                    bdd.query(`DELETE FROM societe WHERE societe_id = ?`, [
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
