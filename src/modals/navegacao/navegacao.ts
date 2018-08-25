import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
    templateUrl: "navegacao.html"
})
export class ModalNavegacao{
    tipoChamada: any;

    constructor(public navCtrl: NavController, public navParams: NavParams){
        this.tipoChamada = this.navParams.get('Origem');
    }

    alterarNavegacao(tipo: any){
        localStorage.setItem('Navegacao', tipo);
        //this.goRootPage();
        this.dismiss();
    }

    goRootPage(): void{
        //this.navCtrl.setRoot(TabsPage);
        this.navCtrl.pop();
    }

    dismiss(){
        this.navCtrl.pop();
    }

    validaChamada(){
        if(this.tipoChamada == 'inicio'){
          return false;
        }else{
          return true;
        }
    }
}