import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { API_CONFIG } from '../../config/api.config';
import { ProdutoService } from '../../services/domain/produto.service';
import { AWSService } from '../../services/aws.service';

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
		public loadingCtrl: LoadingController,
		public awsService: AWSService,
		public loadCtrl: LoadingController
	) { }

	ionViewDidLoad() {
		let categoria_id = this.navParams.get('categoria_id');
		let loader = this.presentLoading();
		if (categoria_id && categoria_id != 'undefined') {
			this.produtoService.findByCategoria(categoria_id)
				.subscribe(
					response => {
						this.itens = response['content'];
						this.loadSmallImagesFromBucket();
						loader.dismiss();
					},
					error => {
						loader.dismiss();
					}
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
			this.awsService.getImageFromBucket(url)
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

	presentLoading(): Loading {
		let loader = this.loadingCtrl.create(
			{
				content: "Aguarde..."
			}
		);
		loader.present();
		return loader;
	}
}