
var express = require('express');
var router = express.Router();
var bdd = require('./module/bdd');

function isAdminInSociete(param, id_societe) {
    return new Promise((resolve, reject) => {
        if (param.cookies.userData != null && id_societe != null && !isNaN(id_societe)) {
            bdd.query("SELECT emploi_access FROM employer WHERE user_id = ? AND societe_id = ?", [
                param.cookies.userData.id, id_societe
            ], function(err, result) {
                if (err) return reject(err);

                if (result[0].emploi_access != null && result[0].emploi_access == 2) {
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

router.post('/getEmployersForSocieteById', function (req, res, next) {
    isAdminInSociete(req, req.body.societe_id).then((admin) => {
        if (!admin) {
            res.sendStatus(401);
            return;
        }

        if (req.body.societe_id != null && !isNaN(req.body.societe_id) && req.body.emploi_id != null && !isNaN(req.body.emploi_id)) {
            bdd.query(`SELECT emploi_id, employer.user_id, user_username, user_nom, user_prenom, employer.societe_id, societe_nom, emploi_access FROM employer JOIN utilisateur ON utilisateur.user_id = employer.user_id JOIN societe ON societe.societe_id = employer.societe_id WHERE (employer.societe_id = ? AND emploi_id = ?)`, [
                req.body.societe_id, req.body.emploi_id
            ], function(err, result) {
                if (err) throw err;
                res.send(result);
            });    
        } else {
            res.sendStatus(400);
        }
    });
});

router.post('/updateEmploiAcces', function (req, res, next) {
    isAdminInSociete(req, req.body.societe_id).then((admin) => {
        if (!admin) {
            res.sendStatus(401);
            return;
        }

        if (req.body.societe_id != null && !isNaN(req.body.societe_id) && req.body.emploi_id != null && !isNaN(req.body.emploi_id) && req.body.emploi_access != null && !isNaN(req.body.emploi_access)) {
            bdd.query(`SELECT * FROM employer WHERE (societe_id = ? AND emploi_access = ? AND emploi_id != ?)`, [
                req.body.societe_id, 2, req.body.emploi_id
            ], function(err, result) {
                if (err) throw err;
                
                if (!(result.length == 0 && req.body.emploi_access != 2)) {
                    bdd.query(`UPDATE employer SET emploi_access = ? WHERE emploi_id = ?`, [
                        req.body.emploi_access, req.body.emploi_id
                    ], function(err, result) {
                        if (err) throw err;
                        res.send("OK")
                    });
                } else {
                    res.send("NOK"); // rjgvfrbiulrn
                }
            });
        } else {
            res.sendStatus(400);
        }
    });
});

router.post('/remove', function (req, res, next) {
    isAdminInSociete(req, req.body.societe_id).then((admin) => {
        if (!admin) {
            res.sendStatus(401);
            return;
        }

        if (req.body.societe_id != null && !isNaN(req.body.societe_id) && req.body.emploi_id != null && !isNaN(req.body.emploi_id)) {
            bdd.query(`SELECT * FROM employer WHERE (societe_id = ? AND emploi_access = ? AND emploi_id != ?)`, [
                req.body.societe_id, 2, req.body.emploi_id
            ], function(err, result) {
                if (err) throw err;
                
                if (!(result.length == 0 && req.body.emploi_access != 2)) {
                    bdd.query(`SELECT * FROM employer WHERE emploi_id = ?`, [
                        req.body.emploi_id
                    ], function(err, result) {
                        if (result.length == 1) {
                            bdd.query(`DELETE FROM employer WHERE emploi_id = ?`, [
                                req.body.emploi_id
                            ], function(err, result) {
                                if (err) throw err;
                                res.send("OK");
                            });
                        }
                        else {
                            res.send("NOK"); // rjgvfrbiulrn
                        }
                    });
                } else {
                    res.send("NOK"); // rjgvfrbiulrn
                }
            });
        } else {
            res.sendStatus(400);
        }
    });
});

/* if() {
    res.send("NOK");
} else {
    bdd.query(`UPDATE employer SET emploi_access = '${req.body.emploi_access}' WHERE emploi_id = '${req.body.emploi_id}'`, (err, result2, fields) => {
        if (err) throw err;
        res.send("OK")
    });
} */

module.exports = router;