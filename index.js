const fs = require('fs')
const chalk= require('chalk')
const inquirer = require('inquirer')
const { NOMEM } = require('dns')
const { checkPrime } = require('crypto')

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

function Deposit(){
    inquirer.prompt([
        {name:'nameAccount',message:'Qual o nome da Conta?'}
    ])
    .then(answer=>{
        const nameAccount = answer.nameAccount
        if(existsAccount(nameAccount)){
            inquirer.prompt([
                {name:'amount',message:'Qual O Valor Do Deposito?'}
            ])
            .then(answer=>{
                const amount = answer.amount

                addAmount(nameAccount,amount)
                
            }).catch(e=>console.log(e))
        }else{
            Deposit()
        }
    })
}

function WithDraw(){
    inquirer.prompt([
        {name:'nameAccount',message:'Qual o nome da Conta?'}
    ])
    .then(answer=>{
        const nameAccount = answer.nameAccount
        if(existsAccount(nameAccount)){
            inquirer.prompt([
                {name:'amount',message:'Qual O Valor Do Saque?'}
            ])
            .then(answer=>{
                const amount = answer.amount

                removeAmount(nameAccount,amount)
                
            }).catch(e=>console.log(e))
        }else{
            WithDraw()
        }
    })
}

function CheckBalance(nameAccount){
    inquirer.prompt([{
        name:'nameAccount',
        message:'Qual O Nome da Conta'
    }])
    .then(answer=>{
        const nameAccount = answer.nameAccount
        if(existsAccount(nameAccount)){
            const AccountData = getAccountData(nameAccount)
            console.log(chalk.bgBlue(`Seu Saldo é: R$${AccountData.balance}`))
            return operation()
        }else{
            CheckBalance()
        }
    })
    .catch(e=>console.log(e))
}

function existsAccount(nameAccount){
    if(!fs.existsSync(`Contas/${nameAccount}.json`)){
        console.log(chalk.bgRedBright('Está Conta Não Existe'))
        return false
    
    }else{
        return true
    }
}

function addAmount(nameAccount,amount){
    const AccountData =getAccountData(nameAccount)

    if(isNaN(amount)){
        console.log(chalk.bgRedBright('Ocorreu Um erro, Tente Novamente'))
        return Deposit()
    }else{
        
    AccountData.balance = Number(amount) + Number(AccountData.balance)

    fs.writeFileSync(`Contas/${nameAccount}.json`,JSON.stringify(AccountData))

    console.log(chalk.bgBlue(`Foi Depositado: R$${amount}`))
    }


    return operation()
}

function removeAmount(nameAccount,amount){
    const AccountData = getAccountData(nameAccount)

    if(AccountData.balance<amount){
        console.log(chalk.bgRedBright('Valor Indisponível'))
        return WithDraw()
    }
    if(isNaN(amount)){
        console.log(chalk.bgRedBright('Ocorreu Um erro, Tente Novamente'))
        return WithDraw()
    }
        
    AccountData.balance = Number(AccountData.balance) - Number(amount)

    fs.writeFileSync(`Contas/${nameAccount}.json`,JSON.stringify(AccountData))

    console.log(chalk.bgBlue(`Foi Sacado: R$${amount}`))
    
}

function getAccountData(nameAccount){
    const AccountJSON = fs.readFileSync(`Contas/${nameAccount}.json`,{
        encoding:'utf8',
        flag:'r'
    })
    return JSON.parse(AccountJSON)
}