import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { Observable } from "rxjs/Rx";
import { ProdutoDTO } from "../../models/produto.dto";

@Injectable()
export class ProdutoService {
	constructor(public http: HttpClient) { }

	findById(produto_id: string) {
		return this.http.get<ProdutoDTO>(`${API_CONFIG.baseUrl}/produtos/${produto_id}`);
	}

	findByCategoria(categoria_id: string) {
		return this.http.get(`${API_CONFIG.baseUrl}/produtos/?categorias=${categoria_id}`);
	}

	/*
	findByCategoria(categoria_id: string, page: number = 0, linesPerPage: number = 24) {
		return this.http.get(`${API_CONFIG.baseUrl}/produtos/?categorias=${categoria_id}&page=${page}&linesPerPage=${linesPerPage}`);
	}
	*/

	getImageFromBucket(url: string): Observable<any> {
		return this.http.get(url, { responseType: 'blob' });
	}
}