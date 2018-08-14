import { Component } from '@angular/core';
import { TabsPage } from '../../pages/tabs/tabs';
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
        this.goRootPage();
    }

    goRootPage(): void{
        this.navCtrl.setRoot(TabsPage);
        this.navCtrl.pop();
    }

    dismiss(){
        this.navCtrl.pop();
    }

    validaChamada(){
        console.log(this.tipoChamada);
        if(this.tipoChamada == 'inicio'){
          return false;
        }else{
          return true;
        }
    }
}