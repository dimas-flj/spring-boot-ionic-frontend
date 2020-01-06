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
	itens: ProdutoDTO[] = [];
	page: number = 0;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public produtoService: ProdutoService,
		public loadingCtrl: LoadingController,
		public awsService: AWSService
	) { }

	ionViewDidLoad() {
		this.loadData();
	}

	loadSmallImagesFromBucket(start: number, end: number) {
		for (var i = start; i <= end; i++) {
			let item = this.itens[i];
			let url = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`;
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

	loadData() {
		let categoria_id = this.navParams.get('categoria_id');
		let loader = this.presentLoading();
		if (categoria_id && categoria_id != 'undefined') {
			this.produtoService.findByCategoria(categoria_id, this.page, 10)
				.subscribe(
					response => {
						let start = this.itens.length;
						this.itens = this.itens.concat(response['content']);
						let end = this.itens.length - 1;
						this.loadSmallImagesFromBucket(start, end);
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

	doRefresh(refresher: any) {
		this.page = 0;
		this.itens = [];

		this.loadData();
		setTimeout(
			() => {
				refresher.complete();
			},
			1000
		);
	}

	doInfinite(infiniteScroll: any) {
		this.page++;
		this.loadData();
		setTimeout(
			() => {
				infiniteScroll.complete();
			},
			1000
		);
	}
}