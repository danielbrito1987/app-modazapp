import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../database/database';
import 'rxjs/add/operator/map';

/*
  Generated class for the LojasProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LojasProvider {

  constructor(private dbProvider: DatabaseProvider) {
    console.log('Hello LojasProvider Provider');
  }

  public insert(loja: Lojas) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'insert into Lojas (Nome, Email, Senha, RazaoSocial, Endereco, Cidade, Estado, Pais, Cep, NomeComercial, Imagem, Logomarca, Telefone) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        let data = [loja.Nome, loja.Email, loja.Senha, loja.RazaoSocial, loja.Endereco, loja.Endereco, loja.Cidade, loja.Estado, loja.Pais, loja.Cep, loja.NomeComercial, loja.Imagem, loja.Logomarca, loja.Telefone];
 
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public update(loja: Lojas) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'update Lojas set Nome = ?, Email = ?, Senha = ?, RazaoSocial = ?, Endereco = ?, Cidade = ?, Estado = ?, Pais = ?, Cep = ?, NomeComercial = ?, Imagem = ?, Logomarca = ?, Telefone = ? where IdLoja = ?';
        let data = [loja.Nome, loja.Email, loja.Senha, loja.RazaoSocial, loja.Endereco, loja.Endereco, loja.Cidade, loja.Estado, loja.Pais, loja.Cep, loja.NomeComercial, loja.Imagem, loja.Logomarca, loja.Telefone, loja.IdLoja];
 
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public remove(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'delete from Lojas where IdLoja = ?';
        let data = [id];
 
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public get(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'select * from Lojas where IdLoja = ?';
        let data = [id];
 
        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let item = data.rows.item(0);
              let loja = new Lojas();

              loja.IdLoja = item.IdLoja;
              loja.Nome = item.Nome;
              loja.Email = item.Email;
              loja.RazaoSocial = item.RazaoSocial;
              loja.Endereco = item.Endereco;
              loja.Cidade = item.Cidade;
              loja.Estado = item.Estado;
              loja.Pais = item.Pais;
              loja.Cep = item.Cep;
              loja.NomeComercial = item.NomeComercial;
              loja.Imagem = item.Imagem;
              loja.Logomarca = item.Logomarca;
              loja.Telefone = item.Telefone;
 
              return loja;
            }
 
            return null;
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public getAll(name: string = null) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'SELECT * FROM lojas ';
        var data: any[];
         
        // filtrando pelo nome
        if (name) {
          sql += ' where Nome like ?'
          data.push('%' + name + '%');
        }
 
        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let lojas: any[] = [];
              for (var i = 0; i < data.rows.length; i++) {
                var loja = data.rows.item(i);
                lojas.push(loja);
              }
              return lojas;
            } else {
              return [];
            }
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

}

export class Lojas {
  IdLoja: number;
  Nome: string;
  Email: string;
  Senha: string;
  RazaoSocial: string;
  Endereco: string;
  Cidade: string;
  Estado: string;
  Pais: string;
  Cep: string;
  NomeComercial: string;
  Imagem: string;
  Logomarca: string;
  Telefone: string;
}