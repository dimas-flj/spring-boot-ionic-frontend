import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component({
	selector: 'page-produto-detail',
	templateUrl: 'produto-detail.html',
})
export class ProdutoDetailPage {
	produto: ProdutoDTO;

	constructor(public navCtrl: NavController, public navParams: NavParams) { }

	ionViewDidLoad() {
		this.produto = {
			id: "1",
			nome: "Mouse",
			preco: 80.59,
			imageUrl: `${API_CONFIG.bucketBaseUrl}/imgs/prod3.jpg`
		}
	}
}