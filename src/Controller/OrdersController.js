import { response } from 'express';
import pool from '../Database/mysql.js';


export const addNewOrders = async (req, res = response ) => {

    try {

        const { uidAddress, total, typePayment,  products } = req.body;

        const orderdb = await pool.query('INSERT INTO orders (client_id, address_id, amount, pay_type) VALUES (?,?,?,?)', [ req.uid, uidAddress, total, typePayment ]);

        products.forEach(o => {
             pool.query('INSERT INTO orderDetails (order_id, product_id, quantity, price) VALUES (?,?,?,?)', [ orderdb.insertId, o.uidProduct, o.quantity, o.quantity * o.price ]);
        });

        res.json({
            resp: true,
            msg : 'New Order added successfully'
        });

    } catch (e) {
        return res.status(500).json({
            resp: false,
            msg : e
        });
    }

}

export const getOrdersByStatus = async (req, res = response ) => {

    try {


        console.log(2)
        const ordersdb = await pool.query(`SELECT o.id AS order_id, o.delivery_id, CONCAT(pe.firstName, " ", pe.lastName) AS delivery, pe.image AS deliveryImage, o.client_id, CONCAT(p.firstName, " ", p.lastName) AS cliente, p.image AS clientImage, p.phone AS clientPhone, o.address_id, a.street, a.reference, a.Latitude, a.Longitude, o.status, o.pay_type, o.amount, o.currentDate
        FROM orders o
        INNER JOIN person p ON o.client_id = p.uid
        INNER JOIN addresses a ON o.address_id = a.id
        LEFT JOIN person pe ON o.delivery_id = pe.uid
        WHERE o.status = ?`, [ req.params.statusOrder ]);



        res.json({
            resp: true,
            msg : 'Orders by ' + req.params.statusOrder,
            ordersResponse : ordersdb
        });
        
    } catch (e) {
        return res.status(500).json({
            resp: false,
            msg : e
        });
    }

}

export const getDetailsOrderById = async ( req, res = response ) => {

    try {

        // console.log(1)
        const detailOrderdb = await pool.query(`SELECT od.id, od.order_id, od.product_id, p.nameProduct, ip.picture, od.quantity, od.price AS total
        FROM orderdetails od
        INNER JOIN products p ON od.product_id = p.id
        INNER JOIN imageProduct ip ON p.id = ip.product_id
        INNER JOIN ( SELECT product_id, MIN(id) AS id_image FROM imageProduct GROUP BY product_id) p3 ON ip.product_id = p3.product_id AND ip.id = p3.id_image
        WHERE od.order_id = ?;`, [ req.params.idOrderDetails ]);

        // console.log(detailOrderdb)
        res.json({
            resp: true,
            msg : 'Order details by ' + req.params.idOrderDetails,
            detailsOrder: detailOrderdb
        });
        
    } catch (e) {
        return res.status(500).json({
            resp: false,
            msg : e
        });
    }

}

export const updateStatusToDispatched = async ( req, res = response ) => {

    try {

        const { idDelivery, idOrder } = req.body;

        await pool.query('UPDATE orders SET status = ?, delivery_id = ? WHERE id = ?', [ 'DISPATCHED', idDelivery, idOrder ]);

        res.json({
            resp: true,
            msg : 'Order DISPATCHED'
        });
        
    } catch (e) {
        return res.status(500).json({
            resp: false,
            msg : e
        });
    }

}



export const getOrdersByDelivery = async ( req, res = response ) => {

    try {

        const ordersDeliverydb = await pool.query(`SELECT o.id AS order_id, o.delivery_id, o.client_id, CONCAT(p.firstName, " ", p.lastName) AS cliente, p.image AS clientImage, p.phone AS clientPhone, o.address_id, a.street, a.reference, a.Latitude, a.Longitude, o.status, o.pay_type, o.amount, o.currentDate
        FROM orders o
        INNER JOIN person p ON o.client_id = p.uid
        INNER JOIN addresses a ON o.address_id = a.id
        WHERE o.status = ? AND o.delivery_id = ?;`, [req.params.statusOrder,  req.uid  ]);


        res.json({
            resp: true,
            msg : 'All Orders By Delivery',
            ordersResponse : ordersDeliverydb
        });                                                                                                                                     
    } catch (e) {
        return res.status(500).json({
            resp: false,
            msg : e
        });
    }

}

export const updateStatusToOntheWay = async ( req, res = response ) => {

    try {

        const { latitude, longitude } = req.body;

        await pool.query('UPDATE orders SET status = ?, latitude = ?, longitude = ? WHERE id = ?', ['ON WAY', latitude, longitude, req.params.idOrder ]);

        res.json({
            resp: true,
            msg : 'ON WAY'
        });
        
    } catch (e) {
        return res.status(500).json({
            resp: false,
            msg : e
        });
    }

}

export const updateStatusToDelivered = async ( req, res = response ) => {

    try {

        await pool.query('UPDATE orders SET status = ? WHERE id = ?', ['DELIVERED', req.params.idOrder ]);

        res.json({
            resp: true,
            msg : 'ORDER DELIVERED'
        });
        
    } catch (e) {
        return res.status(500).json({
            resp: false,
            msg : e
        });
    }

}