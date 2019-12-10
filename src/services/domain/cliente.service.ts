import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ClienteDTO } from "../../models/cliente.dto";
import { Observable } from "rxjs/Rx";
import { API_CONFIG } from "../../config/api.config";

@Injectable()
export class ClienteService {
	constructor(public http: HttpClient) { }

	findByEmail(email: string): Observable<ClienteDTO> {
		return this.http.get<ClienteDTO>(
			`${API_CONFIG.baseUrl}/clientes/email?value=${email}`
		);
	}

	getImageFromBucket(url: string): Observable<any> {
		return this.http.get(url, { responseType: 'blob' });
	}

	insert(obj: ClienteDTO) {
		return this.http.post(
			`${API_CONFIG.baseUrl}/clientes`,
			obj,
			{
				observe: 'response',
				responseType: 'text'
			}
		);
	}
}