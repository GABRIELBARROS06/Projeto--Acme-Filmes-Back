/**********************************************************************************************************************
 * Objetivo: Arquivo responsável pelo acesso ao banco de dados MySql, aqui faremos o CRUD na tabela de classificação
 * Autor: Gabriel de Barros Gomes
 * Data: 24/05
 * Versão: 1.0 
 *********************************************************************************************************************/

//import da biblioteca prisma client
const {PrismaClient} = require('@prisma/client') 

//instância da classe prisma client
const prisma = new PrismaClient()

//Função que cadastra uma classificação no DB
const insertCLassificacao = async function(dadosClassificacao){
    try {
        //script sql
        let sql = `insert into tbl_classificacao(
            faixa_etaria,
            classificacao,
            caracteristicas,
            foto_classificacao
        )values(
            '${dadosClassificacao.faixa_etaria}',
            '${dadosClassificacao.classificacao}',
            '${dadosClassificacao.caracteristicas}',
            '${dadosClassificacao.foto_classificacao}'
        )`

        let rsClassificacao = await prisma.$executeRawUnsafe(sql)
        if(rsClassificacao){
            return true
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

//Função para retornar todas as classificações do DB
const selectAllClassificacoes = async function(){
    try {
        let sql = 'select * from tbl_classificacao'
        let rsClassificacao = await prisma.$queryRawUnsafe(sql)
        return rsClassificacao       
    } catch (error) {
        return false
    }
}

//função para selecionar a classificação filtrando pelo id
const selectByIdClassificacao = async function(id){
    try {
        //script sql
        let sql = `select * from tbl_classificacao where id = ${id}`

        //executa o script no banco de dados
        let rsClassificacao = await prisma.$queryRawUnsafe(sql)

        if(rsClassificacao){
            return rsClassificacao
        }else{
            return false
        }
        
    } catch (error) {
        return false
    }
}

//Função para excluir uma classificação no DB, filtrando pelo ID
const deleteClassificacao = async function(id){
    try {
        //script sql
        let sql = `delete from tbl_classificacao where id = ${id}`

        //variável que aciona o prisma no banco de dados
        const rsClassificacao = await prisma.$executeRawUnsafe(sql)

        if(rsClassificacao){
            return rsClassificacao
        }else{
            return false
        }
        
    } catch (error) {
        return false
    }
}

//Função que atualiza uma classificação do DB, filtrando pelo id
const updateClassificacao = async function(dadosClassificacao){
    try {
        //script sql
        let sql = 
        ` update tbl_classificacao
                       set
                       faixa_etaria = '${dadosClassificacao.faixa_etaria}',
                       classificacao = '${dadosClassificacao.classificacao}',
                       caracteristicas = '${dadosClassificacao.caracteristicas}',
                       foto_classificacao = '${dadosClassificacao.foto_classificacao}'
                       
                       where id = ${dadosClassificacao.id} `

        //executar script no banco de dados
        let rsClassificacao = await prisma.$executeRawUnsafe(sql)

        //verificar se os dados foram cadastrados
        if(rsClassificacao){
            return rsClassificacao
        }
        else{
            return false
        }
        
    } catch (error) {
        return false
    }

}

//Função que busca o ultimo ID inserido de uma classificação presente no DB
const selectIdLastClassificacao = async function(){
    try {
        let sql = `select cast(last_insert_id() as decimal) as id from tbl_classificacao limit 1`

        let rsId = await prisma.$queryRawUnsafe(sql)
        if(rsId){
            return rsId
        }
        else{
            return false
        }
    } catch (error) {
        return false
    }
}

module.exports = {
    selectAllClassificacoes,
    selectByIdClassificacao,
    insertCLassificacao,
    deleteClassificacao,
    updateClassificacao,
    selectIdLastClassificacao
}