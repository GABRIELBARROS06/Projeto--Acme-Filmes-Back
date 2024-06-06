/************************************************************************************************************
 * Objetivo: Arquivo responsável pela criação de API no projeto
 * Data: 25/03
 * Autor: Gabriel de Barros Gomes
 * Versão: 1.0 
 ***********************************************************************************************************/
/**
 *  Para realizar a integração com o banco de dados devemos utilizar uma das seguintes bibliotecas:
 *        -SEQUELIZE    (BIBLIOTECA ANTIGA, E POSSUI MAIS CONTEUDOS EXPLICATIVOS NA WEB)
 *        -PRISMA ORM   (A BIBLIOTECA MAIS ATUAL - UTILIZADA NESSE PROJETO)
 *        -FASTFY ORM   (A BIBLIOTECA MAIS ATUAL)
 * 
 *  
 *      Para a instalação do Prisma ORM
 *      npm install prisma --save   (É responsávem pela conexão como o DB)
 *      npm install @prisma/client --save   (É responsavel por executar scripts SQL mo DB)
 *  
 *      Para inicializar o prisma no projeto
 * 
 *      npx prisma init
 */


//Importação das bibliotecas necessárias para o projeto 
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const controleFilmes = require ('./controller/funcoes.js')

/***************************************** Import dos arquivos do controller do projeto***********************/
const controllerFilmes = require('./controller/controller_filme.js')
const controllerClassificacao = require('./controller/controller_classificacao.js')
const controllerGenero = require('./controller/controller_genero.js')
const controllerAtores = require('./controller/controller_ator.js')
const controllerDiretores = require('./controller/controller_diretor.js')


//Criação do App
const app = express() 

//Mostrar como usar o App
app.use((request, response, next) => {
        response.header('Access-Control-Allow-Origin', '*')

        response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    
        app.use(cors())
    
        next()
    })

//Criando um objeto para controlar a chegada dos dados da requisição em formato JSON
const bodyParserJSON =  bodyParser.json()

/***********************************Endpoints de Filmes*********************************************************** */

//Criação do endpoint que retorna todos os filmes do Banco de Dados
app.get('/v2/acmeFilmes/filmes',cors(),async function(request, response, next){

        //Chama a função da controller para retornar todos os filmes
        let dadosFilmes = await controllerFilmes.getListarFilmes()

        response.status(dadosFilmes.status_code)
        response.json(dadosFilmes)
})

//Criação do endpoint que retorna um filme no banco de dados filtrando pelo id 
app.get('/v2/acmeFilmes/filme/:id', cors(), async function(request, response){
    let idFilme = request.params.id

    let dadosFilme = await controllerFilmes.getBuscarFilmeByID(idFilme) 

    response.status(dadosFilme.status_code)
    response.json(dadosFilme)
})

//Criação do endpoint que retorna dados de um filme filtrando pelo nome
app.get('/v2/acmeFilmes/nomefilme', cors(), async function(request, response){
    let nomeFilme = request.query.nome

    let dadosFilme = await controllerFilmes.getBuscarFilmeNome(nomeFilme)

    response.status(dadosFilme.status_code)
    response.json(dadosFilme)
})

//Criação do endpoint que cadastra um filme no banco de dados
app.post('/v2/acmeFilmes/filme', cors(), bodyParserJSON, async function(request, response){
   
    //Recebe o content-type com o tipo de dados encaminhado na requisição
    const contentType = request.header('content-type')
   
    //Recebe todos os dados encaminhados na requisição pelo body
    let dadosBody = request.body

    //Encaminha os dados para a controller enviar para o DAO
    let resultDadosNovoFilme = await controllerFilmes.setInserirNovoFilme(dadosBody, contentType)
    
    response.status(resultDadosNovoFilme.status_code)
    response.json(resultDadosNovoFilme)
})

//Criação do endpoint que deleta um filme no banco de dados filtrando pelo id
app.delete('/v2/acmeFilmes/filme/:id', cors(), async function(request, response){
    let idFilme = request.params.id

    let dadosExclusao = await controllerFilmes.setExcluirFilme(idFilme)

    response.status(dadosExclusao.status_code)
    response.json(dadosExclusao.message)
})

