import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ConversationService {

    /*
        local: http://localhost:8080/watson-conversation-demo/mensagem
        bluemix: http://watson-conversation-demo.mybluemix.net/mensagem
    */
    private url = "https://gateway.watsonplatform.net/conversation/api/v1/workspaces/3b8544cf-4a34-454f-89d1-73728d9af420/message/";

    constructor(private http: Http) {

    }

    private getHeaders(): RequestOptions {
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });

		return options;
	}

    sendMessage(mensagem: string, context: string): Observable<any> {
        let dto = new ConversationDTO(mensagem, context);
        
        return this.http.post(this.url, JSON.stringify(dto), this.getHeaders()).map(res => res.json());
    }
}

export class ConversationDTO {
    mensagem: string;
    context: any;

    constructor(mensagem: string, context: any) {
        this.mensagem = mensagem;
        this.context = context;
    }
}