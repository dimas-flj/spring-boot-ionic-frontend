import { RefDTO } from "./ref.dto";
import { PagamentoDTO } from "./pagamento.dto";
import { ItemPedidoDTO } from "./item_pedido.dto";

export interface PedidoDTO {
	cliente: RefDTO;
	enderecoDeEntrega: RefDTO;
	pagamento: PagamentoDTO;
	itens: ItemPedidoDTO[];
}