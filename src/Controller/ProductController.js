import { response } from 'express';
import pool from '../Database/mysql.js';


export const addNewProduct = async (req, res = response) => {

    try {

        const { name, description, price, category } = req.body;
        
        const rows = await pool.query('INSERT INTO products (nameProduct, description, price, category_id) VALUE (?,?,?,?)', [name, description, price, category]);
        
        req.files.forEach(image => {
            pool.query('INSERT INTO imageProduct (picture, product_id) value (?,?)', [ image.path, rows.insertId ]);
        });

        res.json({
            resp: true,
            msg : 'Product added Successfully'
        });
 
    } catch (e) {
        return res.status(500).json({
            resp: false,
            msg : e
        });
    }

}

export const getProductsTopHome = async (req, res = response) => {

    try {

        const productsdb = await pool.query(`SELECT pro.id, pro.nameProduct, pro.description, pro.price, pro.status, ip.picture, c.category, c.id AS category_id FROM products pro
        INNER JOIN categories c ON pro.category_id = c.id
        INNER JOIN imageProduct ip ON pro.id = ip.product_id
        INNER JOIN ( SELECT product_id, MIN(id) AS id_image FROM imageProduct GROUP BY product_id) p3 ON ip.product_id = p3.product_id AND ip.id = p3.id_image
        LIMIT 10;`);


        res.json({
            resp: true,
            msg : 'Top 10 Products',
            productsdb: productsdb
        });

        
    } catch (e) {
        return res.status(500).json({
            resp: false,
            msg : e
        });
    }
}

export const getImagesProducts = async ( req, res = response ) => {

    try {

        const imageProductdb = await pool.query('SELECT * FROM imageProduct WHERE product_id = ?', [ req.params.id ]);

        res.json({
            resp: true,
            msg : 'Get Images Products',
            imageProductdb: imageProductdb
        });
        
    } catch (e) {
        return res.status(500).json({
            resp: false,
            msg : e
        });
    }

}

export const searchProductForName = async (req, res = response) => {

    try {

        const productdb = await pool.query(`SELECT pro.id, pro.nameProduct, pro.description, pro.price, pro.status, ip.picture, c.category, c.id AS category_id FROM products pro
        INNER JOIN categories c ON pro.category_id = c.id
        INNER JOIN imageProduct ip ON pro.id = ip.product_id
        INNER JOIN ( SELECT product_id, MIN(id) AS id_image FROM imageProduct GROUP BY product_id) p3 ON ip.product_id = p3.product_id AND ip.id = p3.id_image
        WHERE pro.nameProduct LIKE CONCAT('%', nameProduct , '%');`, [ req.params.nameProduct ]);

        console.log(productdb)
        res.json({
            resp: true,
            msg : 'Search products',
            productsdb: productdb
        }); 
        
    } catch (e) {
        return res.status(500).json({
            resp: false,
            msg : e
        });
    }

}

export const searchProductsForCategory = async (req, res = response) => {

    try {

        const productdb = await pool.query(`SELECT pro.id, pro.nameProduct, pro.description, pro.price, pro.status, ip.picture, c.category, c.id AS category_id FROM products pro
        INNER JOIN categories c ON pro.category_id = c.id
        INNER JOIN imageProduct ip ON pro.id = ip.product_id
        INNER JOIN ( SELECT product_id, MIN(id) AS id_image FROM imageProduct GROUP BY product_id) p3 ON ip.product_id = p3.product_id AND ip.id = p3.id_image
        WHERE pro.category_id = ?;`, [req.params.idCategory]);

        res.json({
            resp: true,
            msg : 'list Products for id Category',
            productsdb : productdb
        });
        
    } catch (e) {
        return res.status(500).json({
            resp: false,
            msg : e
        });
    }

}

export const listProductsAdmin = async (req, res = response) => {

    try {

        const productsdb = await pool.query(`SELECT pro.id, pro.nameProduct, pro.description, pro.price, pro.status, ip.picture, c.category, c.id AS category_id FROM products pro
        INNER JOIN categories c ON pro.category_id = c.id
        INNER JOIN imageProduct ip ON pro.id = ip.product_id
        INNER JOIN ( SELECT product_id, MIN(id) AS id_image FROM imageProduct GROUP BY product_id) p3 ON ip.product_id = p3.product_id AND ip.id = p3.id_image;`);

        res.json({
            resp: true,
            msg : 'Top 10 Products',
            productsdb: productsdb 
        });

        
    } catch (e) {
        return res.status(500).json({
            resp: false,
            msg : e
        });
    }
}

export const updateStatusProduct = async (req, res = response) => {

    try {

        const { status, idProduct } = req.body;

        await pool.query('UPDATE products SET status = ? WHERE id = ?', [ parseInt(status), parseInt(idProduct) ]);

        res.json({
            resp: true,
            msg : 'Product updated'
        });
        
    } catch (e) {
        return res.status(500).json({
            resp: false,
            msg : e
        });
    }

}

export const deleteProduct = async (req, res = response ) => {

    try {

        await pool.query('DELETE FROM imageProduct WHERE product_id = ?', [ req.params.idProduct ]);
        await pool.query('DELETE FROM products WHERE id = ?', [ req.params.idProduct ]);

        res.json({
            resp: true,
            msg : 'Product deleted successfully'
        });
        
    } catch (e) {
        return res.status(500).json({
            resp: false,
            msg : e
        });
    }

}