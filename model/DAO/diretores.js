/**********************************************************************************************************************
 * Objetivo: Arquivo responsável pelo acesso ao banco de dados MySql, aqui faremos o CRUD na tabela de diretores
 * Autor: Gabriel de Barros Gomes
 * Data: 25/05
 * Versão: 1.0 
 *********************************************************************************************************************/
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

//SQL para listar todos os diretores presentes no DB
const selectALlDiretores = async function () {
    try {
        let sql = 'select * from tbl_diretor'

        let rsDiretor = await prisma.$queryRawUnsafe(sql)

        if (rsDiretor) {
            return rsDiretor
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

//SQL para selecionar todos os sexos presentes no DB
const selectSexo = async function (id) {
    try {
        let sql = `select * from tbl_sexoD where id = ${id}`

        let rsSexo = await prisma.$queryRawUnsafe(sql)

        if (rsSexo) {
            return rsSexo
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

//SQl para selecionar a sexualidade de um diretor determinado, filtrando pelo ID
const selectNacionalidadeDiretor = async function (idDiretor) {
    try {
        let sql = `select * from tbl_nacionalidadeD_diretor where id_diretor = ${idDiretor}`

        let rsNacionalidade = await prisma.$queryRawUnsafe(sql)

        if (rsNacionalidade) {
            let sqlNacionalidade = `select * from tbl_nacionalidadeD where id = ${rsNacionalidade[0].id_nacionalidadeD}`

            let rsFinal = await prisma.$queryRawUnsafe(sqlNacionalidade)

            if (rsFinal) {
                return rsFinal
            } else {
                return false
            }
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

//SQl para buscar um diretor/filme, filtrando pelo ID
const selectFilmesDiretor = async function (idDiretor) {
    try {
        let sql = `select * from tbl_diretor_filme where id_diretor = ${idDiretor}`

        let rsFilmeD = await prisma.$queryRawUnsafe(sql)

        if (rsFilmeD) {
            for (let index = 0; index < rsFilmeD.length; index++) {
                const element = rsFilmeD[index]

                let sqlFilme = `select * from tbl_filme where id = ${element.id_filme}`

                let rsFilme = await prisma.$queryRawUnsafe(sqlFilme)

                if (rsFilme) {
                    return rsFilme
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

//SQL que busca os dados de um determinado diretor, filtrando pelo ID
const selectBuscarDiretor = async function (id) {
    try {
        let sql = `select * from tbl_diretor where id = ${id}`

        let rsDiretor = await prisma.$queryRawUnsafe(sql)

        if (rsDiretor) {
            return rsDiretor
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

//SQL que busca o ultimo ID adicionado ao DB
const selectLastIdDiretor = async function () {
    try {
        let sql = 'select cast(last_insert_id() as decimal) as id from tbl_diretor limit 1'

        let resultId = await prisma.$queryRawUnsafe(sql)

        if (resultId) {
            return resultId
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

//SQL para adicionar um novo diretor ao DB
const insertDiretor = async function (dadosDiretor) {
    try {
        let sql = ` insert into tbl_diretor(
                nome,
                foto_diretor,
                biografia,
                data_nascimento,
                id_sexoD
            )values(
                '${dadosDiretor.nome}',
                '${dadosDiretor.foto_diretor}',
                '${dadosDiretor.biografia}',
                '${dadosDiretor.data_nascimento}',
                ${dadosDiretor.id_sexoD}
            )`

        let rsDiretor = await prisma.$executeRawUnsafe(sql)

        if (rsDiretor) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

//SQL para adicionar um filme/diretor ao DB
const insertFilmesDiretor = async function (id_filme, id_diretor) {
    try {
        let sql = `insert into tbl_diretor_filme

        (
            id_diretor,
            id_filme
        )
          values(
            ${id_diretor},
            ${id_filme}
          )`

        let rsDiretorFilme = await prisma.$executeRawUnsafe(sql)

        if (rsDiretorFilme) {
            let sqlFilmes = `select * from tbl_filme where id = ${id_filme}`

            let rsFilme = await prisma.$queryRawUnsafe(sqlFilmes)

            if (rsFilme) {
                return rsFilme
            } else {
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

//SQL para excluir um diretor, filtrando pelo ID
const deleteDiretor = async function (id) {
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
                `delete from tbl_diretor where id = ${id};`

            let rsDiretor = await prisma.$executeRawUnsafe(sql)

            if (rsDiretor) {
                sql = `SET FOREIGN_KEY_CHECKS=1;`

                let rsFinal = await prisma.$executeRawUnsafe(sql)

                if (rsFinal == 0) {
                    return rsDiretor
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

//SQL para atualizar os dados de um determinado Diretor do DB
const updateDiretor = async function (dadosDiretor) {
    try {
        let sql =

            ` update tbl_diretor
                      set
                      nome = '${dadosDiretor.nome}',
                      foto_diretor = '${dadosDiretor.foto_diretor}',
                      biografia = '${dadosDiretor.biografia}',
                      data_nascimento = '${dadosDiretor.data_nascimento}',
                      id_sexoD = ${dadosDiretor.id_sexoD}

                      where id = ${dadosDiretor.id}
        `
        let rsDiretor = prisma.$executeRawUnsafe(sql)

        if (rsDiretor) {
            return rsDiretor
        } else {
            return false
        }

    } catch (error) {
        return false
    }
}


module.exports = {
    selectALlDiretores,
    selectSexo,
    selectNacionalidadeDiretor,
    selectFilmesDiretor,
    selectBuscarDiretor,
    selectLastIdDiretor,
    insertDiretor,
    insertFilmesDiretor,
    deleteDiretor,
    updateDiretor
}