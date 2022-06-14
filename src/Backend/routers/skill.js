const express = require('express')
const router = express.Router()

// DATABASE SETUP
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

const { adminAuth } = require('../middlewares/auth')

router.get('/skills', async (req, res) => {
    try {
        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './database/bit.db',
            driver: sqlite3.Database,
        })

        // GET SOFT SKILLS
        const skills = await db.all(`SELECT * FROM skill`)

        // FECHAR O BANCO DE DADOS
        await db.close()

        res.send(skills)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

router.post('/skill/create', adminAuth, async (req, res) => {
    try {
        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './database/bit.db',
            driver: sqlite3.Database,
        })

        // CHECAR SE SKILL JÁ EXISTE
        const existingSkill = await db.get(`SELECT * FROM skill WHERE name='${req.body.name}'`)
        if (existingSkill) {
            throw new Error('Competência já existe')
        }

        // INSERT SKILL
        await db.run(`INSERT INTO skill (name, type) VALUES ('${req.body.name}', '${req.body.type}')`)

        // FECHAR O BANCO DE DADOS
        await db.close()

        res.send()
    } catch (err) {
        res.status(400).send(err.message)
    }
})

router.delete('/skill/:id', adminAuth, async (req, res) => {
    try {
        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './database/bit.db',
            driver: sqlite3.Database,
        })

        await db.run(`DELETE FROM skill WHERE id='${req.params.id}'`)

        await db.close()

        res.send()
    } catch (err) {
        res.status(400).send()
    }
})

module.exports = router
