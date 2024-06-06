var filmes = require('../modulo/filmes.js')

const getFilmes = function(){
    const arrayFilmes = []
    const jsonfilmes = {}
    let status = false
    
    filmes.filmes.filmes.forEach(filmesA => {
        arrayFilmes.push(filmesA)       
        status = true        
    });
    jsonfilmes.filmes = arrayFilmes

   
   if(filmes){
    return jsonfilmes
   }else{
    return false
   }
}

const getFilme = function(id){
    const jsonFilme = {}
    let status = false

    filmes.filmes.filmes.forEach(filmesA => {
        if(id == filmesA.id){
            jsonFilme.id = filmesA.id
            jsonFilme.nome = filmesA.nome
            jsonFilme.sinopse = filmesA.sinopse
            jsonFilme.duracao = filmesA.duracao
            jsonFilme.data_lancamento = filmesA.data_lancamento
            jsonFilme.data_relancamento = filmesA.data_relancamento
            jsonFilme.foto_capa = filmesA.foto_capa
            jsonFilme.valor_unitario = filmesA.valor_unitario

            status = true
        }  
    });

    if(filmes){
        return jsonFilme
    }else{
        return false
    }
}

module.exports = {
    getFilmes,
    getFilme
}

