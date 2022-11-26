import { response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../Database/mysql.js';
import fs from 'fs-extra';
import path from 'path';

export const getUserById = async (req, res = response) => {

    try {

        const uid = req.uid;

        const query = await pool.query(`SELECT p.uid, p.firstName, p.lastName, p.phone, p.image, u.email, u.rol_id, u.notification_token FROM person p
        INNER JOIN users u ON p.uid = u.persona_id
        WHERE p.uid = 1 AND p.state = TRUE;`, [uid]);
        
        res.json({
            resp: true,
            msg : 'Get profile',
            user: query[0]
        });
        
    } catch (e) {
        return res.status(500).json({
            resp: false,
            msg : e
        });
    }

}


export const editProfile = async ( req, res = response ) => {

    try {

        const { firstname, lastname, phone } = req.body;

        await pool.query(`	UPDATE person
		SET firstName = ?, lastName = ?, phone = ?,
	WHERE person.uid = ?;`, [firstname, lastname, phone, req.uid]);

        res.json({
            resp: true,
            msg : 'Updated Profile'
        });
        
    } catch (e) {
        return res.status(500).json({
            resp: false,
            msg : e
        });
    }

}


export const getUserUpdated = async ( req, res = response ) => {

    try {

        const userdb = await pool.query(`SELECT p.firstName, p.lastName, p.image, u.email, u.rol_id FROM person p
        INNER JOIN users u ON p.uid = u.persona_id
        WHERE p.uid = ? AND p.state = TRUE;`, [ req.uid ]);

        const user = userdb[0][0];

        res.json({
            resp: true,
            msg : 'User updated',
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                email: user.email,
                rol_id: user.rol_id
            },
        });
        
    } catch (e) {
        return res.status(500).json({
            resp: false,
            msg : e
        });
    }

}


export const changePassword = async ( req, res = response ) => {

    try {

        const { currentPassword, newPassword } = req.body;

        const passworddb = await pool.query('SELECT passwordd FROM users WHERE persona_id = ?', [req.uid]);

        if( !await bcrypt.compareSync( currentPassword, passworddb[0].passwordd )){
            return res.status(401).json({
                resp: false,
                msg : 'Passwords do not match'
            }); 
        }

        let salt = bcrypt.genSaltSync();
        const pass = bcrypt.hashSync( newPassword, salt );

        await pool.query('UPDATE users SET passwordd = ? WHERE persona_id = ?', [ pass, req.uid ]);

        res.json({
            resp: true,
            msg: 'Password Changed'
        });
        
    } catch (e) {
        return res.status(500).json({
            resp: false,
            msg : e
        });
    }

}


export const changeImageProfile = async (req, res = response) => {

    try {

        const imagePath = req.file.path;

        const imagedb = await pool.query('SELECT image FROM person WHERE uid = ?', [ req.uid ]);
        
        await fs.unlink( path.resolve('src/Uploads/Profile/'+imagedb[0].image));

        await pool.query('UPDATE person SET image = ? WHERE uid = ?', [ imagePath, req.uid ]);

        res.json({
            resp: true,
            msg : 'Picture changed'
        });
        
    } catch (e) {
        return res.status(500).json({
            resp: false,
            msg : e
        });
    }

}


export const getAddressesUser = async (req, res = response ) => {

    try {

        const addressesdb = await pool.query('SELECT id, street, reference, Latitude, Longitude FROM addresses WHERE persona_id = ?', [req.uid]);

        res.json({
            resp: true,
            msg : 'List the Addresses',
            listAddresses : addressesdb
        });
        
    } catch (e) {
        return res.status(500).json({
            resp: false,
            msg : e
        });
    }

}


export const deleteStreetAddress = async (req, res = response ) => {

    try {

        await pool.query('DELETE FROM addresses WHERE id = ? AND persona_id = ?', [ req.params.idAddress , req.uid ]);

        res.json({
            resp: true,
            msg : 'Street Address deleted'
        });
        
    } catch (e) {
        return res.status(500).json({
            resp: false,
            msg : e
        });
    }
}


export const addStreetAddress = async ( req, res = response ) => {

    try {

        const { street, reference, latitude, longitude } = req.body;
        console.log(street, reference, latitude, longitude)

        await pool.query('INSERT INTO addresses (street, reference, Latitude, Longitude, persona_id) VALUE (?,?,?,?,?)', [ street, reference, latitude, longitude, req.uid ]);
        
        res.json({
            resp: true,
            msg : 'Street Address added successfully'
        });

    } catch (e) {
        return res.status(500).json({
            resp: false,
            msg : e
        });
    }

}


export const getAddressOne = async (req, res = response) => {

    try {

        const addressdb = await pool.query('SELECT * FROM addresses WHERE persona_id = ? ORDER BY id DESC LIMIT 1', [ req.uid ]);
        
        res.json({
            resp: true,
            msg : 'One Address',
            address: addressdb[0]
        });
        
    } catch (e) {
        return res.status(500).json({
            resp: false,
            msg : e
        }); 
    }
}

export const updateNotificationToken = async (req, res = response ) => {

    try {

        const { nToken } = req.body;

        await pool.query('UPDATE users SET notification_token = ? WHERE persona_id = ?', [ nToken, req.uid ]);

        res.json({
            resp: true,
            msg : 'Token updated'
        });
        
    } catch (e) {
        return res.status(500).json({
            resp : false,
            msg : e
        });
    }

}

export const getAdminNotificationToken = async (req, res = response ) => {

    try {

        const admisdb = await pool.query('SELECT notification_token FROM users WHERE rol_id = 1');

        let tokens = [];

        admisdb.forEach( t  => {
            tokens.push(t.notification_token);
        });

        res.json(tokens);
        
    } catch (e) {
        return res.status(501).json({
            resp: false,
            msg : e
        });
    }

}

export const updateDeliveryToClient = async( req, res = response ) => {

    try {

        await pool.query('UPDATE users SET rol_id = ? WHERE persona_id = ?', [ 2, req.params.idPerson ]);

        res.json({
            resp: true,
            msg : 'Delivery To Client'
        });
        
    } catch (e) {
        return res.status(501).json({
            resp: false,
            msg : e
        });
    }

}