import { response } from 'express';
import pool from '../Database/mysql.js';

export const addCategories = async (req, res = response) => {

    try {

        const { category, description } = req.body;

        await pool.query(`INSERT INTO categories (category, description) VALUE(?,?);`, [ category, description ]);

        res.json({
            resp: true,
            msg : 'Category added successfully',
        });
        
    } catch (e) {
        return res.status(500).json({
            resp: false,
            msg : e
        }); 
    }
}

export const getAllCategories = async ( req, res = response ) => {

    try {

        const category = await pool.query('SELECT * FROM categories');

        res.json({
            resp: true,
            msg : 'All Categories',
            categories: category
        });
        
    } catch (e) {
        return res.status(500).json({
            resp: false,
            msg : e
        });
    }

}

export const getProductsByCategory = async (req, res = response) => {

    try {

        const productsdb = await pool.query(`SELECT pro.id, pro.nameProduct, pro.description, pro.price, pro.status, ip.picture, c.category, c.id AS category_id FROM products pro
        INNER JOIN categories c ON pro.category_id = c.id
        INNER JOIN imageProduct ip ON pro.id = ip.product_id
        INNER JOIN ( SELECT product_id, MIN(id) AS id_image FROM imageProduct GROUP BY product_id) p3 ON ip.product_id = p3.product_id AND ip.id = p3.id_image WHERE c.category = ? LIMIT 10;`, [ req.params.category ]);


        res.json({
            resp: true,
            msg : `Top 10 Products for ${req.params.category}`,
            productsdb: productsdb
        });

        
    } catch (e) {
        return res.status(500).json({
            resp: false,
            msg : e
        });
    }
}