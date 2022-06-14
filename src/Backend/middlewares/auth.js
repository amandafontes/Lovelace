const jwt = require('jsonwebtoken')

// DATABASE SETUP
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

exports.userAuth = async (req, res, next) => {
    try {
        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './database/bit.db',
            driver: sqlite3.Database,
        })

        // CHECAR TOKEN
        const token = req.cookies.token
        const decoded = await jwt.verify(token, process.env.JWT_USER_SECRET)

        // ENCONTRAR USUÁRIO
        const user = await db.get(`SELECT * FROM user WHERE id='${decoded.id}'`)
        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user

        next()
    } catch (e) {
        res.status(401).send({ error: 'Por favor, faça login ou crie uma conta.' })
    }
}

exports.companyAuth = async (req, res, next) => {
    try {
        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './database/bit.db',
            driver: sqlite3.Database,
        })

        // CHECAR TOKEN
        const token = req.cookies.token
        const decoded = await jwt.verify(token, process.env.JWT_COMPANY_SECRET)

        // ENCONTRAR USUÁRIO
        const company = await db.get(`SELECT * FROM company WHERE id=${decoded.id} AND isApproved=1`)

        if (!company) {
            throw new Error()
        }

        req.token = token
        req.company = company

        next()
    } catch (e) {
        res.status(401).send({ error: 'Por favor, faça login ou crie uma conta.' })
    }
}

exports.adminAuth = async (req, res, next) => {
    try {
        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './database/bit.db',
            driver: sqlite3.Database,
        })

        // CHECAR TOKEN
        const token = req.cookies.token
        const decoded = await jwt.verify(token, process.env.JWT_ADMIN_SECRET)

        // ENCONTRAR USUÁRIO
        const admin = await db.get(`SELECT * FROM admin WHERE id=${decoded.id}`)

        if (!admin) {
            throw new Error()
        }

        req.token = token
        req.admin = admin

        next()
    } catch (e) {
        res.status(401).send({ error: 'Por favor, faça login ou crie uma conta.' })
    }
}
