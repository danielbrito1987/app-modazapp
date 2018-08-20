import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams, ToastController, Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';

@Component({
    selector: "page-perfil",
    templateUrl: "perfil.html"
})
export class PerfilPage{
    loading: any;
    usuarioLogado: boolean;
    items: any;
    nomeUsuario: string;
    emailusuario: string;
    telefoneusuario: string;
    cpfUsuario: string;
    dataNasc: string;
    senha: string;
    confirmaSenha: string;
    api = "https://api.modazapp.online/api";
    //api = "http://localhost:65417/api";

    constructor(public platform: Platform, public navCtrl: NavController, private http: HttpClient, public loadingCtrl: LoadingController,
        public navParams: NavParams, public toastCtrl: ToastController, public alertCtrl: AlertController){
            this.usuarioLogado = this.validaLogin();
            this.initializeItems();
    }

    initializeItems(){        
        if(localStorage.getItem('tokenLogin') != null && localStorage.getItem('tokenLogin') != "")
        {
            if(localStorage.getItem("Perfil") != null && localStorage.getItem("Perfil") != ""){
                this.items = JSON.parse(localStorage.getItem("Perfil"));
                this.nomeUsuario = this.items[0].Nome;
                this.emailusuario = this.items[0].Email;
                this.cpfUsuario = this.items[0].Cpf;
                this.dataNasc = this.items[0].DataNasc;
                this.telefoneusuario = this.items[0].Telefone;
            }else{
                this.http.get(this.api + '/Usuarios/GetPerfilUsuario?id=' + localStorage.getItem("IdUsuario")).subscribe(data => {
                    console.log(data);
                    this.items = data;
                    this.nomeUsuario = data[0].Nome;
                    this.emailusuario = data[0].Email;
                    this.cpfUsuario = data[0].Cpf;
                    this.dataNasc = data[0].DataNasc;
                    this.telefoneusuario = data[0].Telefone;
                    localStorage.setItem('Perfil', JSON.stringify(data));
                }, (erro) => {
                    this.showAlert('Erro', 'Falha na comunicação com o servidor.');
                    this.goRootPage();
                });
            }
        }else{
            this.goLoginPage();
        }
    }

    alterarUsuario(){
        if(this.senha == this.confirmaSenha){
            this.showLoader();
            if(this.validaLogin()){
                var dados = { 'IdUsuario': parseInt(localStorage.getItem("IdUsuario")), 'Nome': this.nomeUsuario, 'Email': this.emailusuario, 'CPF': this.cpfUsuario, 'DataNasc': this.dataNasc, 'Senha': this.senha, 'Telefone': this.telefoneusuario };

                this.http.post(this.api + "/Usuarios/AlterarPerfil", dados).subscribe(data => {
                    this.loading.dismiss();
                    if(data["success"] == true){
                        this.showAlert("Sucesso", data["message"]);
                        this.nomeUsuario = data["Nome"];
                        this.emailusuario = data["Email"];
                        this.cpfUsuario = data["CPF"];
                        this.dataNasc = data["DataNasc"];
                        this.telefoneusuario = data["Telefone"];
                    }else{
                        this.showAlert("Atenção", data["message"]);
                    }
                })
            }else{
                this.loading.dismiss();
                this.goLoginPage();
            }
        }else{
            this.showAlert("Atenção", "Senha e confirmação de senha diferentes.");
        }
    }

    validaLogin(){
        if(localStorage.getItem("tokenLogin") != null && localStorage.getItem("tokenLogin")){
          return true;
        }else{
          return false;
        }
    }

    goLoginPage(){
        this.navCtrl.push(LoginPage);
    }

    goRootPage(): void{
        this.navCtrl.setRoot(HomePage);
        this.navCtrl.popToRoot();
    }

    showToast(position: string, msg: string){
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 2000,
            position: position
        });
    
        toast.present(toast);
    }
    
    showAlert(titulo: string, texto: string) {
        let alert = this.alertCtrl.create({
          title: titulo,
          subTitle: texto,
          buttons: ['OK']
        });
        alert.present();
    }

    showLoader(){    
        this.loading = this.loadingCtrl.create({
          content: "Aguarde..."
        });
    
        this.loading.present();
    }
}