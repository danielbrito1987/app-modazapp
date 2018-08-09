import { Component } from '@angular/core';
import { TabsPage } from '../../pages/tabs/tabs';
import { NavController } from 'ionic-angular';

@Component({
    templateUrl: "navegacao.html"
})
export class ModalNavegacao{
    constructor(public navCtrl: NavController){

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
}