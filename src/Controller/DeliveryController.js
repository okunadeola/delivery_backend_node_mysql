import { response } from 'express';
import pool from '../Database/mysql.js';

export const getAllDelivery = async ( req, res = response ) => {

    try {

        let deliverydb = await pool.query(`SELECT p.uid AS person_id, CONCAT(p.firstName, ' ', p.lastName) AS nameDelivery, p.phone, p.image, u.notification_token FROM person p
        INNER JOIN users u ON p.uid = u.persona_id
        WHERE u.rol_id = 3 AND p.state = 1`);

        res.json({
            resp: true,
            msg : 'Get All Delivery',
            delivery: deliverydb
        });
        
    } catch (e) {
        return res.status(500).json({
            resp: false,
            msg : e
        });
    }

}
