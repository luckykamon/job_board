
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
    
        bdd.query("SELECT cand_id, cand_titre, cand_description, cand_etat, candidature.offre_id, offre_titre, candidature.user_id, user_username FROM candidature JOIN offre_emploi ON candidature.offre_id = offre_emploi.offre_id JOIN utilisateur ON candidature.user_id = utilisateur.user_id", [], function(err, result) {
            if (err) throw err;
            res.send(result);
        });  
    });
});

router.get('/getForForm', function(req, res, next) {
    isAdmin(req).then((admin) => {
        if (!admin) {
            res.sendStatus(401);
            return;
        }
    
        bdd.query("SELECT offre_id, offre_titre FROM offre_emploi", [], function(err, result) {
            if (err) throw err;

            bdd.query("SELECT user_id, user_username FROM utilisateur", [], function(err, resultbis) {
                if (err) throw err;

                res.send([result, resultbis]);
            });
        }); 
    });
});

router.post('/getByOffreId', function(req, res, next) {
    isAdmin(req).then((admin) => {
        if (!admin) {
            if (req.cookies.userData != null && req.body.societe_id != null && !isNaN(req.body.societe_id)) {
                bdd.query("SELECT * FROM employer WHERE user_id = ? AND societe_id = ?", [
                    req.cookies.userData.id, req.body.societe_id
                ], function(err, result) {
                    if (err) return reject(err);
        
                    console.log(result);
        
                    if (!(result != null && result.length == 1)) {
                        res.sendStatus(401);
                        return;
                    }
                });
            } else {
                res.sendStatus(401);
                return;
            }
        }
    
        if (req.body.offre_id != null && !isNaN(req.body.offre_id)) {
            bdd.query("SELECT cand_id, cand_titre, cand_description, cand_etat, candidature.offre_id, offre_titre, candidature.user_id, user_username, user_email, user_phone, user_nom, user_prenom, user_biographie FROM candidature JOIN offre_emploi ON candidature.offre_id = offre_emploi.offre_id JOIN utilisateur ON candidature.user_id = utilisateur.user_id WHERE candidature.offre_id = ?", [
                req.body.offre_id
            ], function(err, result) {
                if (err) throw err;
                res.send(result);
            });
        } else {
            res.sendStatus(404);
        }  
    });
});

router.post('/getById', function(req, res, next) {
    isAdmin(req).then((admin) => {
        if (!admin) {
            res.sendStatus(401);
            return;
        }
    
        if (req.body.id != null && !isNaN(req.body.id)) {
            bdd.query("SELECT cand_id, cand_titre, cand_description, cand_etat, candidature.offre_id, offre_titre, candidature.user_id, user_username FROM candidature JOIN offre_emploi ON candidature.offre_id = offre_emploi.offre_id JOIN utilisateur ON candidature.user_id = utilisateur.user_id WHERE cand_id = ?", [
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
    if (req.cookies.userData != null) {
        let titre = req.body.cand_titre;
        let description = req.body.cand_description;
        let offre_id = req.body.offre_id;
        let user_id = req.body.user_id;

        if (titre != null && description != null && offre_id != null && !isNaN(offre_id) && user_id != null && !isNaN(user_id)) {
            bdd.query(`SELECT * FROM candidature WHERE offre_id = ? AND user_id = ?`, [
                offre_id, user_id
            ], function(err, result) {
                if (err) throw err;

                if (result.length == 0) {
                    bdd.query(`INSERT INTO candidature (cand_titre, cand_description, offre_id, user_id) VALUES ( ?, ?, ?, ?)`, [
                        titre, description, offre_id, user_id
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
    }
    else
    {
        res.sendStatus(401);
    }
});

router.post('/update', function(req, res, next) {
    isAdmin(req).then((admin) => {
        if (!admin) {
            res.sendStatus(401);
            return;
        }
    
        let id = req.body.cand_id;
        let titre = req.body.cand_titre;
        let description = req.body.cand_description;
        let offre_id = req.body.offre_id;
        let user_id = req.body.user_id;

        if (titre != null && description != null && offre_id != null && !isNaN(offre_id) && user_id != null && !isNaN(user_id) && id != null && !isNaN(id)) {
            bdd.query(`SELECT * FROM candidature WHERE cand_id = ?`, [
                id
            ], function(err, result) {
                if (err) throw err;

                if (result.length == 1) {
                    bdd.query(`SELECT * FROM candidature WHERE cand_id != ? AND offre_id = ? AND user_id = ?`, [
                        id, offre_id, user_id
                    ], function(err, result) {
                        if (err) throw err;
            
                        if (result.length == 0) {
                            bdd.query(`UPDATE candidature SET cand_titre = ?, cand_description = ?, offre_id = ?, user_id = ? WHERE cand_id = ?`, [
                                titre, description, offre_id, user_id, id
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
    
        let id = req.body.cand_id;

        if (id != null && !isNaN(id)) {
            bdd.query(`SELECT * FROM candidature WHERE cand_id = ?`, [
                id
            ], function(err, result) {
                if (err) throw err;

                if (result.length == 1) {
                    bdd.query(`DELETE FROM candidature WHERE cand_id = ?`, [
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

router.post('/removeWithUser', function(req, res, next) {
    if (req.cookies.userData != null && req.body.societe_id != null && !isNaN(req.body.societe_id)) {
        bdd.query("SELECT emploi_access FROM employer WHERE user_id = ? AND societe_id = ?", [
            req.cookies.userData.id, req.body.societe_id
        ], function(err, result) {
            if (err) return reject(err);

            if (result != null && result[0] != null && result[0].emploi_access != null && (result[0].emploi_access == 1 || result[0].emploi_access == 2)) {
                let id = req.body.cand_id;

                if (id != null && !isNaN(id)) {
                    bdd.query(`SELECT * FROM candidature WHERE cand_id = ?`, [
                        id
                    ], function(err, result) {
                        if (err) throw err;

                        if (result.length == 1) {
                            bdd.query(`DELETE FROM candidature WHERE cand_id = ?`, [
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

module.exports = router;