//Criação do endpoint que atualiza um filme filtrando pelo id
app.put('/v2/acmeFilmes/filme/:id', cors(), bodyParserJSON, async function(request, response){
    let idFilme = request.params.id

    const contentType = request.header('content-type')

    const dadosBody = request.body

    
    let resultDadosFilmeAtualizado = await controllerFilmes.setAtualizarFilme(idFilme, dadosBody, contentType)

    response.status(resultDadosFilmeAtualizado.status_code)
    response.json(resultDadosFilmeAtualizado)
})



/***********************************Endpoints de Classificação*********************************************************** */

//endpoint que retorna todas as classificações do banco de dados
app.get('/v2/acmeFilmes/classificacoes', cors(), async function(request, response){
    //arquivo que aciona a controller para realizar a requisição
    let dadosClassificacacoes = await controllerClassificacao.getAllClassificacoes()

    response.status(dadosClassificacacoes.status_code)
    response.json(dadosClassificacacoes)
})

//endpoint que busca a classificacao filtrando pelo id
app.get('/v2/acmeFilmes/classificacao/:id', cors(), async function(request, response){
    let idClassificacao = request.params.id
   
    //arquivo que aciona a controller para realizar a requisição
    let dadosClassificacacao = await controllerClassificacao.getBuscarClassificacao(idClassificacao)

    response.status(dadosClassificacacao.status_code)
    response.json(dadosClassificacacao)
})

//endpoint que cadastra uma nova classificação no banco de dados
app.post('/v2/acmeFilmes/classificacao', cors(), bodyParserJSON, async function(request, response){
    //variável que vai realizar o tratamento do tipo do body
    const contentType = request.header('content-type')

    //variável que recebe os dados do Json do body
    let dadosBody = request.body

    //variável que vai realizar a requisição
    let resultDadosClassificacao = await controllerClassificacao.setInserirNovaClassificacao(dadosBody, contentType)

    //return da requisição
    response.status(resultDadosClassificacao.status_code)
    response.json(resultDadosClassificacao)
})

//endpoint que deleta uma classificação do banco de dados
app.delete('/v2/acmeFilmes/classificacao/:id', cors(), async function(request, response){
    //variável local que recebe id da requisição
    let id = request.params.id
    //variável que realiza a requisição
    let dadosClassificacacao = await controllerClassificacao.setDeletarClassificacao(id)

    response.status(dadosClassificacacao.status_code)
    response.json(dadosClassificacacao.message)
})

app.put('/v2/acmeFilmes/classificacao/:id', cors(), bodyParserJSON, async function(request, response){
    let idClassificacao = request.params.id

    const contentType = request.header('content-type')

    const dadosBody = request.body

    let resultDadosClassificacao = await controllerClassificacao.setAtualizarCLassificacao(idClassificacao, dadosBody, contentType)

    response.status(resultDadosClassificacao.status_code)
    response.json(resultDadosClassificacao)
})


/***********************************Endpoints de Gênero************************************************************/

//endpoint que retorna todos os gêneros do banco de dados
app.get('/v2/acmeFilmes/generos', cors(), async function(request, response){
    //requisição do app para retornar todos os gêneros
    let resultDadosGeneros = await controllerGenero.getListarALlGeneros()

    response.status(resultDadosGeneros.status_code)
    response.json(resultDadosGeneros)
})

//endpoint que retorna um gênero filtrando pelo id
app.get('/v2/acmeFilmes/genero/:id', cors(), async function(request, response){
    let idGenero = request.params.id

    let resultDadosGenero = await controllerGenero.getBuscarGeneroById(idGenero)

    response.status(resultDadosGenero.status_code)
    response.json(resultDadosGenero)
})

//endpoint que cadstra um gênero no banco de dados
app.post('/v2/acmeFilmes/genero', cors(), bodyParserJSON, async function(request, response){
    const contentType = request.header('content-type')

    const dadosGenero = request.body

    let resultDadosGenero = await controllerGenero.setInserirNovoGenero(dadosGenero, contentType)

    response.status(resultDadosGenero.status_code)
    response.json(resultDadosGenero)
})

//endpoint que deleta um filme do banco de dados filtrando pelo id
app.delete('/v2/acmeFilmes/genero/:id', cors(), async function(request, response){
    let generoId = request.params.id

    let resultDadosGenero = await controllerGenero.setExcluirGenero(generoId)

    response.status(resultDadosGenero.status_code)
    response.json(resultDadosGenero.message)
})

