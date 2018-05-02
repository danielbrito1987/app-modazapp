import { Component } from '@angular/core';

import { CadastroPage } from '../cadastro/cadastro';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { ChatPage } from '../chat/chat';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = CadastroPage;
  tab3Root = ContactPage;
  tab4Root = ChatPage;

  constructor() {

  }
}
