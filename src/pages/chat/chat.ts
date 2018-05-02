import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, ToastController } from 'ionic-angular';

declare var require: any;

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {
    mensagem: string = "";
    mensagens: Array<Mensagem>;
    context: any = {};
    nome: string = "";
    usuarioLogado: boolean;
    @ViewChild(Content) content: Content;
    
    constructor(public navCtrl: NavController, private navParams: NavParams, private toastCtrl: ToastController) {
        this.mensagens = new Array<Mensagem>();
        this.nome = this.navParams.get("nome");
        this.context.nome = this.nome;
        this.usuarioLogado = this.validaLogin();        
    }

    ionViewDidEnter() {
        this.mensagens = new Array<Mensagem>();
        var that = this;

        var watson = require('watson-developer-cloud');

        var conversation = new watson.ConversationV1({ 
            username: 'a3b803e5-f77b-48a9-9d90-42f5cd4bfc9a',
            password: 'kZkJnvcr7a88',
            version_date: '2018-02-16'
        });

        conversation.message({
            workspace_id: '7d03d059-1797-440b-8f8c-596582685571',
            input: { 'text': '' }
        }, function (err, response){
            if(err){
                console.log("Erro:" + err);
            }else{                
                that.mensagens.push(new Mensagem(response.output.text[0], true));
                //that.tratarRetorno(response.output);
            }
        }).catch(err => {
            console.log("Erro: ", err.message);
        });
    }

    enviarMensagem() {
        var that = this;

        if(this.mensagem == null || this.mensagem == ""){
            this.showToast("bottom", "Não é possível enviar mensagem vazia");
        }else{
            this.mensagens.push(new Mensagem(this.mensagem, false));

            var watson = require('watson-developer-cloud');

            var conversation = new watson.ConversationV1({ 
                username: 'a3b803e5-f77b-48a9-9d90-42f5cd4bfc9a',
                password: 'kZkJnvcr7a88',
                version_date: '2018-02-16'
            });

            conversation.message({
                workspace_id: '7d03d059-1797-440b-8f8c-596582685571',
                input: { 'text': this.mensagem }
            }, function (err, response){
                if(err){
                    console.log("Erro:" + err);
                }else{
                    that.mensagens.push(new Mensagem(response.output.text[0], true));
                    //that.tratarRetorno(response.output);
                }            
            }).catch(err => {
                console.log("Erro: ", err.mensage);
            });

            this.mensagem = "";
        }
    }

    tratarRetorno(data: any) {
        this.context = data.context;
        console.log(this.context);
        let msg = "";

        if(data.text.length >= 1) {
            msg = data.text + " ";
        } else if(data.text.length == 1) {
            msg = data.text[0];
        }

        this.mensagens.push(new Mensagem(msg, true));

        setTimeout(() => {
            this.content.scrollToBottom(300);
        });
    }

    validaLogin(){
        if(localStorage.getItem("tokenLogin") != null && localStorage.getItem("tokenLogin")){
          return true;
        }else{
          return false;
        }
    }

    showToast(position: string, msg: string){
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 2000,
            position: position
        });
    
        toast.present(toast);
    }

}

export class Mensagem  {
    mensagem: string;
    isWatson: boolean;

    constructor(mensagem: string, isWatson: boolean) {
        this.mensagem = mensagem;
        this.isWatson = isWatson;
    }
}