import Status from "/Status.js";
import livro from "/Livro.js";
import ViewerError from "/ViewerError.js";

export default class ViewerLivro {
  #ctrl;  
  constructor(ctrl) {
    this.#ctrl = ctrl;
    this.divNavegar  = this.obterElemento('divNavegar'); 
    this.divComandos = this.obterElemento('divComando'); 
    this.divAviso    = this.obterElemento('divAviso'); 
    this.divDialogo  = this.obterElemento('divDialogo');
    this.btPrimeiro  = this.obterElemento('btPrimeiro');
    this.btAnterior  = this.obterElemento('btAnterior');
    this.btProximo   = this.obterElemento('btProximo');
    this.btUltimo    = this.obterElemento('btUltimo');
    this.btIncluir   = this.obterElemento('btIncluir');
    this.btExcluir   = this.obterElemento('btExcluir');
    this.btAlterar   = this.obterElemento('btAlterar');
    this.btSair      = this.obterElemento('btSair');
    this.btOk        = this.obterElemento('btOk');
    this.btCancelar  = this.obterElemento('btCancelar');

    this.ISBN        = this.obterElemento('ISBN');
    this.Nome        = this.obterElemento('Nome');
    this.Paginas     = this.obterElemento('Paginas');
    this.Quantidade  = this.obterElemento('Quantidade');
      
    this.btPrimeiro.onclick = fnBtPrimeiro;
    this.btProximo.onclick  = fnBtProximo;
    this.btAnterior.onclick = fnBtAnterior;
    this.btUltimo.onclick   = fnBtUltimo;
    this.btIncluir.onclick  = fnBtIncluir; 
    this.btAlterar.onclick  = fnBtAlterar; 
    this.btExcluir.onclick  = fnBtExcluir;  
    this.btSair.onclick     = fnBtSair;
    this.btOk.onclick       = fnBtOk; 
    this.btCancelar.onclick = fnBtCancelar; 
  }

  obterElemento(idElemento) {
    let elemento = document.getElementById(idElemento);
    if(elemento == null) 
      throw new ViewerError("Não encontrei um elemento com id '" + idElemento + "'");
    // Adicionando o atributo 'viewer' no elemento do Viewer. Isso permitirá
    // que o elemento guarde a referência para o objeto Viewer que o contém.
    elemento.viewer = this;
    return elemento;
  }
  
  getCtrl() { 
    return this.#ctrl;
  }
  
  apresentar(pos, qtde, livro) {   
    this.configurarNavegacao( pos <= 1 , pos == qtde );  
    if(livro == null) {
      this.ISBN.value         = "";
      this.Nome.value         = "";
      this.Paginas.value      = "";
      this.Quantidade.value   = "";
      this.divAviso.innerHTML = " Livros Cadastrados: 0";
    } else {
      this.ISBN.value         = livro.getISBN();
      this.Nome.value         = livro.getNome();
      this.Paginas.value      = livro.getPaginas();
      this.Quantidade.value   = livro.getQuantidade();
      this.divAviso.innerHTML = pos + " de " + qtde + " Livro(s) Cadastrado(s)";
    }
  }

  configurarNavegacao(flagInicio, flagFim) {
    this.btPrimeiro.disabled = flagInicio;
    this.btUltimo.disabled   = flagFim;
    this.btProximo.disabled  = flagFim;
    this.btAnterior.disabled = flagInicio;
  }
  
  statusEdicao(operacao) { 
    this.divNavegar.hidden  = true;
    this.divComandos.hidden = true;
    this.divDialogo.hidden  = false; 
    
    if(operacao != Status.EXCLUINDO) {
      this.Nome.disabled       = false;
      this.Paginas.disabled    = false;
      this.Quantidade.disabled = false;
      this.divAviso.innerHTML  = "";      
    } else {
      this.divAviso.innerHTML  = "Deseja excluir este registro?";      
    }

    if(operacao == Status.INCLUINDO) {
      this.ISBN.disabled    = false;
      this.ISBN.value       = "";
      this.Nome.value       = "";
      this.Paginas.value    = "";
      this.Quantidade.value = "";
    }
  }
  
  statusApresentacao() { 
    this.Nome.disabled       = true;
    this.divNavegar.hidden   = false;
    this.divComandos.hidden  = false;
    this.divDialogo.hidden   = true; 
    this.ISBN.disabled       = true;
    this.Nome.disabled       = true;
    this.Paginas.disabled    = true;
    this.Quantidade.disabled = true;
  }

}

//------------------------------------------------------------------------//
// CALLBACKs para os Botões
//------------------------------------------------------------------------//

function fnBtPrimeiro() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().apresentarPrimeiro();
}

function fnBtProximo() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().apresentarProximo();
}

function fnBtAnterior() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().apresentarAnterior();
}

function fnBtUltimo() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().apresentarUltimo();
  
}

function fnBtIncluir() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().iniciarIncluir();
}

function fnBtAlterar() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().iniciarAlterar();
}

function fnBtExcluir() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().iniciarExcluir();
}

function fnBtSair() {
  window.close();
}

function fnBtOk() {
  const ISBN       = this.viewer.ISBN.value;
  const Nome       = this.viewer.Nome.value;
  const Paginas    = this.viewer.Paginas.value;
  const Quantidade = this.viewer.Quantidade.value;
    
  // Como defini que o método "efetivar" é um dos métodos incluir, excluir ou alterar
  // não estou precisando colocar os ninhos de IF abaixo.
  this.viewer.getCtrl().efetivar(ISBN, Nome, Paginas, Quantidade); 
}

function fnBtCancelar() {
  this.viewer.getCtrl().cancelar(); 
}