//endpoint que atualiza um filme do banco de dados filtrando pelo id
app.put('/v2/acmeFilmes/genero/:id', cors(), bodyParserJSON, async function(request, response){
    let generoId = request.params.id
    const contentType = request.header('content-type')
    const dadosGenero = request.body

    let resultDadosGenero = await controllerGenero.setAtualizarGenero(generoId, dadosGenero, contentType)

    response.status(resultDadosGenero.status_code)
    response.json(resultDadosGenero)
})

/****************************************Endpoints de Atores*********************************************/
//endpoint que retorna todos os atores
app.get('/v2/acmeFilmes/atores', cors(), async function(request, response){
    let resultDadosAtores = await controllerAtores.getAllAtores()

    response.status(resultDadosAtores.status_code)
    response.json(resultDadosAtores)
})

//endpoint que busca um ator filtrando pelo id
app.get('/v2/acmeFilmes/ator/:id', cors(), async function(request, response){
    let idAtor = request.params.id

    let resultDadosAtor = await controllerAtores.getAtorById(idAtor)

    response.status(resultDadosAtor.status_code)
    response.json(resultDadosAtor)
})

//endpoint que cadastra um ator no banco de dados
app.post('/v2/acmeFilmes/ator', cors(), bodyParserJSON, async function(request, response){
    const contentType = request.header('content-type')

    const dadosAtor = request.body

    let resultDadosAtor = await controllerAtores.setInserirNovoAtor(dadosAtor, contentType)

    response.status(resultDadosAtor.status_code)
    response.json(resultDadosAtor)
})

//endpoint que deleta um ator do banco de dados
app.delete('/v2/acmeFilmes/ator/:id', cors(), async function(request, response){
    let idAtor = request.params.id

    let resultDadosAtor = await controllerAtores.setExcluirAtor(idAtor)

    response.status(resultDadosAtor.status_code)
    response.json(resultDadosAtor.message)
})

//endpoint que atualiza um filme do banco de dados
app.put('/v2/acmeFilmes/ator/:id', cors(), bodyParserJSON, async function(request, response){
    let idAtor = request.params.id
    const novosDados = request.body
    const contentType = request.header('content-type')

    let resultDadosAtor = await controllerAtores.setAtualizarAtor(idAtor, novosDados, contentType)

    response.status(resultDadosAtor.status_code)
    response.json(resultDadosAtor)

})

/****************************************Endpoints de Diretores*********************************************/ 
//endpoint que retorna todos os diretores
app.get('/v2/acmeFilmes/diretores', cors(), async function(request, response){
    let resultDadosDiretores = await controllerDiretores.getAllDiretores()

    response.status(resultDadosDiretores.status_code)
    response.json(resultDadosDiretores)
})

//endpoint que busca um ator filtrando pelo id
app.get('/v2/acmeFilmes/diretor/:id', cors(), async function(request, response){
    let idDiretor = request.params.id

    let resultDadosDiretor = await controllerDiretores.getDiretorById(idDiretor)

    response.status(resultDadosDiretor.status_code)
    response.json(resultDadosDiretor)
})

//endpoint que cadastra um diretor no banco de dados
app.post('/v2/acmeFilmes/diretor', cors(), bodyParserJSON, async function(request, response){
    const contentType = request.header('content-type')

    const dadosDiretor = request.body

    let resultDadosDiretor = await controllerDiretores.setInserirDiretor(dadosDiretor, contentType)

    response.status(resultDadosDiretor.status_code)
    response.json(resultDadosDiretor)
})

//endpoint que deleta um diretor do banco de dados
app.delete('/v2/acmeFilmes/diretor/:id', cors(), async function(request, response){
    let idAtor = request.params.id

    let resultDadosAtor = await controllerDiretores.setExcluirDiretor(idAtor)

    response.status(resultDadosAtor.status_code)
    response.json(resultDadosAtor.message)
})

//endpoint que atualiza um filme do banco de dados
app.put('/v2/acmeFilmes/diretor/:id', cors(), bodyParserJSON, async function(request, response){
    let idDiretor = request.params.id
    const novosDados = request.body
    const contentType = request.header('content-type')

    let resultDadosDiretor = await controllerDiretores.setAtualizarDiretor(idDiretor, novosDados, contentType)

    response.status(resultDadosDiretor.status_code)
    response.json(resultDadosDiretor)

})


/********************************************************************************************************************************** */
//Configuração para que a API use a porta 8080
app.listen('8080', function(){
  console.log('API funcionando e aguardando requisições')
})
