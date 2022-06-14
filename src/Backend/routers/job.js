const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { companyAuth } = require('../middlewares/auth')

// DATABASE SETUP
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

// EXPRESS ROUTER
const router = express.Router()

// ROTA DE VER VAGAS
router.get('/job', companyAuth, async (req, res) => {
    try {
        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './database/bit.db',
            driver: sqlite3.Database,
        })

        // GET VAGAS
        const jobs = await db.all(`SELECT * FROM job WHERE companyId='${req.company.id}'`)

        const jobArray = []

        for (job of jobs) {
            job.skills = await db.all(
                `SELECT * FROM skill INNER JOIN jobSkill ON skill.id=jobSkill.skillId WHERE jobSkill.jobId=${job.id}`
            )
            jobArray.push(job)
        }

        // FECHAR O BANCO DE DADOS
        await db.close()

        // RESPOSTA
        res.send(jobArray)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

// ROTA DE CRIAR VAGA
router.post('/job/create', companyAuth, async (req, res) => {
    try {
        const { type, workModel, area, skills } = req.body

        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './database/bit.db',
            driver: sqlite3.Database,
        })

        // INSERIR VAGA
        const job = await db.run(
            `INSERT INTO job (companyId, workModel, type, area) VALUES ('${req.company.id}', '${workModel}', '${type}', '${area}')`
        )

        // INSERIR COMPETÊNCIAS TÉCNICAS
        for (let i = 0; i < skills.length; i++) {
            await db.run(`INSERT INTO jobSkill (skillId, jobId) VALUES ('${skills[i]}', '${job.lastID}')`)
        }

        // FECHAR O BANCO DE DADOS
        await db.close()

        // RESPOSTA
        res.redirect('/views/jobs/jobs.html')
    } catch (err) {
        res.status(400).send(err.message)
    }
})

router.get('/job/:id/getUsers', companyAuth, async (req, res) => {
    try {
        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './database/bit.db',
            driver: sqlite3.Database,
        })

        // PEGAR O JOB DA COMPANHIA SELECIONADA
        const job = await db.get(
            `SELECT * FROM job WHERE job.id='${req.params.id}' AND job.companyId='${req.company.id}'`
        )
        if (!job) {
            throw new Error('Nenhuma vaga encontrada!')
        }

        // GET ALL SKILLS
        const jobSkills = await db.all(
            `SELECT * FROM jobSkill INNER JOIN job ON job.id = jobSkill.jobId WHERE jobId = '${job.id}'`
        )

        // GET TODAS AS CANDIDATAS QUE APLICARAM PARA A EMPRESA
        const appliedUsers = await db.all(
            `SELECT userCompany.* FROM userCompany INNER JOIN company ON company.id=userCompany.companyId WHERE company.id='${req.company.id}'`
        )

        const matchUserIds = []

        for (companyUser of appliedUsers) {
            let equalSkills = []

            // SKILLS DA USUÁRIA
            const userSkills = await db.all(
                `SELECT userSkill.* FROM userSkill INNER JOIN user ON userSkill.userId=user.id WHERE user.id='${companyUser.userId}'`
            )

            for (userSkill of userSkills) {
                for (jobSkill of jobSkills) {
                    if (jobSkill.skillId == userSkill.skillId) {
                        equalSkills.push(jobSkill.skillId)
                    }
                }
            }

            let matchPercentage = equalSkills.length / jobSkills.length

            if (matchPercentage >= 0.5) {
                matchUserIds.push(companyUser.userId)
            }
        }

        let users = []
        for (id of matchUserIds) {
            const fetchedUser = await db.get(`SELECT * FROM user WHERE id='${id}'`)
            users.push(fetchedUser)
        }

        await db.close()

        res.send(users)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

router.delete('/job/:id', companyAuth, async (req, res) => {
    try {
        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './database/bit.db',
            driver: sqlite3.Database,
        })

        await db.run(`DELETE FROM job WHERE id='${req.params.id}' AND companyId='${req.company.id}'`)

        await db.run(`DELETE FROM jobSkill WHERE jobId='${req.params.id}'`)

        await db.close()

        res.send()
    } catch (err) {
        res.status(400).send()
    }
})

router.get('/job/getUsers/:userId', companyAuth, async (req, res) => {
    try {
        const db = await open({
            filename: './database/bit.db',
            driver: sqlite3.Database,
        })

        const user = await db.get(
            `SELECT id, firstName, lastName, country, aboutYou, email, phone, birthDate, userAddressId FROM user WHERE id='${req.params.userId}'`
        )

        const address = await db.get(`SELECT city, state FROM address WHERE id='${user.userAddressId}'`)
        user.address = address

        const userSkills = await db.all(
            `SELECT * FROM userSkill INNER JOIN skill ON userSkill.skillId = skill.id WHERE userSkill.userId = '${req.params.userId}'`
        )

        user.skills = userSkills

        await db.close()

        res.send(user)
    } catch (err) {
        res.status(400).send()
    }
})

module.exports = router
