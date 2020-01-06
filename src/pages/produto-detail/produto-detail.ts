import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { API_CONFIG } from '../../config/api.config';
import { ProdutoService } from '../../services/domain/produto.service';
import { AWSService } from '../../services/aws.service';
import { CartService } from '../../services/domain/cart.service';

@IonicPage()
@Component({
	selector: 'page-produto-detail',
	templateUrl: 'produto-detail.html',
})
export class ProdutoDetailPage {
	produto: ProdutoDTO;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public produtoService: ProdutoService,
		public awsService: AWSService,
		public cartService: CartService,
		public loadingCtrl: LoadingController
	) { }

	ionViewDidLoad() {
		this.loadData();
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

	loadData() {
		let produto_id = this.navParams.get('produto_id');
		let loader = this.presentLoading();
		if (produto_id && produto_id != 'undefined') {
			this.produtoService.findById(produto_id)
				.subscribe(
					response => {
						this.produto = response;
						this.getImageFromBucket(produto_id);
						loader.dismiss();
					},
					error => {
						loader.dismiss();
					}
				)
		}
		else {
			this.navCtrl.setRoot('ProdutosPage');
		}
	}

	getImageFromBucket(produto_id: string) {
		let url = `${API_CONFIG.bucketBaseUrl}/prod${produto_id}.jpg`;
		this.awsService.getImageFromBucket(url)
			.subscribe(
				response => {
					this.produto.imageUrl = url;
				},
				error => {
					this.produto.imageUrl = "assets/imgs/prod.jpg";
				}
			)
	}

	addToCart(produto: ProdutoDTO) {
		this.cartService.addProduto(produto);
		this.navCtrl.push('CartPage');
	}
}