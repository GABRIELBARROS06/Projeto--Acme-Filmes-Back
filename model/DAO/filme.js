/************************************************************************************************************
 * Objetivo: Arquivo responsável pelo acesso ao banco de dados MySql, aqui faremos o CRUD na tabela de 
 * Data: 25/05
 * Autor: Gabriel de Barros Gomes
 * Versão: 1.0 
 ***********************************************************************************************************/

//Import da biblioteca do prisma client
const { PrismaClient } = require('@prisma/client');

//Instancia da classe prisma client
const prisma = new PrismaClient()


const atoresDAO = require('../DAO/atores.js')

//Função para inserir um filme no banco de dados
const insertFilme = async function (dadosFilme) {
    try {

        let sql

        if (dadosFilme.data_relancamento != '' && dadosFilme.data_relancamento != null && dadosFilme.data_relancamento != undefined) {
            sql = `insert into tbl_filme( 
            titulo,
            sinopse,
            duracao,
            data_lancamento,
            data_relancamento,
            foto_capa,
            valor_unitario,
            id_favorito,
            id_classificacao
   )values(
            '${dadosFilme.titulo}',
            '${dadosFilme.sinopse}',
            '${dadosFilme.duracao}',
            '${dadosFilme.data_lancamento}',
            '${dadosFilme.data_relancamento}',
            '${dadosFilme.foto_capa}',
            '${dadosFilme.valor_unitario}',
            '${dadosFilme.id_favorito}',
            '${dadosFilme.id_classificacao}'
)`
        } else {
            sql = `insert into tbl_filme( 
        titulo,
        sinopse,
        duracao,
        data_lancamento,
        data_relancamento,
        foto_capa,
        valor_unitario,
        id_favorito,
        id_classificacao
)values(
        '${dadosFilme.titulo}',
        '${dadosFilme.sinopse}',
        '${dadosFilme.duracao}',
        '${dadosFilme.data_lancamento}',
         null,
        '${dadosFilme.foto_capa}',
        '${dadosFilme.valor_unitario}',
        '${dadosFilme.id_favorito}',
        '${dadosFilme.id_classificacao}'
)`
        }
        //executeRawUnsafe() = serve para executar scripts sem retorno de dados
        //(insert, update, delete)
        //queryRawUnsafe() = serve para executar scripts com retorno de dados
        //(select)
        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }

}

const insertAtoresFilme = async function (id_ator, id_filme) {
    try {
        let sql = `insert into tbl_ator_filme

        (
            id_ator,
            id_filme
          )
          values( 
            ${id_ator},
            ${id_filme}
          )`


        let rsAtorFilme = await prisma.$executeRawUnsafe(sql)

        if (rsAtorFilme) {
            let rsAtor = await atoresDAO.selectBuscarAtor(id_ator)

            if (rsAtor) {
                return rsAtor
            }
            else {
                return false
            }
        }
        else {
            return false
        }
    } catch (error) {
        return false
    }
}

//Função para atualizar um filme no banco de dados
const updateFilme = async function (novosDados) {
    try {
        let sql

        if (novosDados.data_relancamento != '' && novosDados.data_relancamento != null && novosDados.data_relancamento != undefined) {
            sql = `update tbl_filme
               set

               titulo = '${novosDados.titulo}',
               sinopse = '${novosDados.sinopse}',
               duracao = '${novosDados.duracao}',
               data_lancamento = '${novosDados.data_lancamento}',
               data_relancamento = '${novosDados.data_relancamento}',
               foto_capa = '${novosDados.foto_capa}',
               valor_unitario = ${novosDados.valor_unitario},
               id_favorito = ${novosDados.id_favorito},
               id_classificacao = ${novosDados.id_classificacao}
               
               where id = ${novosDados.id}
               `
        } else {
            sql = `update tbl_filme
               set

               titulo = '${novosDados.titulo}',
               sinopse = '${novosDados.sinopse}',
               duracao = '${novosDados.duracao}',
               data_lancamento = '${novosDados.data_lancamento}',
               foto_capa = '${novosDados.foto_capa}',
               valor_unitario = ${novosDados.valor_unitario},
               id_favorito = ${novosDados.id_favorito},
               id_classificacao = ${novosDados.id_classificacao}
               
               where id = ${novosDados.id}
               `
        }
        let result = await prisma.$executeRawUnsafe(sql)


        if (result) {
            return true
        } else {
            return false
        }
    }
    catch (error) {
        return false
    }
}

