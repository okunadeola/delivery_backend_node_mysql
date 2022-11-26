import { response } from 'express';
import pool from '../Database/mysql.js';


export const getListOrdersForClient = async (req, res = response) => {

    try {
        console.log(1)
        const listdb = await pool.query(`SELECT o.id, o.client_id, o.delivery_id, ad.reference, ad.Latitude AS latClient, ad.Longitude AS lngClient ,CONCAT(p.firstName, ' ', p.lastName)AS delivery, p.phone AS deliveryPhone, p.image AS imageDelivery, o.address_id, o.latitude, o.longitude, o.status, o.amount, o.pay_type, o.currentDate 
        FROM orders o
        LEFT JOIN person p ON p.uid = o.delivery_id
        INNER JOIN addresses ad ON o.address_id = ad.id 
        WHERE o.client_id = ?
        ORDER BY o.id DESC;`, [req.uid]);
        console.log(listdb)

        res.json({
            resp: true,
            msg : 'List orders for client',
            ordersClient: listdb
        });
        
    } catch (e) {
        return res.status(500).json({
            resp: false,
            msg : e
        });
    }

}