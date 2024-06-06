/************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, consisitência de dados das requisições da API de atores
 * Data: 25/05
 * Autor: Gabriel de Barros Gomes
 * Versão: 1.0 
 ***********************************************************************************************************/

const message = require('../modulo/config.js')

const atorDAO = require('../model/DAO/atores.js')


//Função para listar todos os Atores presentes no DB
const getAllAtores = async function () {
    const atoresJSON = {}

    let dadosAtores = await atorDAO.selectALlAtores()

    if (dadosAtores) {
        if (dadosAtores.length > 0) { 
            for (let index = 0; index < dadosAtores.length; index++) {
                const element = dadosAtores[index]

                let sexoAtor = await atorDAO.selectSexo(element.id_sexoA)
                element.sexo = sexoAtor[0].sexo

                let nacionalidadeAtor = await atorDAO.selectNacionalidadeAtor(element.id)
                element.nacionalidade = nacionalidadeAtor[0]

                let filmesAtor = await atorDAO.selectFilmesAtor(element.id)
                element.filmesAtor = filmesAtor
            }

            atoresJSON.atores = dadosAtores
            atoresJSON.quantidade = dadosAtores.length
            atoresJSON.status_code = 200

            return atoresJSON
        }
        else {
            return message.ERROR_NOT_FOUND //404
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB //500 
    }

}

//Função para listar os dados de um determinado Ator, filtrando pelo ID
const getAtorById = async function (id) { 
    let idAtor = id

    const atorJSON = {}

    if (idAtor == '' || idAtor == undefined || isNaN(idAtor)) {
        return message.ERROR_INVALID_ID //400
    } else {
        let resultDadosAtor = await atorDAO.selectBuscarAtor(id)

        for (let index = 0; index < resultDadosAtor.length; index++) {
            const element = resultDadosAtor[index]

            let sexoAtor = await atorDAO.selectSexo(element.id_sexoA)
            element.sexo = sexoAtor[0].sexo

            let nacionalidadeAtor = await atorDAO.selectNacionalidadeAtor(idAtor)
            element.nacionalidade = nacionalidadeAtor[0]

            let filmesAtor = await atorDAO.selectFilmesAtor(idAtor)
            element.filmesAtor = filmesAtor
        }

        if (resultDadosAtor) {
            if (resultDadosAtor.length > 0) {
                atorJSON.ator = resultDadosAtor
                atorJSON.status_code = 200

                return atorJSON
            } else {
                return message.ERROR_NOT_FOUND //404
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB //500
        }
    }

}

//Função para adicionar um novo Ator no DB
const setInserirNovoAtor = async function (dadosAtor, contentType) {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {

            let novoAtorJSON = {} 

            if (
                dadosAtor.nome == '' || dadosAtor.nome == null || dadosAtor.nome == undefined || dadosAtor.nome.length > 80 ||
                dadosAtor.foto_ator == '' || dadosAtor.foto_ator == null || dadosAtor.foto_ator == undefined || dadosAtor.foto_ator.length > 80 ||
                dadosAtor.biografia == '' || dadosAtor.biografia == null || dadosAtor.biografia == undefined ||
                dadosAtor.data_nascimento == '' || dadosAtor.data_nascimento == null || dadosAtor.data_nascimento == undefined       || dadosAtor.data_nascimento.length > 10 ||
                dadosAtor.id_sexoA == '' || dadosAtor.id_sexoA == null || dadosAtor.id_sexoA == undefined || isNaN(dadosAtor.id_sexoA)   ||
                dadosAtor.id_filme == '' || dadosAtor.id_filme == null || dadosAtor.id_filme == undefined || isNaN(dadosAtor.id_filme)
            ) {
                return message.ERROR_REQUIRED_FIELDS //400
            } else {
                let novoAtor = await atorDAO.insertAtor(dadosAtor)
                let novoId = await atorDAO.selectLastIdAtor()
                let filmesAtor = await atorDAO.insertFilmesAtor(dadosAtor.id_filme, novoId[0].id)
                let sexoAtor = await atorDAO.selectSexo(dadosAtor.id_sexoA)

                console.log(filmesAtor)

                if (novoAtor) {
                    novoAtorJSON.id = Number(novoId[0].id)
                    novoAtorJSON.ator = dadosAtor
                    novoAtorJSON.sexo = sexoAtor[0].sexo
                    novoAtorJSON.filmes = filmesAtor
                    novoAtorJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code //200
                    novoAtorJSON.message = message.SUCCESS_CREATED_ITEM.message

                    return novoAtorJSON
                } else {
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

//Função para excluir um Ator do DB, filtrando pelo ID
const setExcluirAtor = async function (id) {
    let idAtor = id

    let validarId = await atorDAO.selectBuscarAtor(idAtor)

    if (validarId.length > 0) {
        if (idAtor == '' || idAtor == null || idAtor == undefined) {
            return message.ERROR_INVALID_ID //400
        } else {
            let dadosAtor = await atorDAO.deleteAtor(idAtor)

            if (dadosAtor) {
                return message.SUCCESS_DELETED_ITEM //200
            } else {
                return message.ERROR_INTERNAL_SERVER_DB //500
            }
        }
    } else {
        return message.ERROR_NOT_FOUND //404
    }
}


//função que atualiza os dados de um determinado Ator filtrando pelo ID
const setAtualizarAtor = async function(id, dadosAtor, contentType){
    try {
        if(String(contentType).toLowerCase() == 'application/json'){
            let idLocal = id

            const validarId = await atorDAO.selectBuscarAtor(idLocal)
            if(validarId.length > 0){
                let atorAtualizadoJSON = {}

                if(
                    dadosAtor.nome == ''      || dadosAtor.nome == null      || dadosAtor.nome == undefined      || dadosAtor.nome.length > 80      ||
                    dadosAtor.foto_ator == '' || dadosAtor.foto_ator == null || dadosAtor.foto_ator == undefined || dadosAtor.foto_ator.length > 80 ||
                    dadosAtor.biografia == '' || dadosAtor.biografia == null || dadosAtor.biografia == undefined ||
              dadosAtor.data_nascimento == '' || dadosAtor.data_nascimento == null || dadosAtor.data_nascimento == undefined       || dadosAtor.data_nascimento.length > 10 ||
                    dadosAtor.id_sexoa == ''  || dadosAtor.id_sexoa == null  || isNaN(dadosAtor.id_sexoa)        ||
                    dadosAtor.id_filme == '' || dadosAtor.id_filme == null || dadosAtor.id_filme == undefined || isNaN(dadosAtor.id_filme)
                 ){
                    return message.ERROR_REQUIRED_FIELDS //400
                 }
                 else{
                    dadosAtor.id = Number(idLocal)
                    let atualizarAtor = await atorDAO.updateAtor(dadosAtor)
                    let sexoAtor = await atorDAO.selectSexo(dadosAtor.id_sexoA)
                    let filmesAtor = await atorDAO.insertFilmesAtor(dadosAtor.id_filme, dadosAtor.id)

                    if(atualizarAtor){
                        atorAtualizadoJSON.ator = dadosAtor
                        atorAtualizadoJSON.sexo = sexoAtor[0].sexo
                        atorAtualizadoJSON.filmes = filmesAtor
                        atorAtualizadoJSON.status = message.SUCCESS_UPDATED_ITEM
                        atorAtualizadoJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                        atorAtualizadoJSON.message = message.SUCCESS_UPDATED_ITEM.message

                        return atorAtualizadoJSON
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
        return message.ERROR_INTERNAL_SERVER //500
    }
}
module.exports = {
    getAllAtores,
    getAtorById,
    setInserirNovoAtor,
    setExcluirAtor,
    setAtualizarAtor    
}