//Função para excluir um filme no banco de dados
const deleteFilme = async function (id) {
    try {
        //Script sql para deletar um filme filtrando pelo id
        let sql

        sql =
            `
        SET FOREIGN_KEY_CHECKS=0;
        `
        let rs1 = await prisma.$executeRawUnsafe(sql)

        if (rs1 == 0) {
            sql =
                `delete from tbl_filme where id = ${id};`

            let rsFilme = await prisma.$executeRawUnsafe(sql)

            if (rsFilme) {
                sql = `SET FOREIGN_KEY_CHECKS=1;`

                let rsFinal = await prisma.$executeRawUnsafe(sql)

                if (rsFinal == 0) {
                    return rsFilme
                } else {
                    return false
                }

            } else {
                return false
            }
        } else {
            return false
        }
    }
    catch (error) {
        return false
    }
}
//Função para reeber o id do último filme cadastrado
const selectIdLastFilme = async function () {
    try {
        let sql = 'select cast(last_insert_id() as decimal) as id from tbl_filme limit 1'

        let rsIdFilme = await prisma.$queryRawUnsafe(sql)
        return rsIdFilme

    } catch (error) {
        return false
    }
}

//Função para listar todos os filmes do banco de dados
const selectAllFilmes = async function () {
    try {
        let sql = 'select * from tbl_filme';

        //$QuerryRawUnsafe(sql)         possibilita enviar uma variavel
        //$QuerryRaw('select * from tbl_filme;')  executa o script dentro

        let rsFilmes = await prisma.$queryRawUnsafe(sql)
        return rsFilmes

    } catch (error) {
        return false
    }
}

//Função para buscar um filme no banco de dados, filtrando pelo id
const selectByIdFilme = async function (id) {
    try {
        //Script Sql para filtrar pelo id
        let sql = `select * from tbl_filme where id = ${id}`

        //Executa o Sql no banco de dados
        let rsFilme = await prisma.$queryRawUnsafe(sql)

        if (rsFilme) {
            return rsFilme
        } else {
            return false
        }

    } catch (error) {
        return false
    }

}

//Função para buscar um filme no banco de dados, filtrando pelo nome
const selectByNomeFilme = async function (nome) {
    try {
        let sql = `select * from tbl_filme where tbl_filme.titulo LIKE "%${nome}%"`

        let rsFilme = await prisma.$queryRawUnsafe(sql)

        return rsFilme

    } catch (error) {
        return false

    }
}

//Função para verificar se o filme é favorito
const selectFavorito = async function (id) {
    try {
        let sql = `select * from tbl_favorito where id = ${id}`

        let rsFavorito = await prisma.$queryRawUnsafe(sql)

        if (rsFavorito) {
            return rsFavorito
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const selectAtoresFilme = async function (idFilme) {
    try {
        let sql = `select * from tbl_ator_filme where id_filme = ${idFilme}` 

        let rsAtorF = await prisma.$queryRawUnsafe(sql)

        if (rsAtorF) {
            for (let index = 0; index < rsAtorF.length; index++) {
                const element = rsAtorF[index];

                let rsAtor = await atoresDAO.selectBuscarAtor(Number(element.id_ator))

                if (rsAtor) {
                    return rsAtor
                } else {
                    return false
                }
            }
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

//Exportação das funções 
module.exports = {
    insertFilme,
    insertAtoresFilme,
    updateFilme,
    deleteFilme,
    selectAllFilmes,
    selectByIdFilme,
    selectByNomeFilme,
    selectIdLastFilme,
    selectFavorito,
    selectAtoresFilme
}

