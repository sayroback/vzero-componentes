"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	PlusIcon,
	TrashIcon,
	AlertCircle,
	CheckCircle2,
	XCircle,
} from "lucide-react";

interface BarcodeItem {
	id: string;
	code: string;
	state: string;
}

interface Product {
	id: string;
	code: string;
	name: string;
	quantity: number;
	barcodes: BarcodeItem[];
}

export function MultiProductRemovalComponent() {
	const [products, setProducts] = useState<Product[]>([
		{
			id: "1",
			code: "P001",
			name: "Laptop Lenovo",
			quantity: 3,
			barcodes: [
				{ id: "b1", code: "LENOVO123", state: "Buen estado" },
				{ id: "b2", code: "LENOVO124", state: "Buen estado" },
			],
		},
		{
			id: "2",
			code: "P002",
			name: "Mouse Logitech",
			quantity: 2,
			barcodes: [{ id: "b3", code: "LOGI567", state: "Regular" }],
		},
	]);
	const [currentProduct, setCurrentProduct] = useState<Product>({
		id: Date.now().toString(),
		code: "",
		name: "",
		quantity: 1,
		barcodes: [],
	});
	const [newBarcode, setNewBarcode] = useState("");
	const [barcodeList, setBarcodeList] = useState("");

	const addProduct = () => {
		if (currentProduct.code && currentProduct.name) {
			setProducts([...products, currentProduct]);
			setCurrentProduct({
				id: Date.now().toString(),
				code: "",
				name: "",
				quantity: 1,
				barcodes: [],
			});
		}
	};

	const updateCurrentProduct = (
		field: keyof Product,
		value: string | number
	) => {
		setCurrentProduct({ ...currentProduct, [field]: value });
	};

	const addBarcode = (productId: string) => {
		if (newBarcode) {
			const updatedProducts = products.map((product) => {
				if (product.id === productId) {
					return {
						...product,
						barcodes: [
							...product.barcodes,
							{
								id: Date.now().toString(),
								code: newBarcode,
								state: "Buen estado",
							},
						],
					};
				}
				return product;
			});
			setProducts(updatedProducts);
			setNewBarcode("");
		}
	};

	const removeBarcode = (productId: string, barcodeId: string) => {
		const updatedProducts = products.map((product) => {
			if (product.id === productId) {
				return {
					...product,
					barcodes: product.barcodes.filter(
						(barcode) => barcode.id !== barcodeId
					),
				};
			}
			return product;
		});
		setProducts(updatedProducts);
	};

	const processBarcodeList = (productId: string) => {
		const newBarcodes = barcodeList
			.split("\n")
			.map((code) => code.trim())
			.filter((code) => code !== "")
			.map((code) => ({
				id: Date.now().toString() + Math.random(),
				code,
				state: "Buen estado",
			}));

		const updatedProducts = products.map((product) => {
			if (product.id === productId) {
				return {
					...product,
					barcodes: [...product.barcodes, ...newBarcodes],
				};
			}
			return product;
		});
		setProducts(updatedProducts);
		setBarcodeList("");
	};

	const updateBarcodeState = (
		productId: string,
		barcodeId: string,
		newState: string
	) => {
		const updatedProducts = products.map((product) => {
			if (product.id === productId) {
				return {
					...product,
					barcodes: product.barcodes.map((barcode) =>
						barcode.id === barcodeId ? { ...barcode, state: newState } : barcode
					),
				};
			}
			return product;
		});
		setProducts(updatedProducts);
	};

	const getMessageStatus = (product: Product) => {
		const diff = product.quantity - product.barcodes.length;
		if (diff > 0) return "warning";
		if (diff < 0) return "error";
		return "success";
	};

	const getMessage = (product: Product) => {
		const diff = product.quantity - product.barcodes.length;
		if (diff > 0)
			return `Faltan ${diff} código${diff !== 1 ? "s" : ""} por agregar. (${
				product.barcodes.length
			}/${product.quantity})`;
		if (diff < 0)
			return `Se han agregado ${Math.abs(diff)} código${
				Math.abs(diff) !== 1 ? "s" : ""
			} de más. (${product.barcodes.length}/${product.quantity})`;
		return `Se han agregado todos los códigos necesarios. (${product.barcodes.length}/${product.quantity})`;
	};

	return (
		<div className="container mx-auto p-6 space-y-8">
			<h1 className="text-3xl font-bold text-center mb-8">
				Retiro de Múltiples Productos
			</h1>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>Asignar a Colaborador</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label
									htmlFor="recipient"
									className="block text-sm font-medium text-gray-700"
								>
									Destinatario
								</label>
								<Input
									id="recipient"
									defaultValue="Juan Manuel Calderón - UX/UI"
									className="mt-1"
								/>
							</div>
							<div>
								<label
									htmlFor="destinationArea"
									className="block text-sm font-medium text-gray-700"
								>
									Área de destino
								</label>
								<Select defaultValue="Area destino">
									<SelectTrigger className="mt-1">
										<SelectValue placeholder="Seleccione área" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Area destino">Area destino</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Añadir Nuevo Producto</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 gap-4">
							<div>
								<label
									htmlFor="productCode"
									className="block text-sm font-medium text-gray-700"
								>
									Código de producto
								</label>
								<Input
									id="productCode"
									value={currentProduct.code}
									onChange={(e) => updateCurrentProduct("code", e.target.value)}
									className="mt-1"
								/>
							</div>
							<div>
								<label
									htmlFor="productName"
									className="block text-sm font-medium text-gray-700"
								>
									Nombre de producto
								</label>
								<Input
									id="productName"
									value={currentProduct.name}
									onChange={(e) => updateCurrentProduct("name", e.target.value)}
									className="mt-1"
								/>
							</div>
							<div>
								<label
									htmlFor="quantity"
									className="block text-sm font-medium text-gray-700"
								>
									Cantidad
								</label>
								<Input
									id="quantity"
									type="number"
									value={currentProduct.quantity}
									onChange={(e) =>
										updateCurrentProduct("quantity", Number(e.target.value))
									}
									className="mt-1"
								/>
							</div>
							<Button className="w-full mt-4" onClick={addProduct}>
								Añadir Producto
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{products.map((product) => (
					<Card key={product.id}>
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle>
								{product.name} ({product.code})
							</CardTitle>
							<Badge variant="secondary">Cantidad: {product.quantity}</Badge>
						</CardHeader>
						<CardContent>
							<Alert
								variant={
									getMessageStatus(product) as "warning" | "success" | "error"
								}
								className="mb-4"
							>
								{getMessageStatus(product) === "warning" && (
									<AlertCircle className="h-4 w-4" />
								)}
								{getMessageStatus(product) === "success" && (
									<CheckCircle2 className="h-4 w-4" />
								)}
								{getMessageStatus(product) === "error" && (
									<XCircle className="h-4 w-4" />
								)}
								<AlertDescription>{getMessage(product)}</AlertDescription>
							</Alert>

							<Tabs defaultValue="individual" className="w-full">
								<TabsList className="grid w-full grid-cols-2">
									<TabsTrigger value="individual">
										Añadir Individual
									</TabsTrigger>
									<TabsTrigger value="list">Pegar Lista</TabsTrigger>
								</TabsList>
								<TabsContent value="individual">
									<div className="flex space-x-2 mt-4">
										<Input
											value={newBarcode}
											onChange={(e) => setNewBarcode(e.target.value)}
											placeholder="Ingrese código de barras"
											className="flex-grow"
										/>
										<Button
											onClick={() => addBarcode(product.id)}
											disabled={product.barcodes.length >= product.quantity}
										>
											<PlusIcon className="h-4 w-4 mr-2" />
											Agregar
										</Button>
									</div>
								</TabsContent>
								<TabsContent value="list">
									<div className="space-y-2 mt-4">
										<Textarea
											value={barcodeList}
											onChange={(e) => setBarcodeList(e.target.value)}
											placeholder={`Pegue aquí la lista de códigos de barras, uno por línea:
123456789012
987654321098
234567890123
`}
											className="w-full h-32"
										/>
										<Button
											onClick={() => processBarcodeList(product.id)}
											className="w-full"
										>
											Procesar Lista
										</Button>
									</div>
								</TabsContent>
							</Tabs>

							<div className="mt-6 max-h-64 overflow-y-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-16">N°</TableHead>
											<TableHead>Código de Barras</TableHead>
											<TableHead>Estado</TableHead>
											<TableHead className="w-24">Acción</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{product.barcodes.map((barcode, index) => (
											<TableRow key={barcode.id}>
												<TableCell>{index + 1}</TableCell>
												<TableCell>{barcode.code}</TableCell>
												<TableCell>
													<Select
														value={barcode.state}
														onValueChange={(value) =>
															updateBarcodeState(product.id, barcode.id, value)
														}
													>
														<SelectTrigger>
															<SelectValue placeholder="Seleccione estado" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="Buen estado">
																Buen estado
															</SelectItem>
															<SelectItem value="Mal estado">
																Mal estado
															</SelectItem>
															<SelectItem value="Regular">Regular</SelectItem>
														</SelectContent>
													</Select>
												</TableCell>
												<TableCell>
													<Button
														variant="destructive"
														size="sm"
														onClick={() =>
															removeBarcode(product.id, barcode.id)
														}
													>
														<TrashIcon className="h-4 w-4" />
													</Button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
