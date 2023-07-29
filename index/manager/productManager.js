import  fs from "fs";


export default class ProductManager {
  constructor(path) {
    this.path = path;
  }


  addProducto = async (producto) => {
    try {
      const productos = await this.getProductos();
      const codeRepeat = productos.find((p) => p.code === producto.code);

      if (
        !producto.title ||
        !producto.description ||
        !producto.price ||
        !producto.thumbnail ||
        !producto.code ||
        !producto.stock
      ) {
        return "Complete todos los campos";
      }
      if (codeRepeat) {
        return "Codigo ingresado ya existente";
      }
      let id;
      if (productos.length === 0) {
        id = 1;
      } else {
        id = productos[productos.length - 1].id + 1;
      }

      productos.push({ ...producto, id });

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(productos, null, "\t")
      );
    } catch (error) {
      console.log(error);
    }
  };

  getProductos = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        console.log(data);
        const parseData = JSON.parse(data);
        return parseData;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  };

  getProductosById = async (id) => {
    try {
      let results = await this.getProductos();
      let producto = results.find((p) => p.id === id);

      if (producto) {
        return producto;
      } else {
        return "Not Found";
      }
    } catch (error) {
      console.log(error);
    }
  };

  updateProducto = async (producto) => {
    try {
      const productos = await this.getProductos();
      const productoUpdate = productos.find((p) => p.id === producto.id);
      if (!productoUpdate) {
        return `No se encuentra el producto : ${producto.id}`;
      }
      const indexOfProducto = productos.findIndex((p) => p.id === producto.id);
      productos[indexOfProducto] = {
        ...productoUpdate,
        ...producto,
      };

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(productos, null, "\t")
      );
      return productos[indexOfProducto];
    } catch (error) {
      console.log(error);
    }
  };

  deleteProduct = async (id) => {
    try {
      const productos = await this.getProductos();
      const index = productos.findIndex((p) => p.id === id);

      if (index < 0) {
        return `Can't find product with id : ${id}`;
      }
      productos.splice(index, 1);

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(productos, null, "\t")
      );

      return productos;
    } catch (error) {
      console.log(error);
    }
  };
}