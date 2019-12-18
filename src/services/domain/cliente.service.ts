import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ClienteDTO } from "../../models/cliente.dto";
import { API_CONFIG } from "../../config/api.config";
import { ImageUtilService } from "../image-util.service";

@Injectable()
export class ClienteService {
	constructor(
		public http: HttpClient,
		public imageUtilService: ImageUtilService
	) { }

	findByEmail(email: string) {
		return this.http.get(
			`${API_CONFIG.baseUrl}/clientes/email?value=${email}`
		);
	}

	findById(id: string) {
		return this.http.get(
			`${API_CONFIG.baseUrl}/clientes/${id}`
		);
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

	uploadPicture(picture: string) {
		let pictureBlob = this.imageUtilService.dataUriToBlob(picture);
		let formData: FormData = new FormData();
		formData.set('file', pictureBlob, 'file.png');
		return this.http.post(
			`${API_CONFIG.baseUrl}/clientes/picture`,
			formData,
			{
				observe: 'response',
				responseType: 'text'
			}
		);
	}
}