"use strict";

import Status from "/Status.js";
import Livro from "/Livro.js";
import DaoLivro from "/DaoLivro.js";
import ViewerLivro from "/ViewerLivro.js";

export default class CtrlManterLivros {
  
  //-----------------------------------------------------------------------------------------//
  // Atributos do Controlador
  //
  #dao;      // Referência para o Data Access Object para o Store de Alunos
  #viewer;   // Referência para o gerenciador do viewer 
  #posAtual; // Indica a posição do objeto Aluno que estiver sendo apresentado
  #status;   // Indica o que o controlador está fazendo 
  //-----------------------------------------------------------------------------------------//

  constructor() {
    this.#dao = new DaoLivro();
    this.#viewer = new ViewerLivro(this);
    this.#posAtual = 1;
    this.#atualizarContextoNavegacao();    
  }

  async #atualizarContextoNavegacao() {
    // Guardo a informação que o controlador está navegando pelos dados
    this.#status = Status.NAVEGANDO;

    // Determina ao viewer que ele está apresentando dos dados 
    this.#viewer.statusApresentacao();
    
    // Solicita ao DAO que dê a lista de todos os alunos presentes na base
    let conjLivro = await this.#dao.obterLivro();
    
    // Se a lista de alunos estiver vazia
    if(conjLivro.length == 0) {
      // Posição Atual igual a zero indica que não há objetos na base
      this.#posAtual = 0;
      
      // Informo ao viewer que não deve apresentar nada
      this.#viewer.apresentar(0, 0, null);
    }
    else {
      // Se é necessário ajustar a posição atual, determino que ela passa a ser 1
      if(this.#posAtual == 0 || this.#posAtual > conjLivro.length)
        this.#posAtual = 1;
      // Peço ao viewer que apresente o objeto da posição atual
      this.#viewer.apresentar(this.#posAtual, conjLivro.length, conjLivro[this.#posAtual - 1]);
    }
  }

  async apresentarPrimeiro() {
    let conjLivro = await this.#dao.obterLivro();
    if(conjLivro.length > 0)
      this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  async apresentarProximo() {
    let conjLivro = await this.#dao.obterLivro();
    if(this.#posAtual < conjLivro.length)
      this.#posAtual++;
    this.#atualizarContextoNavegacao();
  }

  async apresentarAnterior() {
    let conjLivro = await this.#dao.obterLivro();
    if(this.#posAtual > 1)
      this.#posAtual--;
    this.#atualizarContextoNavegacao();
  }

  async apresentarUltimo() {
    let conjLivro = await this.#dao.obterLivro();
    this.#posAtual = conjLivro.length;
    this.#atualizarContextoNavegacao();
  }
  
  iniciarIncluir() {
    this.#status = Status.INCLUINDO;
    this.#viewer.statusEdicao(Status.INCLUINDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir. 
    // Preciso disto, pois o viewer mandará a mensagem "efetivar" (polimórfica) ao invés de "incluir"
    this.efetivar = this.incluir;
  }
  
  iniciarAlterar() {
    this.#status = Status.ALTERANDO;
    this.#viewer.statusEdicao(Status.ALTERANDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir. 
    // Preciso disto, pois o viewer mandará a mensagem "efetivar" (polimórfica) ao invés de "alterar"
    this.efetivar = this.alterar;
  }
  
  iniciarExcluir() {
    this.#status = Status.EXCLUINDO;
    this.#viewer.statusEdicao(Status.EXCLUINDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir. 
    // Preciso disto, pois o viewer mandará a mensagem "efetivar" (polimórfica) ao invés de "excluir"
    this.efetivar = this.excluir;
  }
 
  async incluir(ISBN, Nome, Paginas, Quantidade) {
    if(this.#status == Status.INCLUINDO) {
      try {
        let livro= new Livro(ISBN, Nome, Paginas, Quantidade);
        await this.#dao.incluir(livro); 
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }
 
  async alterar(ISBN, Nome, Paginas, Quantidade) {
    if(this.#status == Status.ALTERANDO) {
      try {
        let livro = await this.#dao.obterLivroPeloISBN(ISBN); 
        if(livro == null) {
          alert("Livro " + ISBN + " não encontrado.");
        } else {
          livro.setNome(Nome);
          livro.setPaginas(Paginas);
          livro.setQuantidade(Quantidade);
          await this.#dao.alterar(livro); 
        }
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }
 
  async excluir(ISBN) {
    if(this.#status == Status.EXCLUINDO) {
      try {
        let livro = await this.#dao.obterLivroPeloISBN(ISBN); 
        if(livro == null) {
          alert("Livro  " + ISBN + " não encontrado.");
        } else {
          await this.#dao.excluir(livro); 
        }
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }

  cancelar() {
    this.#atualizarContextoNavegacao();
  }

  getStatus() {
    return this.#status;
  }

}