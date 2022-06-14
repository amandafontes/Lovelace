const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// DATABASE SETUP
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

const { companyAuth } = require('../middlewares/auth')

// EXPRESS ROUTER
const router = express.Router()

// FUNÇÃO PARA GERAR TOKEN
const generateAuthToken = async (id) => {
    const token = await jwt.sign({ id }, process.env.JWT_COMPANY_SECRET, {
        expiresIn: 2 * 60 * 60, // TEMPO DE EXPIRAÇÃO
    })
    return token
}

// ROTA DE CRIAR CONTA
router.post('/company/signUp', async (req, res) => {
    try {
        const {
            street,
            cep,
            neighborhood,
            city,
            state,
            complement,
            email,
            name,
            cnpj,
            phone,
            phone2,
            openingDate,
            marketNiche,
            companyPhilosophy,
            companyCulture,
            badges,
            recruterFirstName,
            recruterSecondName,
            recruterRole,
            recruterEmail,
            recruterPhone,
            recruterLocation,
        } = req.body

        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './database/bit.db',
            driver: sqlite3.Database,
        })

        // CHECAR SE USUÁRIO EXISTE
        const existingCompany = await db.get(`SELECT * FROM company WHERE email='${email}'`)
        if (existingCompany) {
            throw new Error('Uma conta com esse Email já existe')
        }

        // INSERIR ENDEREÇO DA EMPRESA
        const companyAddress = await db.run(
            `INSERT INTO address (street, cep, neighborhood, city, state, complement) VALUES ('${street}', '${cep}', '${neighborhood}', '${city}', '${state}', '${complement}')`
        )

        // INSERIR RECRUTADOR
        const recruter = await db.run(
            `INSERT INTO recruter (firstName, secondName, role, email, phone, location) VALUES ('${recruterFirstName}', '${recruterSecondName}', '${recruterRole}', '${recruterEmail}', '${recruterPhone}', '${recruterLocation}')`
        )

        // ENCRYPT PASSWORD
        const password = await bcrypt.hash(req.body.password, 8)

        // INSERIR USUÁRIO
        const company = await db.run(
            `INSERT INTO company (email, password, name, cnpj, phone, phone2, openingDate, companyAddressId, marketNiche, companyPhilosophy, companyCulture, badges, recruterId, isApproved) VALUES ('${email}', '${password}', '${name}', '${cnpj}', '${phone2}', '${phone}', '${openingDate}', '${companyAddress.lastID}', '${marketNiche}', '${companyPhilosophy}', '${companyCulture}', '${badges}', '${recruter.lastID}', '0')`
        )

        // FECHAR O BANCO DE DADOS
        await db.close()

        // GERAR TOKEN JWT
        const token = await generateAuthToken(company.lastID)

        // SETAR TOKEN NOS COOKIES
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 2 * 60 * 60 * 1000, // 2 HORAS
            path: '/',
            sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'lax',
        })

        // RESPOSTA
        // res.redirect('/views/companySignUpCompleted/companySignUpCompleted.html')
        res.send()
    } catch (err) {
        console.log(err)
        res.status(400).send(err.message)
    }
})

// ROTA DE FAZER LOGIN
router.post('/company/login', async (req, res) => {
    try {
        // CONECTAR AO BANCO DE DADOS
        const db = await open({
            filename: './database/bit.db',
            driver: sqlite3.Database,
        })

        // ENCONTRAR USUÁRIO
        const company = await db.get(`SELECT * FROM company WHERE email='${req.body.email}'`)

        if (!company) {
            throw new Error('Não foi possivel entrar')
        }

        // CHECAR SENHA
        const isMatch = await bcrypt.compare(req.body.password, company.password)

        if (!isMatch) {
            throw new Error('Não foi possivel entrar')
        }

        if (!company.isApproved) {
            throw new Error('Empresa ainda não aprovada')
        }

        // FECHAR O BANCO DE DADOS
        await db.close()

        // GERAR TOKEN JWT
        const token = await generateAuthToken(company.id)

        // SETAR TOKEN NOS COOKIES
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 2 * 60 * 60 * 1000, // 2 HORAS
            path: '/',
            sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'lax',
        })

        // RESPOSTA
        // res.redirect('/views/companySignUpCompleted/companySignUpCompleted.html')
        res.send()
    } catch (err) {
        res.status(400).send(err.message)
    }
})

module.exports = router
