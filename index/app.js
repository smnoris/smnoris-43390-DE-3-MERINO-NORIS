import express from "express";
import ProductManager from "./manager/productManager.js";

const app = express();

const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const manager = new ProductManager("./index/productos/productos.json");

app.get("/productos", async (req, res) => {
  const { limit } = req.query;
  const productos = await manager.getProductos();
  if (limit) {
    const limited = productos.slice(0, limit);
    res.status(200).json(limited);
  } else {
    res.status(200).json(productos);
  }
});

app.get("/productos/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const producto = await manager.getProductosById(id);
  if (producto) {
    res.status(200).json(producto);
  } else {
    res.status(400).json({ message: "Producto no encontrado" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});