import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CategoriaService } from '../../services/domain/categoria.service';
import { CategoriaDTO } from '../../models/categoria.dto';
import { API_CONFIG } from "../../config/api.config";

@IonicPage()
@Component({
	selector: 'page-categorias',
	templateUrl: 'categorias.html',
})

export class CategoriasPage {
	categoria: CategoriaDTO = {
		id: "",
		nome: "",
		bucketUrl: ""
	};

	itens: CategoriaDTO[];

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public categoriaService: CategoriaService
	) { }

	ionViewDidLoad() {
		this.categoriaService.findAll()
			.subscribe(
				response => {
					this.categoria.bucketUrl = API_CONFIG.bucketBaseUrl;
					this.itens = response;
				},
				error => { }
			);
	}

	showProdutos() {
		this.navCtrl.push('ProdutosPage');
	}

	/*
	showProdutos(categoria_id: string) {
		this.navCtrl.push('ProdutosPage', { categoria_id: categoria_id });
	}
	*/
}