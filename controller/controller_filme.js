/************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, consisitência de dados das requisições da API de filmes
 * Data: 25/05
 * Autor: Gabriel de Barros Gomes
 * Versão: 1.0 
 ***********************************************************************************************************/
//Import do arquivo de configuração do projeto
const message = require('../modulo/config.js')

//Import do arquivo responsavel pela interação com o BD
const filmesDAO = require('../model/DAO/filme.js')
const classificacaoDAO = require('../model/DAO/classificacao.js')

//Função para inserir um novo filme ao DB
const setInserirNovoFilme = async function (novosDados, contentType) {
    try {
        //Validação do content type da requisição
        if (String(contentType).toLowerCase() == 'application/json') {
            //Cria o objeto JSON para devolver os dados criados na requisição
            let novoFilmeJSON = {}

            //Validação de campos obrigatórios ou com digitação inválida                            
            if (novosDados.titulo == ''           || novosDados.titulo == undefined            || novosDados.titulo == null           || novosDados.titulo.length > 80           ||
                novosDados.sinopse == ''          || novosDados.sinopse == undefined           || novosDados.sinopse == null          ||
                novosDados.duracao == ''          || novosDados.duracao == undefined           || novosDados.duracao == null          || novosDados.duracao.length > 8           ||
                novosDados.data_lancamento == ''  || novosDados.data_lancamento == undefined   || novosDados.data_lancamento == null  || novosDados.data_lancamento.length != 10 ||
                novosDados.foto_capa == ''        || novosDados.foto_capa == undefined         || novosDados.foto_capa == null        || novosDados.foto_capa.length > 200       ||
                novosDados.valor_unitario == ''   || novosDados.valor_unitario == undefined    || novosDados.valor_unitario == null   || novosDados.valor_unitario.length > 6    ||
                novosDados.id_favorito == ''      || novosDados.id_favorito == undefined       || novosDados.id_favorito == null      || isNaN(novosDados.id_classificacao)      ||
                novosDados.id_classificacao == '' || novosDados.id_classificacao == undefined  || novosDados.id_classificacao == null || isNaN(novosDados.id_classificacao)      ||
                novosDados.id_ator == ''          || novosDados.id_ator == undefined           || novosDados.id_ator == null          || isNaN(novosDados.id_ator)
            ) {
                return message.ERROR_REQUIRED_FIELDS //400

            } else {
                let validateStatus = false

                //Validação da data de relancamento, já que ela não é obrigatória no banco de dados
                if (novosDados.data_relancamento != null && novosDados.data_relancamento != '' && novosDados.data_relancamento != undefined) {
                    //Validação para verificar se a data está com a data de dígitos correta
                    if (novosDados.data_relancamento.length != 10) {
                        return message.ERROR_REQUIRED_FIELDS //400
                    } else {
                        validateStatus = true
                    }
                } else {
                    validateStatus = true
                }

                //Validação para verificar se podemos encaminhar os dados para o DAO
                if (validateStatus) { 
                    //encaminha os dados do filme para o DAO inserir no Banco de Dados
                    let novoFilme = await filmesDAO.insertFilme(novosDados)
                    let filmeId = await filmesDAO.selectIdLastFilme()
                    let atoresFilme = await filmesDAO.insertAtoresFilme(novosDados.id_ator, filmeId[0].id)
                    let favorito = await filmesDAO.selectFavorito(novosDados.id_favorito)
                    let classificacao = await classificacaoDAO.selectByIdClassificacao(novosDados.id_classificacao)

                    //validação para verificar se o DAO inseriu os dados do Banco de Dados
                    if (novoFilme && filmeId && favorito && classificacao) {
                        //Cria o JSON do retorno dos Dados (201)
                        novoFilmeJSON.filme = novosDados
                        novoFilmeJSON.favorito = Number(favorito[0].favorito)
                        novoFilmeJSON.classificacao = classificacao[0]
                        novoFilmeJSON.filme.id = Number(filmeId[0].id)
                        novoFilmeJSON.atores = atoresFilme
                        novoFilmeJSON.status = message.SUCCESS_CREATED_ITEM
                        novoFilmeJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                        novoFilmeJSON.message = message.SUCCESS_CREATED_ITEM.message

                        return novoFilmeJSON //201
                    } else {
                        return message.ERROR_INTERNAL_SERVER_DB //500
                    }
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE //415
        }
    }
    catch (error) {
        return message.ERROR_INTERNAL_SERVER //500 erro na controller
    }
}

//Função para validar e atualizar um filme
const setAtualizarFilme = async function (id, novosDados, contentType) {
    try {
        let contentTypeL = contentType

        if (String(contentTypeL).toLowerCase() == 'application/json') {

            let idFilme = id
            const validarId = await filmesDAO.selectByIdFilme(idFilme)

            if (validarId.length > 0) {

                let filmeAtualizadoJSON = {}
                
                if (
                    novosDados.titulo == '' || novosDados.titulo == undefined || novosDados.titulo == null || novosDados.titulo.length > 80 ||
                    novosDados.sinopse == '' || novosDados.sinopse == undefined || novosDados.sinopse == null || novosDados.sinopse.length > 65000 ||
                    novosDados.duracao == '' || novosDados.duracao == undefined || novosDados.duracao == null || novosDados.duracao.length > 8 ||
                    novosDados.data_lancamento == '' || novosDados.data_lancamento == undefined || novosDados.data_lancamento == null || novosDados.data_lancamento.length != 10 ||
                    novosDados.foto_capa == '' || novosDados.foto_capa == undefined || novosDados.foto_capa == null || novosDados.foto_capa.length > 200 ||
                    novosDados.valor_unitario.length > 6 ||
                    novosDados.id_favorito == '' || novosDados.id_favorito == undefined || novosDados.id_favorito == null || isNaN(novosDados.id_favorito) ||
                    novosDados.id_classificacao == '' || novosDados.id_classificacao == undefined || novosDados.id_classificacao == null || isNaN(novosDados.id_classificacao) ||
                    novosDados.id_ator == ''           || novosDados.id_ator == undefined        || novosDados.id_ator == null           || isNaN(novosDados.id_ator)
                ) {
                    return message.ERROR_REQUIRED_FIELDS //400
                } else {
                    let validateStatus = false

                    if (novosDados.data_relancamento != '' && novosDados.data_relancamento != null && novosDados.data_relancamento != undefined) {
                        if (novosDados.data_relancamento.length != 10) {
                            return message.ERROR_REQUIRED_FIELDS //400
                        } else {
                            validateStatus = true
                        }
                    } else {
                        validateStatus = true
                    }

                    if (validateStatus) {
                        novosDados.id = Number(id)
                        let filmeAtualizado = await filmesDAO.updateFilme(novosDados)
                        let atoresFilme = await filmesDAO.insertAtoresFilme(novosDados.id_ator, novosDados.id)
                        let favorito = await filmesDAO.selectFavorito(novosDados.id_favorito)
                        let classificacao = await classificacaoDAO.selectByIdClassificacao(novosDados.id_classificacao)

                        if (filmeAtualizado) {
                            filmeAtualizadoJSON.filme = novosDados
                            filmeAtualizadoJSON.favorito = Number(favorito[0].favorito)
                            filmeAtualizadoJSON.classificacao = classificacao[0]
                            filmeAtualizadoJSON.atores = atoresFilme
                            filmeAtualizadoJSON.status = message.SUCCESS_UPDATED_ITEM
                            filmeAtualizadoJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                            filmeAtualizadoJSON.message = message.SUCCESS_UPDATED_ITEM.message

                            return filmeAtualizadoJSON
                        } else {
                            return message.ERROR_INTERNAL_SERVER_DB //500
                        }
                    }

                }
            } else {
                return message.ERROR_NOT_FOUND //404
            }
        } else {
            return message.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500 controller        
    }
}

//Função para excluir um filme
const setExcluirFilme = async function (id) {
    //recebe o id do filme
    let idFilme = id

    let validarId = await filmesDAO.selectByIdFilme(idFilme)

    if (validarId.length > 0) {
        //verifica se o id recebido é válido
        if (idFilme == '' || idFilme == undefined || isNaN(idFilme)) {
            return message.ERROR_INVALID_ID //400
        } else {
            //Encaminha o id para a DAO deletar no banco de dados
            let novosDados = await filmesDAO.deleteFilme(idFilme)
            console.log(novosDados)

            //verificar se a DAO apagou o filme
            if (novosDados) {
                return message.SUCCESS_DELETED_ITEM //200            
            }
            else {
                return message.ERROR_INTERNAL_SERVER_DB //500
            }
        }

    } else {
        return message.ERROR_NOT_FOUND //404
    }
}

//Função para retornar todos os filmes
const getListarFilmes = async function () {
    const filmesJSON = {}

    let dadosFilmes = await filmesDAO.selectAllFilmes()

    if (dadosFilmes) {
        if (dadosFilmes.length > 0) {
            filmesJSON.filmes = dadosFilmes
            filmesJSON.quantidade = dadosFilmes.length
            filmesJSON.status_code = 200

            for (let index = 0; index < dadosFilmes.length; index++) {
                const element = dadosFilmes[index];
        
                let atores = await filmesDAO.selectAtoresFilme(element.id)

                if (atores) {
                    element.atores = atores
                }else{
                    element.atores = null
                }
            }

            for (let index = 0; index < dadosFilmes.length; index++) {
                const element = dadosFilmes[index]

                let classificacao = await classificacaoDAO.selectByIdClassificacao(element.id_classificacao)
                filmesJSON.classificacao = classificacao[0].classificacao
            }
            return filmesJSON
        } else {
            return message.ERROR_NOT_FOUND //404
        }
    } else
        return message.ERROR_INTERNAL_SERVER_DB //500
}

//Função para buscar um filme pelo id
const getBuscarFilmeByID = async function (id) {
    try {
        
    } catch (error) {
        
    }
    //Recebe o ID do filme
    let idFilme = id
    //Cria o objeto JSON
    let filmesJSON = {}

    //Validação para verificar se o ID é válido
    //(vazio, indefinido, ou não numérico)
    if (idFilme == '' || idFilme == undefined || isNaN(idFilme)) {
        return message.ERROR_INVALID_ID //400    
    } else {
        //Encaminha o ID para a DAO buscar no banco de dados
        let dadosFilme = await filmesDAO.selectByIdFilme(idFilme)

        //Verifica se o DAO retornou dados
        if (dadosFilme) {
            //Validação para verificar a quantidade de itens retornados
            if (dadosFilme.length > 0) {
                let classificacao = await classificacaoDAO.selectByIdClassificacao(dadosFilme[0].id_classificacao)
                let atores = await filmesDAO.selectAtoresFilme(dadosFilme[0].id) 

                //Cria o JSON para retorno
                filmesJSON.filme = dadosFilme;
                filmesJSON.classificacao = classificacao[0]
                filmesJSON.atores = atores
                filmesJSON.status_code = 200;

                return filmesJSON
            } else {
                return message.ERROR_NOT_FOUND //404
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB //500
        }
    }

}

//Função para buscar um filme filtrando pelo nome
const getBuscarFilmeNome = async function (nome) {
    //variável local para facilitar a validação
    const nomeFilme = nome
    //objeto JSON de filmes
    const filmesJSON = {}

    //validação do conteúdo da variável nome
    if (nomeFilme == '' || nomeFilme == undefined) {
        return message.ERROR_INVALID_REQUEST //400
    } else {
        //encaminha o nome ao DAO para fazer a pesquisa no banco de dados 
        let dadosFilme = await filmesDAO.selectByNomeFilme(nomeFilme)

        if (dadosFilme) {
            //validação para ver a quantidade de itens retornados
            if (dadosFilme.length > 0) {
                let classificacao = await classificacaoDAO.selectByIdClassificacao(dadosFilme[0].id_classificacao)
                //criação do json para retorno dos dados
                filmesJSON.filme = dadosFilme
                filmesJSON.classificacao = classificacao[0]
                filmesJSON.status_code = 200

            } else {
                return message.ERROR_NOT_FOUND //404
            }
            for (let index = 0; index < dadosFilme.length; index++) {
                const element = dadosFilme[index];

                let atores = await filmesDAO.selectAtoresFilme(element.id)

                if (atores) {
                    filmesJSON.atores = atores
                }else{
                    filmesJSON.atores = null
                }
                return filmesJSON
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB //500
        }
    }

}

module.exports = {
    setInserirNovoFilme,
    setAtualizarFilme,
    setExcluirFilme,
    getListarFilmes,
    getBuscarFilmeByID,
    getBuscarFilmeNome
}