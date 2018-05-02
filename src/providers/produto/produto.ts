import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../database/database';
import 'rxjs/add/operator/map';

/*
  Generated class for the ProdutoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProdutoProvider {  
  constructor(private dbProvider: DatabaseProvider) {
    console.log('Hello ProdutoProvider Provider');
  }

  public insert(produto: Produto) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'insert into Produtos (IdProduto, Descricao, Valor, Imagem, DataRegistro, IdLoja, EstoqueP, EstoqueM, EstoqueG, EstoqueG, EstoqueGG, EstoqueXG, EstoqueXGG, DescricaoCompleta, ValorAtacado, Slide1, Slide2, Slide3) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        let data = [produto.IdProduto, produto.Descricao, produto.Valor, produto.Imagem, produto.DataRegistro, produto.IdLoja, produto.EstoqueP, produto.EstoqueM, produto.EstoqueG, produto.EstoqueGG, produto.EstoqueXG, produto.EstoqueXGG, produto.DescricaoCompleta, produto.ValorAtacado, produto.Slide1, produto.Slide2, produto.Slide3];
 
        return db.executeSql(sql, data)
          .then(response =>{
            console.log('Produto Inserido com Sucesso!');
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public getProduto(id: number){
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'select * from Produtos where IdProduto = ?';
        let data = [id];
 
        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let item = data.rows.item(0);
              let produto = new Produto();

              produto.IdProduto = item.IdProduto; 
              produto.Descricao = item.Descricao; 
              produto.Valor = item.Valor; 
              produto.Imagem = item.Imagem; 
              produto.DataRegistro = item.DataRegistro; 
              produto.IdLoja = item.IdLoja; 
              produto.EstoqueP = item.EstoqueP; 
              produto.EstoqueM = item.EstoqueM; 
              produto.EstoqueG = item.EstoqueG; 
              produto.EstoqueGG = item.EstoqueGG; 
              produto.EstoqueXG = item.EstoqueXG; 
              produto.EstoqueXGG = item.EstoqueXGG; 
              produto.DescricaoCompleta = item.DescricaoCompleta; 
              produto.ValorAtacado = item.ValorAtacado; 
              produto.Slide1 = item.Slide1; 
              produto.Slide2 = item.Slide2;
              produto.Slide3 = item.Slide3;
 
              return produto;
            }
 
            return null;
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public get(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'select * from Produtos where IdLoja = ?';
        let data = [id];
 
        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let item = data.rows.item(0);
              let produto = new Produto();

              produto.IdProduto = item.IdProduto; 
              produto.Descricao = item.Descricao; 
              produto.Valor = item.Valor; 
              produto.Imagem = item.Imagem; 
              produto.DataRegistro = item.DataRegistro; 
              produto.IdLoja = item.IdLoja; 
              produto.EstoqueP = item.EstoqueP; 
              produto.EstoqueM = item.EstoqueM; 
              produto.EstoqueG = item.EstoqueG; 
              produto.EstoqueGG = item.EstoqueGG; 
              produto.EstoqueXG = item.EstoqueXG; 
              produto.EstoqueXGG = item.EstoqueXGG; 
              produto.DescricaoCompleta = item.DescricaoCompleta; 
              produto.ValorAtacado = item.ValorAtacado; 
              produto.Slide1 = item.Slide1; 
              produto.Slide2 = item.Slide2;
              produto.Slide3 = item.Slide3;
 
              return produto;
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
        let sql = 'SELECT * FROM produtos ';
        var data: any[];
         
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

export class Produto {
  IdProduto: number;
  Descricao: string;
  Valor: number;
  Imagem: string;
  DataRegistro: Date;
  IdLoja: number;
  EstoqueP: number;
  EstoqueM: number;
  EstoqueG: number;
  EstoqueGG: number;
  EstoqueXG: number;
  EstoqueXGG: number;
  DescricaoCompleta: string;
  ValorAtacado: number;
  Slide1: string;
  Slide2: string;
  Slide3: string;
}