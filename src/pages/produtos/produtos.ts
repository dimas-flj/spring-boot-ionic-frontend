import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { API_CONFIG } from '../../config/api.config';
import { ProdutoService } from '../../services/domain/produto.service';

@IonicPage()
@Component({
	selector: 'page-produtos',
	templateUrl: 'produtos.html',
})
export class ProdutosPage {
	itens: ProdutoDTO[];
	page: number = 0;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public produtoService: ProdutoService,
		public loadingCtrl: LoadingController
	) { }

	ionViewDidLoad() {
		this.itens = [
			{
				id: "1",
				nome: "Mouse",
				preco: 80.99,
				imageUrl: `${API_CONFIG.bucketBaseUrl}/imgs/prod1-small.jpg`
			},
			{
				id: "2",
				nome: "Teclado",
				preco: 100.00,
				imageUrl: `${API_CONFIG.bucketBaseUrl}/imgs/prod2-small.jpg`
			}
		];
		//this.loadData();
	}

	loadData() {
		let categoria_id = this.navParams.get('categoria_id');
		let loader = this.presentLoading();
		this.produtoService.findByCategoria(
			categoria_id,
			this.page,
			10
		)
			.subscribe(
				response => {
					let start = this.itens.length;
					this.itens = this.itens.concat(response['content']);
					let end = this.itens.length - 1;
					loader.dismiss();
					console.log(this.page);
					console.log(this.itens);
					this.loadImageUrls(start, end);
				},
				error => {
					loader.dismiss();
				}
			);
	}

	loadImageUrls(start: number, end: number) {
		for (var i = start; i <= end; i++) {
			let item = this.itens[i];
			this.produtoService.getSmallImageFromBucket(item.id)
				.subscribe(
					response => {
						item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`;
					},
					error => {
						item.imageUrl = "assets/imgs/prod.jpg";
					}
				);
		}
	}

	presentLoading() {
		let loader = this.loadingCtrl.create({
			content: "Aguarde..."
		});
		loader.present();
		return loader;
	}
}