import { response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../Database/mysql.js';



 

export const uploadImage = async (req, res) => {
    try {
      console.log(req.files);
      return res.status(200).json({
        success: 1,
        message: req.files
      })
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "upload error"
      })
    }
  }














export const registerClient = async ( req, res = response  ) => {
    const { firstname, lastname, phone, email, password, notification_token } = req.body;
    // req.file.filename if => local
    const imagePath = req.file.path;
    try {
        let salt = bcrypt.genSaltSync();
        const pass = bcrypt.hashSync( password, salt );
        const validatedEmail = await pool.query('SELECT email FROM users WHERE email = ?', [email]);

        if( validatedEmail.length  > 0 ){
            return res.status(401).json({
                resp: false,
                msg : 'Email already exists'
            });
        }else{
               var returnn =  await pool.query(`INSERT INTO Person(firstName, lastName, phone, image) VALUE (?,?,?,?)`, [firstname, lastname, phone, imagePath]);
       
            await pool.query(`INSERT INTO Users(users, email, passwordd, persona_id, rol_id, notification_token) VALUE (?,?,?,?,?,?)`, [firstname, email, pass, returnn.insertId,  2, notification_token]);

            res.json({
                resp: true,
                msg : 'Client successfully registered',
            });
        }
     } catch (err) {
        return res.status(500).json({
            resp: false,
            msg : err
        });
    }

}


export const registerDelivery = async (req, res = response) => {

    try {

        const { firstname, lastname, phone, email, password, notification_token } = req.body;
        const imagePath = req.file.path;

        const validatedEmail = await pool.query('SELECT email FROM users WHERE email = ?', [email]);

        if( validatedEmail.length  > 0 ){
            return res.status(401).json({
                resp: false,
                msg : 'Email already exists'
            });
        }

        let salt = bcrypt.genSaltSync();

        const pass = bcrypt.hashSync( password, salt );

        var returnn =  await pool.query(`INSERT INTO Person(firstName, lastName, phone, image) VALUE (?,?,?,?)`, [firstname, lastname, phone, imagePath]);
       
        await pool.query(`INSERT INTO Users(users, email, passwordd, persona_id, rol_id, notification_token) VALUE (?,?,?,?,?,?)`, [firstname, email, pass, returnn.insertId,  3, notification_token]);
        res.json({
            resp: true,
            msg : 'Devlivery successfully registered',
        });

        
    } catch (e) {
        return res.status(500).json({
            resp: false,
            msg : e
        });
    }


}
export const registerAdmin = async (req, res = response) => {
    try {
        const { firstname, lastname, phone, email, password, notification_token } = req.body;
        const imagePath = req.file.path;

        const validatedEmail = await pool.query('SELECT email FROM users WHERE email = ?', [email]);

        if( validatedEmail.length  > 0 ){
            return res.status(401).json({
                resp: false,
                msg : 'Email already exists'
            });
        }

        let salt = bcrypt.genSaltSync();
        const pass = bcrypt.hashSync( password, salt );

        var returnn =  await pool.query(`INSERT INTO Person(firstName, lastName, phone, image) VALUE (?,?,?,?)`, [firstname, lastname, phone, imagePath]);
       
        await pool.query(`INSERT INTO Users(users, email, passwordd, persona_id, rol_id, notification_token) VALUE (?,?,?,?,?,?)`, [firstname, email, pass, returnn.insertId,  1, notification_token]);

        res.json({
            resp: true,
            msg : 'Admin successfully registered',
        });

        
    } catch (e) {
        return res.status(500).json({
            resp: false,
            msg : e
        });
    }

}
