/************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, consisitência de dados das requisições da API de classificações
 * Data: 25/05
 * Autor: Gabriel de Barros Gomes
 * Versão: 1.0 
 ***********************************************************************************************************/
//import do arquivo que possui as mensagens padrão
const message = require('../modulo/config.js')

//import do arquivo que realizará as requisições ao banco de dad os
const classificacaoDAO = require('../model/DAO/classificacao.js')

//Função para listar todds as funções presentes no DB
const getAllClassificacoes = async function () {
    //JSON que vai guardar os dados das classificações
    const classificacoesJson = {}

    //variável que realiza a requisição no banco de dados
    let dadosClassificacacoes = await classificacaoDAO.selectAllClassificacoes()

    //verificar se a DAO retornou dados
    if (dadosClassificacacoes) {
        //verificar quantos dados a DAO retornou
        if (dadosClassificacacoes.length > 0) {
            classificacoesJson.classificacoes = dadosClassificacacoes
            classificacoesJson.quantidade = dadosClassificacacoes.length
            classificacoesJson.status_code = 200

            return classificacoesJson
        } else {
            return message.ERROR_NOT_FOUND //404
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB //500

    }
}

//Função para listar todos os dados de uma determinada classificação, filtrando pelo ID
const getBuscarClassificacao = async function (id) {
    //recebe o id da classificacao
    let idClassificacao = id

    //objeto que recebe os dados da classificacao
    let classificacaoJSON = {}

    //validar se o id é válido
    if (idClassificacao == '' || idClassificacao == undefined || isNaN(idClassificacao)) {
        return message.ERROR_INVALID_ID //400
    } else {
        let dadosClassificacao = await classificacaoDAO.selectByIdClassificacao(idClassificacao)

        if (dadosClassificacao) {
            if (dadosClassificacao.length > 0) {
                classificacaoJSON.classificacao = dadosClassificacao
                classificacaoJSON.status_code = 200

                return classificacaoJSON
            } else {
                return message.ERROR_NOT_FOUND //400
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB //500
        }
    }

}

//Função para adicionar uma nova classificação ao DB
const setInserirNovaClassificacao = async function (dadosClassificacao, contentType) {
    try {
        //validação do content type da requisição
        if (String(contentType).toLowerCase() == 'application/json') {
            //objeto que retorna os dados da requisição
            let novaClassificacaoJson = {}

            //validação do campos da requisição
            if (
                dadosClassificacao.faixa_etaria == '' || dadosClassificacao.classificacao == '' || dadosClassificacao.caracteristicas == ''                      || dadosClassificacao.foto_classificacao == ''        ||
                dadosClassificacao.faixa_etaria == null || dadosClassificacao.classificacao == null || dadosClassificacao.caracteristicas == null                || dadosClassificacao.foto_classificacao == null      ||
                dadosClassificacao.faixa_etaria == undefined || dadosClassificacao.classificacao == undefined || dadosClassificacao.caracteristicas == undefined || dadosClassificacao.foto_classificacao == undefined ||
                dadosClassificacao.faixa_etaria.length > 5 || dadosClassificacao.classificacao.length > 7 || dadosClassificacao.caracteristicas.length > 10000   || dadosClassificacao.foto_classificacao.length > 300
            ) {
                return message.ERROR_REQUIRED_FIELDS //400
            } else {
                //enacaminha dados para o banco de dados inserir a nova classificação
                let novaClassificacao = await classificacaoDAO.insertCLassificacao(dadosClassificacao)
                let novoId = await classificacaoDAO.selectIdLastClassificacao()

                //validação para verificar se a DAO inseriu dados
                if (novaClassificacao) {
                    novaClassificacaoJson.id = Number(novoId[0].id)
                    novaClassificacaoJson.classificacao = dadosClassificacao
                    novaClassificacaoJson.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    novaClassificacaoJson.status = message.SUCCESS_CREATED_ITEM.message

                    return novaClassificacaoJson //201
                }else{
                    return message.ERROR_INTERNAL_SERVER_DB //500
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500
    }

}

//Função para excluir uma classificação do DB
const setDeletarClassificacao = async function (id) {
    //variável local que recebe o id
    let idClassificacao = id

    //verificar se o id existe no banco de dados
    let validarId = await classificacaoDAO.selectByIdClassificacao(idClassificacao)
    if (validarId.length > 0) {
        //validar se o id é válido
        if (idClassificacao == null || idClassificacao == '' || idClassificacao == undefined){
            return message.ERROR_INVALID_ID //400
        }
        else{
            let dadosClassificacao = await classificacaoDAO.deleteClassificacao(idClassificacao)

            if(dadosClassificacao){
                return message.SUCCESS_DELETED_ITEM //200
            }
            else{
                return message.ERROR_INTERNAL_SERVER_DB //500
            }
        }
    } 
    else {
        return message.ERROR_NOT_FOUND //404
    }
}

//Função para atualizar os dados de uma determinada classificação do DB
const setAtualizarCLassificacao = async function(id, dadosClassificacao, contentType){
    try {
        //validação do content type da requisição
        if (String(contentType).toLowerCase() == 'application/json') {

            let idLocal = id
            
            const validarId = await classificacaoDAO.selectByIdClassificacao(idLocal)
            if(validarId.length > 0){

            //objeto que retorna os dados da requisição
            let novaClassificacaoJson = {}

            //validação do campos da requisição
            if (
                dadosClassificacao.faixa_etaria == '' || dadosClassificacao.classificacao == '' || dadosClassificacao.caracteristicas == ''                      || dadosClassificacao.foto_classificacao == ''        ||
                dadosClassificacao.faixa_etaria == null || dadosClassificacao.classificacao == null || dadosClassificacao.caracteristicas == null                || dadosClassificacao.foto_classificacao == null      ||
                dadosClassificacao.faixa_etaria == undefined || dadosClassificacao.classificacao == undefined || dadosClassificacao.caracteristicas == undefined || dadosClassificacao.foto_classificacao == undefined ||
                dadosClassificacao.faixa_etaria.length > 5 || dadosClassificacao.classificacao.length > 7 || dadosClassificacao.caracteristicas.length > 10000   || dadosClassificacao.foto_classificacao.length > 300
            ) {
                return message.ERROR_REQUIRED_FIELDS //400
            }
            else{
                dadosClassificacao.id = idLocal
                let atualizaClassificacao = await classificacaoDAO.updateClassificacao(dadosClassificacao)

                if(atualizaClassificacao){
                    novaClassificacaoJson.classificacao = dadosClassificacao
                    novaClassificacaoJson.status = message.SUCCESS_UPDATED_ITEM
                    novaClassificacaoJson.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                    novaClassificacaoJson.message = message.SUCCESS_UPDATED_ITEM.message

                    return novaClassificacaoJson
                }else{
                    return message.ERROR_INTERNAL_SERVER_DB //500
                }

            }
        }else{
            return message.ERROR_NOT_FOUND //404
        }
        }else{
            return message.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500 controller
    }

}


module.exports = {
    getAllClassificacoes,
    getBuscarClassificacao,
    setInserirNovaClassificacao,
    setDeletarClassificacao,
    setAtualizarCLassificacao
}