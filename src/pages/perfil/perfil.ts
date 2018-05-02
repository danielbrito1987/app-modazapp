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
    usuarioLogado: boolean;
    items: any;

    constructor(public platform: Platform, public navCtrl: NavController, private http: HttpClient, public loadingCtrl: LoadingController,
        public navParams: NavParams, public toastCtrl: ToastController, public alertCtrl: AlertController){
            this.usuarioLogado = this.validaLogin();
            this.initializeItems();
    }

    initializeItems(){        
        if(localStorage.getItem('tokenLogin') != null && localStorage.getItem('tokenLogin') != "")
        {
            if(localStorage.getItem("Perfil") != null && localStorage.getItem("Perfil") != ""){
                this.items = JSON.stringify(localStorage.getItem("Perfil"));
            }else{
                this.http.get('https://api.modazapp.online/api/Usuarios/GetPerfilUsuario?id=' + localStorage.getItem("IdUsuario")).subscribe(data => {
                //this.http.get('http://localhost:65417/api/Usuarios/GetPerfilUsuario?id=' + localStorage.getItem("IdUsuario")).subscribe(data => {
                    this.items = data;
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
}