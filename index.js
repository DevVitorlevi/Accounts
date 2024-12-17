const fs = require('fs')
const chalk= require('chalk')
const inquirer = require('inquirer')
const { NOMEM } = require('dns')

operation()

function operation(){
    inquirer.prompt([
        {type:'list',name:'operation',message:'Escolha Uma Da opções',choices:['Criar Conta','Consultar Saldo','Depositar','Sacar','Sair']}
    ])
    .then(answer=>{
        const operation = answer.operation

        switch(operation){
            case 'Criar Conta':
                CreateAccount()
                break
            case  'Consultar Saldo':
                CheckBalance()
            break
            case 'Depositar':
                Deposit()
            break
            case 'Sacar':
                WithDraw()
            break
            case 'Sair':
                console.log(chalk.bgBlue('Saindo Do Sistema....'))
                process.exit()
            break
        }
    })
    .catch(e=>console.log(e))
}
function CreateAccount(){
    console.log(chalk.green('Obrigado Por Escolher Nosso Banco !!!'))

    inquirer.prompt([
        {name:'name',message:'Qual o Nome do Titular'}
    ])
    .then(answer =>{
        const name = answer.name
        if(!fs.existsSync('Contas')){
            fs.mkdirSync('Contas')
        }
        if(fs.existsSync(`Contas/${name}.json`)){
            console.log(chalk.bgRedBright('Já Existe Uma Conta Com esse Nome, Tente Novamente'))
            return CreateAccount()
        }else{
            console.log(chalk.bgGreen(`Parabens, ${name} sua conta está criada`))
        }
        fs.writeFileSync(`Contas/${name}.json`,JSON.stringify({name:name,balance:0}))
        operation()
    })
    .catch(e=>console.log(e))
}