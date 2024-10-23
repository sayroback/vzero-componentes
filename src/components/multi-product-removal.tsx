'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusIcon, TrashIcon, AlertCircle, CheckCircle2, XCircle } from 'lucide-react'

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
  const [products, setProducts] = useState<Product[]>([])
  const [currentProduct, setCurrentProduct] = useState<Product>({
    id: Date.now().toString(),
    code: '',
    name: '',
    quantity: 1,
    barcodes: []
  })
  const [newBarcode, setNewBarcode] = useState('')
  const [barcodeList, setBarcodeList] = useState('')

  const addProduct = () => {
    if (currentProduct.code && currentProduct.name) {
      setProducts([...products, currentProduct])
      setCurrentProduct({
        id: Date.now().toString(),
        code: '',
        name: '',
        quantity: 1,
        barcodes: []
      })
    }
  }

  const updateCurrentProduct = (field: keyof Product, value: string | number) => {
    setCurrentProduct({ ...currentProduct, [field]: value })
  }

  const addBarcode = (productId: string) => {
    if (newBarcode) {
      const updatedProducts = products.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            barcodes: [...product.barcodes, { id: Date.now().toString(), code: newBarcode, state: 'Buen estado' }]
          }
        }
        return product
      })
      setProducts(updatedProducts)
      setNewBarcode('')
    }
  }

  const removeBarcode = (productId: string, barcodeId: string) => {
    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          barcodes: product.barcodes.filter(barcode => barcode.id !== barcodeId)
        }
      }
      return product
    })
    setProducts(updatedProducts)
  }

  const processBarcodeList = (productId: string) => {
    const newBarcodes = barcodeList
      .split('\n')
      .map(code => code.trim())
      .filter(code => code !== '')
      .map(code => ({ id: Date.now().toString() + Math.random(), code, state: 'Buen estado' }))
    
    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          barcodes: [...product.barcodes, ...newBarcodes]
        }
      }
      return product
    })
    setProducts(updatedProducts)
    setBarcodeList('')
  }

  const updateBarcodeState = (productId: string, barcodeId: string, newState: string) => {
    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          barcodes: product.barcodes.map(barcode => 
            barcode.id === barcodeId ? { ...barcode, state: newState } : barcode
          )
        }
      }
      return product
    })
    setProducts(updatedProducts)
  }

  const getMessageStatus = (product: Product) => {
    const diff = product.quantity - product.barcodes.length
    if (diff > 0) return 'warning'
    if (diff < 0) return 'error'
    return 'success'
  }

  const getMessage = (product: Product) => {
    const diff = product.quantity - product.barcodes.length
    if (diff > 0) return `Faltan ${diff} código${diff !== 1 ? 's' : ''} por agregar. (${product.barcodes.length}/${product.quantity})`
    if (diff < 0) return `Se han agregado ${Math.abs(diff)} código${Math.abs(diff) !== 1 ? 's' : ''} de más. (${product.barcodes.length}/${product.quantity})`
    return `Se han agregado todos los códigos necesarios. (${product.barcodes.length}/${product.quantity})`
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Retiro de Múltiples Productos</h1>
      
      <div className="grid grid-cols-3 gap-8">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Información del Producto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="productCode" className="block text-sm font-medium text-gray-700">Código de producto</label>
                <Input 
                  id="productCode" 
                  value={currentProduct.code} 
                  onChange={(e) => updateCurrentProduct('code', e.target.value)} 
                  className="mt-1" 
                />
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Cantidad</label>
                <Input 
                  id="quantity" 
                  type="number" 
                  value={currentProduct.quantity} 
                  onChange={(e) => updateCurrentProduct('quantity', Number(e.target.value))} 
                  className="mt-1" 
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Nombre de producto</label>
                <Input 
                  id="productName" 
                  value={currentProduct.name} 
                  onChange={(e) => updateCurrentProduct('name', e.target.value)} 
                  className="mt-1" 
                />
              </div>
            </div>
            <Button className="w-full mt-4" onClick={addProduct}>Añadir Producto</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Asignar a Colaborador</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">Destinatario</label>
                <Input id="recipient" defaultValue="Juan Manuel Calderón - UX/UI" className="mt-1" />
              </div>
              <div>
                <label htmlFor="destinationArea" className="block text-sm font-medium text-gray-700">Área de destino</label>
                <Select id="destinationArea" defaultValue="Area destino" className="mt-1">
                  <option>Area destino</option>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {products.map(product => (
        <Card key={product.id} className="mt-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{product.name} ({product.code})</CardTitle>
            <Badge variant="secondary">Cantidad: {product.quantity}</Badge>
          </CardHeader>
          <CardContent>
            <Alert variant={getMessageStatus(product) as 'warning' | 'success' | 'error'}>
              {getMessageStatus(product) === 'warning' && <AlertCircle className="h-4 w-4" />}
              {getMessageStatus(product) === 'success' && <CheckCircle2 className="h-4 w-4" />}
              {getMessageStatus(product) === 'error' && <XCircle className="h-4 w-4" />}
              <AlertDescription>{getMessage(product)}</AlertDescription>
            </Alert>

            <Tabs defaultValue="individual" className="w-full mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="individual">Añadir Individual</TabsTrigger>
                <TabsTrigger value="list">Pegar Lista</TabsTrigger>
              </TabsList>
              <TabsContent value="individual">
                <div className="flex space-x-2">
                  <Input 
                    value={newBarcode} 
                    onChange={(e) => setNewBarcode(e.target.value)}
                    placeholder="Ingrese código de barras"
                    className="flex-grow"
                  />
                  <Button onClick={() => addBarcode(product.id)} disabled={product.barcodes.length >= product.quantity}>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Agregar
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="list">
                <div className="space-y-2">
                  <Textarea 
                    value={barcodeList}
                    onChange={(e) => setBarcodeList(e.target.value)}
                    placeholder="Pegue aquí la lista de códigos de barras, uno por línea"
                    className="w-full h-32"
                  />
                  <Button onClick={() => processBarcodeList(product.id)} className="w-full">
                    Procesar Lista
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-4 max-h-64 overflow-y-auto">
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
                          onValueChange={(value) => updateBarcodeState(product.id, barcode.id, value)}
                        >
                          <option value="Buen estado">Buen estado</option>
                          <option value="Mal estado">Mal estado</option>
                          <option value="Regular">Regular</option>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button variant="destructive" size="sm" onClick={() => removeBarcode(product.id, barcode.id)}>
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
  )
}