import { Component } from '@angular/core';
import { TabsPage } from '../../pages/tabs/tabs';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import * as cep from 'cep-promise';

@Component({
    templateUrl: "endereco.html"
})
export class ModalEndereco{
    loading: any;
    Titulo: any;
    TextoCep: any;
    Endereco: any;
    Bairro: any;
    Cidade: any;
    Estado: any;    

    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public http: HttpClient){
        
    }

    inserirEndereco(){
        this.showLoader();
        
        var dados = { IdUsuario: localStorage.getItem('IdUsuario'), Titulo: this.Titulo, Endereco: this.Endereco, Bairro: this.Bairro, Cidade: this.Cidade, Estado: this.Estado, Cep: this.TextoCep }

        this.http.post('https://api.modazapp.online/api/Usuarios/PostEndereco', dados).subscribe(data => {
            this.loading.dismiss();
            this.showAlert('Sucesso', 'Endereço cadastrado com sucesso.');
            this.navCtrl.pop();
        }, (error) => {
            console.log(error);
        });
    }

    runTimeChange(){
        if(this.TextoCep.length == 10){
            this.buscaCep();
        }
    }

    buscaCep(){
        cep(this.TextoCep).then(data => {
            this.Endereco = data['street'];
            this.Bairro = data['neighborhood'];
            this.Cidade = data['city'];
            this.Estado = data['state'];
        }).catch(error => {
            this.showAlert('Atenção', error.message);
            this.Endereco = "";
            this.Bairro = "";
            this.Cidade = "";
            this.Estado = "";
        })
    }

    goRootPage(): void{
        this.navCtrl.setRoot(TabsPage);
        this.navCtrl.pop();
    }

    dismiss(){        
        this.navCtrl.pop();
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