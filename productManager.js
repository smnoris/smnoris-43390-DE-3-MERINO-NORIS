import { promises as fs, writeFile } from "fs";

class ProductManager {
  constructor() {
    this.path = "./productos.json";
    this.productos = [];
  }

  async addProducto(title, description, price, thumbnail, code, stock) {
    const producto = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    const codeProducto = this.productos.find((producto) => producto.code === code);
    if (!codeProducto) {
      if (this.productos.length === 0) {
        producto.id = 1;
      } else {
        producto.id = this.productos[this.productos.length - 1].id + 1;
      }
      this.productos.push(producto);
      await fs.writeFile(this.path, JSON.stringify(this.productos), "utf8");
    } else {
      return console.log("El código no puede repetirse");
    }
  }

  async getProductos() {
    const allProductos = await fs.readFile(this.path, "utf8");
    let parsedProductos = JSON.parse(allProductos);
    console.log(parsedProductos);
    return parsedProductos;
  }

  async getProductoById(productoId) {
    let allProductos = await this.getProductos();
    const idProducto = allProductos.find((producto) => producto.id === productoId);
    if (idProducto) {
      console.log(idProducto);
      return idProducto;
    } else {
      return console.log("Not Found");
    }
  }

  async updateById({ id, ...producto }) {
    await this.deleteById(id);
    let oldProducto = await this.getProductos();

    let updatedProducto = [{ id, ...producto }, ...oldProducto];
    await fs.writeFile(this.path, JSON.stringify(updatedProducto), "utf8");
  }

  async deleteById(id) {
    let productos = await fs.readFile(this.path, "utf8");
    let allProductos = JSON.parse(productos);
    let deletedProducto = allProductos.filter((producto) => producto.id !== id);
    await fs.writeFile(this.path, JSON.stringify(deletedProducto), "utf8");

    console.log("Producto eliminado");
    console.log(deletedProducto);
  }
}
// TEST 

const producto = new ProductManager();

producto.addProducto(
  "Producto 1",
  "Tradicional 1",
  1500,
  "Sin imagen",
  "clase1",
  100
);

producto.addProducto(
  "Producto 2",
  "Tradicional 2",
  2000,
  "Sin imagen",
  "clase2",
  100
);

producto.addProducto(
  "Producto 3",
  "Digital 1",
  2500,
  "Sin imagen",
  "clase3",
  75
);

producto.addProducto(
  "Producto 4",
  "Digital 2",
  2500,
  "Sin imagen",
  "clase4",
  10
);

producto.getProductos();
producto.getProductoById(3);
producto.getProductoById(4);
producto.deleteById(1);
producto.updateById({
  title: "Producto 2",
  description: "Tradicional 2",
  price: 2500,
  thumbnail: "Sin imagen",
  code: "clase2",
  stock: 110,
  id: 2,
});