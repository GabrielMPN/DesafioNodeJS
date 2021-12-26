const express = require('express')
const app = express()

//porta app
const port = 80

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/farmacia", (req, res) => {
    res.redirect(`http://${req.headers.host}:3001/farmacia${req.url}`);
})

app.use("/produto", (req, res) => {
    res.redirect(`http://${req.headers.host}:3002/produto${req.url}`);
})

app.listen(port, (err) => {
    if (err) return console.log(err)
    console.log(`gateway iniciado na porta ${port}...`)
})