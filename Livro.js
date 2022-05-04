import ModelError from "/ModelError.js";

export default class Livro {
    
  // -----------------------------------------------------------------------------------------------//
  // DECLARAÇÃO DE ATRIBUTOS PRIVADOS: Em JavaScript, se o nome do atributo tem # no início, isso   //
  // indica que ele é privado. Também deve-se colocar a presença dele destacada, como está abaixo.  //
  //                                                                                                //
  #ISBN;                                                                                            //  
  #Nome;                                                                                            //
  #Paginas;                                                                                         //
  #Quantidade;                                                                                      //
  // -----------------------------------------------------------------------------------------------//

  constructor(ISBN, Nome, Paginas, Quantidade) {
    this.setISBN(ISBN);
    this.setNome(Nome);
    this.setPaginas(Paginas);
    this.setQuantidade(Quantidade);
  }

  // ISBN

  getISBN() {
    return this.#ISBN;
  }

  setISBN(ISBN) {
    if(!Livro.validarISBN(ISBN))
      throw new ModelError("ISBN Inválido: " + ISBN);
    this.#ISBN = ISBN;
  }

  static validarISBN(ISBN) {
    // Validação do ISBN https://generate.plus/en/number/isbn
    var isValid = function(str) {
      // Variaveis
      var sum, weight, digit, check, i;
      // Replace em caracteres indevidos
      str = str.replace(/[^0-9X]/gi, '');
      // Teste se for diferente de 10 digitos
      if (str.length != 10) {
          return false;
      }
      // Inicio
      if (str.length == 10) {
        weight = 10;
        sum = 0;
        for (i = 0; i < 9; i++) {
          digit = parseInt(str[i]);
          sum += weight*digit;
          weight--;
        }
        check = (11 - (sum % 11)) % 11
        if (check == 10) {
            check = 'X';
        }
        return (check == str[str.length-1].toUpperCase());
      }
    }

    if(ISBN == null || ISBN == "" || ISBN == undefined || isValid(ISBN) != true)
      return false;

    return true;
  }

  // Nome

  getNome() {
    return this.#Nome;
  }

  setNome(Nome) {
    if(!Livro.validarNome(Nome)) {
      alert("Nome deve possuir entre 1 e 40 caracters.\nLetras maiusculas e minusculas, espaços e digitos");
      throw new ModelError("Nome Inválido: " + Nome);
    }
    this.#Nome = Nome;
  }

  static validarNome(Nome) {
    if(Nome == null || Nome == "" || Nome == undefined)
      return false;

    const padraoNome = /[\w\s]{1,40}/;
    if (!padraoNome.test(Nome))
      return false;
    
    return true;
  }

  // Paginas

  getPaginas() {
    return this.#Paginas;
  }

  setPaginas(Paginas) {
    if(!Livro.validarPaginas(Paginas)) {
      alert("Paginas devem possuir entre 1 e 9999 paginas");
      throw new ModelError("Paginas Inválida: " + Paginas);
    }
    this.#Paginas = Paginas;
  }

  static validarPaginas(Paginas) {

    if(Paginas == null || Paginas == "" || Paginas == undefined)
      return false;

    if(Number(Paginas) < 1 || Number(Paginas) > 9999)
      return false;
    
    return true;
  }

  // Quantidade

  getQuantidade() {
    return this.#Quantidade;
  }

  setQuantidade(Quantidade) {
    if(!Livro.validarQuantidade(Quantidade)) {
      alert("Quantidade deve ser maior que 0");
      throw new ModelError("Quantidade inválida: " + Quantidade);
    }
    this.#Quantidade = Quantidade;
  }

  static validarQuantidade(Quantidade) {
    if(Quantidade == null || Quantidade == "" || Quantidade == undefined)
      return false;

    if(Number(Quantidade) < 1)
      return false;
    
    return true
  }

  // ------------------------- //
  
  static deassign(obj) {
    return JSON.parse(obj.toJSON());
  }

  static assign(obj) {
    return new Livro(obj.ISBN, obj.Nome, obj.Paginas, obj.Quantidade);
  }

  toJSON() {
    return  '{' +
              '"ISBN" : "'       + this.#ISBN       + '",' +
              '"Nome" : "'       + this.#Nome       + '",' +
              '"Paginas" : "'    + this.#Paginas    + '",' +
              '"Quantidade" : "' + this.#Quantidade + '" ' +
            '}';
  }

}