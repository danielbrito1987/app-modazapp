import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import 'rxjs/add/operator/map';

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {

  constructor(private sqlite: SQLite) {
    
  }

  /**
   * Cria um banco caso não exista ou pega um banco existente com o nome no parametro
   */
  public getDB(){
    return this.sqlite.create({
      name: 'data.db',
      location: 'default'
    });
  }

  /**
   * Cria a estrutura inicial do banco de dados
   */
  public createDatabase() {
    return this.getDB()
      .then((db: SQLiteObject) => {
 
        // Criando as tabelas
        this.createTables(db);
 
        // Inserindo dados padrão
        this.insertDefaultItems(db);
 
      })
      .catch(e => console.log(e));
  }

  /**
   * Criando as tabelas no banco de dados
   * @param db
   */
  private createTables(db: SQLiteObject) {
    // Criando as tabelas
    db.sqlBatch([
      ['CREATE TABLE IF NOT EXISTS Lojas (IdLoja integer primary key AUTOINCREMENT NOT NULL, Nome TEXT, Email TEXT, Senha TEXT, RazaoSocial TEXT, Endereco TEXT, Cidade TEXT, Estado TEXT, Pais TEXT, Cep TEXT, NomeComercial TEXT, Imagem TEXT, Logomarca TEXT, Telefone TEXT)'],
      ['CREATE TABLE IF NOT EXISTS Produtos (Id integer primary key AUTOINCREMENT NOT NULL, IdProduto integer primary key NOT NULL, Descricao TEXT, Valor decimal, Imagem TEXT, DataRegistro Date, IdLoja number, EstoqueP int, EstoqueM int, EstoqueG int, EstoqueGG int, EstoqueXG int, EstoqueXGG int, DescricaoCompleta TEXT, ValorAtacado decimal, Slide1 TEXT, Slide2 TEXT, Slide3 TEXT)'],
    ])
      .then(() => console.log('Tabelas criadas'))
      .catch(e => console.error('Erro ao criar as tabelas', e));
  }

  /**
   * Incluindo os dados padrões
   * @param db
   */
  private insertDefaultItems(db: SQLiteObject) {
    db.executeSql('select COUNT(IdLoja) as qtd from Lojas where Nome = \"TLD Brasil\"', {})
    .then((data:any) =>{
      if(data.rows.item(0).qtd == 0){
        db.sqlBatch([
          ['insert into Lojas (Nome, Email, Senha, RazaoSocial, Endereco, Cidade, Estado, Pais, Cep, NomeComercial, Imagem, Logomarca, Telefone) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', ['TLD Brasil', 'tld@tld.com.br', '123456', 'TLD Brasil', 'Av. Filomeno Gomes, 430', 'Fortaleza', 'CE', 'Brasil', null, 'TLD Brasil', 'TLD.png', 'logo_tld.png', '27 3262-7525']],
        ])
        .then(() => console.log('Dados padrões incluídos'))
        .catch(e => console.error('Erro ao incluir dados padrões', e)); 
      }
    })
    .catch(e => console.error('Erro ao consultar a qtd de categorias', e));

    db.executeSql('select COUNT(IdLoja) as qtd from Lojas where Nome = \"Zambia\"', {})
    .then((data:any) =>{
      if(data.rows.item(0).qtd == 0){
        db.sqlBatch([
          ['insert into Lojas (Nome, Email, Senha, RazaoSocial, Endereco, Cidade, Estado, Pais, Cep, NomeComercial, Imagem, Logomarca, Telefone) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', ['Zambia', 'zambia@zambia.com.br', '123456', 'Zambia', 'Av. Filomeno Gomes, 430', 'Fortaleza', 'CE', 'Brasil', null, 'Zambia', 'ZAMBIA.png', 'logo_zambia.png', '27 3361-8514']],
        ])
        .then(() => console.log('Dados padrões incluídos'))
        .catch(e => console.error('Erro ao incluir dados padrões', e)); 
      }
    })
    .catch(e => console.error('Erro ao consultar a qtd de categorias', e));

    db.executeSql('select COUNT(IdLoja) as qtd from Lojas where Nome = \"Grupo Qjóia Modas\"', {})
    .then((data:any) =>{
      if(data.rows.item(0).qtd == 0){
        db.sqlBatch([
          ['insert into Lojas (Nome, Email, Senha, RazaoSocial, Endereco, Cidade, Estado, Pais, Cep, NomeComercial, Imagem, Logomarca, Telefone) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', ['Grupo Qjóia Modas', 'qjoia@qjoia.com.br', '123456', 'Grupo QJóia Modas', 'Centro/Muquiçaba', 'Guarapari', 'ES', 'Brasil', null, 'Grupo QJóia Modas', 'QJOIA.png', 'logo_qjoia.png', null]],
        ])
        .then(() => console.log('Dados padrões incluídos'))
        .catch(e => console.error('Erro ao incluir dados padrões', e)); 
      }
    })
    .catch(e => console.error('Erro ao consultar a qtd de categorias', e));

    db.executeSql('select COUNT(IdLoja) as qtd from Lojas where Nome = \"Praia e Sol\"', {})
    .then((data:any) =>{
      if(data.rows.item(0).qtd == 0){
        db.sqlBatch([
          ['insert into Lojas (Nome, Email, Senha, RazaoSocial, Endereco, Cidade, Estado, Pais, Cep, NomeComercial, Imagem, Logomarca, Telefone) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', ['Praia e Sol', 'praiaesolcomercial@gmail.com', '123456', 'Praia e Sol', 'Praia do Morro', 'Guarapari', 'ES', 'Brasil', null, 'Praia e Sol', 'Praia-e-Sol.png', 'logo-praia-e-sol.png', '27 99649-0332 / 99649-0331']],
        ])
        .then(() => console.log('Dados padrões incluídos'))
        .catch(e => console.error('Erro ao incluir dados padrões', e)); 
      }
    })
    .catch(e => console.error('Erro ao consultar a qtd de categorias', e));

    db.executeSql('select COUNT(IdLoja) as qtd from Lojas where Nome = \"Le Belia para elas\"', {})
    .then((data:any) =>{
      if(data.rows.item(0).qtd == 0){
        db.sqlBatch([
          ['insert into Lojas (Nome, Email, Senha, RazaoSocial, Endereco, Cidade, Estado, Pais, Cep, NomeComercial, Imagem, Logomarca, Telefone) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', ['Le Belia para elas', 'lebelia@lebelila.com.br', '123456', 'Le Belia para elas', 'Portal Club', 'Guarapari', 'ES', 'Brasil', null, 'Le Belia para elas', 'LE-BELIA.png', 'logo_lebelia.png', null]],
        ])
        .then(() => console.log('Dados padrões incluídos'))
        .catch(e => console.error('Erro ao incluir dados padrões', e)); 
      }
    })
    .catch(e => console.error('Erro ao consultar a qtd de categorias', e));

    db.executeSql('select COUNT(IdLoja) as qtd from Lojas where Nome = \"Mabeli Modas e Acessórios\"', {})
    .then((data:any) =>{
      if(data.rows.item(0).qtd == 0){
        db.sqlBatch([
          ['insert into Lojas (Nome, Email, Senha, RazaoSocial, Endereco, Cidade, Estado, Pais, Cep, NomeComercial, Imagem, Logomarca, Telefone) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', ['Mabeli Modas e Acessórios', 'mabeli@mabeli.com.br', '123456', 'Mabeli Modas e Acessórios', 'Av. F, Itapebussú', 'Guarapari', 'ES', 'Brasil', null, 'Mabeli Modas e Acessórios', 'MABELI.png', 'logo_mabeli.png', null]],
        ])
        .then(() => console.log('Dados padrões incluídos'))
        .catch(e => console.error('Erro ao incluir dados padrões', e)); 
      }
    })
    .catch(e => console.error('Erro ao consultar a qtd de categorias', e));

    db.executeSql('select COUNT(IdLoja) as qtd from Lojas where Nome = \"Bazar Grande Rio\"', {})
    .then((data:any) =>{
      if(data.rows.item(0).qtd == 0){
        db.sqlBatch([
          ['insert into Lojas (Nome, Email, Senha, RazaoSocial, Endereco, Cidade, Estado, Pais, Cep, NomeComercial, Imagem, Logomarca, Telefone) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', ['Bazar Grande Rio', 'granderio@granderio.com.br', '123456', 'Bazar Grande Rio', 'Rod do Sol, 1446 - Aeroporto', 'Guarapari', 'ES', 'Brasil', null, 'Bazar Grande Rio', 'GRANDE-RIO.png', 'logo_grande_rio.png', '(27) 3361-2796']],
        ])
        .then(() => console.log('Dados padrões incluídos'))
        .catch(e => console.error('Erro ao incluir dados padrões', e)); 
      }
    })
    .catch(e => console.error('Erro ao consultar a qtd de categorias', e));
  }
}
