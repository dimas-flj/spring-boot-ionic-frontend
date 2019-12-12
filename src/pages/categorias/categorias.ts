import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CategoriaDTO } from '../../models/categoria.dto';
import { API_CONFIG } from "../../config/api.config";
import { AWSService } from '../../services/aws.service';
import { CategoriaService } from '../../services/domain/categoria.service';

@IonicPage()
@Component({
	selector: 'page-categorias',
	templateUrl: 'categorias.html',
})

export class CategoriasPage {
	categoria: CategoriaDTO = {
		id: "",
		nome: "",
		imageUrl: ""
	};

	itens: CategoriaDTO[];

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public categoriaService: CategoriaService,
		public awsService: AWSService
	) { }

	ionViewDidLoad() {
		this.categoriaService.findAll()
			.subscribe(
				response => {
					this.itens = response;
					this.loadImagesFromBucket();
				},
				error => { }
			);
	}

	loadImagesFromBucket() {
		for (var i = 0; i < this.itens.length; i++) {
			let item = this.itens[i];
			let url = `${API_CONFIG.bucketBaseUrl}/imgs/cat${item.id}.jpg`;
			this.awsService.getImageFromBucket(url)
				.subscribe(
					response => {
						item.imageUrl = url;
					},
					error => {
						item.imageUrl = "assets/imgs/cat.jpg";
					}
				);
		}
	}

	showProdutos(categoria_id: string) {
		this.navCtrl.push('ProdutosPage', { categoria_id: categoria_id });
	}
}