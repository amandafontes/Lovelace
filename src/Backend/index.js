const express = require('express')
const app = express()
const port = 3000
const path = require('path')

// SETUP DE VARIÁVEIS ENV
require('dotenv').config()

// PARSE REQUEST BODY
app.use(express.json())

// PARSE COOKIES
var cookieParser = require('cookie-parser')
app.use(cookieParser())

// SETUP CROSS ORIGIN
const cors = require('cors')
app.use(cors())

// PERMITE QUE A PASTA FRONTEND SEJA ACESSADA
app.use(express.static(path.join(__dirname + '/../Frontend')))

// REDIRECIONAMENTO PARA A LANDING PAGE
app.get('/', (req, res) => {
    res.redirect('/views/landingPage/landingPage.html')
})

// LOGOUT DE EMPRESAS, USUÁRIAS E ADMINISTRADORES
app.post('/logout', async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 2 * 60 * 60 * 1000, // 2 HORAS
            path: '/',
            sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'lax',
        })
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// ROTAS DO USUÁRIO
const userRoutes = require('./routers/user')
app.use(userRoutes)

// ROTAS DA EMPRESA
const companyRoutes = require('./routers/company')
app.use(companyRoutes)

// ROTAS DE ADMINISTRADOR
const adminRoutes = require('./routers/admin')
app.use(adminRoutes)

// ROTAS DE VAGAS
const jobRoutes = require('./routers/job')
app.use(jobRoutes)

// ROTAS DE SKILLS
const skillRoutes = require('./routers/skill')
app.use(skillRoutes)

// CRIAR SERVIDOR
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})
