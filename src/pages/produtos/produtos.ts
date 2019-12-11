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
		let categoria_id = this.navParams.get('categoria_id');
		if (categoria_id && categoria_id != 'undefined') {
			this.produtoService.findByCategoria(categoria_id)
				.subscribe(
					response => {
						this.itens = response['content'];
						this.loadSmallImagesFromBucket();
					},
					error => { }
				)
		}
		else {
			this.navCtrl.setRoot('CategoriasPage');
		}
	}

	loadSmallImagesFromBucket() {
		for (var i = 0; i < this.itens.length; i++) {
			let item = this.itens[i];
			let url = `${API_CONFIG.bucketBaseUrl}/imgs/prod${item.id}-small.jpg`;
			this.produtoService.getImageFromBucket(url)
				.subscribe(
					response => {
						item.imageUrl = url;
					},
					error => {
						item.imageUrl = "assets/imgs/prod.jpg";
					}
				);
		}
	}

	showDetail(produto_id: string) {
		this.navCtrl.push('ProdutoDetailPage', { produto_id: produto_id });
	}
}