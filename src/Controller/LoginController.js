import { response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../Database/mysql.js';
import { generateJsonWebToken } from '../Lib/JwToken.js';


export const loginController = async ( req, res = response ) => {

    try {

        const { email, password } = req.body;

        const validatedEmail = await pool.query('SELECT email FROM users WHERE email = ?', [ email ]);

        if( validatedEmail.length == 0 ){
            return res.status(400).json({
                resp: false,
                msg : 'Wrong Credentials'
            
            });
        }
        const userdb = await pool.query(`SELECT p.uid, p.firstName, p.lastName, p.image, u.email, u.passwordd, u.rol_id, u.notification_token FROM person p
        INNER JOIN users u ON p.uid = u.persona_id
        WHERE u.email = ? AND p.state = TRUE;`, [email]);
        
        const user = userdb[0];

        
        if( !await bcrypt.compareSync( password, user.passwordd )){
            return res.status(401).json({
                resp: false,
                msg : 'Wrong Credentials'
            }); 
        }else{
            let token = await generateJsonWebToken( user.uid );
    
            res.json({
                resp: true,
                msg : 'Welcome to Delivery Restaurant',
                user: {
                    uid: user.uid,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    image: user.image,
                    email: user.email,
                    rol_id: user.rol_id,
                    notification_token: user.notification_token
                },
                token
            });
        }
    } catch (e) {
        return res.status(500).json({
            resp: false,
            msg : e
        });
    }


}


export const renewTokenLogin = async ( req, res = response ) => {

    try {

        const token = await generateJsonWebToken( req.uid );

        const userdb = await pool.query(`SELECT p.uid, p.firstName, p.lastName, p.image, p.phone, u.email, u.rol_id, u.notification_token FROM person p
        INNER JOIN users u ON p.uid = u.persona_id
        WHERE p.uid = ? AND p.state = 1`, [ req.uid ]);



        const user = userdb[0];

        
        res.json({
            resp: true,
            msg : 'Welcome to Delivery Restaurant',
            user: {
                uid: user.uid,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                phone: user.phone,
                email: user.email,
                rol_id: user.rol_id,
                notification_token: user.notification_token
            },
            token
        });
        
    } catch (e) {
        res.status(500).json({
            resp: false,
            msg : e
        });
    }

}